/**
 * Google Earth Engine Service (Mock/Stub for now)
 * In production, this requires GCP Service Account setup and an Earth Engine API proxy.
 */

export const EarthEngineService = {
  /**
   * Fetch satellite-derived environmental data
   * @param {number} lat 
   * @param {number} lng 
   */
  getSatelliteData: async (lat, lng, buffer = 5000) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/satellite?lat=${lat}&lng=${lng}&buffer=${buffer}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch Earth Engine data from backend");

      const resData = await response.json();

      return {
        success: true,
        data: resData
      };
    } catch (error) {
      console.error("Earth Engine Service Error:", error);
      // Fallback dummy data if backend fails
      return {
        success: false,
        data: {
          ndvi: (Math.random() * 0.5 + 0.2).toFixed(2), // 0.2 to 0.7
          fireHotspots: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0, 
          landCover: "Urban/Built-up",
          vegetationHealth: "Moderate",
          elevation: Math.floor(Math.random() * 400 + 10) + "m"
        }
      };
    }
  }
};
