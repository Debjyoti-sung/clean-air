import React, { useState, useEffect } from 'react';
import { Loader2, Globe2, MapPin, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import { EarthEngineService } from '../../services/earthEngine.service';

export default function SatelliteCard({ coords }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buffer, setBuffer] = useState(5000); // Default to 5km buffer

  const bufferLevels = [1000, 2500, 5000, 10000];

  useEffect(() => {
    if (!coords?.lat) return;
    
    let isMounted = true;
    setLoading(true);
    
    EarthEngineService.getSatelliteData(coords.lat, coords.lng, buffer)
      .then(res => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [coords?.lat, coords?.lng, buffer]);

  const handleZoom = (zoomIn) => {
    const currentIndex = bufferLevels.indexOf(buffer);
    if (zoomIn && currentIndex > 0) {
      setBuffer(bufferLevels[currentIndex - 1]);
    } else if (!zoomIn && currentIndex < bufferLevels.length - 1) {
      setBuffer(bufferLevels[currentIndex + 1]);
    }
  };

  if (!coords?.lat) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
        <MapPin className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Location Required</h3>
        <p className="text-sm text-slate-500">Please set a location in Step 2 to query Earth Engine layers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 6: Satellite Analysis</h2>
        <p className="text-sm text-slate-500">
          Querying Google Earth Engine for environmental surface insights (NDVI, Burned Areas).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="text-sm font-bold text-slate-600">Processing Earth Engine Grids...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-slate-800">NDVI (Vegetation Index)</span>
                </div>
                <span className="text-2xl font-black text-slate-900">{data?.ndvi}</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-slate-800">Land Cover Class</span>
                </div>
                <span className="text-sm font-bold text-slate-700">{data?.landCover}</span>
              </div>
              
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${data?.fireHotspots > 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className="font-bold text-slate-800">FIRMS Active Hotspots</span>
                </div>
                <span className="text-xl font-black text-slate-900">{data?.fireHotspots}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-[#f1f5f9] border border-slate-200 rounded-3xl p-2 relative overflow-hidden flex items-center justify-center h-[350px] min-h-[300px]">
          <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply z-10 pointer-events-none"></div>
          
          {/* Main Satellite Image (Interactive Visual Zoom) */}
          <img 
            src={data?.thumbUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"} 
            alt="Satellite view" 
            className="w-full h-full object-cover rounded-2xl opacity-80 transition-all duration-500 ease-out hover:scale-155 hover:opacity-100 cursor-crosshair" 
          />

          {/* Centered Location Pin Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center">
            <div className="absolute w-8 h-8 bg-red-500/35 rounded-full animate-ping"></div>
            <div className="absolute w-4 h-4 bg-red-500/50 rounded-full animate-pulse"></div>
            <MapPin className="w-7 h-7 text-red-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] fill-red-600/20" />
          </div>

          {/* GEE Info Overlay */}
          <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
            <span className="text-[10px] font-mono text-emerald-400">GEE: SENTINEL-2 L2A</span>
          </div>

          {/* Current Zoom Distance Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
            <span className="text-[10px] font-mono text-emerald-400">
              GEE RANGE: {buffer >= 1000 ? `${(buffer / 1000).toFixed(1)} km` : `${buffer} m`}
            </span>
          </div>

          {/* Floating Zoom Controls Overlay */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
            <button 
              onClick={() => handleZoom(true)} 
              disabled={buffer === 1000 || loading}
              className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleZoom(false)} 
              disabled={buffer === 10000 || loading}
              className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
