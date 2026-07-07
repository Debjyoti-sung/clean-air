import React, { useState, useEffect } from 'react';
import { Loader2, Wind, MapPin, Activity } from 'lucide-react';
import { AirQualityService } from '../../services/airquality.service';

export default function AQICard({ coords }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coords?.lat) return;
    
    let isMounted = true;
    setLoading(true);
    
    AirQualityService.getAirQuality(coords.lat, coords.lng)
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
        <p className="text-sm text-slate-500">Please set a location in Step 2 to analyze air quality.</p>
      </div>
    );
  }

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
    return { label: 'Hazardous', color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-300' };
  };

  const status = data ? getAQIStatus(data.aqi) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 4: Air Quality Analysis</h2>
        <p className="text-sm text-slate-500">
          Querying Open-Meteo for real-time AQI and specific pollutant concentrations.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-sm font-bold text-slate-600">Fetching live AQI sensors...</p>
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* AQI Master Badge */}
              <div className={`shrink-0 w-48 h-48 rounded-full border-8 ${status.border} ${status.bg} flex flex-col items-center justify-center text-center shadow-inner`}>
                <Wind className={`w-8 h-8 mb-1 ${status.color}`} />
                <span className={`text-5xl font-black ${status.color}`}>{data?.aqi || '--'}</span>
                <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${status.color}`}>US AQI</span>
              </div>
              
              <div className="space-y-3 flex-1 text-center md:text-left">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${status.bg} ${status.color} ${status.border}`}>
                  {status.label}
                </span>
                <h3 className="text-xl font-bold text-slate-800">Current Air Quality Index</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  The Air Quality Index indicates the level of pollution in the area. 
                  Higher values reflect higher health risks. This data is provided in real-time by Open-Meteo Air Quality APIs.
                </p>
              </div>
            </div>

            {/* Pollutant Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
              {[
                { label: 'PM2.5', val: data?.pm25, unit: 'µg/m³' },
                { label: 'PM10', val: data?.pm10, unit: 'µg/m³' },
                { label: 'NO₂', val: data?.no2, unit: 'µg/m³' },
                { label: 'SO₂', val: data?.so2, unit: 'µg/m³' },
                { label: 'O₃', val: data?.o3, unit: 'µg/m³' },
                { label: 'CO', val: data?.co, unit: 'µg/m³' },
              ].map((p) => (
                <div key={p.label} className="bg-[#f1f5f9] p-3 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{p.label}</span>
                  <div className="mt-2">
                    <span className="text-lg font-black text-slate-900">{p.val !== undefined ? p.val : '--'}</span>
                    <span className="text-[9px] text-slate-400 ml-1">{p.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
