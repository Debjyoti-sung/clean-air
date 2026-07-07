import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';

// Load service account
const keyFile = path.resolve('../api_json.json');
const privateKey = JSON.parse(fs.readFileSync(keyFile, 'utf8'));

console.log('Authenticating...');

ee.data.authenticateViaPrivateKey(privateKey, () => {
  console.log('Authentication successful. Initializing...');
  ee.initialize(null, null, () => {
    console.log('Earth Engine initialized successfully!');
    
    // Test fetching a live value for a specific coordinate (e.g. elevation)
    const lat = 28.6139;
    const lng = 77.2090;
    
    const point = ee.Geometry.Point([lng, lat]);
    const elevation = ee.Image('USGS/SRTMGL1_003').reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: point,
      scale: 30
    });
    
    elevation.evaluate((result, error) => {
      if (error) {
        console.error('Error evaluating:', error);
      } else {
        console.log('Elevation:', result);
      }
      process.exit(0);
    });
    
  }, (e) => {
    console.error('Initialization error:', e);
    process.exit(1);
  });
}, (e) => {
  console.error('Authentication error:', e);
  process.exit(1);
});
