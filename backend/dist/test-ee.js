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
    ee.initialize(null, null, async () => {
        console.log('Google Earth Engine initialized successfully!');
        try {
            // Run a test query
            const point = ee.Geometry.Point([77.2090, 28.6139]); // Delhi
            console.log('Fetching Sentinel-2 image...');
            const s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                .filterBounds(point)
                .filterDate(ee.Date(Date.now() - 30 * 24 * 60 * 60 * 1000), ee.Date(Date.now()))
                .sort('CLOUDY_PIXEL_PERCENTAGE')
                .first();
            const rgbImage = s2.visualize({ bands: ['B4', 'B3', 'B2'], min: 0, max: 3000 });
            const buffer = point.buffer(5000);
            console.log('Requesting thumbnail URL...');
            const thumbUrl = await new Promise((resolve, reject) => {
                rgbImage.getThumbURL({
                    dimensions: 800,
                    region: buffer,
                    format: 'jpg'
                }, (url, err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(url);
                });
            });
            console.log('Thumbnail URL successfully generated:', thumbUrl);
            process.exit(0);
        }
        catch (e) {
            console.error('Execution Error:', e);
            process.exit(1);
        }
    }, (e) => {
        console.error('EE Initialization error:', e);
        process.exit(1);
    });
}, (e) => {
    console.error('EE Authentication error:', e);
    process.exit(1);
});
