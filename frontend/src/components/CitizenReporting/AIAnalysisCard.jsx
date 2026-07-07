import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { VisionService } from '../../services/vision.service';

export default function AIAnalysisCard({ image, onAnalysisComplete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!image) return;

    let isMounted = true;
    setLoading(true);
    
    VisionService.analyzeImage(image)
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
          onAnalysisComplete(res);
        }
      })
      .catch(err => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [image, onAnalysisComplete]);

  if (!image) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
        <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Image Required</h3>
        <p className="text-sm text-slate-500">Please upload a photo in Step 1 for AI Analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Step 7: AI Image Analysis 
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Mistral Vision</span>
        </h2>
        <p className="text-sm text-slate-500">
          The uploaded image is being analyzed by Vision AI to classify pollution signatures.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              <Sparkles className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-600">Mistral Vision is scanning the image...</p>
          </div>
        ) : !data?.isPollution ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Analysis Rejected</h3>
            <p className="text-sm text-slate-600 max-w-md">{data?.message}</p>
            <p className="text-xs font-bold text-red-500 mt-2">Cannot proceed to next step.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{data.data.pollutionType}</h3>
                <p className="text-sm text-emerald-600 font-bold">Positive Match Confirmed</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-3xl font-black text-slate-900">{data.data.confidenceScore}%</span>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Confidence</span>
              </div>
            </div>
            
            <div className="bg-[#f1f5f9] p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">AI Explanation</span>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {data.data.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
