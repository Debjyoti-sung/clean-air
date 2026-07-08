import React from 'react';
import { TrendingUp, Users, Award, ShieldAlert, Cpu, Play } from 'lucide-react';
import { mockHotspots } from './mockData';

export default function DashboardView({ setActiveTab }) {
  return (
    <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto text-slate-800">
      
      {/* Welcome Banner (Neumorphic Flat Card) */}
      <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] p-8 rounded-[2rem] border border-white/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(21,128,61,0.05),transparent_60%)]"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Status: Active</h1>
          <p className="text-slate-500 font-semibold max-w-xl text-sm leading-relaxed">
            Aerion Smart City Integration Engine is fully connected. 4 Critical Alerts require dispatch coordinates.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('Citizen Reports')}
          className="relative z-10 px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl font-black text-sm transition shadow-[0_4px_12px_rgba(21,128,61,0.25)] cursor-pointer"
        >
          View Pending Queue
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Actionable Feeds */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Performance Trend SVG Chart (Neumorphic) */}
          <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Incident Resolution Trend</h3>
                <span className="text-xs font-semibold text-slate-450">Weekly operational efficiency status</span>
              </div>
              <span className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 text-xs font-bold rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+14.2% resolving speed</span>
              </span>
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="relative h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#15803D" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="50" x2="500" y2="50" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" opacity="0.4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" opacity="0.4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" opacity="0.4" />
                
                <path d="M 0,200 L 0,150 Q 100,100 200,120 T 400,60 L 500,50 L 500,200 Z" fill="url(#chartGradient)" />
                <path d="M 0,150 Q 100,100 200,120 T 400,60 L 500,50" fill="none" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
                
                <circle cx="200" cy="120" r="5" fill="#15803D" stroke="#ffffff" strokeWidth="2" />
                <circle cx="400" cy="60" r="5" fill="#15803D" stroke="#ffffff" strokeWidth="2" />
                <circle cx="500" cy="50" r="5" fill="#15803D" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="flex justify-between border-t border-slate-200/50 pt-4 text-xs font-bold text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* AI Hotspots list (Neumorphic) */}
          <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">AI Identified High-Risk Hotspots</h3>
                <span className="text-xs font-semibold text-slate-450">Target areas with repeating violation anomalies</span>
              </div>
              <span className="px-2.5 py-1 bg-rose-500/10 text-rose-700 text-[10px] font-black uppercase rounded border border-rose-500/20">
                Action Mandated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockHotspots.slice(0, 4).map((hotspot) => (
                <div key={hotspot.area} className="p-4 bg-[#f1f5f9] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] border border-transparent rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{hotspot.area}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{hotspot.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-rose-600 text-sm">HI: {hotspot.hazardIndex}</div>
                    <span className="text-[10px] text-slate-400 font-bold">{hotspot.frequency} alerts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Mini Widgets */}
        <div className="space-y-8">
          
          {/* Quick Metrics (Neumorphic) */}
          <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem] space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-200/50 pb-3">Fleet Overview</h3>
            
            <div className="space-y-4">
              {[
                { title: "Active Dispatchers", count: "14 Officers", icon: Users, color: "text-[#15803D]", bg: "bg-[#15803D]/10" },
                { title: "Escalated Cases", count: "9 Unresolved", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-500/10" },
                { title: "Average Clean Rate", count: "89.4% SLA Pass", icon: Award, color: "text-emerald-700", bg: "bg-emerald-500/10" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-500">{item.title}</div>
                    <div className="text-sm font-black text-slate-800">{item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dispatch Checklist (Neumorphic) */}
          <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem] space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-200/50 pb-3">Standard Dispatch SLA</h3>
            
            <div className="space-y-3">
              {[
                "1. Automated Image validation verify coordinates",
                "2. Dispatch Ward Officer with Requisition vehicle",
                "3. AI Resolution strategy execution check",
                "4. Final inspection verification and Citizen notice",
              ].map((text, idx) => (
                <div key={idx} className="p-3 bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] rounded-xl flex items-start space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#15803D]/10 text-[#15803D] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-600 leading-normal">{text.slice(3)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
