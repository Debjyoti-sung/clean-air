import React from 'react';
import { Check } from 'lucide-react';

export default function ProgressTracker({ currentStatus }) {
  const steps = [
    'New',
    'Officer Assigned',
    'Work In Progress',
    'Completed'
  ];

  let currentIndex = steps.indexOf(currentStatus);
  if (currentIndex === -1) currentIndex = 0;

  return (
    <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-5 rounded-2xl">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-4">Resolution Timeline</span>
      <div className="relative flex justify-between">
        {/* Connecting Line */}
        <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 -z-10"></div>
        <div 
          className="absolute top-3 left-6 h-0.5 bg-emerald-500 -z-10 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;
          const isWIPGlow = step === 'Work In Progress' && currentStatus === 'Work In Progress';
          
          return (
            <div key={step} className="flex flex-col items-center space-y-2 z-10 w-24 relative">
              <div className="relative flex items-center justify-center">
                {isWIPGlow && (
                  <span className="absolute -inset-2.5 rounded-full bg-amber-500/30 animate-pulse-ring border border-amber-550/40"></span>
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                    : isWIPGlow
                      ? 'bg-amber-500 border-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse'
                      : 'bg-white border-slate-300 text-slate-350 shadow-[inset_1px_1px_3px_#cbd5e1]'
                }`}>
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-350"></span>}
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider text-center ${
                isWIPGlow ? 'text-amber-600 animate-pulse' : isActive ? 'text-emerald-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
