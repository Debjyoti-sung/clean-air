import React, { useEffect } from 'react';
import { useCesium } from 'resium';
import * as Cesium from 'cesium';

export default function CameraController({ selectedLocation }) {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;

    // Start very far out in space, looking generally at Earth
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(80.0, -10.0, 25000000.0)
    });

    // Determine target location (India center or user selected)
    const targetLon = selectedLocation ? selectedLocation.longitude : 78.9629;
    const targetLat = selectedLocation ? selectedLocation.latitude : 20.5937;
    const targetHeight = selectedLocation ? 15000.0 : 5000000.0; // Zoom closer if a location is selected
    const targetPitch = selectedLocation ? -45.0 : -90.0; // Angled view for cities, top-down for country

    // Trigger the cinematic fly-in sequence after a short delay
    const timeoutId = setTimeout(() => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(targetLon, targetLat, targetHeight),
        duration: 4.5, // Smooth 4.5s cinematic easing
        easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(targetPitch),
          roll: 0.0
        }
      });
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [viewer, selectedLocation]);

  return null;
}
