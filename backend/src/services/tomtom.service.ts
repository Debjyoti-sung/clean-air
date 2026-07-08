import axios from 'axios';
import { logger } from '../utils/logger.js';
import { Place } from '../types/map.types.js';

export const TomTomService = {
  /**
   * Fetch POIs near coordinates using TomTom Search
   */
  getNearbyPOIs: async (lat: number, lng: number, radius: number): Promise<Place[]> => {
    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey || apiKey.includes('xxx') || apiKey.includes('your_')) {
      logger.warn('TomTom API Key is missing or default placeholder. Using mock POIs.');
      return getMockPOIs(lat, lng);
    }

    try {
      // TomTom Category Search for POIs
      // To get various POIs, we search for multiple query terms.
      // E.g., schools, hospitals, transit, parks.
      const categories = [
        { query: 'school', cat: 'school' },
        { query: 'hospital', cat: 'hospital' },
        { query: 'gas station', cat: 'petrolPumps' },
        { query: 'railway station', cat: 'railwayStations' },
        { query: 'park', cat: 'parks' }
      ];

      const promises = categories.map(async (c) => {
        const url = `https://api.tomtom.com/search/2/poiSearch/${encodeURIComponent(c.query)}.json`;
        const res = await axios.get(url, {
          params: {
            key: apiKey,
            lat,
            lon: lng,
            radius,
            limit: 10
          },
          timeout: 8000 // 8s timeout
        });

        const results = res.data?.results || [];
        return results.map((r: any): Place => ({
          id: r.id,
          name: r.poi?.name || 'Unnamed Place',
          category: c.cat,
          latitude: r.position?.lat,
          longitude: r.position?.lon,
          address: r.address?.freeformAddress,
          distance: r.dist
        }));
      });

      const allResults = await Promise.all(promises);
      return allResults.flat();
    } catch (error: any) {
      logger.error('TomTom API request failed. Falling back to mocks:', error.message);
      return getMockPOIs(lat, lng);
    }
  },

  /**
   * Reverse geocode coordinates using TomTom Search
   */
  reverseGeocode: async (lat: number, lng: number): Promise<any> => {
    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey || apiKey.includes('xxx') || apiKey.includes('your_')) {
      logger.warn('TomTom API Key is missing or default placeholder. Using mock address.');
      return getMockAddress(lat, lng);
    }

    try {
      const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json`;
      const res = await axios.get(url, {
        params: {
          key: apiKey
        },
        timeout: 8000
      });

      const result = res.data?.addresses?.[0]?.address;
      if (!result) throw new Error('No address found in TomTom response');

      return {
        address: result.freeformAddress || `${lat}, ${lng}`,
        city: result.municipality || result.locality || 'GPS Location',
        district: result.subMunicipality || result.municipalitySubdivision || '',
        state: result.countrySubdivision || result.countrySubdivisionName || 'India',
        postcode: result.postalCode || ''
      };
    } catch (error: any) {
      logger.error('TomTom Reverse Geocode request failed. Falling back to mocks:', error.message);
      return getMockAddress(lat, lng);
    }
  }
};

function getMockAddress(lat: number, lng: number) {
  return {
    address: `GPS Telemetry Node Node-${Math.floor(lat * 100)},\nDetected Coordinates: [${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E],\nIndia`,
    city: 'GPS Location',
    district: '',
    state: 'India',
    postcode: ''
  };
}

function getMockPOIs(lat: number, lng: number): Place[] {
  // We return empty instead of static identical data so that the frontend shows real API behavior
  // relying on OSM (Overpass) for schools, hospitals, and parks instead.
  return [];
}
