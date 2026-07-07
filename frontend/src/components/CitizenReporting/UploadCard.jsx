import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';

export default function UploadCard({ onImageUploaded, language = 'EN' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should not exceed 10MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        const result = e.target.result;
        setUploadedImage(result);
        setIsUploading(false);
        onImageUploaded(result);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const simulateUpload = (type) => {
    setIsUploading(true);
    setTimeout(() => {
      const images = {
        dust: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
        garbage: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
        industrial: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=600&q=80"
      };
      
      const img = images[type];
      setUploadedImage(img);
      setIsUploading(false);
      onImageUploaded(img);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 1: Environmental Incident Proof</h2>
        <p className="text-sm text-slate-500">
          Upload or capture a photo showing smoke plume boundaries, active waste burning, or construction dust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={uploadedImage ? undefined : triggerFileInput}
          className={`border-2 border-dashed border-slate-300 rounded-3xl p-8 bg-white/50 text-center relative flex flex-col items-center justify-center min-h-[220px] transition-all hover:border-emerald-500/40 shadow-sm ${!uploadedImage ? 'cursor-pointer' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*" 
          />
          {isUploading ? (
            <div className="space-y-3 flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <span className="text-xs font-bold text-slate-500">Uploading telemetry image...</span>
            </div>
          ) : uploadedImage ? (
            <div className="space-y-4 w-full">
              <div className="relative w-48 h-32 rounded-2xl overflow-hidden mx-auto border border-slate-200 shadow-md">
                <img src={uploadedImage} alt="Uploaded incident proof" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={() => {
                    setUploadedImage(null);
                    onImageUploaded(null);
                  }}
                  className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-100 transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">Drag and drop file here, or click to browse</span>
                <span className="text-[10px] text-slate-500 block">PNG, JPG, or WEBP up to 10MB</span>
              </div>
              <div className="flex flex-wrap gap-2.5 justify-center pt-2" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => simulateUpload('dust')}
                  className="px-4 py-2 text-[11.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition cursor-pointer"
                >
                  Mock Dust Upload
                </button>
                <button 
                  onClick={() => simulateUpload('garbage')}
                  className="px-4 py-2 text-[11.5px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition cursor-pointer"
                >
                  Mock Fire Upload
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/80 border border-slate-200 rounded-3xl p-6 min-h-[220px] flex flex-col justify-between text-left space-y-4 shadow-sm">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Camera Device Ingest</span>
            <h4 className="text-md font-bold text-slate-900">Live View Simulator</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulate sensor array camera alignment checks. Clicking camera triggers simulates visual target bounds ingestion and registers telemetry indexes.
            </p>
          </div>
          <div className="bg-[#f1f5f9] rounded-2xl p-4 flex items-center justify-between border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-slate-700">Device ID: INGEST_CAM_01</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
