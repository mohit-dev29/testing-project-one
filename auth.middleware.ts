import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};
