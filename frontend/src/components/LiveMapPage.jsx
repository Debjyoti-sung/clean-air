import React, { useState } from 'react';
import {
  Map,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Loader2,
  Navigation,
  MapPin
} from 'lucide-react';
import { getDisplayNameFromCoords } from './LocationModal';
import CesiumViewerWrapper from './liveMap3D/CesiumViewer';

export default function LiveMapPage({ language, selectedLocation, onOpenLocationModal, onBack, onLocationChange }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');

  // Detect live location using browser Geolocation API
  const handleDetectLiveLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (onLocationChange) {
          onLocationChange({
            latitude,
            longitude,
            displayName: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
          });
        } else {
          // Fallback: open the existing location modal
          onOpenLocationModal?.();
        }
        setIsDetecting(false);
      },
      (err) => {
        setGeoError('Location access denied. Please enable location permissions or enter manually.');
        setIsDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  // Handle manual coordinate submission
  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setGeoError('Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180.');
      return;
    }
    setGeoError(null);
    if (onLocationChange) {
      onLocationChange({
        latitude: lat,
        longitude: lon,
        displayName: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`,
      });
    }
    setShowManualEntry(false);
    setManualLat('');
    setManualLon('');
  };

  return (
    <section className="w-full py-12 bg-[#F8FAFC] px-4 md:px-8 min-h-[70vh]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-3 text-left">
            <button
              onClick={onBack}
              className="p-2 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Map className="w-7 h-7 text-blue-600" />
                <span>{language === 'EN' ? 'Live Environmental Digital Twin' : 'लाइव पर्यावरण डिजिटल ट्विन'}</span>
              </h2>
              <p className="text-[14.5px] text-slate-500 font-medium">
                {language === 'EN' ? 'Real-time 3D environmental intelligence — AQI, weather, industrial emissions.' : 'रियल-टाइम 3D पर्यावरण इंटेलिजेंस'}
              </p>
            </div>
          </div>

          {selectedLocation && (
            <div className="flex items-center space-x-3 self-start md:self-center">
              <button
                onClick={onOpenLocationModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-full text-[13.5px] font-bold text-slate-700 shadow-sm hover:shadow transition cursor-pointer"
              >
                <span>📍</span>
                <span>{selectedLocation.displayName || getDisplayNameFromCoords(selectedLocation.latitude, selectedLocation.longitude)}</span>
                <span className="text-slate-400 text-xs ml-1">✏️</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3D Globe */}
          <div className="lg:col-span-2 w-full h-full min-h-[500px] md:min-h-[700px] relative rounded-3xl overflow-hidden shadow-2xl bg-black">
            <CesiumViewerWrapper selectedLocation={selectedLocation} />
            {!selectedLocation && (
              <div className="absolute top-6 right-6 z-20 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-xl flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></span>
                  <span className="text-white font-bold tracking-widest text-[11px] uppercase">Global View</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 text-left flex flex-col">
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-[18px] font-bold text-slate-800 flex items-center space-x-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  <span>Mission Control Target</span>
                </h3>
                <p className="text-[13px] text-slate-500 font-medium">Configure your location to load live AQI, weather, and industrial data.</p>
              </div>
              
              <div className="space-y-3 pt-2">
                {/* Detect Live Location */}
                <button
                  onClick={handleDetectLiveLocation}
                  disabled={isDetecting}
                  className="w-full text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-5 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>Detect Live Location</span>
                    </>
                  )}
                </button>
                
                {/* Enter Manually */}
                <button
                  onClick={() => { setShowManualEntry(v => !v); setGeoError(null); }}
                  className="w-full text-[14px] font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-5 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Enter Coordinates Manually</span>
                </button>

                {/* Manual coordinate fields */}
                {showManualEntry && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Latitude</label>
                      <input
                        type="number"
                        value={manualLat}
                        onChange={e => setManualLat(e.target.value)}
                        placeholder="e.g. 28.6139"
                        className="w-full text-sm font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Longitude</label>
                      <input
                        type="number"
                        value={manualLon}
                        onChange={e => setManualLon(e.target.value)}
                        placeholder="e.g. 77.2090"
                        className="w-full text-sm font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleManualSubmit}
                      className="w-full text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg transition"
                    >
                      Launch 3D Simulation
                    </button>
                  </div>
                )}

                {/* Error message */}
                {geoError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-[12px] text-red-700 font-medium">
                    {geoError}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="pt-6 border-t border-slate-200 flex-1 flex flex-col justify-start">
              {selectedLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Status</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Coordinates</span>
                    <span className="block text-[13px] font-mono text-slate-700">
                      {Number(selectedLocation.latitude).toFixed(4)}°N
                    </span>
                    <span className="block text-[13px] font-mono text-slate-700">
                      {Number(selectedLocation.longitude).toFixed(4)}°E
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[12px] text-emerald-700 font-medium">
                    ✅ Environmental layers loading. Toggle layers in the Simulation panel on the map.
                  </div>
                  <button
                    onClick={handleDetectLiveLocation}
                    disabled={isDetecting}
                    className="w-full text-[12px] font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    {isDetecting ? 'Detecting...' : '🔄 Update to Current Location'}
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-slate-400 opacity-60">
                  <Lock className="w-8 h-8" />
                  <p className="text-sm font-medium">Set location to unlock environmental data</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
