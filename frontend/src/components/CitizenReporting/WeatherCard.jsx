import React, { useState, useEffect } from 'react';
import { Loader2, Thermometer, Droplets, Wind, Eye, MapPin } from 'lucide-react';
import { WeatherService } from '../../services/weather.service';

export default function WeatherCard({ coords }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coords?.lat) return;
    
    let isMounted = true;
    setLoading(true);
    
    WeatherService.getCurrentWeather(coords.lat, coords.lng)
      .then(res => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [coords]);

  if (!coords?.lat) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
        <MapPin className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Location Required</h3>
        <p className="text-sm text-slate-500">Please set a location in Step 2 to fetch weather conditions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 5: Weather Analysis</h2>
        <p className="text-sm text-slate-500">
          Current meteorological conditions using Open-Meteo API. Weather impacts pollution dispersion.
        </p>
      </div>

      <div className="bg-[#f1f5f9] p-6 rounded-3xl border border-slate-200 shadow-inner">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold text-slate-600">Syncing with Open-Meteo Servers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                  <Thermometer className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Temperature</span>
              </div>
              <span className="text-3xl font-black text-slate-900">{data?.temperature}°C</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Humidity</span>
              </div>
              <span className="text-3xl font-black text-slate-900">{data?.humidity}%</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 text-teal-500 rounded-lg">
                  <Wind className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wind Speed</span>
              </div>
              <span className="text-3xl font-black text-slate-900">{data?.windSpeed} <span className="text-sm text-slate-400 font-bold">km/h</span></span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility</span>
              </div>
              <span className="text-3xl font-black text-slate-900">{(data?.visibility / 1000).toFixed(1)} <span className="text-sm text-slate-400 font-bold">km</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
