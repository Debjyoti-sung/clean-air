import { getPollutionData } from '../components/LivePollution';

/**
 * Placeholder function to fetch AQI telemetry for a given location.
 * Later this function will be replaced with a real AQI API.
 * 
 * @param {Object} selectedLocation - The selected location object.
 * @returns {Object} AQI, Temperature, Humidity, Wind Speed, Hotspots, Last Updated.
 */
export function fetchLocationAQI(selectedLocation) {
  if (!selectedLocation) {
    return {
      aqi: '--',
      status: 'Location Required',
      temperature: '--',
      humidity: '--',
      windSpeed: '--',
      hotspots: '--',
      lastUpdated: '--'
    };
  }

  const data = getPollutionData(selectedLocation);
  
  let status = 'Location Required';
  if (data && typeof data.aqi === 'number') {
    const val = data.aqi;
    if (val <= 50) status = 'Good';
    else if (val <= 100) status = 'Moderate';
    else if (val <= 200) status = 'Poor';
    else if (val <= 300) status = 'Very Poor';
    else status = 'Severe';
  }

  return {
    aqi: data ? data.aqi : '--',
    status: status,
    temperature: data ? `${data.temp}°C` : '--',
    humidity: data ? `${data.humidity}%` : '--',
    windSpeed: data ? `${data.windSpeed} km/h` : '--',
    hotspots: data ? data.activeHotspots : '--',
    lastUpdated: 'Just Now'
  };
}
