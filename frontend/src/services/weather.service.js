/**
 * Weather Service
 * Uses Open-Meteo Weather API
 */

export const WeatherService = {
  /**
   * Get current weather for coordinates
   * @param {number} lat 
   * @param {number} lng 
   */
  getCurrentWeather: async (lat, lng) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?lat=${lat}&lng=${lng}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch Weather data from backend");

      const resData = await response.json();

      return {
        success: true,
        data: {
          temperature: resData.temperature || 0,
          humidity: resData.humidity || 0,
          windSpeed: resData.windSpeed || 0,
          windDirection: resData.windDirection || 0,
          pressure: resData.pressure || 0,
          visibility: resData.visibility || 0
        }
      };
    } catch (error) {
      console.error("Weather Service Error:", error);
      // Fallback dummy data
      return {
        success: false,
        data: {
          temperature: 28,
          humidity: 65,
          windSpeed: 12,
          windDirection: 180,
          pressure: 1012,
          visibility: 8000
        }
      };
    }
  }
};
