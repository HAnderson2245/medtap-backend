import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserType } from '../models/User';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: UserType;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ error: 'JWT configuration error' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      userType: UserType;
    };

    // Verify user still exists and is active
    const user = await User.findByPk(decoded.id);
    if (!user || user.status !== 'active') {
      res.status(401).json({ error: 'Invalid or inactive user' });
      return;
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      userType: decoded.userType
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ error: 'Token expired' });
    } else {
      res.status(500).json({ error: 'Authentication error' });
    }
  }
};

// Middleware to check user types
export const authorizeUserTypes = (...allowedTypes: UserType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedTypes.includes(req.user.userType)) {
      res.status(403).json({ 
        error: 'Access denied',
        message: `This endpoint requires one of: ${allowedTypes.join(', ')}`
      });
      return;
    }

    next();
  };
};

// HIPAA Audit Logging Middleware
export const hipaaAuditLog = (action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const auditData = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id || 'anonymous',
      action,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      endpoint: req.originalUrl,
      method: req.method
    };

    // Log to audit trail (in production, this should go to a secure audit log system)
    console.log('[HIPAA AUDIT]', JSON.stringify(auditData));

    next();
  };
};
