import React from 'react';
import { Eye, Maximize2, UserPlus, CheckCircle2, CircleDashed } from 'lucide-react';

export default function ReportsTable({ reports, onExpand }) {
  
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-50 text-rose-700 border-rose-200 shadow-[inset_0_1px_4px_rgba(225,29,72,0.05)]';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200 shadow-[inset_0_1px_4px_rgba(234,88,12,0.05)]';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200 shadow-[inset_0_1px_4px_rgba(217,119,6,0.05)]';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-[inset_0_1px_4px_rgba(16,185,129,0.05)]';
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Completed') return 'text-[#15803D] bg-emerald-50 border-emerald-100';
    if (status === 'Work In Progress') return 'text-blue-700 bg-blue-50 border-blue-100';
    if (status === 'Officer Assigned') return 'text-purple-750 bg-purple-50 border-purple-100';
    return 'text-slate-600 bg-slate-100 border-slate-200';
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse whitespace-nowrap text-slate-800">
        <thead>
          <tr className="bg-slate-200/20 border-b border-slate-200/60 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <th className="py-5 px-6 font-extrabold w-32">Ticket ID</th>
            <th className="py-5 px-6 font-extrabold">Citizen</th>
            <th className="py-5 px-6 font-extrabold">Classification</th>
            <th className="py-5 px-6 font-extrabold">Priority Level</th>
            <th className="py-5 px-6 font-extrabold">Current Status</th>
            <th className="py-5 px-6 font-extrabold min-w-[200px]">Location Data</th>
            <th className="py-5 px-6 font-extrabold text-right">Operations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/50">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-slate-200/25 transition-colors group">
              <td className="py-4 px-6 font-mono text-[13px] font-bold text-slate-600">
                {report.id}
              </td>
              <td className="py-4 px-6">
                <div className="font-bold text-[14px] text-slate-900 leading-tight">{report.citizenName}</div>
                <div className="text-[12px] font-semibold text-slate-500">{report.contactNumber}</div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${report.issueCategory === 'Air Pollution' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                  <span className="text-[14px] font-bold text-slate-800">{report.issueCategory}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${getPriorityStyle(report.priority)}`}>
                  {report.priority}
                </span>
              </td>
              <td className="py-4 px-6">
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold border flex items-center w-fit ${getStatusStyle(report.currentStatus)}`}>
                  {report.currentStatus === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <CircleDashed className="w-3.5 h-3.5 mr-1.5" />}
                  {report.currentStatus}
                </span>
              </td>
              <td className="py-4 px-6">
                <div className="font-bold text-[13px] text-slate-800 truncate max-w-[250px]" title={report.location}>
                  {report.location}
                </div>
                <div className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest mt-0.5">{report.wardNumber}</div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-455 hover:text-blue-650 hover:bg-white rounded-xl transition shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] bg-[#f1f5f9] border border-white/20" title="Quick View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-455 hover:text-purple-650 hover:bg-white rounded-xl transition shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] bg-[#f1f5f9] border border-white/20" title="Assign Officer">
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onExpand(report)}
                    className="p-2 text-slate-650 hover:text-[#15803D] hover:bg-white rounded-xl transition shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] bg-[#f1f5f9] border border-white/20" 
                    title="Expand Full Report"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
