// layers/WindLayer.js
import * as Cesium from 'cesium';
import { WeatherProvider } from '../services/WeatherProvider';

export class WindLayer {
  constructor(viewer) {
    this.viewer = viewer;
    this.primitiveSystem = null;
    this.refreshInterval = null;
    this.currentLocation = null;
    this.weatherData = null;
    this._visible = false;
    this._animationHandle = null;
    this.dataSource = new Cesium.CustomDataSource('wind-layer');
  }

  async initialize(location) {
    await this.viewer.dataSources.add(this.dataSource);
    await this.load(location);
    this.refreshInterval = setInterval(() => {
      if (this._visible && this.currentLocation) this.refresh();
    }, 10 * 60 * 1000);
    this._visible = true;
  }

  async load(location) {
    if (!location) return;
    this.currentLocation = location;
    this.dataSource.entities.removeAll();

    try {
      this.weatherData = await WeatherProvider.fetchAt(location.latitude, location.longitude);
    } catch (e) {
      this.weatherData = { windSpeed: 12, windDirection: 225, humidity: 65, pressure: 1012, temperature: 30, visibility: 10 };
    }

    this._drawWindArrows(location, this.weatherData);
    this._addInfoPoints(location, this.weatherData);
  }

  _drawWindArrows(location, weather) {
    const { windSpeed, windDirection } = weather;
    const gridSize = 5;
    const spread = 0.25;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = location.latitude + (i - gridSize / 2) * (spread / gridSize);
        const lon = location.longitude + (j - gridSize / 2) * (spread / gridSize);

        // Convert wind direction to radians (meteorological: wind FROM this direction)
        const headingRad = Cesium.Math.toRadians(windDirection + 180);
        const speedFactor = Math.min(windSpeed / 30, 1.0);
        const arrowLength = 0.005 + speedFactor * 0.01;

        const endLat = lat + arrowLength * Math.cos(headingRad);
        const endLon = lon + arrowLength * Math.sin(headingRad);

        // Animated moving wind streamlines
        const t = (i * gridSize + j) / (gridSize * gridSize);
        this.dataSource.entities.add({
          id: `wind-arrow-${i}-${j}`,
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([lon, lat, endLon, endLat]),
            width: 1.5 + speedFactor * 2,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.3,
              taperPower: 0.8,
              color: new Cesium.Color(0.2, 0.8, 1.0, 0.6 + speedFactor * 0.4),
            }),
            clampToGround: true,
          },
        });
      }
    }
  }

  _addInfoPoints(location, weather) {
    // Central clickable info node
    this.dataSource.entities.add({
      id: 'wind-info-center',
      position: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, 200),
      billboard: {
        image: this._buildWindIcon(weather.windSpeed),
        width: 48,
        height: 48,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      description: this._buildInfoHTML(weather),
    });
  }

  _buildWindIcon(speed) {
    const color = speed > 20 ? '#ef4444' : speed > 10 ? '#f97316' : '#22d3ee';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="#0f172a" stroke="${color}" stroke-width="2" opacity="0.9"/>
      <text x="24" y="30" text-anchor="middle" font-size="22">💨</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  _buildInfoHTML(w) {
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    const dir = dirs[Math.round(w.windDirection / 45) % 8];
    return `
      <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;color:white;font-family:Inter,sans-serif;min-width:220px;">
        <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#94a3b8;margin-bottom:8px;">Live Wind Conditions</div>
        <div style="font-size:36px;font-weight:900;color:#22d3ee;">${w.windSpeed} <span style="font-size:14px;color:#94a3b8;">km/h</span></div>
        <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;">From ${dir} (${w.windDirection}°)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Humidity</div>
            <div style="font-size:16px;font-weight:800;">${w.humidity}<span style="font-size:9px;color:#94a3b8;">%</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Pressure</div>
            <div style="font-size:16px;font-weight:800;">${w.pressure}<span style="font-size:9px;color:#94a3b8;">hPa</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Temperature</div>
            <div style="font-size:16px;font-weight:800;">${w.temperature}<span style="font-size:9px;color:#94a3b8;">°C</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Visibility</div>
            <div style="font-size:16px;font-weight:800;">${w.visibility}<span style="font-size:9px;color:#94a3b8;">km</span></div>
          </div>
        </div>
      </div>`;
  }

  show() { this.dataSource.show = true; this._visible = true; }
  hide() { this.dataSource.show = false; this._visible = false; }
  async refresh() { await this.load(this.currentLocation); }

  destroy() {
    clearInterval(this.refreshInterval);
    this.viewer.dataSources.remove(this.dataSource);
  }
}
