// layers/AQILayer.js
// Manages Cesium AQI heatmap entities — independent layer lifecycle

import * as Cesium from 'cesium';
import { AQIDataProvider } from '../services/AQIDataProvider';

export class AQILayer {
  constructor(viewer) {
    this.viewer = viewer;
    this.dataSource = new Cesium.CustomDataSource('aqi-layer');
    this.refreshInterval = null;
    this.currentLocation = null;
    this.stations = [];
    this._visible = false;
  }

  async initialize(location) {
    this.currentLocation = location;
    await this.viewer.dataSources.add(this.dataSource);
    await this.load(location);

    // Auto-refresh every 5 minutes
    this.refreshInterval = setInterval(() => {
      if (this._visible && this.currentLocation) this.refresh();
    }, 5 * 60 * 1000);

    this._visible = true;
  }

  async load(location) {
    if (!location) return;
    this.currentLocation = location;
    this.dataSource.entities.removeAll();

    try {
      this.stations = await AQIDataProvider.fetchNearby(location.latitude, location.longitude);
    } catch (e) {
      console.error('[AQILayer] Failed to fetch:', e);
      return;
    }

    this.stations.forEach(station => this._addStation(station));
  }

  _addStation(station) {
    const color = Cesium.Color.fromCssColorString(AQIDataProvider.getAQIColor(station.aqi)).withAlpha(0.75);
    const radius = Math.max(2000, station.aqi * 25); // Scale radius by AQI

    // Ground circle heatmap blob
    this.dataSource.entities.add({
      id: `aqi-circle-${station.id}`,
      position: Cesium.Cartesian3.fromDegrees(station.lon, station.lat),
      ellipse: {
        semiMajorAxis: radius,
        semiMinorAxis: radius,
        material: new Cesium.ColorMaterialProperty(
          new Cesium.CallbackProperty(() => color, false)
        ),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        height: 0,
        outline: false,
      },
      description: this._buildInfoHTML(station),
      label: {
        text: `AQI\n${station.aqi}`,
        font: 'bold 11px Inter, sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -8),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString(AQIDataProvider.getAQIColor(station.aqi)).withAlpha(0.9),
        backgroundPadding: new Cesium.Cartesian2(6, 4),
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.2, 8e5, 0.3),
      },
    });
  }

  _buildInfoHTML(s) {
    const timeDiff = Math.floor((Date.now() - new Date(s.updatedAt)) / 60000);
    const color = AQIDataProvider.getAQIColor(s.aqi);
    return `
      <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;color:white;font-family:Inter,sans-serif;min-width:220px;">
        <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#94a3b8;margin-bottom:4px;">Air Quality Index</div>
        <div style="font-size:32px;font-weight:900;color:${color};line-height:1;">${s.aqi}</div>
        <div style="font-size:11px;color:${color};font-weight:700;margin-bottom:12px;">${s.category}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">PM2.5</div>
            <div style="font-size:16px;font-weight:800;">${s.pm25} <span style="font-size:9px;color:#94a3b8;">µg/m³</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">PM10</div>
            <div style="font-size:16px;font-weight:800;">${s.pm10} <span style="font-size:9px;color:#94a3b8;">µg/m³</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">O₃</div>
            <div style="font-size:16px;font-weight:800;">${s.o3} <span style="font-size:9px;color:#94a3b8;">ppb</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">NO₂</div>
            <div style="font-size:16px;font-weight:800;">${s.no2} <span style="font-size:9px;color:#94a3b8;">ppb</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">SO₂</div>
            <div style="font-size:16px;font-weight:800;">${s.so2} <span style="font-size:9px;color:#94a3b8;">ppb</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">CO</div>
            <div style="font-size:16px;font-weight:800;">${s.co} <span style="font-size:9px;color:#94a3b8;">ppm</span></div>
          </div>
        </div>
        <div style="margin-top:12px;font-size:10px;color:#64748b;">
          📍 ${s.name} &bull; Updated ${timeDiff < 1 ? 'just now' : timeDiff + ' min ago'}
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
