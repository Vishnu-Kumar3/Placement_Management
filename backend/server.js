import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './src/routes/auth.js';
import studentRoutes from './src/routes/students.js';
import driveRoutes from './src/routes/drives.js';
import applicationRoutes from './src/routes/applications.js';
import dashboardRoutes from './src/routes/dashboard.js';
import uploadRoutes from './src/routes/uploads.js';
import { notFound, errorHandler } from './src/middleware/errors.js';

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map(s => s.trim()) || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));
app.use(morgan('dev'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 }), authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/uploads', express.static(path.resolve(here, process.env.UPLOAD_DIR || 'uploads')));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_management')
  .then(() => app.listen(port, () => console.log(`Placement API listening on ${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
