import { Router } from 'express';
import multer from 'multer';
import { AIController } from '../controllers/ai.controller.js';
const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});
// Endpoint: POST /api/ai/analyze-image
router.post('/analyze-image', upload.single('image'), AIController.analyzeImage);
export default router;
