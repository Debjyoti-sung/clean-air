import React from 'react';
import { Focus, Cpu, Landmark } from 'lucide-react';

export default function WhyAerioN({ language }) {
  const points = [
    {
      title: language === 'EN' ? 'Hyperlocal Detection' : 'हाइपरलोकल ट्रैकिंग',
      desc: language === 'EN' ? 'Goes beyond regional AQI. Tracks specific streets and coordinates using a hybrid network of low-cost IoT monitors and crowdsourced imaging.' : 'क्षेत्रीय एक्यूआई से परे। कम लागत वाले आईओटी मॉनिटर और क्राउडसोर्स इमेजिंग के हाइब्रिड नेटवर्क का उपयोग करके विशिष्ट सड़कों और स्थानों को ट्रैक करता है।',
      icon: Focus,
      color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100/80 group-hover:bg-emerald-100/50',
      hoverGlow: 'hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] hover:border-emerald-300/40'
    },
    {
      title: language === 'EN' ? 'AI-Powered Decisions' : 'एआई-संचालित निर्णय',
      desc: language === 'EN' ? 'Automates false-positive filtering. Machine learning models cross-analyze weather trajectories, humidity indices, and satellite heat signatures.' : 'गलत-सकारात्मक रिपोर्ट की छंटनी को स्वचालित करता है। मशीन लर्निंग मॉडल मौसम के प्रवाह, आर्द्रता और थर्मल हस्ताक्षर का विश्लेषण करते हैं।',
      icon: Cpu,
      color: 'text-blue-600 bg-blue-50/50 border-blue-100/80 group-hover:bg-blue-100/50',
      hoverGlow: 'hover:shadow-[0_20px_40px_rgba(59,130,246,0.06)] hover:border-blue-300/40'
    },
    {
      title: language === 'EN' ? 'Government Integration' : 'सरकारी विभाग एकीकरण',
      desc: language === 'EN' ? 'Directly maps onto municipal work queues. Automates citations, dispatches inspection ward teams, and tracks resolution SLA logs in real-time.' : 'नगरपालिका कार्य प्रणालियों से सीधे एकीकृत। चालान उत्पन्न करता है, निरीक्षण टीमों को भेजता है, और समाधान एसएलए लॉग को ट्रैक करता है।',
      icon: Landmark,
      color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100/80 group-hover:bg-indigo-100/50',
      hoverGlow: 'hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] hover:border-indigo-300/40'
    }
  ];

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-[#F8FAFC] px-4 md:px-8 border-b border-slate-200/60 max-w-[1440px] mx-auto relative overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-indigo-200/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-60" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] bg-emerald-200/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-60" />

      <div className="space-y-16 relative z-10">
        
        {/* Headings */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-[34px] md:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
            {language === 'EN' ? 'Why AerioN?' : 'AerioN क्यों चुनें?'}
          </h2>
          <p className="text-[16.5px] text-slate-500 font-semibold leading-relaxed">
            {language === 'EN'
              ? 'A resilient environmental framework bridging citizens, intelligence, and authorities.'
              : 'नागरिकों, खुफिया प्रणालियों और स्थानीय निकायों को जोड़ने वाला एक मजबूत सुरक्षा ढांचा।'}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, index) => {
            const Icon = point.icon;

            return (
              <div 
                key={index} 
                className={`group bg-white/85 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 text-left space-y-6 hover:-translate-y-2 transition-all duration-300 cursor-pointer ${point.hoverGlow}`}
              >
                {/* Icon Badge */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${point.color}`}>
                  <Icon className="w-7 h-7 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-[21px] font-black text-slate-800 tracking-tight group-hover:text-slate-950 transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-[14.5px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-655 transition-colors">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
