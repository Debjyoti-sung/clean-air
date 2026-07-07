import axios from 'axios';
import { logger } from '../utils/logger.js';
export const TomTomService = {
    /**
     * Fetch POIs near coordinates using TomTom Search
     */
    getNearbyPOIs: async (lat, lng, radius) => {
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
                return results.map((r) => ({
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
        }
        catch (error) {
            logger.error('TomTom API request failed. Falling back to mocks:', error.message);
            return getMockPOIs(lat, lng);
        }
    }
};
function getMockPOIs(lat, lng) {
    // We return empty instead of static identical data so that the frontend shows real API behavior
    // relying on OSM (Overpass) for schools, hospitals, and parks instead.
    return [];
}
