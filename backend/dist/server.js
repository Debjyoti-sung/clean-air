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
dotenv.config({ path: path.join(__dirname, '../../.env') });
const app = express();
const PORT = process.env.PORT || 5000;
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
import aiRouter from './routes/ai.routes.js';
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
// Error Handling
app.use(errorHandler);
// Start Server
app.listen(PORT, () => {
    logger.info(`Server is actively listening in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
