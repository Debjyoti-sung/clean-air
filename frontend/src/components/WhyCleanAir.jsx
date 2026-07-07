import React from 'react';
import { Focus, Cpu, Landmark } from 'lucide-react';

export default function WhyCleanAir({ language }) {
  const points = [
    {
      title: language === 'EN' ? 'Hyperlocal Detection' : 'हाइपरलोकल ट्रैकिंग',
      desc: language === 'EN' ? 'Goes beyond regional AQI. Tracks specific streets and coordinates using a hybrid network of low-cost IoT monitors and crowdsourced imaging.' : 'क्षेत्रीय एक्यूआई से परे। कम लागत वाले आईओटी मॉनिटर और क्राउडसोर्स इमेजिंग के हाइब्रिड नेटवर्क का उपयोग करके विशिष्ट सड़कों और स्थानों को ट्रैक करता है।',
      icon: Focus,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      title: language === 'EN' ? 'AI-Powered Decisions' : 'एआई-संचालित निर्णय',
      desc: language === 'EN' ? 'Automates false-positive filtering. Machine learning models cross-analyze weather trajectories, humidity indices, and satellite heat signatures.' : 'गलत-सकारात्मक रिपोर्ट की छंटनी को स्वचालित करता है। मशीन लर्निंग मॉडल मौसम के प्रवाह, आर्द्रता और थर्मल हस्ताक्षर का विश्लेषण करते हैं।',
      icon: Cpu,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      title: language === 'EN' ? 'Government Integration' : 'सरकारी विभाग एकीकरण',
      desc: language === 'EN' ? 'Directly maps onto municipal work queues. Automates citations, dispatches inspection ward teams, and tracks resolution SLA logs in real-time.' : 'नगरपालिका कार्य प्रणालियों से सीधे एकीकृत। चालान उत्पन्न करता है, निरीक्षण टीमों को भेजता है, और समाधान एसएलए लॉग को ट्रैक करता है।',
      icon: Landmark,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    }
  ];

  return (
    <section className="w-full py-16 bg-white px-4 md:px-8 border-b border-slate-200 max-w-[1440px] mx-auto">
      <div className="space-y-12">
        
        {/* Headings */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-[32px] md:text-[36px] font-bold text-slate-900 tracking-tight">
            {language === 'EN' ? 'Why CleanAir?' : 'CleanAir क्यों चुनें?'}
          </h2>
          <p className="text-[16px] text-slate-500 font-medium">
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
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left space-y-4 hover:-translate-y-0.5 transition-transform"
              >
                {/* Icon Badge */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${point.color}`}>
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>

                <div className="space-y-2 font-medium">
                  <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">
                    {point.title}
                  </h3>
                  <p className="text-[14.5px] text-slate-600 leading-relaxed">
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
