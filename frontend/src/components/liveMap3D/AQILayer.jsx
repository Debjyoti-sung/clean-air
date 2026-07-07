import React, { useEffect, useState } from 'react';
import { useCesium } from 'resium';
import * as Cesium from 'cesium';
import * as turf from '@turf/turf';

export default function AQILayer({ selectedLocation }) {
  const { viewer } = useCesium();
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Generate a mock grid of AQI areas around the location using Turf.js
    const lon = selectedLocation ? selectedLocation.longitude : 77.2090; // Default Delhi
    const lat = selectedLocation ? selectedLocation.latitude : 28.6139;
    
    // Create a 1 degree bounding box
    const bbox = [lon - 0.5, lat - 0.5, lon + 0.5, lat + 0.5];
    const cellSide = 2.5; // kilometers per hex
    const options = {units: 'kilometers'};
    
    // Generate hexagonal grid for organic heatmap shape
    const grid = turf.hexGrid(bbox, cellSide, options);
    
    // Assign mock AQI values to simulate interpolation
    turf.featureEach(grid, function (currentFeature) {
      // Simulate AQI worse closer to center
      const centerDist = turf.distance(turf.center(currentFeature), [lon, lat]);
      const baseAqi = Math.max(50, 450 - (centerDist * 15)); // High center, falls off radially
      const aqi = baseAqi + (Math.random() * 40 - 20); // Add noise
      
      currentFeature.properties.aqi = aqi;
      
      // Standard AQI color gradient mapping
      let color = '#00e400'; // Good
      if (aqi > 50) color = '#ffff00'; // Moderate
      if (aqi > 100) color = '#ff7e00'; // Unhealthy SG
      if (aqi > 150) color = '#ff0000'; // Unhealthy
      if (aqi > 200) color = '#8f3f97'; // Very Unhealthy
      if (aqi > 300) color = '#7e0023'; // Hazardous
      
      currentFeature.properties.color = color;
    });

    setGeoJsonData(grid);
  }, [selectedLocation]);

  useEffect(() => {
    if (!viewer || !geoJsonData) return;

    let dataSource;
    
    // Load the Turf GeoJSON into Cesium engine
    Cesium.GeoJsonDataSource.load(geoJsonData, {
      stroke: Cesium.Color.TRANSPARENT,
      fill: Cesium.Color.WHITE.withAlpha(0.0), // Replaced below
      strokeWidth: 0,
    }).then(ds => {
      dataSource = ds;
      viewer.dataSources.add(ds);

      // Procedurally style the geometry (Volumetric PM2.5 Rendering)
      const entities = ds.entities.values;
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const colorHex = entity.properties.color.getValue();
        const aqi = entity.properties.aqi.getValue();
        
        // Semi-transparent colored polygons overlaying the terrain
        entity.polygon.material = Cesium.Color.fromCssColorString(colorHex).withAlpha(0.3);
        
        // Extrude height based on AQI to create a 3D Volumetric PM2.5 visual
        entity.polygon.extrudedHeight = aqi * 12.0; 
      }
    });

    return () => {
      if (dataSource) {
        viewer.dataSources.remove(dataSource);
      }
    };
  }, [viewer, geoJsonData]);

  return null;
}
