import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Activity, Settings, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function MunicipalityTopNav({ onBack, user, setActiveTab }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setActiveTab('Citizen Reports');
    }
  };

  return (
    <header className="h-[88px] bg-[#f1f5f9] border-b border-slate-200 sticky top-0 z-30 px-10 flex items-center justify-between text-slate-800">
      <div className="flex items-center space-x-8 w-1/2">
        <button 
          onClick={onBack}
          className="text-[13px] font-extrabold uppercase tracking-widest text-[#15803D] hover:text-[#166534] transition-colors flex items-center space-x-2 group cursor-pointer"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">&larr;</span> 
          <span>Portal</span>
        </button>
        
        <div className="relative w-full max-w-lg hidden md:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" />
          <input 
            type="text" 
            placeholder="Search reports (Press Enter to view)..." 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-[#f1f5f9] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] border border-transparent rounded-full pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-slate-300 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1 pointer-events-none">
            <kbd className="bg-white border border-slate-250 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-400">Ctrl</kbd>
            <kbd className="bg-white border border-slate-250 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-400">K</kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] rounded-full text-[#15803D] text-sm font-bold">
          <Activity className="w-4 h-4" />
          <span>SLA: 94.2%</span>
        </div>

        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-black text-slate-800 tracking-tight">{currentTime}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{currentDate}</span>
        </div>
        
        <button 
          onClick={() => setActiveTab('Notifications')}
          className="relative w-10 h-10 rounded-full bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e1] flex items-center justify-center text-slate-655 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#f1f5f9] rounded-full shadow-sm animate-pulse"></span>
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 pl-6 border-l border-slate-350/30 cursor-pointer group select-none"
          >
            <div className="flex flex-col text-right">
              <span className="text-[13px] font-black text-slate-800 group-hover:text-[#15803D] transition-colors">Nodal Officer</span>
              <span className="text-[11px] font-bold text-slate-400">NDMC Division</span>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#f1f5f9] overflow-hidden border-2 border-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] group-hover:shadow-[inset_2px_2px_5px_#cbd5e1] transition-all">
              <img src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-14 w-56 bg-[#f1f5f9] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-200/60 p-2.5 z-50 animate-fadeIn flex flex-col space-y-1">
              <button 
                onClick={() => { setActiveTab('Dashboard'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-[#15803D] hover:bg-slate-200/40 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => { setActiveTab('Settings'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-[#15803D] hover:bg-slate-200/40 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <hr className="border-slate-200/60 my-1" />
              <button 
                onClick={() => { setDropdownOpen(false); onBack(); }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Back to Portal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
