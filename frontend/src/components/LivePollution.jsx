import React, { useState, useEffect } from 'react';
import {
  Wind,
  Thermometer,
  Droplets,
  Flame,
  CheckCircle2,
  Activity,
  Clock,
  Lock,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { getDisplayNameFromCoords } from './LocationModal';

// Simulated location-specific database
export const locationDatabase = {
  // Bidhannagar (West Bengal)
  '22.5726,88.3639': {
    aqi: 156,
    temp: 32,
    humidity: 65,
    windSpeed: 14,
    windDir: 'Dir: East-Southeast',
    activeHotspots: 24,
    resolvedToday: 18,
    slaTarget: '85.0%',
    slaCurrent: '78.4%',
    trendData: [
      { label: '08:00 AM', aqi: 142, temp: '30°C', wind: '12 km/h' },
      { label: '11:00 AM', aqi: 148, temp: '33°C', wind: '15 km/h' },
      { label: '02:00 PM', aqi: 156, temp: '34°C', wind: '18 km/h' },
      { label: '05:00 PM', aqi: 168, temp: '32°C', wind: '14 km/h' },
      { label: '08:00 PM', aqi: 185, temp: '29°C', wind: '10 km/h' },
      { label: '11:00 PM', aqi: 195, temp: '27°C', wind: '9 km/h' },
      { label: '02:00 AM', aqi: 180, temp: '25°C', wind: '8 km/h' },
      { label: '05:00 AM', aqi: 152, temp: '24°C', wind: '11 km/h' },
    ],
    predictions: [
      { day: 'Tomorrow', aqi: 142, category: 'Moderate', desc: 'Slight dispersion due to breeze.' },
      { day: 'Tuesday', aqi: 130, category: 'Moderate', desc: 'Showers expected to clear air.' },
      { day: 'Wednesday', aqi: 165, category: 'Poor', desc: 'Calm winds may pool emissions.' }
    ],
    nearbyHotspots: [
      { id: 'HOT-101', type: 'Construction Dust', distance: '0.8 km', status: 'Enforcement Sent', severity: 'High', color: 'text-orange-600 bg-orange-50 border-orange-200' },
      { id: 'HOT-102', type: 'Garbage Burning', distance: '1.4 km', status: 'Wet Suppression Active', severity: 'Critical', color: 'text-red-600 bg-red-50 border-red-200 text-[#DC2626]' },
      { id: 'HOT-103', type: 'Industrial Plume', distance: '3.2 km', status: 'Resolved', severity: 'Moderate', color: 'text-green-600 bg-green-50 border-green-200' }
    ]
  },
  // Pune (Maharashtra)
  '18.5596,73.8062': {
    aqi: 72,
    temp: 28,
    humidity: 55,
    windSpeed: 16,
    windDir: 'Dir: West-Northwest',
    activeHotspots: 6,
    resolvedToday: 14,
    slaTarget: '90.0%',
    slaCurrent: '92.5%',
    trendData: [
      { label: '08:00 AM', aqi: 52, temp: '25°C', wind: '12 km/h' },
      { label: '11:00 AM', aqi: 60, temp: '28°C', wind: '14 km/h' },
      { label: '02:00 PM', aqi: 72, temp: '30°C', wind: '16 km/h' },
      { label: '05:00 PM', aqi: 68, temp: '29°C', wind: '15 km/h' },
      { label: '08:00 PM', aqi: 75, temp: '26°C', wind: '11 km/h' },
      { label: '11:00 PM', aqi: 80, temp: '24°C', wind: '9 km/h' },
      { label: '02:00 AM', aqi: 65, temp: '23°C', wind: '8 km/h' },
      { label: '05:00 AM', aqi: 55, temp: '22°C', wind: '10 km/h' },
    ],
    predictions: [
      { day: 'Tomorrow', aqi: 68, category: 'Moderate', desc: 'Stable atmospheric conditions.' },
      { day: 'Tuesday', aqi: 50, category: 'Good', desc: 'Favorable winds dispersing particulates.' },
      { day: 'Wednesday', aqi: 78, category: 'Moderate', desc: 'Mild dust accumulation expected.' }
    ],
    nearbyHotspots: [
      { id: 'HOT-201', type: 'Construction Dust', distance: '1.8 km', status: 'Water Sprinkled', severity: 'Moderate', color: 'text-green-600 bg-green-50 border-green-200' },
      { id: 'HOT-202', type: 'Garbage Burning', distance: '4.1 km', status: 'Investigating', severity: 'High', color: 'text-orange-600 bg-orange-50 border-orange-200' }
    ]
  },
  // New Delhi (Delhi)
  '28.6304,77.2177': {
    aqi: 245,
    temp: 36,
    humidity: 45,
    windSpeed: 8,
    windDir: 'Dir: Calm / Variable',
    activeHotspots: 48,
    resolvedToday: 32,
    slaTarget: '80.0%',
    slaCurrent: '74.2%',
    trendData: [
      { label: '08:00 AM', aqi: 210, temp: '32°C', wind: '6 km/h' },
      { label: '11:00 AM', aqi: 230, temp: '35°C', wind: '8 km/h' },
      { label: '02:00 PM', aqi: 245, temp: '37°C', wind: '8 km/h' },
      { label: '05:00 PM', aqi: 260, temp: '36°C', wind: '7 km/h' },
      { label: '08:00 PM', aqi: 285, temp: '33°C', wind: '5 km/h' },
      { label: '11:00 PM', aqi: 298, temp: '30°C', wind: '4 km/h' },
      { label: '02:00 AM', aqi: 280, temp: '28°C', wind: '5 km/h' },
      { label: '05:00 AM', aqi: 235, temp: '27°C', wind: '6 km/h' },
    ],
    predictions: [
      { day: 'Tomorrow', aqi: 260, category: 'Very Poor', desc: 'No wind dispersion. Particulates stagnant.' },
      { day: 'Tuesday', aqi: 280, category: 'Very Poor', desc: 'Severe accumulation, heat dome effect.' },
      { day: 'Wednesday', aqi: 220, category: 'Very Poor', desc: 'Slight breeze may offer minor relief.' }
    ],
    nearbyHotspots: [
      { id: 'HOT-301', type: 'Garbage Burning', distance: '0.5 km', status: 'Enforcement Sent', severity: 'Critical', color: 'text-red-600 bg-red-50 border-red-200 text-[#DC2626]' },
      { id: 'HOT-302', type: 'Construction Dust', distance: '1.1 km', status: 'Fine Issued', severity: 'High', color: 'text-orange-600 bg-orange-50 border-orange-200' },
      { id: 'HOT-303', type: 'Industrial Plume', distance: '2.5 km', status: 'Auditing Stack', severity: 'Severe', color: 'text-purple-600 bg-purple-50 border-purple-250 text-[#7E22CE]' }
    ]
  },
  // Bangalore Urban (Karnataka)
  '12.9784,77.6408': {
    aqi: 48,
    temp: 26,
    humidity: 70,
    windSpeed: 18,
    windDir: 'Dir: West',
    activeHotspots: 3,
    resolvedToday: 9,
    slaTarget: '95.0%',
    slaCurrent: '96.8%',
    trendData: [
      { label: '08:00 AM', aqi: 35, temp: '22°C', wind: '15 km/h' },
      { label: '11:00 AM', aqi: 42, temp: '25°C', wind: '18 km/h' },
      { label: '02:00 PM', aqi: 48, temp: '26°C', wind: '20 km/h' },
      { label: '05:00 PM', aqi: 45, temp: '25°C', wind: '18 km/h' },
      { label: '08:00 PM', aqi: 50, temp: '23°C', wind: '14 km/h' },
      { label: '11:00 PM', aqi: 52, temp: '22°C', wind: '11 km/h' },
      { label: '02:00 AM', aqi: 45, temp: '21°C', wind: '10 km/h' },
      { label: '05:00 AM', aqi: 38, temp: '20°C', wind: '12 km/h' },
    ],
    predictions: [
      { day: 'Tomorrow', aqi: 45, category: 'Good', desc: 'Continued strong winds from coast.' },
      { day: 'Tuesday', aqi: 52, category: 'Moderate', desc: 'Mild traffic exhaust pooling in valleys.' },
      { day: 'Wednesday', aqi: 38, category: 'Good', desc: 'Excellent dispersion under rainfall.' }
    ],
    nearbyHotspots: [
      { id: 'HOT-401', type: 'Construction Dust', distance: '2.5 km', status: 'Water Sprinkled', severity: 'Moderate', color: 'text-green-600 bg-green-50 border-green-200' }
    ]
  }
};

export const getPollutionData = (location) => {
  if (!location) return null;
  const key = `${parseFloat(location.latitude).toFixed(4)},${parseFloat(location.longitude).toFixed(4)}`;
  if (locationDatabase[key]) {
    return locationDatabase[key];
  }

  // Deterministic fallback data generator based on coordinates
  const lat = parseFloat(location.latitude) || 28.6273;
  const lng = parseFloat(location.longitude) || 77.3725;
  const seed = Math.abs(Math.sin(lat) * Math.cos(lng));

  const aqi = Math.floor(seed * 220) + 45; // 45 - 265
  const temp = Math.floor(seed * 12) + 22; // 22 - 34
  const humidity = Math.floor(seed * 35) + 45; // 45 - 80
  const windSpeed = Math.floor(seed * 15) + 6; // 6 - 21
  const activeHotspots = Math.floor(seed * 22) + 3;
  const resolvedToday = Math.floor(seed * 18) + 2;

  const trendData = [
    { label: '08:00 AM', aqi: Math.max(10, aqi - 15), temp: `${temp - 2}°C`, wind: `${windSpeed - 1} km/h` },
    { label: '11:00 AM', aqi: Math.max(10, aqi - 8), temp: `${temp}°C`, wind: `${windSpeed} km/h` },
    { label: '02:00 PM', aqi: aqi, temp: `${temp + 1}°C`, wind: `${windSpeed + 2} km/h` },
    { label: '05:00 PM', aqi: Math.max(10, aqi + 10), temp: `${temp}°C`, wind: `${windSpeed} km/h` },
    { label: '08:00 PM', aqi: Math.max(10, aqi + 25), temp: `${temp - 3}°C`, wind: `${windSpeed - 2} km/h` },
    { label: '11:00 PM', aqi: Math.max(10, aqi + 35), temp: `${temp - 4}°C`, wind: `${windSpeed - 3} km/h` },
    { label: '02:00 AM', aqi: Math.max(10, aqi + 20), temp: `${temp - 6}°C`, wind: `${windSpeed - 4} km/h` },
    { label: '05:00 AM', aqi: Math.max(10, aqi - 5), temp: `${temp - 6}°C`, wind: `${windSpeed - 2} km/h` },
  ];

  const getCategory = (v) => {
    if (v <= 50) return 'Good';
    if (v <= 100) return 'Moderate';
    if (v <= 200) return 'Poor';
    if (v <= 300) return 'Very Poor';
    return 'Severe';
  };

  const predictions = [
    { day: 'Tomorrow', aqi: Math.max(10, aqi - 12), category: getCategory(Math.max(10, aqi - 12)), desc: 'Clearing expected due to wind patterns.' },
    { day: 'Tuesday', aqi: Math.max(10, aqi + 8), category: getCategory(Math.max(10, aqi + 8)), desc: 'Slight accumulation under calm atmospheric conditions.' },
    { day: 'Wednesday', aqi: Math.max(10, aqi - 5), category: getCategory(Math.max(10, aqi - 5)), desc: 'Favorable winds continuing to support dispersion.' }
  ];

  const nearbyHotspots = [
    { id: 'HOT-GPS-1', type: 'Construction Dust', distance: '1.2 km', status: 'Team Dispatched', severity: aqi > 150 ? 'Critical' : 'Moderate', color: aqi > 150 ? 'text-red-600 bg-red-50 border-red-200 text-[#DC2626]' : 'text-green-600 bg-green-50 border-green-200' },
    { id: 'HOT-GPS-2', type: 'Garbage Burning', distance: '2.5 km', status: 'Auditing Incident', severity: aqi > 100 ? 'High' : 'Moderate', color: aqi > 100 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-green-600 bg-green-50 border-green-200' }
  ];

  return {
    aqi,
    temp,
    humidity,
    windSpeed,
    windDir: 'Dir: Northwest',
    activeHotspots,
    resolvedToday,
    slaTarget: '85.0%',
    slaCurrent: '81.2%',
    trendData,
    predictions,
    nearbyHotspots
  };
};

export default function LivePollution({ language, selectedLocation, setSelectedLocation, isLocationLoading = false, onOpenLocationModal }) {
  const [timeframe, setTimeframe] = useState('7d');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const [displayedLocation, setDisplayedLocation] = useState(null);

  useEffect(() => {
    if (!selectedLocation) {
      setDisplayedLocation(null);
      return;
    }
    if (!isLocationLoading) {
      setDisplayedLocation(selectedLocation);
    }
  }, [selectedLocation, isLocationLoading]);

  // Base chart trend details template
  const chartData = {
    '7d': [
      { label: 'Monday', aqi: 135, temp: '31°C', wind: '14 km/h' },
      { label: 'Tuesday', aqi: 148, temp: '32°C', wind: '12 km/h' },
      { label: 'Wednesday', aqi: 172, temp: '33°C', wind: '11 km/h' },
      { label: 'Thursday', aqi: 185, temp: '34°C', wind: '15 km/h' },
      { label: 'Friday', aqi: 156, temp: '32°C', wind: '14 km/h' },
      { label: 'Saturday', aqi: 125, temp: '30°C', wind: '13 km/h' },
      { label: 'Sunday', aqi: 110, temp: '29°C', wind: '16 km/h' },
    ],
    '30d': [
      { label: 'Week 1', aqi: 188, temp: '34°C', wind: '12 km/h' },
      { label: 'Week 2', aqi: 165, temp: '33°C', wind: '13 km/h' },
      { label: 'Week 3', aqi: 152, temp: '31°C', wind: '15 km/h' },
      { label: 'Week 4', aqi: 138, temp: '30°C', wind: '14 km/h' },
    ]
  };

  const pollutionData = getPollutionData(displayedLocation || selectedLocation);
  const currentAqi = pollutionData ? pollutionData.aqi : 156;

  // Scale chart data based on dynamic AQI values
  const getScaledTrendData = (tf, baseAqi) => {
    const factor = baseAqi / 156;
    const baseTrend = chartData[tf] || chartData['7d'];
    return baseTrend.map(pt => ({
      ...pt,
      aqi: Math.max(10, Math.floor(pt.aqi * factor))
    }));
  };

  const activePoints = (displayedLocation || selectedLocation)
    ? getScaledTrendData(timeframe, currentAqi)
    : chartData[timeframe];

  const maxAqi = 350; // Max scale for SVG height calculations

  const getCoordinates = (points, width, height) => {
    const paddingX = 60;
    const paddingY = 30;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    return points.map((point, index) => {
      const x = paddingX + (index / (points.length - 1)) * chartWidth;
      const y = height - paddingY - (point.aqi / maxAqi) * chartHeight;
      return { x, y, ...point };
    });
  };

  const svgWidth = 800;
  const svgHeight = 240;
  const coordinates = getCoordinates(activePoints, svgWidth, svgHeight);

  let linePath = '';
  let areaPath = '';
  if (coordinates.length > 0) {
    linePath = `M ${coordinates[0].x} ${coordinates[0].y} ` +
      coordinates.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

    areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${svgHeight - 30} L ${coordinates[0].x} ${svgHeight - 30} Z`;
  }

  const getAqiCategory = (val) => {
    if (val <= 50) return { name: 'Good', bg: 'bg-[#22C55E]', text: 'text-white', hex: '#22C55E' };
    if (val <= 100) return { name: 'Moderate', bg: 'bg-[#EAB308]', text: 'text-slate-900', hex: '#EAB308' };
    if (val <= 200) return { name: 'Poor', bg: 'bg-[#F97316]', text: 'text-white', hex: '#F97316' };
    if (val <= 300) return { name: 'Very Poor', bg: 'bg-[#EF4444]', text: 'text-white', hex: '#EF4444' };
    return { name: 'Severe', bg: 'bg-[#7E22CE]', text: 'text-white', hex: '#7E22CE' };
  };

  const currentAqiMeta = getAqiCategory(currentAqi);

  return (
    <section id="map" className="w-full py-16 bg-white px-4 md:px-8 border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto space-y-8">

        {/* Title */}
        <div className="text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-[32px] md:text-[40px] font-black text-slate-800 tracking-tight">
                {language === 'EN' ? 'Live Pollution Status' : 'लाइव प्रदूषण स्थिति'}
              </h2>
              <button
                onClick={onOpenLocationModal}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] active:shadow-[inset_2px_2px_5px_#cbd5e1] rounded-full text-[14px] font-extrabold text-slate-700 transition-all duration-300 cursor-pointer"
              >
                <span>📍</span>
                <span>
                  {selectedLocation
                    ? (selectedLocation.displayName || getDisplayNameFromCoords(selectedLocation.latitude, selectedLocation.longitude))
                    : (language === 'EN' ? 'Set Location' : 'स्थान निर्धारित करें')}
                </span>
                <span className="text-slate-400 text-xs ml-1">✏️</span>
              </button>
            </div>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">
              {language === 'EN'
                ? 'Real-time telemetry gathered from municipal sensors and satellite scans.'
                : 'नगरपालिका सेंसर और उपग्रह स्कैन से एकत्र किया गया वास्तविक समय टेलीमेट्री डेटा।'}
            </p>
          </div>
        </div>

        {/* TELEMETRY & VISUALIZATION DASHBOARD PANEL */}
        {!selectedLocation ? (
          /* High-End Interactive Locked State */
          <div className="bg-[#f1f5f9] rounded-[2.5rem] shadow-[inset_6px_6px_12px_#cbd5e1] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 min-h-[400px] border border-white/40">
            
            {/* Column 1: High-Tech Telemetry Radar Simulator */}
            <div className="w-full md:w-1/2 flex items-center justify-center select-none">
              <div className="w-60 h-60 relative rounded-full overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
                {/* Radial scanning grid lines */}
                <div className="absolute w-48 h-48 rounded-full border border-dashed border-emerald-500/10"></div>
                <div className="absolute w-36 h-36 rounded-full border border-dashed border-emerald-500/15"></div>
                <div className="absolute w-24 h-24 rounded-full border border-dashed border-emerald-500/20"></div>
                <div className="absolute w-12 h-12 rounded-full border border-dashed border-emerald-500/25"></div>
                
                {/* Rotating vector scanner sweep */}
                <div 
                  className="absolute top-1/2 left-1/2 w-28 h-28 origin-top-left -translate-x-[0.5px] -translate-y-[0.5px] bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-tr-full animate-spin" 
                  style={{ animationDuration: '4s' }}
                ></div>
                
                {/* Axis crosshairs */}
                <div className="absolute w-full h-[1px] bg-emerald-500/10"></div>
                <div className="absolute h-full w-[1px] bg-emerald-500/10"></div>
                
                {/* Ping Target 1 (Delhi simulation) */}
                <div className="absolute top-16 left-20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="absolute left-3.5 -top-1.5 text-[9px] font-mono text-emerald-400/80 tracking-wider whitespace-nowrap">DEL_SENS_28</span>
                </div>
                
                {/* Ping Target 2 (Pune simulation) */}
                <div className="absolute bottom-20 right-16">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="absolute left-3.5 -top-1.5 text-[9px] font-mono text-amber-400/80 tracking-wider whitespace-nowrap">PN_MET_05</span>
                </div>
                
                {/* Ping Target 3 (Bangalore simulation) */}
                <div className="absolute bottom-12 left-12">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="absolute left-3.5 -top-1.5 text-[9px] font-mono text-blue-400/80 tracking-wider whitespace-nowrap">BLR_GIS_12</span>
                </div>
                
                {/* Radar label */}
                <div className="absolute bottom-4 text-[9px] font-mono text-slate-500 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800 tracking-widest uppercase">
                  Telemetry Standby
                </div>
              </div>
            </div>

            {/* Column 2: Details & Quick Select Controls */}
            <div className="w-full md:w-1/2 text-left flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 text-emerald-600 font-extrabold uppercase tracking-widest text-[11px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Telemetry Offline</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                  {language === 'EN' ? 'Awaiting Location Selection' : 'स्थान चयन की प्रतीक्षा है'}
                </h3>
                <p className="text-[14px] text-slate-500 font-bold leading-relaxed">
                  {language === 'EN' 
                    ? 'Hyperlocal air quality streaming, GIS gas dispersion vectors, and municipal SLA monitoring require a target region to parse and visualize sensor grids.'
                    : 'सेंसर ग्रिड को पार्स और विज़ुअलाइज़ करने के लिए हाइपरलोकल वायु गुणवत्ता स्ट्रीमिंग, जीआईएस गैस फैलाव वैक्टर और नगर निगम एसएलए निगरानी के लिए एक स्थान की आवश्यकता होती है।'}
                </p>
              </div>

              {/* Quick Select Demo Buttons */}
              <div className="space-y-3 pt-2">
                <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  {language === 'EN' ? 'Quick-Select Demo Region:' : 'त्वरित डेमो क्षेत्र चुनें:'}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setSelectedLocation({
                      displayName: "New Delhi, Delhi, India",
                      city: "Delhi",
                      state: "Delhi",
                      latitude: "28.6304",
                      longitude: "77.2177",
                      source: "demo"
                    })}
                    className="px-4 py-2 bg-white text-[13px] font-bold text-slate-700 rounded-xl shadow-sm border border-slate-200/60 hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer active:scale-95"
                  >
                    🇮🇳 New Delhi
                  </button>
                  <button
                    onClick={() => setSelectedLocation({
                      displayName: "Pune, Maharashtra, India",
                      city: "Pune",
                      state: "Maharashtra",
                      latitude: "18.5596",
                      longitude: "73.8062",
                      source: "demo"
                    })}
                    className="px-4 py-2 bg-white text-[13px] font-bold text-slate-700 rounded-xl shadow-sm border border-slate-200/60 hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer active:scale-95"
                  >
                    🇮🇳 Pune
                  </button>
                  <button
                    onClick={() => setSelectedLocation({
                      displayName: "Bangalore Urban, Karnataka, India",
                      city: "Bengaluru",
                      state: "Karnataka",
                      latitude: "12.9784",
                      longitude: "77.6408",
                      source: "demo"
                    })}
                    className="px-4 py-2 bg-white text-[13px] font-bold text-slate-700 rounded-xl shadow-sm border border-slate-200/60 hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer active:scale-95"
                  >
                    🇮🇳 Bengaluru
                  </button>
                  <button
                    onClick={() => setSelectedLocation({
                      displayName: "Bidhannagar, Kolkata, West Bengal, India",
                      city: "Kolkata",
                      state: "West Bengal",
                      latitude: "22.5726",
                      longitude: "88.3639",
                      source: "demo"
                    })}
                    className="px-4 py-2 bg-white text-[13px] font-bold text-slate-700 rounded-xl shadow-sm border border-slate-200/60 hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer active:scale-95"
                  >
                    🇮🇳 Kolkata
                  </button>
                </div>
              </div>

              {/* Custom Search Trigger */}
              <div className="pt-2">
                <button
                  onClick={onOpenLocationModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-[13px] font-black text-white bg-slate-800 hover:bg-slate-900 px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  <span>🔍</span>
                  <span>{language === 'EN' ? 'Search Custom Location' : 'कस्टम स्थान खोजें'}</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Active telemetry components */
          <div className="relative overflow-hidden bg-[#f1f5f9] rounded-[2.5rem] shadow-[12px_12px_24px_#cbd5e1] p-8 md:p-10 space-y-10 animate-fade-in-up">

            {/* Loading animation overlay */}
            {isLocationLoading && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 z-30 transition-all duration-300">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-sm font-semibold text-slate-650 tracking-wider">Syncing Telemetry...</span>
              </div>
            )}

            {/* Top Grid of 6 Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

              {/* Metric 1: Current AQI */}
              <div className="bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl p-5 flex flex-col justify-between text-left">
                <span className="text-[12px] text-slate-500 font-extrabold uppercase tracking-widest">Current AQI</span>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-slate-800">{pollutionData.aqi}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm ${currentAqiMeta.bg} ${currentAqiMeta.text}`}>
                    {currentAqiMeta.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Updated Just Now</span>
                </span>
              </div>

              {/* Metric 2: Temperature */}
              <div className="bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl p-5 flex flex-col justify-between text-left">
                <span className="text-[12px] text-slate-500 font-extrabold uppercase tracking-widest">Temperature</span>
                <div className="mt-3 flex items-center space-x-2">
                  <Thermometer className="w-6 h-6 text-amber-500" />
                  <span className="text-4xl font-black text-slate-800">{pollutionData.temp}°C</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-bold">RealFeel {pollutionData.temp + 3}°C</span>
              </div>

              {/* Metric 3: Humidity */}
              <div className="bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl p-5 flex flex-col justify-between text-left">
                <span className="text-[12px] text-slate-500 font-extrabold uppercase tracking-widest">Humidity</span>
                <div className="mt-3 flex items-center space-x-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <span className="text-4xl font-black text-slate-800">{pollutionData.humidity}%</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-bold">Dew Point {Math.round(pollutionData.humidity / 3)}°C</span>
              </div>

              {/* Metric 4: Wind Speed */}
              <div className="bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl p-5 flex flex-col justify-between text-left">
                <span className="text-[12px] text-slate-500 font-extrabold uppercase tracking-widest">Wind Speed</span>
                <div className="mt-3 flex items-center space-x-2">
                  <Wind className="w-6 h-6 text-[#15803D]" />
                  <span className="text-4xl font-black text-slate-800">
                    {pollutionData.windSpeed} <span className="text-[16px] font-bold text-slate-500">km/h</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-bold">{pollutionData.windDir}</span>
              </div>

              {/* Metric 5: Active Hotspots */}
              <div className="bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl p-5 flex flex-col justify-between text-left border border-red-100/50">
                <span className="text-[12px] text-red-600 font-extrabold uppercase tracking-widest flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>Active Hotspots</span>
                </span>
                <div className="mt-3">
                  <span className="text-4xl font-black text-slate-800">{pollutionData.activeHotspots}</span>
                </div>
                <span className="text-[11px] text-red-500 font-bold mt-2">Requires audit</span>
              </div>

              {/* Metric 6: Resolved Today */}
              <div className="bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl p-5 flex flex-col justify-between text-left border border-emerald-100/50">
                <span className="text-[12px] text-emerald-600 font-extrabold uppercase tracking-widest flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resolved Today</span>
                </span>
                <div className="mt-3">
                  <span className="text-4xl font-black text-slate-800">{pollutionData.resolvedToday}</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold mt-2">100% SLA Met</span>
              </div>

            </div>



          </div>
        )}

      </div>
    </section>
  );
}
