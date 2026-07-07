// layers/LayerManager.js
// Central orchestrator — each layer is independently managed

import { AQILayer } from './AQILayer';
import { IndustrialLayer } from './IndustrialLayer';
import { WindLayer } from './WindLayer';
import { WeatherLayer } from './WeatherLayer';

export class LayerManager {
  constructor(viewer) {
    this.viewer = viewer;
    this.layers = {
      aqi:        new AQILayer(viewer),
      pollution:  new IndustrialLayer(viewer),
      wind:       new WindLayer(viewer),
      weather:    new WeatherLayer(viewer),
    };
    this._initialized = new Set();
    this._active = new Set();
    this._location = null;
  }

  setLocation(location) {
    this._location = location;
    // Refresh all active layers when location changes
    this._active.forEach(name => {
      const layer = this.layers[name];
      if (layer && this._initialized.has(name)) {
        layer.load(location);
      }
    });
  }

  async enable(layerName) {
    const layer = this.layers[layerName];
    if (!layer) return;

    if (this._initialized.has(layerName)) {
      layer.show();
    } else {
      // First time — initialize and load
      await layer.initialize(this._location || { latitude: 20.5937, longitude: 78.9629 });
      this._initialized.add(layerName);
    }
    this._active.add(layerName);
  }

  disable(layerName) {
    const layer = this.layers[layerName];
    if (!layer) return;
    layer.hide();
    this._active.delete(layerName);
  }

  async toggle(layerName, isActive) {
    if (isActive) {
      await this.enable(layerName);
    } else {
      this.disable(layerName);
    }
  }

  destroyAll() {
    Object.values(this.layers).forEach(layer => {
      try { layer.destroy(); } catch (e) {}
    });
    this._initialized.clear();
    this._active.clear();
  }
}
