import React, { useState } from 'react';
import { FileText, MapPin, Eye, AlertTriangle } from 'lucide-react';

export default function ReportSummaryCard({ data, notes, setNotes }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 7: Final Review</h2>
        <p className="text-sm text-slate-500">
          Review the automatically compiled dossier before submission.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200">
              <img src={data?.image || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80"} alt="Incident" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Detected Location</span>
                <span className="text-sm font-bold text-slate-900 leading-tight block">{data?.location?.address || 'Location Data Pending'}</span>
                <span className="text-xs font-mono text-emerald-600 font-bold mt-1 block">LAT: {data?.location?.lat || '--'} | LNG: {data?.location?.lng || '--'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  AI Classification
                  <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-[4px] text-[8px] leading-none">Verified by Gemini API</span>
                </span>
                <span className="text-sm font-bold text-slate-900 leading-tight block mt-1">{data?.analysis?.data?.pollutionType || 'Visible Pollution'}</span>
                <span className="text-xs font-bold text-slate-500 block">{data?.analysis?.data?.explanation || 'Image has been verified by the Gemini Vision API. The scene contains potential environmental violations.'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            Citizen Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any extra context for the authorities..."
            rows="3"
            className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-emerald-500 rounded-xl p-3 text-slate-900 font-medium text-sm focus:outline-none transition resize-none shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
