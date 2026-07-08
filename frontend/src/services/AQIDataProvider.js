// services/AQIDataProvider.js
// Abstraction layer for AQI data — swap out the provider without touching UI

const AQICN_TOKEN = import.meta.env.VITE_AQICN_TOKEN || 'demo';
const BACKEND_URL = 'https://clean-air-w252.onrender.com';

export const AQIDataProvider = {
  /**
   * Fetch AQI stations near a coordinate.
   * Falls back to mock data if API is unavailable.
   */
  async fetchNearby(lat, lon, radius = 10) {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/map?lat=${lat}&lng=${lon}&radius=${radius * 1000}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error('Backend unavailable');
      const data = await res.json();
      return this._mapBackendToStations(data, lat, lon);
    } catch (err) {
      console.warn('[AQIDataProvider] Using mock data:', err.message);
      return this._mockStations(lat, lon);
    }
  },

  _mapBackendToStations(data, centerLat, centerLon) {
    const aqiData = data?.aqi || {};
    const stations = [];

    // Main station from live data
    if (aqiData.aqi !== undefined) {
      stations.push({
        id: 'main',
        name: data?.location?.displayName || 'Nearest Station',
        lat: centerLat,
        lon: centerLon,
        aqi: aqiData.aqi,
        pm25: aqiData.pm25 || aqiData.aqi * 0.6,
        pm10: aqiData.pm10 || aqiData.aqi * 0.9,
        o3: aqiData.o3 || 22,
        no2: aqiData.no2 || 31,
        so2: aqiData.so2 || 6,
        co: aqiData.co || 1.2,
        category: this._getCategory(aqiData.aqi),
        primaryPollutant: aqiData.dominantPollutant || 'PM2.5',
        updatedAt: new Date().toISOString(),
      });
    }

    // Synthetic surrounding stations for heatmap spread
    const offsets = [
      [0.05, 0.05], [-0.05, 0.05], [0.05, -0.05], [-0.05, -0.05],
      [0.1, 0], [-0.1, 0], [0, 0.1], [0, -0.1],
    ];
    offsets.forEach(([dLat, dLon], i) => {
      const baseAqi = aqiData.aqi || 80;
      const aqi = Math.max(10, baseAqi + (Math.random() - 0.5) * 60);
      stations.push({
        id: `synth-${i}`,
        name: `Station ${i + 1}`,
        lat: centerLat + dLat,
        lon: centerLon + dLon,
        aqi: Math.round(aqi),
        pm25: Math.round(aqi * 0.6),
        pm10: Math.round(aqi * 0.9),
        o3: Math.round(10 + Math.random() * 30),
        no2: Math.round(15 + Math.random() * 40),
        so2: Math.round(3 + Math.random() * 15),
        co: parseFloat((0.5 + Math.random() * 2).toFixed(1)),
        category: this._getCategory(aqi),
        primaryPollutant: 'PM2.5',
        updatedAt: new Date().toISOString(),
      });
    });

    return stations;
  },

  _mockStations(centerLat, centerLon) {
    const rawStations = [
      { dLat: 0, dLon: 0, name: 'City Center', aqi: 165 },
      { dLat: 0.04, dLon: 0.04, name: 'Industrial Zone', aqi: 210 },
      { dLat: -0.05, dLon: 0.02, name: 'Residential Area', aqi: 95 },
      { dLat: 0.08, dLon: -0.06, name: 'Highway Junction', aqi: 180 },
      { dLat: -0.08, dLon: -0.04, name: 'Green Belt', aqi: 45 },
      { dLat: 0.12, dLon: 0.10, name: 'Factory District', aqi: 250 },
      { dLat: -0.12, dLon: 0.08, name: 'Suburban Area', aqi: 70 },
      { dLat: 0.06, dLon: -0.12, name: 'Port Area', aqi: 145 },
    ];

    return rawStations.map((s, i) => ({
      id: `mock-${i}`,
      name: s.name,
      lat: centerLat + s.dLat,
      lon: centerLon + s.dLon,
      aqi: s.aqi,
      pm25: Math.round(s.aqi * 0.6),
      pm10: Math.round(s.aqi * 0.9),
      o3: Math.round(10 + Math.random() * 30),
      no2: Math.round(15 + Math.random() * 40),
      so2: Math.round(3 + Math.random() * 15),
      co: parseFloat((0.5 + Math.random() * 2).toFixed(1)),
      category: this._getCategory(s.aqi),
      primaryPollutant: 'PM2.5',
      updatedAt: new Date().toISOString(),
    }));
  },

  _getCategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  },

  getAQIColor(aqi) {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  },
};
