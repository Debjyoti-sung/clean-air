import React, { useState } from 'react';
import { Filter, Download, UserPlus, Search, SlidersHorizontal } from 'lucide-react';
import ReportsTable from './ReportsTable';
import ReportDrawer from './ReportDrawer';
import { mockReports } from './mockData';

export default function CitizenReportsView() {
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleExpand = (report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto pb-12 text-slate-800">
      
      {/* Header Section (Neumorphic Flat Card) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] p-6 rounded-[2rem] border border-white/40 relative overflow-hidden">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="px-3 py-1 bg-[#15803D]/10 text-[#15803D] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#15803D]/20">Live Operations</span>
            <span className="text-xs font-bold text-slate-450">v4.2.1-stable</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Citizen Reports Hub</h1>
          <p className="text-[15px] font-medium text-slate-500 mt-1 max-w-xl">Manage, verify, and route public environmental grievances to field operations.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e1] border border-white/40 rounded-xl text-[13px] font-bold text-slate-700 hover:text-slate-900 transition-all">
            <SlidersHorizontal className="w-4 h-4 text-slate-450" />
            <span>Filters</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e1] border border-white/40 rounded-xl text-[13px] font-bold text-slate-700 hover:text-slate-900 transition-all">
            <Download className="w-4 h-4 text-slate-450" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-b from-[#15803D] to-[#166534] rounded-xl text-[13px] font-black text-white hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(21,128,61,0.25)]">
            <UserPlus className="w-4 h-4 text-emerald-100" />
            <span>Auto Dispatch</span>
          </button>
        </div>
      </div>

      {/* Analytics Mini-Cards (Neumorphic Flat Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Pending', value: '1,248', desc: '+12% from last week', color: 'text-[#15803D]', bg: 'bg-[#15803D]/10' },
          { label: 'Critical Priority', value: '42', desc: 'Requires immediate action', color: 'text-rose-600', bg: 'bg-rose-500/10' },
          { label: 'AI Verified', value: '890', desc: 'Auto-processed by Aerion', color: 'text-emerald-700', bg: 'bg-emerald-500/10' },
          { label: 'Resolved Today', value: '156', desc: 'Across all wards', color: 'text-slate-700', bg: 'bg-slate-500/10' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[1.5rem] flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bg} rounded-bl-full -mr-4 -mt-4 opacity-30 group-hover:scale-110 transition-transform`}></div>
            <div className="relative z-10 space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-550">{stat.label}</span>
              <div className="flex items-end justify-between">
                <span className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.value}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Table Section (Neumorphic Inner Container) */}
      <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 rounded-[2rem] overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-200/50 flex items-center justify-between bg-slate-200/20">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Citizen, or Location..." 
              className="w-full bg-[#f1f5f9] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] border border-transparent rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-slate-300 transition-all"
            />
          </div>
          <div className="flex items-center space-x-4 text-[13px] font-bold text-slate-500">
            <span>Showing <span className="text-slate-800">1-4</span> of 1,248 reports</span>
          </div>
        </div>
        
        {/* Table */}
        <ReportsTable reports={reports} onExpand={handleExpand} />
      </div>

      {/* Side Drawer */}
      <ReportDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        report={reports.find(r => r.id === selectedReport?.id)}
        setReports={setReports}
      />
    </div>
  );
}
