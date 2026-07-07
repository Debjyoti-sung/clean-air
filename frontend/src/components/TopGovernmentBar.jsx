import React from 'react';
import { Eye, HelpCircle, Phone, Languages } from 'lucide-react';

export default function TopGovernmentBar({ 
  textSize, 
  setTextSize, 
  language, 
  setLanguage, 
  isDarkMode, 
  setIsDarkMode 
}) {
  return (
    <div className="w-full bg-[#0B1E36] text-white text-[12px] py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center border-b border-blue-900 gap-2 md:gap-0 z-50 relative">
      {/* Left: Emblem and Gov info */}
      <div className="flex items-center space-x-3">
        {/* Ashoka Chakra Emblem Placeholder SVG */}
        <svg className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="8" fill="currentColor" />
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div className="flex items-center space-x-2 divider divide-x divide-blue-800">
          <span className="font-semibold tracking-wider uppercase text-slate-100">
            {language === 'EN' ? 'Government of India' : 'भारत सरकार'}
          </span>
          <span className="pl-2 text-slate-300 font-medium">
            {language === 'EN' ? 'AI-Powered Environmental Monitoring' : 'एआई-संचालित पर्यावरणीय निगरानी'}
          </span>
        </div>
      </div>

      {/* Right: Tools & Accessibility */}
      <div className="flex items-center space-x-4 md:space-x-6 flex-wrap justify-center">
        {/* Font Resize buttons */}
        <div className="flex items-center space-x-1 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
          <button 
            onClick={() => setTextSize('sm')} 
            className={`px-1.5 py-0.5 rounded transition ${textSize === 'sm' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            title="Decrease text size"
          >
            A-
          </button>
          <button 
            onClick={() => setTextSize('base')} 
            className={`px-1.5 py-0.5 rounded transition ${textSize === 'base' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            title="Reset text size"
          >
            A
          </button>
          <button 
            onClick={() => setTextSize('lg')} 
            className={`px-1.5 py-0.5 rounded transition ${textSize === 'lg' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            title="Increase text size"
          >
            A+
          </button>
        </div>

        {/* Language selector */}
        <div className="relative group flex items-center space-x-1 cursor-pointer text-slate-300 hover:text-white transition py-1">
          <Languages className="w-3.5 h-3.5" />
          <span className="font-medium">{language === 'EN' ? 'English' : 'हिन्दी'}</span>
          <span className="text-[8px] opacity-70">▼</span>
          
          <div className="absolute right-0 top-full mt-1 bg-slate-900 text-slate-100 rounded border border-slate-700 shadow-lg hidden group-hover:block w-28 z-[60]">
            <button 
              onClick={() => setLanguage('EN')} 
              className={`w-full text-left px-3 py-1.5 hover:bg-blue-800 transition text-[12px] ${language === 'EN' ? 'bg-blue-900 font-semibold' : ''}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('HI')} 
              className={`w-full text-left px-3 py-1.5 hover:bg-blue-800 transition text-[12px] ${language === 'HI' ? 'bg-blue-900 font-semibold' : ''}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Accessibility contrast button */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
          title="Toggle High Contrast / Dark Mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isDarkMode ? 'Normal View' : 'High Contrast'}</span>
        </button>

        {/* Links */}
        <div className="flex items-center space-x-3 text-slate-300">
          <a href="#faq" className="hover:text-white transition flex items-center space-x-0.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </a>
          <span>|</span>
          <a href="#contact" className="hover:text-white transition flex items-center space-x-0.5">
            <Phone className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
        </div>
      </div>
    </div>
  );
}
