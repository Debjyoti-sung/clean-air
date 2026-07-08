import { Request, Response, NextFunction } from 'express';
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
  getEnvironmentAnalysis: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng, radius } = req.query;

      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and Longitude are required query parameters.' });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const searchRadius = radius ? parseInt(radius as string, 10) : 2000;

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
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get weather data from backend
   */
  getWeatherData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and Longitude are required query parameters.' });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);

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
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Satellite Data from Earth Engine
   */
  getSatelliteData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng, buffer } = req.query;

      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and Longitude are required query parameters.' });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const bufferRange = buffer ? parseInt(buffer as string) : 5000;

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
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reverse Geocode coordinates to address
   */
  reverseGeocode: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and Longitude are required query parameters.' });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: 'Latitude and Longitude must be valid numbers.' });
        return;
      }

      // Check Cache
      const cacheKey = `geocode_${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
      const cachedData = apiCache.get(cacheKey);

      if (cachedData) {
        res.status(200).json(cachedData);
        return;
      }

      const { TomTomService } = await import('../services/tomtom.service.js');
      const responseData = await TomTomService.reverseGeocode(latitude, longitude);

      // Save to Cache
      apiCache.set(cacheKey, responseData);

      res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  }
};
