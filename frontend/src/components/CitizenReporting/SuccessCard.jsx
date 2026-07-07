import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessCard({ trackingId }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
        {/* Background confeti style elements could go here */}
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
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
          <button className="px-6 py-3 text-sm font-black text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer">
            View Submitted Reports
          </button>
          <a href="/" className="px-6 py-3 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md shadow-emerald-500/20 cursor-pointer inline-flex items-center gap-2">
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
