import React from 'react';
import { Check } from 'lucide-react';

export default function StepperSidebar({ currentStep, language = 'EN' }) {
  const stepsList = [
    { num: 1, label: language === 'EN' ? 'Upload Image' : 'फोटो अपलोड' },
    { num: 2, label: language === 'EN' ? 'Detect Location' : 'स्थान निर्धारित करें' },
    { num: 3, label: language === 'EN' ? 'Nearby Analysis' : 'आसपास का वातावरण' },
    { num: 4, label: language === 'EN' ? 'Air Quality' : 'एक्यूआई विश्लेषण' },
    { num: 5, label: language === 'EN' ? 'Weather' : 'मौसम विवरण' },
    { num: 6, label: language === 'EN' ? 'Satellite Scan' : 'सैटेलाइट स्कैन' },
    { num: 7, label: language === 'EN' ? 'AI Vision' : 'एआई विश्लेषण' },
    { num: 8, label: language === 'EN' ? 'Severity Engine' : 'जोखिम रेटिंग' },
    { num: 9, label: language === 'EN' ? 'Review Report' : 'समीक्षा' },
    { num: 10, label: language === 'EN' ? 'Authentication' : 'प्रमाणीकरण' },
    { num: 11, label: language === 'EN' ? 'Submission' : 'प्रस्तुति' }
  ];

  return (
    <div className="w-full lg:w-[260px] shrink-0">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-5 space-y-4 shadow-sm">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block px-3">
          Pipeline Status
        </span>
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-3 lg:pb-0 scrollbar-none">
          {stepsList.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            // Hide step 12 from sidebar since it's just success screen
            if (s.num > 11) return null;

            return (
              <div 
                key={s.num}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 min-w-[130px] lg:min-w-0 ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm font-bold' 
                    : isCompleted 
                      ? 'text-slate-700 font-medium hover:bg-slate-50' 
                      : 'text-slate-400 opacity-70'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all duration-300 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : isCompleted 
                      ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                </div>
                <span className="text-xs tracking-tight whitespace-nowrap">{s.label}</span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
