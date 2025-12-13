import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

/**
 * Keycloak authentication middleware (placeholder)
 * TODO: Implement full Keycloak token validation
 * This will validate JWT tokens from Keycloak
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // TODO: Validate token with Keycloak
    // For now, this is a placeholder that extracts basic info
    // In production, use keycloak-connect or verify JWT signature

    // Placeholder user extraction
    req.token = token;
    req.user = {
      id: 'user-123', // TODO: Extract from token
      username: 'testuser', // TODO: Extract from token
      email: 'test@example.com', // TODO: Extract from token
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

/**
 * Optional authentication middleware
 * Attempts to authenticate but doesn't fail if no token is provided
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // TODO: Validate token with Keycloak
      req.token = token;
      req.user = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
      };
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};
