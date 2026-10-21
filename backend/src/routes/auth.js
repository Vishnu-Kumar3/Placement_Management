import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
const router = Router();
const safeUser = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });
router.post('/register', asyncRoute(async (req, res) => {
  const name = String(req.body.name || '').trim(); const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
  if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Name must be 2–80 characters.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (password.length < 10 || password.length > 100) return res.status(400).json({ message: 'Password must be 10–100 characters.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.status(201).json({ token, user: safeUser(user) });
}));
router.post('/login', asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.json({ token, user: safeUser(user) });
}));
export default router;
