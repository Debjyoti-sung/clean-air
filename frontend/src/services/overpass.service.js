/**
 * Overpass API Service
 * Redirects queries to local Node.js backend environment gateway
 */

export const OverpassService = {
  /**
   * Fetch nearby environmental and infrastructure factors
   * @param {number} lat 
   * @param {number} lng 
   * @param {number} radius in meters (default 2000m = 2km)
   * @returns {Promise<any>}
   */
  getNearbyAnalysis: async (lat, lng, radius = 2000) => {
    try {
      const response = await fetch(
        `https://clean-air-w252.onrender.com/api/environment?lat=${lat}&lng=${lng}&radius=${radius}`
      );

      if (!response.ok) throw new Error('Failed to fetch from backend gateway');
      
      const data = await response.json();
      
      // Process results into counts
      const counts = {
        schools: data.summary?.totalSchools || data.places?.schools?.length || 0,
        hospitals: data.summary?.totalHospitals || data.places?.hospitals?.length || 0,
        industries: data.summary?.totalIndustries || (data.environment?.industries?.length + data.environment?.factories?.length) || 0,
        parks: data.places?.parks?.length || 0
      };

      return {
        success: true,
        data: counts,
        raw: data
      };
    } catch (error) {
      console.error("Overpass API Error:", error);
      // Fallback dummy data if API fails
      return {
        success: false,
        data: {
          schools: Math.floor(Math.random() * 10),
          hospitals: Math.floor(Math.random() * 5),
          industries: Math.floor(Math.random() * 8),
          parks: Math.floor(Math.random() * 4)
        },
        error: error.message
      };
    }
  }
};

