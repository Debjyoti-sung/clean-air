/**
 * Geolocation and Reverse Geocoding Service
 * Primary: Browser Geolocation API
 * Fallback Reverse Geocoding: Nominatim (OpenStreetMap)
 */

export const GeolocationService = {
  /**
   * Get current device coordinates
   * @returns {Promise<{lat: number, lng: number, accuracy: number}>}
   */
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  },

  /**
   * Reverse Geocode coordinates to an address using Nominatim
   * @param {number} lat 
   * @param {number} lng 
   * @returns {Promise<any>}
   */
  reverseGeocode: async (lat, lng) => {
    try {
      // Nominatim requires a descriptive User-Agent, but in browsers we just fetch
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (!response.ok) throw new Error("Failed to reverse geocode");
      
      const data = await response.json();
      return {
        formattedAddress: data.display_name,
        address: data.address
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Fallback response if API fails
      return {
        formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        address: {}
      };
    }
  }
};
