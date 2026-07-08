import React, { useState } from 'react';
import { UserPlus, Truck, Calendar } from 'lucide-react';

export default function OfficerAssignment({ report, setReports, readOnly = false }) {
  const [officer, setOfficer] = useState('');
  const [vehicle, setVehicle] = useState('');

  const handleAssign = () => {
    if (!officer) return;
    
    setReports(prev => prev.map(r => {
      if (r.id === report.id) {
        return { 
          ...r, 
          assignedOfficer: officer, 
          currentStatus: r.currentStatus === 'New' ? 'Officer Assigned' : r.currentStatus 
        };
      }
      return r;
    }));
  };

  if (report.currentStatus === 'Completed') return null;

  return (
    <div className="bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-white/40 p-5 rounded-2xl space-y-4 text-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Dispatch & Assignment</span>
        {report.assignedOfficer && (
          <span className="px-2 py-1 bg-[#15803D]/10 text-[#15803D] rounded-md text-[10px] font-bold border border-[#15803D]/20">Assigned</span>
        )}
      </div>

      {!report.assignedOfficer ? (
        readOnly ? (
          <div className="text-center py-4 text-slate-400 text-xs font-semibold">
            Waiting for Nodal Officer to dispatch team...
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-1">Select Officer</label>
                <div className="relative">
                  <UserPlus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-505" />
                  <select 
                    value={officer}
                    onChange={(e) => setOfficer(e.target.value)}
                    className="w-full bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] border border-transparent rounded-lg pl-9 pr-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-slate-300"
                  >
                    <option value="">Select officer...</option>
                    <option value="Arjun Singh">Arjun Singh (Sanitation Dept)</option>
                    <option value="Vikram Das">Vikram Das (Water Dept)</option>
                    <option value="Meera Reddy">Meera Reddy (Environment Control)</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-1">Vehicle Requisition</label>
                <div className="relative">
                  <Truck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-505" />
                  <select 
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] border border-transparent rounded-lg pl-9 pr-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-slate-300"
                  >
                    <option value="">No vehicle</option>
                    <option value="Garbage Truck">Garbage Truck (Heavy)</option>
                    <option value="Water Tanker">Water Suppression Tanker</option>
                    <option value="Drone Unit">Drone Recon Unit</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              onClick={handleAssign}
              disabled={!officer}
              className="w-full py-2.5 bg-[#15803D] hover:bg-[#166534] disabled:bg-slate-300 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition shadow-sm cursor-pointer"
            >
              Dispatch & Assign Task
            </button>
          </div>
        )
      ) : (
        <div className="bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] border border-transparent rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#15803D]/10 flex items-center justify-center text-[#15803D] font-bold uppercase border border-[#15803D]/20">
              {report.assignedOfficer.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{report.assignedOfficer}</div>
              <div className="text-[11px] font-semibold text-slate-500 flex items-center mt-0.5">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Deadline: {new Date(report.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>
          {!readOnly && (
            <button 
              onClick={() => {
                setReports(prev => prev.map(r => r.id === report.id ? { ...r, assignedOfficer: null } : r));
              }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
            >
              Re-assign
            </button>
          )}
        </div>
      )}
    </div>
  );
}
