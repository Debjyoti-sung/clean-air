import { AIService } from '../services/ai.service.js';
import { logger } from '../utils/logger.js';
import sharp from 'sharp';
export const AIController = {
    analyzeImage: async (req, res, next) => {
        const startTime = Date.now();
        logger.info('Upload received');
        try {
            const file = req.file;
            if (!file) {
                res.status(400).json({ error: 'Image file is required.' });
                return;
            }
            logger.info('Image validated');
            const uploadTime = Date.now();
            // Compress and resize image
            const optimizedBuffer = await sharp(file.buffer)
                .resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toBuffer();
            const processTime = Date.now();
            logger.info('Image resized');
            const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
            logger.info('OCR request sent');
            const analysisResult = await AIService.analyzeImage(base64Image);
            const apiTime = Date.now();
            logger.info('Vision response received');
            const totalTimeMs = Date.now() - startTime;
            // Structured Logging Report
            logger.info(`
Total Processing Time: ${(totalTimeMs / 1000).toFixed(2)} seconds
- Upload Handling: ${uploadTime - startTime} ms
- Image Preprocessing: ${processTime - uploadTime} ms
- Gemini API: ${apiTime - processTime} ms
- Original Size: ${(file.size / 1024).toFixed(1)} KB
- Optimized Size: ${(optimizedBuffer.length / 1024).toFixed(1)} KB
      `);
            res.status(200).json(analysisResult);
        }
        catch (error) {
            next(error);
        }
    }
};
