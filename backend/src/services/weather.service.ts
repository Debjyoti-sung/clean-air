import axios from 'axios';
import { logger } from '../utils/logger.js';

export const WeatherService = {
  /**
   * Fetch current weather from OpenWeather API
   */
  getCurrentWeather: async (lat: number, lng: number): Promise<any> => {
    const apiKey = process.env.VITE_OPENWEATHER_API;
    
    if (!apiKey || apiKey.includes('your_')) {
      logger.warn('OpenWeather API Key is missing or invalid. Using fallback data.');
      return getMockWeather();
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather`;
      const res = await axios.get(url, {
        params: {
          lat,
          lon: lng,
          appid: apiKey,
          units: 'metric'
        },
        timeout: 8000
      });

      const data = res.data;
      
      return {
        temperature: data.main?.temp || 0,
        humidity: data.main?.humidity || 0,
        windSpeed: data.wind?.speed ? (data.wind.speed * 3.6) : 0, // Convert m/s to km/h
        windDirection: data.wind?.deg || 0,
        pressure: data.main?.pressure || 0,
        visibility: data.visibility || 0
      };
    } catch (error: any) {
      logger.error('OpenWeather API request failed. Using fallback calculations:', error.message);
      return getMockWeather();
    }
  }
};

function getMockWeather() {
  return {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    windDirection: 180,
    pressure: 1012,
    visibility: 8000
  };
}
