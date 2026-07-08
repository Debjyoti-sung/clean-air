import React, { useState } from 'react';
import { X, MapPin, AlertTriangle } from 'lucide-react';
import ProgressTracker from './ProgressTracker';
import AIResolutionPanel from './AIResolutionPanel';
import OfficerAssignment from './OfficerAssignment';
import EvidenceUpload from './EvidenceUpload';
import FinalImplementation from './FinalImplementation';

export default function ReportDrawer({ isOpen, onClose, report, setReports, readOnly = false }) {
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  if (!isOpen || !report) return null;

  return (
    <div className={`fixed right-0 top-0 bottom-0 h-screen max-h-screen w-[600px] bg-[#f1f5f9] text-slate-800 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col border-l border-slate-200/60 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Drawer Header */}
      <div className="bg-[#f1f5f9] px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-mono tracking-tight">{report.id}</h2>
          <span className="text-xs font-bold text-slate-400">Submitted: {new Date(report.submittedDate).toLocaleString()}</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-8 custom-scrollbar">
        
        {/* Progress Tracker */}
        <ProgressTracker currentStatus={report.currentStatus} />

        {/* Core Info Cards (Neumorphic Flat) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-4 rounded-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">Citizen Details</span>
            <div className="font-bold text-sm text-slate-900">{report.citizenName}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">{report.citizenEmail}</div>
            <div className="text-xs font-semibold text-slate-500">{report.contactNumber}</div>
          </div>
          <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-4 rounded-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">Issue Details</span>
            <div className="font-bold text-sm text-slate-900">{report.issueCategory}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mr-1.5" />
              Priority: {report.priority}
            </div>
            <div className="text-xs font-semibold text-slate-500 flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#15803D] mr-1.5" />
              {report.wardNumber}
            </div>
          </div>
        </div>

        {/* Description & Images (Neumorphic Flat) */}
        <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-5 rounded-2xl space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1.5">Citizen Description</span>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">{report.description}</p>
          </div>
          
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2.5">Uploaded Evidence</span>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {report.images.map((img, idx) => (
                <div key={idx} className="w-32 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] border border-transparent p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#15803D] block">AI Automated Summary</span>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-500/20">Verified</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500">Classified As</div>
              <div className="font-bold text-base text-slate-800 mt-0.5">{report.aiSummary.pollutionType}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Impact Score</div>
              <div className="flex items-center space-x-3 mt-1.5">
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${report.aiSummary.impactScore}%` }}></div>
                </div>
                <span className="font-bold text-sm text-slate-700">{report.aiSummary.impactScore}/100</span>
              </div>
            </div>
            <p className="text-xs text-slate-655 leading-relaxed border-t border-slate-200/60 pt-3">{report.aiSummary.explanation}</p>
          </div>
        </div>

        {/* Officer Assignment */}
        <OfficerAssignment report={report} setReports={setReports} readOnly={readOnly} />

        {/* AI Guided Resolution Panel */}
        <AIResolutionPanel report={report} setReports={setReports} readOnly={readOnly} />

        {/* Support & Resource Requisition Section */}
        {report.assignedOfficer && (
          <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-5 rounded-2xl space-y-4 text-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Support Requisitions</span>
            
            {report.resourceRequest ? (
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Requested Items</div>
                  <div className="font-bold text-sm text-slate-800 mt-1">{report.resourceRequest.item}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold mt-2 inline-block border ${
                    report.resourceRequest.status === 'Pending' 
                      ? 'bg-amber-50 text-amber-600 border-amber-100' 
                      : 'bg-emerald-50 text-[#15803D] border-emerald-100 shadow-[0_2px_4px_rgba(21,128,61,0.1)]'
                  }`}>
                    Request Status: {report.resourceRequest.status}
                  </span>
                </div>
                
                {!readOnly && report.resourceRequest.status === 'Pending' && (
                  <button 
                    onClick={() => {
                      setReports(prev => prev.map(r => r.id === report.id ? {
                        ...r,
                        resourceRequest: { ...r.resourceRequest, status: 'Approved & Dispatched' }
                      } : r));
                    }}
                    className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Approve Request
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] rounded-xl text-xs font-semibold text-slate-400 flex flex-col items-center justify-center space-y-2">
                <span>No support requisitions filed by officer.</span>
                {readOnly && (
                  <button 
                    onClick={() => {
                      setReports(prev => prev.map(r => r.id === report.id ? {
                        ...r,
                        resourceRequest: { item: "1x Wet Suppression Tanker & 2x Ground Sweepers", status: "Pending" }
                      } : r));
                    }}
                    className="px-4 py-2 bg-[#15803D] text-white rounded-lg font-bold hover:bg-[#166534] transition shadow-sm cursor-pointer mt-2"
                  >
                    Request Resources
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Evidence Upload */}
        <EvidenceUpload 
          report={report} 
          readOnly={readOnly} 
          imageFile={imageFile} 
          setImageFile={setImageFile} 
          pdfFile={pdfFile} 
          setPdfFile={setPdfFile} 
        />

      </div>
      
      {/* Footer / Final Action */}
      {!readOnly && (
        <FinalImplementation 
          report={report} 
          onClose={onClose} 
          setReports={setReports} 
          imageFile={imageFile}
          pdfFile={pdfFile}
        />
      )}
    </div>
  );
}
