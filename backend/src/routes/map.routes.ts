import { Router } from 'express';
import { MapController } from '../controllers/map.controller.js';

const router = Router();

// Endpoint: GET /api/environment?lat=...&lng=...&radius=...
router.get('/environment', MapController.getEnvironmentAnalysis);

// Endpoint: GET /api/weather?lat=...&lng=...
router.get('/weather', MapController.getWeatherData);

// Endpoint: GET /api/satellite?lat=...&lng=...
router.get('/satellite', MapController.getSatelliteData);

// Endpoint: GET /api/reverse-geocode?lat=...&lng=...
router.get('/reverse-geocode', MapController.reverseGeocode);

export default router;
