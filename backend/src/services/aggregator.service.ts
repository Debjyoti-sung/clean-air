import { TomTomService } from './tomtom.service.js';
import { OverpassService } from './overpass.service.js';
import { OpenAQService } from './openaq.service.js';
import { logger } from '../utils/logger.js';
import { UnifiedResponse, Place, EnvironmentalFeature, Summary } from '../types/map.types.js';

export const AggregatorService = {
  /**
   * Aggregate POIs, OSM infrastructure, and Air Quality data
   */
  getUnifiedEnvironmentData: async (lat: number, lng: number, radius: number): Promise<UnifiedResponse> => {
    logger.info(`Starting environmental aggregation for Lat:${lat}, Lng:${lng}, Radius:${radius}m`);
    
    const startTime = Date.now();

    // Call all three APIs concurrently using Promise.all
    const [tomtomPois, osmFeatures, airQuality] = await Promise.all([
      TomTomService.getNearbyPOIs(lat, lng, radius),
      OverpassService.getEnvironmentalFeatures(lat, lng, radius),
      OpenAQService.getAirQuality(lat, lng)
    ]);

    logger.info(`Concurrently fetched resources in ${Date.now() - startTime}ms`);

    // Group OSM Environmental Features
    const environment = {
      forests: osmFeatures.filter(f => f.type === 'forests'),
      rivers: osmFeatures.filter(f => f.type === 'rivers'),
      lakes: osmFeatures.filter(f => f.type === 'lakes'),
      industries: osmFeatures.filter(f => f.type === 'industries'),
      factories: osmFeatures.filter(f => f.type === 'factories'),
      landfills: osmFeatures.filter(f => f.type === 'landfills'),
      recyclingCenters: osmFeatures.filter(f => f.type === 'recyclingCenters'),
      powerPlants: osmFeatures.filter(f => f.type === 'powerPlants'),
      constructionSites: osmFeatures.filter(f => f.type === 'constructionSites'),
      schools: osmFeatures.filter(f => f.type === 'schools'),
      hospitals: osmFeatures.filter(f => f.type === 'hospitals')
    };

    // Group TomTom Places (merging with OSM fallback)
    const places = {
      schools: [...tomtomPois.filter(p => p.category === 'school'), ...environment.schools.map(f => ({ ...f, category: 'school' }))],
      hospitals: [...tomtomPois.filter(p => p.category === 'hospital'), ...environment.hospitals.map(f => ({ ...f, category: 'hospital' }))],
      petrolPumps: tomtomPois.filter(p => p.category === 'petrolPumps'),
      railwayStations: tomtomPois.filter(p => p.category === 'railwayStations'),
      parks: [...tomtomPois.filter(p => p.category === 'parks'), ...osmFeatures.filter(f => f.type === 'parks').map(f => ({ ...f, category: 'parks' }))]
    };

    // Compute Risk Score
    const summary = calculateRiskSummary(airQuality.aqi, environment, places);

    return {
      location: {
        latitude: lat,
        longitude: lng
      },
      airQuality,
      places,
      environment,
      summary
    };
  }
};

function calculateRiskSummary(aqi: number, env: any, places: any): Summary {
  let riskScore = 0;

  // Add risk modifiers
  riskScore += env.industries.length * 20;
  riskScore += env.landfills.length * 30;
  riskScore += env.factories.length * 15;
  riskScore += env.powerPlants.length * 10;
  riskScore += env.constructionSites.length * 5;

  // Subtract green/mitigating modifiers
  riskScore -= places.parks.length * 15;
  riskScore -= env.forests.length * 20;
  riskScore -= env.rivers.length * 10;
  riskScore -= env.lakes.length * 10;

  // Add AQI factor weight
  if (aqi <= 50) riskScore += 5;
  else if (aqi <= 100) riskScore += 15;
  else if (aqi <= 150) riskScore += 30;
  else if (aqi <= 200) riskScore += 50;
  else riskScore += 75;

  // Bound the score between 0 and 100
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Determine Risk Level
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Very High' = 'Low';
  if (riskScore <= 30) riskLevel = 'Low';
  else if (riskScore <= 60) riskLevel = 'Medium';
  else if (riskScore <= 85) riskLevel = 'High';
  else riskLevel = 'Very High';

  return {
    totalSchools: places.schools.length,
    totalHospitals: places.hospitals.length,
    totalIndustries: env.industries.length + env.factories.length,
    totalForests: env.forests.length,
    totalLandfills: env.landfills.length,
    riskScore,
    riskLevel
  };
}
