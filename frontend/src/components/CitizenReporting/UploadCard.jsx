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

      <div className="grid grid-cols-1 gap-8 items-center pt-2 max-w-2xl mx-auto w-full">
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={uploadedImage ? undefined : triggerFileInput}
          className={`neu-pressed rounded-3xl p-8 text-center relative flex flex-col items-center justify-center min-h-[220px] transition-all border border-transparent hover:border-emerald-500/30 ${!uploadedImage ? 'cursor-pointer' : ''}`}
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
                  className="text-xs font-bold text-red-600 neu-button px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full neu-flat flex items-center justify-center text-slate-400">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <div className="space-y-1 mt-4 text-center">
                <span className="text-xs font-bold text-slate-700 block">Drag and drop file here, or click to browse</span>
                <span className="text-[10px] text-slate-500 block">PNG, JPG, or WEBP up to 10MB</span>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
