import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';
const keyPath = path.resolve('../api_json.json');
console.log('Loading key from:', keyPath);
if (!fs.existsSync(keyPath)) {
    console.error('Key file not found!');
    process.exit(1);
}
const privateKey = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
console.log('Authenticating...');
ee.data.authenticateViaPrivateKey(privateKey, () => {
    console.log('Initializing...');
    ee.initialize(null, null, () => {
        console.log('Google Earth Engine initialized successfully!');
        // Run a test query
        const point = ee.Geometry.Point([77.2090, 28.6139]); // Delhi
        const elevation = ee.Image('USGS/SRTMGL1_003').reduceRegion({
            reducer: ee.Reducer.mean(),
            geometry: point,
            scale: 30
        });
        console.log('Evaluating test query...');
        ee.Dictionary(elevation).evaluate((res, err) => {
            if (err) {
                console.error('Query failed:', err);
                process.exit(1);
            }
            else {
                console.log('Query success! Result:', res);
                process.exit(0);
            }
        });
    }, (e) => {
        console.error('EE Initialization error:', e);
        process.exit(1);
    }, null, privateKey.project_id);
}, (e) => {
    console.error('EE Authentication error:', e);
    process.exit(1);
});
