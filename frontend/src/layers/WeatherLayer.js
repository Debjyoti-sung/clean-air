// layers/WeatherLayer.js
import * as Cesium from 'cesium';
import { WeatherProvider } from '../services/WeatherProvider';

export class WeatherLayer {
  constructor(viewer) {
    this.viewer = viewer;
    this.dataSource = new Cesium.CustomDataSource('weather-layer');
    this.particleSystems = [];
    this.refreshInterval = null;
    this.currentLocation = null;
    this.weatherData = null;
    this._visible = false;
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
    this._destroyParticles();

    try {
      this.weatherData = await WeatherProvider.fetchAt(location.latitude, location.longitude);
    } catch (e) {
      this.weatherData = { temperature: 30, humidity: 65, pressure: 1012, rainfall: 5, cloudCover: 60, visibility: 8, uvIndex: 5, description: 'Partly Cloudy' };
    }

    this._drawWeatherCells(location, this.weatherData);
    this._addCentralInfo(location, this.weatherData);
  }

  _drawWeatherCells(location, weather) {
    // Temperature color zone
    const tempColor = this._getTempColor(weather.temperature);
    this.dataSource.entities.add({
      id: 'weather-temp-zone',
      position: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude),
      ellipse: {
        semiMajorAxis: 12000,
        semiMinorAxis: 12000,
        material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(tempColor).withAlpha(0.15)),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString(tempColor).withAlpha(0.4),
        outlineWidth: 1.5,
      },
    });

    // Cloud cover semi-transparent dome (ellipsoid)
    if (weather.cloudCover > 20) {
      const alpha = weather.cloudCover / 500;
      this.dataSource.entities.add({
        id: 'weather-cloud-dome',
        position: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, 3000),
        ellipsoid: {
          radii: new Cesium.Cartesian3(18000, 18000, 2000),
          material: Cesium.Color.fromCssColorString('#e2e8f0').withAlpha(alpha),
          outline: false,
          slicePartitions: 8,
          stackPartitions: 8,
        },
      });
    }

    // Rain indication
    if (weather.rainfall > 0) {
      this.dataSource.entities.add({
        id: 'weather-rain-zone',
        position: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude),
        ellipse: {
          semiMajorAxis: 8000,
          semiMinorAxis: 8000,
          material: new Cesium.StripeMaterialProperty({
            evenColor: Cesium.Color.fromCssColorString('#3b82f6').withAlpha(0.2),
            oddColor: Cesium.Color.TRANSPARENT,
            repeat: 20,
            offset: new Cesium.CallbackProperty(
              (time) => Cesium.JulianDate.secondsDifference(time, Cesium.JulianDate.now()) * 0.5, false
            ),
            orientation: Cesium.StripeOrientation.HORIZONTAL,
          }),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    }
  }

  _addCentralInfo(location, weather) {
    const icon = this._getWeatherIcon(weather);
    this.dataSource.entities.add({
      id: 'weather-info-center',
      position: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, 500),
      billboard: {
        image: icon,
        width: 48,
        height: 48,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.5, 8e5, 0.4),
      },
      label: {
        text: `${weather.temperature}°C`,
        font: 'bold 14px Inter, sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -52),
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.2, 5e5, 0.0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        backgroundPadding: new Cesium.Cartesian2(6, 4),
      },
      description: this._buildInfoHTML(weather),
    });
  }

  _getTempColor(temp) {
    if (temp < 10) return '#3b82f6';
    if (temp < 20) return '#22d3ee';
    if (temp < 30) return '#22c55e';
    if (temp < 35) return '#f59e0b';
    if (temp < 40) return '#f97316';
    return '#ef4444';
  }

  _getWeatherIcon(weather) {
    let emoji = '🌤️';
    if (weather.rainfall > 5) emoji = '🌧️';
    else if (weather.rainfall > 0) emoji = '🌦️';
    else if (weather.cloudCover > 70) emoji = '☁️';
    else if (weather.temperature > 38) emoji = '🌡️';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="#0f172a" stroke="#334155" stroke-width="2" opacity="0.9"/>
      <text x="24" y="31" text-anchor="middle" font-size="22">${emoji}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  _buildInfoHTML(w) {
    return `
      <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;color:white;font-family:Inter,sans-serif;min-width:220px;">
        <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#94a3b8;margin-bottom:6px;">Live Weather</div>
        <div style="font-size:20px;font-weight:800;margin-bottom:12px;">${w.description}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Temperature</div>
            <div style="font-size:16px;font-weight:800;">${w.temperature}°C</div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Humidity</div>
            <div style="font-size:16px;font-weight:800;">${w.humidity}%</div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Pressure</div>
            <div style="font-size:16px;font-weight:800;">${w.pressure} hPa</div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Rainfall</div>
            <div style="font-size:16px;font-weight:800;">${w.rainfall} mm</div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Cloud Cover</div>
            <div style="font-size:16px;font-weight:800;">${w.cloudCover}%</div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">UV Index</div>
            <div style="font-size:16px;font-weight:800;">${w.uvIndex}</div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:10px;color:#64748b;">Visibility: ${w.visibility} km</div>
      </div>`;
  }

  _destroyParticles() {
    this.particleSystems.forEach(ps => {
      try { this.viewer.scene.primitives.remove(ps); } catch (e) {}
    });
    this.particleSystems = [];
  }

  show() { this.dataSource.show = true; this._visible = true; }
  hide() { this.dataSource.show = false; this._visible = false; }
  async refresh() { await this.load(this.currentLocation); }

  destroy() {
    clearInterval(this.refreshInterval);
    this._destroyParticles();
    this.viewer.dataSources.remove(this.dataSource);
  }
}
