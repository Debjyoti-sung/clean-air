import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MapPin, User, Mail, Phone } from 'lucide-react';

export default function SuccessCard({ trackingId, reportData, onBack }) {
  const [showDetails, setShowDetails] = useState(false);

  const localImageUrl = reportData?.image || '';
  const citizenName = reportData?.user?.user_metadata?.name || reportData?.user?.user_metadata?.full_name || reportData?.user?.email?.split('@')[0] || "Citizen";
  const citizenEmail = reportData?.user?.email || "N/A";
  const citizenPhone = reportData?.user?.user_metadata?.phone || "N/A";

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
        
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-2">Report Successfully Submitted</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          Your environmental report has been ingested by the Aerion platform and routed to the corresponding municipal authorities. An email confirmation has been sent.
        </p>
        
        <div className="bg-[#f1f5f9] p-6 rounded-2xl border border-slate-200 inline-block text-left min-w-[280px]">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest block mb-1">Official Tracking ID</span>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black text-emerald-600 font-mono tracking-wider">{trackingId}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(trackingId);
                alert("Tracking ID copied to clipboard!");
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition underline cursor-pointer"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-3 text-sm font-black text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            {showDetails ? 'Hide Submitted Details' : 'View Submitted Reports'}
          </button>
          <button onClick={onBack} className="px-6 py-3 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md shadow-emerald-500/20 cursor-pointer inline-flex items-center gap-2">
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable Details Container */}
        {showDetails && (
          <div className="mt-8 text-left bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Grievance Report Summary
              </h3>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                {trackingId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image and Description */}
              <div className="space-y-4">
                {localImageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm max-h-48">
                    <img src={localImageUrl} alt="Submitted Pollution Source" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Description Notes</span>
                  <p className="text-xs font-semibold text-slate-650 leading-relaxed bg-white border border-slate-200/60 rounded-xl p-3">
                    {reportData?.notes || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Right Column: Metadata */}
              <div className="space-y-4">
                {/* Category & Severity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 bg-white border border-slate-200/60 rounded-xl p-3">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Category</span>
                    <span className="text-xs font-bold text-slate-850">{reportData?.analysis?.category || "Ambient Air Quality"}</span>
                  </div>
                  <div className="space-y-1 bg-white border border-slate-200/60 rounded-xl p-3">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Severity Score</span>
                    <span className="text-xs font-bold text-slate-850 uppercase">{reportData?.analysis?.severity || "High"}</span>
                  </div>
                </div>

                {/* Location Info */}
                <div className="bg-white border border-slate-200/60 rounded-xl p-3 space-y-1">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" /> Location Details
                  </span>
                  <p className="text-xs font-bold text-slate-850 truncate" title={reportData?.location?.address}>
                    {reportData?.location?.address || "Selected Coordinates"}
                  </p>
                  {reportData?.location?.lat && (
                    <p className="text-[10px] text-slate-500 font-semibold font-mono">
                      {parseFloat(reportData.location.lat).toFixed(4)}° N, {parseFloat(reportData.location.lng).toFixed(4)}° E
                    </p>
                  )}
                </div>

                {/* Reporter Profile */}
                <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 space-y-2">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Reporter Profile</span>
                  <div className="space-y-1.5 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-450" />
                      <span>{citizenName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-450" />
                      <span>{citizenEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-450" />
                      <span>{citizenPhone}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
