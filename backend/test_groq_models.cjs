const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
dotenv.config({ path: path.join(__dirname, '../.env') });

async function listModels() {
  try {
    const url = 'https://api.groq.com/openai/v1/models';
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
    });
    console.log(response.data.data.map(m => m.id).join('\n'));
  } catch (error) {
    console.error('ERROR:', error.response?.data || error.message);
  }
}

listModels();
