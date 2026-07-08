import { AggregatorService } from '../services/aggregator.service.js';
import { WeatherService } from '../services/weather.service.js';
import { EarthEngineService } from '../services/earthEngine.service.js';
import { logger } from '../utils/logger.js';
import NodeCache from 'node-cache';
// Cache results for 5 minutes (300 seconds)
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
export const MapController = {
    /**
     * Get unified environmental analysis
     */
    getEnvironmentAnalysis: async (req, res, next) => {
        try {
            const { lat, lng, radius } = req.query;
            if (!lat || !lng) {
                res.status(400).json({ error: 'Latitude and Longitude are required query parameters.' });
                return;
            }
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const searchRadius = radius ? parseInt(radius, 10) : 2000;
            if (isNaN(latitude) || isNaN(longitude)) {
                res.status(400).json({ error: 'Latitude and Longitude must be valid numbers.' });
                return;
            }
            // Check Cache
            const cacheKey = `${latitude.toFixed(4)}_${longitude.toFixed(4)}_${searchRadius}`;
            const cachedData = apiCache.get(cacheKey);
            if (cachedData) {
                logger.info(`Serving cached environmental payload for key: ${cacheKey}`);
                res.status(200).json(cachedData);
                return;
            }
            const responseData = await AggregatorService.getUnifiedEnvironmentData(latitude, longitude, searchRadius);
            // Save to Cache
            apiCache.set(cacheKey, responseData);
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Get weather data from backend
     */
    getWeatherData: async (req, res, next) => {
        try {
            const { lat, lng } = req.query;
            if (!lat || !lng) {
                res.status(400).json({ error: 'Latitude and Longitude are required query parameters.' });
                return;
            }
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            if (isNaN(latitude) || isNaN(longitude)) {
                res.status(400).json({ error: 'Latitude and Longitude must be valid numbers.' });
                return;
            }
            // Check Cache
            const cacheKey = `weather_${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
            const cachedData = apiCache.get(cacheKey);
            if (cachedData) {
                logger.info(`Serving cached weather payload for key: ${cacheKey}`);
                res.status(200).json(cachedData);
                return;
            }
            const responseData = await WeatherService.getCurrentWeather(latitude, longitude);
            // Save to Cache
            apiCache.set(cacheKey, responseData);
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Get Satellite Data from Earth Engine
     */
    getSatelliteData: async (req, res, next) => {
        try {
            const { lat, lng, buffer } = req.query;
            if (!lat || !lng) {
                res.status(400).json({ error: 'Latitude and Longitude are required query parameters.' });
                return;
            }
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const bufferRange = buffer ? parseInt(buffer) : 5000;
            if (isNaN(latitude) || isNaN(longitude)) {
                res.status(400).json({ error: 'Latitude and Longitude must be valid numbers.' });
                return;
            }
            if (buffer && isNaN(bufferRange)) {
                res.status(400).json({ error: 'Buffer range must be a valid number.' });
                return;
            }
            // Check Cache
            const cacheKey = `satellite_${latitude.toFixed(4)}_${longitude.toFixed(4)}_${bufferRange}`;
            const cachedData = apiCache.get(cacheKey);
            if (cachedData) {
                logger.info(`Serving cached satellite payload for key: ${cacheKey}`);
                res.status(200).json(cachedData);
                return;
            }
            const responseData = await EarthEngineService.getSatelliteData(latitude, longitude, bufferRange);
            // Save to Cache
            apiCache.set(cacheKey, responseData);
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
};
