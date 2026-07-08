import React, { useState } from 'react';
import { Camera, FileUp, ShieldCheck } from 'lucide-react';

export default function EvidenceUpload({ report, readOnly = false }) {
  const [uploaded, setUploaded] = useState(false);

  const handleUploadClick = () => {
    if (readOnly) return;
    setTimeout(() => {
      setUploaded(true);
    }, 800);
  };

  return (
    <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-5 rounded-2xl space-y-4 text-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Closure Evidence</span>
        {uploaded && <span className="px-2 py-1 bg-emerald-50 text-[#15803D] rounded-md text-[10px] font-bold border border-emerald-100 flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified</span>}
      </div>

      {!uploaded && readOnly ? (
        <div className="text-center py-4 text-slate-400 text-xs font-semibold">
          Waiting for field officer to upload closure evidence...
        </div>
      ) : (

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleUploadClick}
          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition ${
            uploaded ? 'border-emerald-350 bg-emerald-50/50 cursor-default' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
        >
          {uploaded ? (
            <>
              <div className="w-8 h-8 rounded-full bg-emerald-50/80 flex items-center justify-center text-emerald-600 mb-1">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-700">After Image.jpg</span>
              <span className="text-[9px] text-emerald-600/70">GPS Verified</span>
            </>
          ) : (
            <>
              <Camera className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-bold text-slate-655">Upload "After" Image</span>
              <span className="text-[9px] text-slate-400">Required for closure</span>
            </>
          )}
        </button>

        <button 
          onClick={handleUploadClick}
          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition ${
            uploaded ? 'border-[#15803D]/20 bg-emerald-50/20 cursor-default' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
        >
          {uploaded ? (
            <>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-605 mb-1">
                <FileUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-800">Inspection_Report.pdf</span>
              <span className="text-[9px] text-emerald-605">Digitally Signed</span>
            </>
          ) : (
            <>
              <FileUp className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-bold text-slate-655">Inspection PDF</span>
              <span className="text-[9px] text-slate-400">Optional</span>
            </>
          )}
        </button>
      </div>
      )}
    </div>
  );
}
