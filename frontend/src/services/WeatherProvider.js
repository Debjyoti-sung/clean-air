// services/WeatherProvider.js
const BACKEND_URL = 'https://clean-air-w252.onrender.com';

export const WeatherProvider = {
  async fetchAt(lat, lon) {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/weather?lat=${lat}&lng=${lon}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error('Backend unavailable');
      const data = await res.json();
      return this._mapBackendToWeather(data);
    } catch (err) {
      console.warn('[WeatherProvider] Using mock data:', err.message);
      return this._mockWeather(lat, lon);
    }
  },

  _mapBackendToWeather(data) {
    const w = data?.weather || data || {};
    return {
      temperature: w.temperature ?? 32,
      humidity: w.humidity ?? 65,
      pressure: w.pressure ?? 1012,
      windSpeed: w.windSpeed ?? 12,
      windDirection: w.windDirection ?? 225,
      rainfall: w.rainfall ?? 0,
      cloudCover: w.cloudCover ?? 40,
      visibility: w.visibility ?? 8,
      uvIndex: w.uvIndex ?? 6,
      description: w.description || 'Partly Cloudy',
    };
  },

  _mockWeather(lat, lon) {
    return {
      temperature: Math.round(25 + Math.random() * 15),
      humidity: Math.round(50 + Math.random() * 40),
      pressure: Math.round(1005 + Math.random() * 20),
      windSpeed: Math.round(5 + Math.random() * 25),
      windDirection: Math.round(Math.random() * 360),
      rainfall: Math.random() > 0.7 ? parseFloat((Math.random() * 10).toFixed(1)) : 0,
      cloudCover: Math.round(Math.random() * 100),
      visibility: Math.round(3 + Math.random() * 15),
      uvIndex: Math.round(Math.random() * 11),
      description: 'Partly Cloudy',
    };
  },
};
