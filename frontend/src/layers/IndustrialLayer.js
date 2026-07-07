// layers/IndustrialLayer.js
import * as Cesium from 'cesium';
import { IndustryProvider } from '../services/IndustryProvider';

const TYPE_COLORS = {
  'Factory':      '#f97316',
  'Power Plant':  '#ef4444',
  'Refinery':     '#a855f7',
  'Steel Plant':  '#6366f1',
  'Cement Plant': '#84cc16',
  'Thermal Plant':'#f43f5e',
};

export class IndustrialLayer {
  constructor(viewer) {
    this.viewer = viewer;
    this.dataSource = new Cesium.CustomDataSource('industrial-layer');
    this.primitives = [];
    this.refreshInterval = null;
    this.currentLocation = null;
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

    let industries;
    try {
      industries = await IndustryProvider.fetchNearby(location.latitude, location.longitude);
    } catch (e) {
      console.error('[IndustrialLayer] Failed:', e);
      return;
    }

    industries.forEach(ind => this._addIndustry(ind));
  }

  _addIndustry(ind) {
    const isCritical = ind.riskLevel === 'Critical';
    const isActive = ind.status === 'Active';
    const color = Cesium.Color.fromCssColorString(TYPE_COLORS[ind.type] || '#f97316');

    // Animated pulsing ring for critical sources
    if (isCritical && isActive) {
      this.dataSource.entities.add({
        id: `ind-ring-${ind.id}`,
        position: Cesium.Cartesian3.fromDegrees(ind.lon, ind.lat),
        ellipse: {
          semiMajorAxis: new Cesium.CallbackProperty((time) => {
            return 600 + 300 * Math.abs(Math.sin(Cesium.JulianDate.secondsDifference(time, Cesium.JulianDate.now()) * 1.5));
          }, false),
          semiMinorAxis: new Cesium.CallbackProperty((time) => {
            return 600 + 300 * Math.abs(Math.sin(Cesium.JulianDate.secondsDifference(time, Cesium.JulianDate.now()) * 1.5));
          }, false),
          material: color.withAlpha(0.0),
          outline: true,
          outlineColor: color.withAlpha(0.7),
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    }

    // Main industry point
    this.dataSource.entities.add({
      id: `ind-point-${ind.id}`,
      position: Cesium.Cartesian3.fromDegrees(ind.lon, ind.lat, 50),
      billboard: {
        image: this._getIcon(ind.type, isCritical),
        width: isCritical ? 40 : 32,
        height: isCritical ? 40 : 32,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.5, 8e5, 0.3),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: ind.name,
        font: 'bold 10px Inter, sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -45),
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.0, 2e5, 0.0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        backgroundPadding: new Cesium.Cartesian2(6, 3),
      },
      description: this._buildInfoHTML(ind),
    });
  }

  _getIcon(type, isCritical) {
    const emoji = { 'Factory': '🏭', 'Power Plant': '⚡', 'Refinery': '🛢️', 'Steel Plant': '⚙️', 'Cement Plant': '🏗️', 'Thermal Plant': '♨️' };
    const e = emoji[type] || '🏭';
    const bg = isCritical ? '#ef4444' : '#1e293b';
    const border = isCritical ? '#ff0000' : '#475569';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="${bg}" stroke="${border}" stroke-width="2"/>
      <text x="20" y="26" text-anchor="middle" font-size="18">${e}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  _buildInfoHTML(ind) {
    const riskColor = ind.riskLevel === 'Critical' ? '#ef4444' : ind.riskLevel === 'High' ? '#f97316' : '#eab308';
    return `
      <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;color:white;font-family:Inter,sans-serif;min-width:220px;">
        <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#94a3b8;margin-bottom:4px;">Industrial Source</div>
        <div style="font-size:18px;font-weight:900;margin-bottom:2px;">${ind.name}</div>
        <div style="font-size:11px;color:#94a3b8;margin-bottom:12px;">${ind.type} &bull; <span style="color:${riskColor};font-weight:700;">${ind.riskLevel} Risk</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">Est. PM2.5</div>
            <div style="font-size:15px;font-weight:800;">${ind.pm25} <span style="font-size:9px;color:#94a3b8;">µg/m³</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">NOx</div>
            <div style="font-size:15px;font-weight:800;">${ind.nox} <span style="font-size:9px;color:#94a3b8;">µg/m³</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">SO₂</div>
            <div style="font-size:15px;font-weight:800;">${ind.so2} <span style="font-size:9px;color:#94a3b8;">ppb</span></div>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:8px;">
            <div style="font-size:9px;color:#64748b;font-weight:700;">CO₂</div>
            <div style="font-size:15px;font-weight:800;">${ind.co2} <span style="font-size:9px;color:#94a3b8;">t/day</span></div>
          </div>
        </div>
        <div style="margin-top:10px;padding:6px 10px;border-radius:6px;background:${ind.status === 'Active' ? '#064e3b' : '#1e293b'};font-size:10px;font-weight:700;color:${ind.status === 'Active' ? '#34d399' : '#94a3b8'};">
          ● ${ind.status}
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
