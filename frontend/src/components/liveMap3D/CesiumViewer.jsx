import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Viewer } from 'resium';
import * as Cesium from 'cesium';
import CameraController from './CameraController';
import LayerControls from './LayerControls';
import RiskEngine from './RiskEngine';
import { LayerManager } from '../../layers/LayerManager';

// Set up Cesium Ion token
const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
let imageryProvider = undefined;

if (ionToken) {
  Cesium.Ion.defaultAccessToken = ionToken;
} else {
  imageryProvider = new Cesium.OpenStreetMapImageryProvider({
    url: 'https://a.tile.openstreetmap.org/'
  });
}

export default function CesiumViewerWrapper({ selectedLocation }) {
  const viewerRef = useRef(null);
  const layerManagerRef = useRef(null);

  const [activeLayers, setActiveLayers] = useState({
    aqi: false,
    pollution: false,
    wind: false,
    weather: false,
  });

  // Initialize viewer scene settings once
  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;

    viewer.scene.globe.enableLighting = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.cesiumWidget.creditContainer.style.display = 'none';

    // Enable Cesium's built-in infoBox for layer popups
    viewer.infoBox.frame.sandbox = '';
    viewer.infoBox.frame.setAttribute('sandbox',
      'allow-same-origin allow-popups allow-forms allow-scripts allow-top-navigation'
    );

    // Create the LayerManager bound to this viewer
    layerManagerRef.current = new LayerManager(viewer);

    return () => {
      layerManagerRef.current?.destroyAll();
    };
  }, []);

  // When selectedLocation changes, update LayerManager target
  useEffect(() => {
    if (layerManagerRef.current && selectedLocation) {
      layerManagerRef.current.setLocation(selectedLocation);
    }
  }, [selectedLocation]);

  // Toggle a layer: update UI state + call LayerManager
  const toggleLayer = useCallback(async (layerName) => {
    const willBeActive = !activeLayers[layerName];
    setActiveLayers(prev => ({ ...prev, [layerName]: willBeActive }));

    if (layerManagerRef.current) {
      await layerManagerRef.current.toggle(layerName, willBeActive);
    }
  }, [activeLayers]);

  // Auto-enable layers when location first becomes available
  useEffect(() => {
    if (!selectedLocation || !layerManagerRef.current) return;

    const autoEnable = async () => {
      // Enable AQI layer by default when location is set
      if (!activeLayers.aqi) {
        setActiveLayers(prev => ({ ...prev, aqi: true }));
        await layerManagerRef.current.enable('aqi');
      }
    };
    autoEnable();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-[600px] md:h-[800px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        homeButton={false}
        geocoder={false}
        sceneModePicker={false}
        selectionIndicator={true}
        imageryProvider={imageryProvider}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <CameraController selectedLocation={selectedLocation} />
      </Viewer>

      {/* Overlay UI */}
      <LayerControls activeLayers={activeLayers} onToggle={toggleLayer} />
      <RiskEngine selectedLocation={selectedLocation} />
    </div>
  );
}
