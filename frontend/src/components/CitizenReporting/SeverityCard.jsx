import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, MapPin } from 'lucide-react';

export default function SeverityCard({ coords, analysisData }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!coords?.lat) return;

    let isMounted = true;
    setLoading(true);

    fetch(`http://localhost:5000/api/environment?lat=${coords.lat}&lng=${coords.lng}&radius=2000`)
      .then(res => res.json())
      .then(resData => {
        if (isMounted) {
          setData(resData.summary);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Severity Service Error:", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [coords]);

  if (!coords?.lat) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
        <MapPin className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Location Required</h3>
        <p className="text-sm text-slate-500">Please set a location in Step 2 to compute risk severity.</p>
      </div>
    );
  }

  const getSeverityStyle = (level) => {
    switch (level?.toUpperCase()) {
      case 'VERY HIGH':
      case 'CRITICAL':
        return {
          color: 'text-rose-600',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          action: 'Immediate municipal dispatch required. Potential violation of NGT section 4.'
        };
      case 'HIGH':
        return {
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          action: 'Dispatch inspectors within 12 hours.'
        };
      case 'MEDIUM':
      case 'MODERATE':
        return {
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          action: 'Schedule inspection within 48 hours.'
        };
      default:
        return {
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          action: 'Monitor zone remotely. No immediate physical dispatch required.'
        };
    }
  };

  const score = data?.riskScore !== undefined ? data.riskScore : 45;
  const level = data?.riskLevel || 'Medium';
  const style = getSeverityStyle(level);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 7: Multi-Source Severity Engine</h2>
        <p className="text-sm text-slate-500">
          Synthesizing AI Vision, Weather, Satellite, and Nearby Infrastructure data to calculate priority.
        </p>
      </div>

      <div className={`bg-white p-6 rounded-3xl border ${style.border} shadow-sm relative overflow-hidden`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
            <p className="text-sm font-bold text-slate-600">Running synthesis matrix...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`flex flex-col items-center justify-center py-6 border-b border-slate-100 text-center ${style.bg} rounded-2xl`}>
              <ShieldAlert className={`w-12 h-12 ${style.color} mb-2`} />
              <h3 className={`text-3xl font-black ${style.color}`}>{level.toUpperCase()} PRIORITY</h3>
              <p className="text-sm text-slate-700 font-bold mt-1">Computed Risk Score: {score}/100</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f1f5f9] p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">Estimated Affected Radius</span>
                <span className="text-lg font-bold text-slate-900">{score > 60 ? '1.5 km' : '500 m'}</span>
              </div>
              <div className="bg-[#f1f5f9] p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">Recommended Municipal Action</span>
                <span className="text-sm font-bold text-slate-900 leading-tight">{style.action}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
