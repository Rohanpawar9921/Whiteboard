import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JWTPayload {
  id: string;
  username: string;
  email: string;
  sub?: string;
  preferred_username?: string;
}

/**
 * Dual authentication middleware
 * Supports both custom JWT tokens and Keycloak tokens
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

    req.token = token;

    // Try to verify as custom JWT first
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      };
      next();
      return;
    } catch (jwtError) {
      // If custom JWT fails, try Keycloak token format
      // Keycloak tokens have different structure
      try {
        const decoded = jwt.decode(token) as JWTPayload;
        if (decoded && decoded.sub) {
          // Keycloak token format
          req.user = {
            id: decoded.sub,
            username: decoded.preferred_username || 'keycloak-user',
            email: decoded.email || '',
          };
          next();
          return;
        }
      } catch (keycloakError) {
        console.error('Token decode error:', keycloakError);
      }
    }

    // If both fail, return error
    res.status(403).json({ error: 'Invalid token' });
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
