import axios from 'axios';
import { logger } from '../utils/logger.js';

console.log("Triggering backend restart to load new .env variables (Switching to Mistral)...");

export const AIService = {
  analyzeImage: async (base64Image: string): Promise<any> => {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY is not configured in backend');
    }

    // Clean base64 string
    let base64Data = base64Image;
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    }

    const requestBody = {
      model: "pixtral-12b-2409",
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: 'Analyze this image for environmental pollution. Is there pollution visible? If yes, classify the type (e.g., Garbage Burning, Construction Dust, Industrial Smoke, Illegal Waste Dumping, Vehicle Emissions, or Other). Give a brief explanation of what you see. Respond in strict JSON format: {"isPollution": boolean, "pollutionType": "string", "confidenceScore": number (0-100), "explanation": "string", "severitySuggestion": "High" | "Medium" | "Low"}.'
          },
          {
            type: "image_url",
            image_url: `data:image/jpeg;base64,${base64Data}`
          }
        ]
      }],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 1024
    };

    try {
      logger.info('Sending image to Mistral Vision API...');
      const url = 'https://api.mistral.ai/v1/chat/completions';

      const response = await axios.post(url, requestBody, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 60000
      });

      let messageContent = response.data?.choices?.[0]?.message?.content;
      if (!messageContent) {
        throw new Error('Invalid response from Mistral AI');
      }

      // Clean up markdown block if Mistral wraps it
      messageContent = messageContent.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(messageContent);
      logger.info('Mistral Vision API succeeded');
      return parsed;

    } catch (error: any) {
      const status = error.response?.status;
      
      if (status === 429) {
        logger.error('Mistral API quota exhausted or rate limit hit (429).');
      } else {
        logger.error('Mistral Vision API Error:', error.response?.data || error.message);
      }
      
      throw error;
    }
  }
};
