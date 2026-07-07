import React, { useEffect } from 'react';
import { useCesium } from 'resium';
import * as Cesium from 'cesium';

export default function WeatherLayers({ selectedLocation }) {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;

    // Center coordinates for weather effects
    const lon = selectedLocation ? selectedLocation.longitude : 78.9629;
    const lat = selectedLocation ? selectedLocation.latitude : 20.5937;

    // --- RAIN PARTICLE SYSTEM ---
    const rainParticleSystem = viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        // A generic particle image
        image: 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/circular_particle.png',
        startColor: new Cesium.Color(0.7, 0.8, 0.9, 0.6),
        endColor: new Cesium.Color(0.7, 0.8, 0.9, 0.0),
        startScale: 1.0,
        endScale: 0.0,
        minimumParticleLife: 1.0,
        maximumParticleLife: 2.5,
        minimumSpeed: 20.0,
        maximumSpeed: 30.0,
        imageSize: new Cesium.Cartesian2(4.0, 40.0),
        emissionRate: 4000,
        lifetime: 16.0,
        loop: true,
        // Emitter covers a massive 50km radius area
        emitter: new Cesium.SphereEmitter(50000.0),
        // Emit from the clouds down
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(lon, lat, 3000.0) 
        ),
        updateCallback: (p, dt) => {
          // Gravity effect pulling rain down
          p.velocity.z -= 9.8 * dt;
        }
      })
    );

    // --- HUMIDITY / FOG SHADER (Post Processing) ---
    // Simulates atmospheric haziness based on live weather humidity
    const fogShader = `
      uniform sampler2D colorTexture;
      in vec2 v_textureCoordinates;
      out vec4 fragColor;
      void main(void) {
        vec4 color = texture(colorTexture, v_textureCoordinates);
        // Blend a subtle blueish-gray tint for volumetric haze
        fragColor = mix(color, vec4(0.7, 0.75, 0.8, 1.0), 0.12);
      }
    `;
    const fogStage = new Cesium.PostProcessStage({
      fragmentShader: fogShader
    });
    viewer.scene.postProcessStages.add(fogStage);

    return () => {
      viewer.scene.primitives.remove(rainParticleSystem);
      viewer.scene.postProcessStages.remove(fogStage);
    };
  }, [viewer, selectedLocation]);

  return null;
}
