import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import mapRouter from './routes/map.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';

// Resolve environment file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env from multiple possible paths
const envPaths = [
  path.join(__dirname, '../../.env'),       // from backend/src
  path.join(__dirname, '../../../.env'),     // from backend/dist or deeper
  path.resolve(process.cwd(), '../.env'),   // from backend/ -> root
  path.resolve(process.cwd(), '.env'),      // from backend/ itself (if symlinked)
];

for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    logger.info(`Loaded .env from: ${envPath}`);
    break;
  }
}

if (!process.env.GEMINI_API_KEY) {
  logger.warn('WARNING: GEMINI_API_KEY is not set in .env — AI Vision will fail!');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting (relaxed for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  skip: (req) => req.path.startsWith('/api/ai') // Skip rate limiting for AI routes
});

import aiRouter from './routes/ai.routes.js';
import emailRouter from './routes/email.routes.js';

// Middlewares
app.use(limiter);
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', mapRouter);
app.use('/api/ai', aiRouter);
app.use('/api/email', emailRouter);

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`Server is actively listening in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
