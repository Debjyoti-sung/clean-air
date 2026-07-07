import React, { useState, useEffect } from 'react';
import { Loader2, Factory, Stethoscope, GraduationCap, TreePine, MapPin } from 'lucide-react';
import { OverpassService } from '../../services/overpass.service';

export default function OverpassAnalysisCard({ coords }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coords?.lat) return;
    
    let isMounted = true;
    setLoading(true);
    
    OverpassService.getNearbyAnalysis(coords.lat, coords.lng)
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
        <p className="text-sm text-slate-500">Please set a location in Step 2 to analyze nearby environment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 3: Nearby Environment Analysis</h2>
        <p className="text-sm text-slate-500">
          Querying Overpass API for schools, hospitals, industries, and parks within a 2km radius.
        </p>
      </div>

      <div className="bg-[#f1f5f9] p-6 rounded-3xl border border-slate-200 shadow-inner">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-sm font-bold text-slate-600">Querying OpenStreetMap / Overpass...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black text-slate-900">{data?.schools || 0}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Schools</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black text-slate-900">{data?.hospitals || 0}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hospitals</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                <Factory className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black text-slate-900">{data?.industries || 0}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Industries</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <TreePine className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black text-slate-900">{data?.parks || 0}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Parks</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
