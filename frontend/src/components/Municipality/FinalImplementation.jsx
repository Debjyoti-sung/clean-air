import React, { useState } from 'react';
import { CheckCircle2, Lock, Loader2 } from 'lucide-react';

export default function FinalImplementation({ report, onClose, setReports, imageFile, pdfFile }) {
  const [isCompleting, setIsCompleting] = useState(false);

  if (report.currentStatus === 'Completed') {
    return (
      <div className="w-full bg-[#f1f5f9] border-t border-slate-205/60 p-6 shadow-sm z-20">
        <div className="flex items-center justify-center space-x-3 text-[#15803D] bg-emerald-50 py-3 rounded-xl border border-emerald-100">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">Resolution Completed & Verified</span>
        </div>
      </div>
    );
  }

  const hasPlan = !!report.aiResolutionPlan;
  const allTasksDone = hasPlan && report.aiResolutionPlan.checklist.every(t => t.completed);
  const hasEvidence = !!(imageFile && pdfFile);
  const canComplete = allTasksDone && hasEvidence;
  
  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      const formData = new FormData();
      
      const reportDetails = {
        reportId: report.id,
        issueCategory: report.issueCategory,
        priority: report.priority,
        wardNumber: report.wardNumber,
        description: report.description,
        aiResolutionPlan: report.aiResolutionPlan,
        assignedOfficer: report.assignedOfficer,
        citizenName: report.citizenName || 'Citizen'
      };

      formData.append('reportDetailsStr', JSON.stringify(reportDetails));
      formData.append('citizenEmail', report.citizenEmail);

      if (imageFile) formData.append('imageFile', imageFile);
      if (pdfFile) formData.append('pdfFile', pdfFile);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/email/send-resolution`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to send resolution email');
      }

      setReports(prev => prev.map(r => r.id === report.id ? { ...r, currentStatus: 'Completed' } : r));
      onClose();
    } catch (error) {
      console.error('Error completing resolution:', error);
      alert('Failed to complete resolution. Please try again later.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="w-full bg-[#f1f5f9]/95 backdrop-blur-lg border-t border-slate-250/60 p-6 shadow-md z-20 flex flex-col items-center">
      
      {!canComplete ? (
        <div className="flex items-center space-x-3 w-full bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] p-3 rounded-xl border border-transparent mb-3">
          <Lock className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-[11px] font-semibold text-slate-500 leading-tight">
            Resolution locked. Generate AI plan, complete all checklist items, and upload required closure evidence to unlock final submission.
          </p>
        </div>
      ) : (
        <div className="flex items-center space-x-3 w-full bg-emerald-50 p-3 rounded-xl border border-emerald-100 mb-3">
          <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
          <p className="text-[11px] font-bold text-emerald-700 leading-tight">
            All requirements met. Ready for final verification and citizen notification.
          </p>
        </div>
      )}

      <button 
        onClick={handleComplete}
        disabled={!canComplete || isCompleting}
        className="w-full py-4 bg-[#15803D] hover:bg-[#166534] disabled:bg-slate-300 text-white font-black text-sm rounded-xl transition shadow-[0_4px_12px_rgba(21,128,61,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
      >
        {isCompleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
        <span>{isCompleting ? 'Sending Notification & Completing...' : 'Complete Resolution'}</span>
      </button>
    </div>
  );
}
