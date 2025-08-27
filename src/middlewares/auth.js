import { verifyToken } from '../utils/jwt.js';

export function auth(required = true) {
  return (req, res, next) => {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token && required) return res.status(401).json({ error: 'Unauthenticated' });
    if (!token) return next();
    try {
      req.user = verifyToken(token); 
      next();
    } catch {
      return res.status(401).json({ error: 'InvalidToken' });
    }
  };
}

export const allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
