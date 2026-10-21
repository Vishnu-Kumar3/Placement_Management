import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Sign in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-only-secret');
    req.user = await User.findById(payload.sub).select('_id name email role');
    if (!req.user) return res.status(401).json({ message: 'Account not found.' });
    next();
  } catch { res.status(401).json({ message: 'Your session is invalid or expired. Please sign in again.' }); }
}
