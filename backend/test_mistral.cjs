const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.MISTRAL_API_KEY;
console.log('Mistral Key loaded:', !!apiKey);

const testBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwA//9k=';

async function testMistral() {
  const requestBody = {
    model: "pixtral-12b-2409",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: 'Analyze this image briefly in JSON.'
        },
        {
          type: "image_url",
          image_url: `data:image/jpeg;base64,${testBase64}`
        }
      ]
    }],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 1024
  };

  try {
    const url = 'https://api.mistral.ai/v1/chat/completions';
    const response = await axios.post(url, requestBody, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    console.log("SUCCESS:", JSON.stringify(response.data));
  } catch (error) {
    console.error('ERROR:', error.response?.data || error.message);
  }
}

testMistral();
