import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertOctagon, TriangleAlert, Info } from 'lucide-react';
import { AQIDataProvider } from '../../services/AQIDataProvider';
import { WeatherProvider } from '../../services/WeatherProvider';

export default function RiskEngine({ selectedLocation }) {
  const [riskScore, setRiskScore] = useState(50);
  const [aqiValue, setAqiValue] = useState('—');
  const [temp, setTemp] = useState('—');
  const [pressure, setPressure] = useState('—');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedLocation) return;

    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [stations, weather] = await Promise.all([
          AQIDataProvider.fetchNearby(selectedLocation.latitude, selectedLocation.longitude),
          WeatherProvider.fetchAt(selectedLocation.latitude, selectedLocation.longitude),
        ]);

        if (cancelled) return;

        const avgAqi = stations.length
          ? Math.round(stations.reduce((s, st) => s + st.aqi, 0) / stations.length)
          : 80;

        // Environmental Risk Score (0-100)
        const aqiScore = Math.min((avgAqi / 500) * 60, 60);        // max 60pts from AQI
        const tempScore = weather.temperature > 40 ? 10 : weather.temperature > 35 ? 5 : 0;
        const humidScore = weather.humidity > 90 ? 5 : 0;
        const pressureScore = weather.pressure < 1000 ? 5 : 0;
        const rainScore = weather.rainfall > 5 ? 5 : 0;
        const cloudScore = weather.cloudCover > 80 ? 5 : 0;
        const computed = Math.min(100, Math.round(aqiScore + tempScore + humidScore + pressureScore + rainScore + cloudScore));

        setRiskScore(computed);
        setAqiValue(avgAqi);
        setTemp(`${weather.temperature}°C`);
        setPressure(`${weather.pressure} hPa`);
      } catch (e) {
        // Keep previous state on error
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedLocation]);

  // Simulate minor fluctuations when no location
  useEffect(() => {
    if (selectedLocation) return;
    const interval = setInterval(() => {
      setRiskScore(prev => Math.max(10, Math.min(100, prev + Math.floor(Math.random() * 5) - 2)));
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const getRiskDetails = (score) => {
    if (score > 80) return { level: 'Hazardous', color: 'text-red-500', bg: 'bg-red-500', icon: AlertOctagon, border: 'border-red-500/30' };
    if (score > 60) return { level: 'Poor', color: 'text-orange-500', bg: 'bg-orange-500', icon: TriangleAlert, border: 'border-orange-500/30' };
    if (score > 35) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400', icon: Info, border: 'border-yellow-400/30' };
    return { level: 'Safe', color: 'text-emerald-400', bg: 'bg-emerald-400', icon: ShieldAlert, border: 'border-emerald-400/30' };
  };

  const details = getRiskDetails(riskScore);
  const Icon = details.icon;

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
      className="absolute bottom-6 right-6 z-10 w-72 pointer-events-none"
    >
      <div className={`bg-slate-900/85 backdrop-blur-xl border ${details.border} p-5 rounded-2xl shadow-2xl space-y-4`}>
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Environmental Score</h4>
            <span className="text-sm font-bold text-white tracking-wide">
              {isLoading ? 'Updating...' : 'Live Risk Engine'}
            </span>
          </div>
          <Icon className={`w-8 h-8 ${details.color} animate-pulse`} />
        </div>

        <div className="flex items-end justify-between">
          <span className={`text-4xl font-black ${details.color}`}>{riskScore}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">{details.level} Risk</span>
        </div>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${details.bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">AQI</span>
            <span className="text-xs text-white font-mono">{aqiValue}</span>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Temp</span>
            <span className="text-xs text-white font-mono">{temp}</span>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Pressure</span>
            <span className="text-xs text-white font-mono">{pressure}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
