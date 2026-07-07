import axios from 'axios';
import { logger } from '../utils/logger.js';
export const AIService = {
    analyzeImage: async (base64Image) => {
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            throw new Error('MISTRAL_API_KEY is not configured in backend');
        }
        try {
            // Clean base64 string if it contains the prefix
            let imagePayload = base64Image;
            if (!imagePayload.startsWith('data:image')) {
                imagePayload = `data:image/jpeg;base64,${base64Image}`;
            }
            const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
                model: 'pixtral-12b-2409',
                messages: [{
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Analyze this image for environmental pollution. Is there pollution visible? If yes, classify the type (e.g., Garbage Burning, Construction Dust, Industrial Smoke, Illegal Waste Dumping, Vehicle Emissions, or Other). Give a brief explanation of what you see. Respond in strict JSON format: {"isPollution": boolean, "pollutionType": "string", "confidenceScore": number (0-100), "explanation": "string", "severitySuggestion": "High" | "Medium" | "Low"}.'
                            },
                            {
                                type: 'image_url',
                                image_url: imagePayload
                            }
                        ]
                    }],
                response_format: { type: 'json_object' }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // Mistral Vision can take some time
            });
            const messageContent = response.data.choices?.[0]?.message?.content;
            if (!messageContent) {
                throw new Error('Invalid response from Mistral AI');
            }
            const parsed = JSON.parse(messageContent);
            return parsed;
        }
        catch (error) {
            logger.error('Mistral Vision API Error:', error.response?.data || error.message);
            throw error;
        }
    }
};
