// services/IndustryProvider.js
const BACKEND_URL = 'http://localhost:5000';

export const IndustryProvider = {
  async fetchNearby(lat, lon, radius = 10) {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/map?lat=${lat}&lng=${lon}&radius=${radius * 1000}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error('Backend unavailable');
      const data = await res.json();
      return this._mapBackendToIndustry(data, lat, lon);
    } catch (err) {
      console.warn('[IndustryProvider] Using mock data:', err.message);
      return this._mockIndustries(lat, lon);
    }
  },

  _mapBackendToIndustry(data, lat, lon) {
    const pois = data?.pois || {};
    const industries = [];

    // Map industrial POIs from TomTom backend data
    const factories = pois.factories || [];
    const powerPlants = pois.powerPlants || [];
    const landfills = pois.landfills || [];
    const construction = pois.constructionSites || [];

    factories.forEach((f, i) => {
      industries.push({
        id: `factory-${i}`, name: f.name || `Factory ${i + 1}`,
        type: 'Factory', lat: f.lat || lat + (Math.random() - 0.5) * 0.1,
        lon: f.lon || lon + (Math.random() - 0.5) * 0.1,
        riskLevel: 'High', pm25: Math.round(60 + Math.random() * 100),
        nox: Math.round(40 + Math.random() * 80), so2: Math.round(20 + Math.random() * 60),
        co2: Math.round(200 + Math.random() * 400), status: 'Active',
      });
    });

    powerPlants.forEach((p, i) => {
      industries.push({
        id: `plant-${i}`, name: p.name || `Power Plant ${i + 1}`,
        type: 'Power Plant', lat: p.lat || lat + (Math.random() - 0.5) * 0.1,
        lon: p.lon || lon + (Math.random() - 0.5) * 0.1,
        riskLevel: 'Critical', pm25: Math.round(90 + Math.random() * 120),
        nox: Math.round(80 + Math.random() * 100), so2: Math.round(50 + Math.random() * 80),
        co2: Math.round(400 + Math.random() * 600), status: 'Active',
      });
    });

    if (industries.length === 0) return this._mockIndustries(lat, lon);
    return industries;
  },

  _mockIndustries(lat, lon) {
    const types = ['Factory', 'Power Plant', 'Refinery', 'Steel Plant', 'Cement Plant', 'Thermal Plant'];
    const names = [
      'Hindustan Steel Corp', 'National Power Unit 3', 'BPCL Refinery Complex',
      'Ambuja Cement Works', 'Adani Thermal Station', 'Tata Steel Plant',
      'NTPC Unit 7', 'Reliance Industries Hub', 'Coal India Processing'
    ];
    return Array.from({ length: 8 }, (_, i) => ({
      id: `mock-ind-${i}`,
      name: names[i % names.length],
      type: types[i % types.length],
      lat: lat + (Math.random() - 0.5) * 0.2,
      lon: lon + (Math.random() - 0.5) * 0.2,
      riskLevel: i < 3 ? 'Critical' : i < 6 ? 'High' : 'Moderate',
      pm25: Math.round(40 + Math.random() * 150),
      nox: Math.round(30 + Math.random() * 100),
      so2: Math.round(15 + Math.random() * 70),
      co2: Math.round(100 + Math.random() * 700),
      status: Math.random() > 0.15 ? 'Active' : 'Idle',
    }));
  },
};
