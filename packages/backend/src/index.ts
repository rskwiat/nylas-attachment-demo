import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import Nylas from 'nylas';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './db/database';
import { requireGrant } from './middlewares/requireGrant';
import { GrantService } from './services/grantService';

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
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS
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
      clientId: nylasConfig.clientId!,
      redirectUri: nylasConfig.callbackUri,
      code,
    });
    const { grantId } = response;
    console.log(response.grantId);
    await GrantService.storeGrant(userId, grantId);

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
    clientId: nylasConfig.clientId!,
    redirectUri: nylasConfig.callbackUri,
    state: userId,
  });

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

    const { subject, body, attachments } = req.body;

    const to = process.env.TEST_EMAIL;
    
    if (!subject || !body) {
      res.status(400).json({
        error: 'Missing required fields: subject, body'
      });
      return;
    }

    const emailRequest: any = {
      to: Array.isArray(to) ? to : [{ email: to }],
      subject,
      body,
    }

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      emailRequest.attachments = attachments.map((attachment: any) => ({
        filename: attachment.filename,
        content: attachment.content,
        content_type: attachment.contentType,
        size: attachment.size,
      }));
    }

    const sentMessage = await nylas.messages.send({
      identifier: grantId,
      requestBody: emailRequest
    });
    
    res.json({
      message: 'Email sent successfully',
      messageId: sentMessage.data?.id,
      sentMessage: sentMessage.data,
      attachments: attachments?.length || 0,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

app.get("/nylas/sent-emails", requireGrant, async (req: Request, res: Response) => {
  try {
    const messages = await nylas.messages.list({
      identifier: req.grantId!,
      queryParams: { limit: 10 }
    });

    const sentToRecipient = messages.data.filter(message => {
      return message.from?.some(recipient => 
        recipient.email?.toLowerCase() === process.env.TEST_EMAIL
      );
    });

    res.json({ 
      messages: sentToRecipient,
      totalFound: messages,
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
  console.log(`Server running on port ${PORT}`);
});

export default app;
