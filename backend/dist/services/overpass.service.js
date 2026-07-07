import axios from 'axios';
import { logger } from '../utils/logger.js';
import { buildOverpassQuery } from '../utils/overpassQueries.js';
export const OverpassService = {
    /**
     * Fetch landuse, forests, rivers, industries near coordinates
     */
    getEnvironmentalFeatures: async (lat, lng, radius) => {
        try {
            const query = buildOverpassQuery(lat, lng, radius);
            const res = await axios.post('https://overpass-api.de/api/interpreter', query, {
                headers: {
                    'Content-Type': 'text/plain',
                    'User-Agent': 'CleanAirApp/1.0 (contact@cleanair.local)'
                },
                timeout: 10000 // 10s timeout
            });
            const elements = res.data?.elements || [];
            return elements.map((el) => {
                let type = 'unknown';
                const tags = el.tags || {};
                if (tags.landuse === 'forest' || tags.natural === 'wood')
                    type = 'forests';
                else if (tags.leisure === 'park')
                    type = 'parks';
                else if (tags.waterway === 'river')
                    type = 'rivers';
                else if (tags.natural === 'water')
                    type = 'lakes';
                else if (tags.landuse === 'industrial' || tags.man_made === 'works' || tags.industrial)
                    type = 'industries';
                else if (tags.landuse === 'landfill')
                    type = 'landfills';
                else if (tags.amenity === 'recycling')
                    type = 'recyclingCenters';
                else if (tags.power === 'plant')
                    type = 'powerPlants';
                else if (tags.landuse === 'construction')
                    type = 'constructionSites';
                else if (tags.amenity && ['school', 'university', 'college'].includes(tags.amenity))
                    type = 'schools';
                else if (tags.amenity && ['hospital', 'clinic'].includes(tags.amenity))
                    type = 'hospitals';
                return {
                    id: el.id.toString(),
                    name: tags.name || `Local ${type.slice(0, -1)}`,
                    type,
                    geometry: el.center ? { type: 'Point', coordinates: [el.center.lon, el.center.lat] } : undefined,
                    latitude: el.center?.lat || el.lat || lat,
                    longitude: el.center?.lon || el.lon || lng
                };
            }).filter((f) => f.type !== 'unknown');
        }
        catch (error) {
            logger.error('Overpass API query failed. Returning empty array instead of mocks:', error.message);
            return getMockEnvironmentalFeatures(lat, lng);
        }
    }
};
function getMockEnvironmentalFeatures(lat, lng) {
    // We return empty instead of static identical data so that the frontend shows real API behavior
    return [];
}
