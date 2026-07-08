import React from 'react';
import { 
  LayoutDashboard, 
  FileWarning, 
  Briefcase, 
  UserCheck, 
  Cpu, 
  CheckCircle, 
  Bell, 
  BarChart3, 
  Users, 
  Settings 
} from 'lucide-react';

export default function MunicipalitySidebar({ activeTab, setActiveTab, isOpen }) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Citizen Reports', icon: FileWarning },
    { name: 'Active Cases', icon: Briefcase },
    { name: 'Assigned Tasks', icon: UserCheck },
    { name: 'Completed Cases', icon: CheckCircle },
    { name: 'Notifications', icon: Bell, badge: '3' },
    { name: 'Reports & Analytics', icon: BarChart3 },
    { name: 'Team Management', icon: Users },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`w-72 bg-[#f1f5f9] h-screen fixed left-0 top-0 flex flex-col z-40 border-r border-slate-300/40 px-5 py-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Brand Logo Header */}
      <div className="flex items-center space-x-3 mb-8 px-3">
        <div className="w-10 h-10 rounded-full bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] flex items-center justify-center text-lg">
          🌿
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-black text-slate-800 tracking-tight leading-none">
            Clean<span className="text-[#15803D]">Air</span>
          </span>
          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">
            Municipality
          </span>
        </div>
      </div>
      
      {/* Segmented Neumorphic Sidebar Items */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-[13px] ${
                isActive 
                  ? 'text-[#15803D] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] bg-[#f1f5f9]' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#15803D]' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  isActive ? 'bg-[#15803D]/10 text-[#15803D]' : 'bg-slate-200 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* System Status block (Neumorphic) */}
      <div className="mt-auto pt-6 border-t border-slate-250/30">
        <div className="bg-[#f1f5f9] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] rounded-2xl p-4 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Systems Health</p>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[12px] font-bold text-slate-700">Fully Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
