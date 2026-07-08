import { Router } from 'express';
import multer from 'multer';
import { sendResolutionEmail } from '../services/email.service.js';
import { logger } from '../utils/logger.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/send-resolution', upload.any(), async (req, res) => {
  try {
    const { reportDetailsStr, citizenEmail } = req.body;
    
    if (!reportDetailsStr || !citizenEmail) {
      return res.status(400).json({ error: 'Missing required fields: reportDetailsStr or citizenEmail' });
    }

    let reportDetails;
    try {
      reportDetails = JSON.parse(reportDetailsStr);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON in reportDetailsStr' });
    }

    const attachments = [];
    
    // Process files uploaded via multer
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        attachments.push({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype
        });
      }
    }

    await sendResolutionEmail(citizenEmail, reportDetails, attachments);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    logger.error('Error sending resolution email:', error);
    return res.status(500).json({ error: 'Failed to send resolution email' });
  }
});

export default router;
