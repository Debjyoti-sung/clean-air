/**
 * Air Quality Service
 * Communicates with the local Node.js backend environment gateway
 */

export const AirQualityService = {
  /**
   * Get AQI and pollutants for coordinates
   * @param {number} lat 
   * @param {number} lng 
   */
  getAirQuality: async (lat, lng) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/environment?lat=${lat}&lng=${lng}&radius=2000`
      );
      
      if (!response.ok) throw new Error("Failed to fetch Air Quality from backend gateway");

      const resData = await response.json();
      const aq = resData.airQuality;

      return {
        success: true,
        data: {
          aqi: aq.aqi || 50,
          pm25: aq.pollutants?.PM25 || 0,
          pm10: aq.pollutants?.PM10 || 0,
          no2: aq.pollutants?.NO2 || 0,
          so2: aq.pollutants?.SO2 || 0,
          co: aq.pollutants?.CO || 0,
          o3: aq.pollutants?.O3 || 0,
        }
      };
    } catch (error) {
      console.error("AQI Service Error:", error);
      // Fallback dummy data
      return {
        success: false,
        data: {
          aqi: 154,
          pm25: 65,
          pm10: 120,
          no2: 24,
          so2: 12,
          co: 300,
          o3: 45
        }
      };
    }
  }
};

