import React, { useEffect, useState } from 'react';
import { useCesium } from 'resium';
import * as Cesium from 'cesium';

export default function PollutionLayer({ selectedLocation }) {
  const { viewer } = useCesium();
  const [industrialSites, setIndustrialSites] = useState([]);

  useEffect(() => {
    // Mocking industrial sites. In production, this pulls from Overpass API (factories/power plants).
    const sites = selectedLocation 
      ? [
          { lat: selectedLocation.latitude + 0.01, lon: selectedLocation.longitude + 0.01, severity: 'high' },
          { lat: selectedLocation.latitude - 0.015, lon: selectedLocation.longitude - 0.005, severity: 'medium' }
        ]
      : [
          { lat: 28.7041, lon: 77.1025, severity: 'high' }, // Delhi
          { lat: 19.0760, lon: 72.8777, severity: 'high' }, // Mumbai
          { lat: 22.5726, lon: 88.3639, severity: 'medium' } // Kolkata
        ];
    setIndustrialSites(sites);
  }, [selectedLocation]);

  useEffect(() => {
    if (!viewer || industrialSites.length === 0) return;

    const particleSystems = [];

    // --- SMOKE PLUME PARTICLE SYSTEMS ---
    industrialSites.forEach(site => {
      const isHigh = site.severity === 'high';
      
      const smokeSystem = viewer.scene.primitives.add(
        new Cesium.ParticleSystem({
          image: 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/smoke.png',
          startColor: new Cesium.Color(0.2, 0.2, 0.2, 0.8), // Dark smoke
          endColor: new Cesium.Color(0.8, 0.8, 0.8, 0.0), // Fades to transparent grey
          startScale: isHigh ? 3.0 : 1.5,
          endScale: isHigh ? 15.0 : 8.0,
          minimumParticleLife: 3.0,
          maximumParticleLife: 8.0,
          minimumSpeed: 5.0,
          maximumSpeed: 10.0,
          imageSize: new Cesium.Cartesian2(25, 25),
          emissionRate: isHigh ? 80 : 30,
          lifetime: 16.0,
          loop: true,
          emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(15.0)),
          modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(site.lon, site.lat, 50.0) // Emission from smokestack height
          ),
          updateCallback: (p, dt) => {
            // Wind blows smoke slightly east and upward
            p.velocity = Cesium.Cartesian3.add(
              p.velocity, 
              new Cesium.Cartesian3(2.0 * dt, 0.5 * dt, 3.0 * dt), 
              new Cesium.Cartesian3()
            );
          }
        })
      );
      
      particleSystems.push(smokeSystem);
    });

    return () => {
      particleSystems.forEach(ps => viewer.scene.primitives.remove(ps));
    };
  }, [viewer, industrialSites]);

  return null;
}
