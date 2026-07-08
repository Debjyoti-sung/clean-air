import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { VisionService } from '../../services/vision.service';

export default function AIAnalysisCard({ image, onAnalysisComplete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const hasRun = useRef(false);

  const runAnalysis = () => {
    if (!image) return;

    setLoading(true);
    setData(null);
    setError(null);
    setProgress('Sending image to Gemini Vision AI...');

    const progressTimer = setTimeout(() => {
      setProgress('Gemini is analyzing pollution signatures...');
    }, 4000);

    const progressTimer2 = setTimeout(() => {
      setProgress('Processing AI response...');
    }, 12000);

    VisionService.analyzeImage(image)
      .then(res => {
        clearTimeout(progressTimer);
        clearTimeout(progressTimer2);
        setData(res);
        setLoading(false);
        if (onAnalysisComplete) onAnalysisComplete(res);
      })
      .catch(err => {
        clearTimeout(progressTimer);
        clearTimeout(progressTimer2);
        console.error('AI Analysis error:', err);
        setError(err?.message || 'Failed to connect to the AI Analysis server.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (image && !hasRun.current) {
      hasRun.current = true;
      runAnalysis();
    }
  }, [image]);

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
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Gemini Vision</span>
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
            <p className="text-sm font-bold text-slate-600">{progress}</p>
            <p className="text-xs text-slate-400">This may take 15-30 seconds depending on network.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Analysis Failed</h3>
            <p className="text-sm text-slate-600 max-w-md">{error}</p>
            <button
              onClick={() => { hasRun.current = false; runAnalysis(); }}
              className="mt-2 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Analysis
            </button>
          </div>
        ) : data && !data.isPollution ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Pollution Detected</h3>
            <p className="text-sm text-slate-600 max-w-md">{data?.message || 'This image does not appear to contain pollution-related evidence.'}</p>
            <p className="text-xs font-bold text-amber-600 mt-2">You may still proceed or retry with a different image.</p>
          </div>
        ) : data?.isPollution ? (
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

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Severity:</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                data.data.severitySuggestion === 'High' ? 'bg-red-100 text-red-700' :
                data.data.severitySuggestion === 'Medium' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {data.data.severitySuggestion}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
