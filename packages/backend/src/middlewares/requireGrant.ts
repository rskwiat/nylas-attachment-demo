import { Request, Response, NextFunction } from "express";
import { GrantService } from "../services/grantService";

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

export {
  requireGrant
};
