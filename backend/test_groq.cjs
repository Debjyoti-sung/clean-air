const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GROQ_API_KEY;
console.log('Key loaded:', !!apiKey);

const testBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwA//9k=';

async function testGroq() {
  const requestBody = {
    model: "llama-3.2-11b-vision-preview",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: 'Analyze this image.'
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${testBase64}`
          }
        }
      ]
    }],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 1024
  };

  try {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const response = await axios.post(url, requestBody, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('ERROR:', error.response?.data || error.message);
  }
}

testGroq();
