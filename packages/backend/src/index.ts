import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import Nylas from 'nylas';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './db/database';
import { GrantService } from './services/grantService';

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3001;

const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  callbackUri: "http://localhost:3001/oauth/exchange",
  apiKey: process.env.NYLAS_API_KEY,
  apiUri: process.env.NYLAS_API_URI,
};

const nylas = new Nylas({
  apiKey: nylasConfig.apiKey!,
  apiUri: nylasConfig.apiUri!,
});

connectDB();

async function requireGrant(req: Request, res: Response, next: NextFunction) {
  const userId = req.query.userId as string || req.headers['x-user-id'] as string || 'default-user';
  
  try {
    const grantId = await GrantService.getGrantId(userId);
    
    if (!grantId) {
      return res.status(401).json({ 
        error: 'No grant ID found. Please authenticate first.',
        authUrl: `/nylas/auth?userId=${userId}`
      });
    }

    req.grantId = grantId;
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Error checking grant:', error);
    return res.status(500).json({ error: 'Failed to verify authentication' });
  }
  return;
}

declare global {
  namespace Express {
    interface Request {
      grantId?: string;
      userId?: string;
    }
  }
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Nylas Attachment Backend API',
    version: '1.0.0',
  });
});

app.get("/oauth/exchange", async (req, res) => {
  console.log("Received callback from Nylas");
  const code = req.query.code as string;
  const userId = req.query.state as string || 'default-user';

  if (!code) {
    res.status(400).send("No authorization code returned from Nylas");
    return;
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey!,
      clientId: nylasConfig.clientId!, // Note this is *different* from your API key
      redirectUri: nylasConfig.callbackUri, // URI you registered with Nylas in the previous step
      code,
    });
    const { grantId } = response;

    // You'll use this grantId to make API calls to Nylas perform actions on
    // behalf of this account. Store this in a database, associated with a user
    console.log(response.grantId);
    await GrantService.storeGrant(userId, grantId);

    // This depends on implementation. If the browser is hitting this endpoint
    // you probably want to use res.redirect('/some-successful-frontend-url')
    res.json({
      message: "OAuth2 flow completed successfully for grant ID: " + grantId,
    });
  } catch (error) {
    res.status(500).send("Failed to exchange authorization code for token");
  }

  return;
});

// Route to initialize authentication
app.get("/nylas/auth", (req: Request, res: Response) => {
  const userId = req.query.userId as string || 'default-user';
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId!, // Note this is *different* from your API key. Make sure to put these in environment variables
    redirectUri: nylasConfig.callbackUri, // URI you registered with Nylas in the previous step
    state: userId,
  });

  // This is one way to redirect the user to the auth screen. Depending on your architecture you may want to pass
  // the url back to your frontend for redirection, that's up to you
  res.redirect(authUrl);
  return;
});

app.post("/nylas/send-email", async (req, res): Promise<void> => {
  try {
    const userId = req.body.userId || req.query.userId as string || 'default-user';
    const grantId = await GrantService.getGrantId(userId);
    
    if (!grantId) {
      res.status(401).json({
        error: 'No grant found. Please authenticate first.',
        authUrl: `/nylas/auth?userId=${userId}`
      });
      return;
    }

    const { to, subject, body } = req.body;
    
    if (!to || !subject || !body) {
      res.status(400).json({
        error: 'Missing required fields: to, subject, body'
      });
      return;
    }

    const sentMessage = await nylas.messages.send({
      identifier: grantId,
      requestBody: {
        to: Array.isArray(to) ? to : [{ email: to }],
        subject,
        body,
      },
    });
    
    res.json({
      message: 'Email sent successfully',
      messageId: sentMessage.data?.id,
      sentMessage: sentMessage.data
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

app.get("/api/emails", requireGrant, async (req: Request, res: Response) => {
  try {
    const messages = await nylas.messages.list({
      identifier: req.grantId!,
      queryParams: { limit: 10 }
    });

    res.json({ 
      messages: messages.data,
      userId: req.userId 
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
  return;
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

export default app;
