import { logger } from '../utils/logger.js';
export const errorHandler = (err, req, res, next) => {
    logger.error(`Error on ${req.method} ${req.url}:`, err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        error: {
            message,
            status
        }
    });
};
