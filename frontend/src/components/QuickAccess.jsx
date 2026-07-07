import React from 'react';
import {
  Map,
  LayoutDashboard,
  Flame,
  ClipboardList,
  TrendingUp,
  Building2,
  BarChart3,
  KeyRound,
  ArrowRight
} from 'lucide-react';

export default function QuickAccess({ onReportClick, language }) {

  const services = [
    {
      title: language === 'EN' ? 'Live Pollution Map' : 'लाइव प्रदूषण नक्शा',
      description: language === 'EN' ? 'Track real-time localized particulate spikes and AQI readings on a digital map.' : 'डिजिटल मानचित्र पर वास्तविक समय में स्थानीयकृत पार्टिकुलेट स्पाइक्स और एक्यूआई रीडिंग को ट्रैक करें।',
      icon: Map,
      link: '#map',
      color: 'text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100/50',
      hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] group-hover:border-blue-300/50'
    },
    {
      title: language === 'EN' ? 'Home Dashboard' : 'होम डैशबोर्ड',
      description: language === 'EN' ? 'Overview of current air quality metrics, national alerts, and active services.' : 'वर्तमान वायु गुणवत्ता मेट्रिक्स, राष्ट्रीय अलर्ट और सक्रिय सेवाओं का अवलोकन।',
      icon: LayoutDashboard,
      link: '#home',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100/50',
      hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] group-hover:border-emerald-300/50'
    },
    {
      title: language === 'EN' ? 'Hotspot Details' : 'हॉटस्पॉट विवरण',
      description: language === 'EN' ? 'Inspect individual active pollution locations, local causes, and dispatch logs.' : 'अलग-अलग सक्रिय प्रदूषण स्थानों, स्थानीय कारणों और डिस्पैच लॉग का निरीक्षण करें।',
      icon: Flame,
      link: '#alerts',
      color: 'text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-100/50',
      hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(147,51,234,0.25)] group-hover:border-purple-300/50'
    },
    {
      title: language === 'EN' ? 'Citizen Reporting' : 'नागरिक रिपोर्टिंग',
      description: language === 'EN' ? 'Upload photos of open burning, dust violations, or smoke plumes for AI evaluation.' : 'एआई मूल्यांकन के लिए खुले में कचरा जलाने, धूल या धुएं के उल्लंघन की तस्वीरें अपलोड करें।',
      icon: ClipboardList,
      action: 'report',
      color: 'text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-100/50',
      hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group-hover:border-amber-300/50'
    },
    {
      title: language === 'EN' ? 'AQI Prediction' : 'एक्यूआई पूर्वानुमान',
      description: language === 'EN' ? 'View 24-hour predictive trends generated using neural meteorological models.' : 'मौसम संबंधी तंत्रिका मॉडल का उपयोग करके उत्पन्न 24 घंटे के पूर्वानुमानित रुझान देखें।',
      icon: TrendingUp,
      link: '#prediction',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100/50',
      hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(79,70,229,0.25)] group-hover:border-indigo-300/50'
    },
    {
      title: language === 'EN' ? 'Municipal Dashboard' : 'नगरपालिका डैशबोर्ड',
      description: language === 'EN' ? 'Management interface for municipal officers allocating field verification teams.' : 'फील्ड सत्यापन टीमों को आवंटित करने वाले नगरपालिका अधिकारियों के लिए प्रबंधन इंटरफ़ेस।',
      icon: Building2,
      link: '#about',
      color: 'text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-100/50',
      hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(225,29,72,0.25)] group-hover:border-rose-300/50'
    },
    {
      title: language === 'EN' ? 'Analytics Dashboard' : 'एनालिटिक्स डैशबोर्ड',
      description: language === 'EN' ? 'Deeper query models, historical filters, regional performance, and audits.' : 'गहरे क्वेरी मॉडल, ऐतिहासिक फिल्टर, क्षेत्रीय प्रदर्शन और ऑडिट।',
      icon: BarChart3,
      link: '#analytics',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-100/50',
      hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(8,145,178,0.25)] group-hover:border-cyan-300/50'
    },
  ];

  return (
    <section className="relative w-full py-24 bg-[#F8FAFC] overflow-hidden border-b border-slate-200/60 px-4 md:px-8">
      {/* Abstract Background Elements for Premium Feel */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-70" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[150px] pointer-events-none mix-blend-multiply opacity-70" />
      
      <div className="relative max-w-[1440px] mx-auto z-10 text-left">
        {/* Section Heading */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 relative z-10">
            <h2 className="text-[34px] md:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
              {language === 'EN' ? 'Quick Access Services' : 'त्वरित पहुंच सेवाएं'}
            </h2>
            <p className="text-[16.5px] text-slate-500 font-semibold max-w-2xl leading-relaxed">
              {language === 'EN' ? 'Navigate to CleanAir modules instantly with our optimized digital infrastructure.' : 'हमारे अनुकूलित डिजिटल बुनियादी ढांचे के साथ तुरंत क्लीनएयर मॉड्यूल पर नेविगेट करें।'}
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-2.5 text-[14px] font-bold text-slate-600 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
             <LayoutDashboard className="w-4 h-4 text-emerald-600" />
             <span>{language === 'EN' ? 'System Directory' : 'सिस्टम निर्देशिका'}</span>
          </div>
        </div>

        {/* 7-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 relative z-10">
          {services.map((item, idx) => {
            const Icon = item.icon;
            const handleClick = (e) => {
              if (item.action === 'report') {
                e.preventDefault();
                onReportClick();
              }
            };

            return (
              <a
                key={idx}
                href={item.link || '#'}
                onClick={item.action === 'report' ? handleClick : undefined}
                className="group relative overflow-hidden flex flex-col justify-between p-7 bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full"
              >
                {/* Decorative Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="space-y-5 relative z-10">
                  {/* Icon Badge */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${item.color} ${item.hoverGlow}`}>
                    <Icon className="w-7 h-7 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-2.5">
                    <h3 className="text-[20px] font-extrabold text-slate-800 tracking-tight group-hover:text-slate-950 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[14.5px] text-slate-500 font-medium leading-relaxed line-clamp-3 group-hover:text-slate-600 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Action Indicator */}
                <div className="relative z-10 flex items-center justify-between mt-8 pt-5 border-t border-slate-100 group-hover:border-slate-200 transition-colors">
                  <span className="text-[13px] font-black text-slate-400 group-hover:text-slate-700 transition-colors uppercase tracking-widest">
                    {language === 'EN' ? 'Explore' : 'अन्वेषण करें'}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-slate-900 flex items-center justify-center transition-colors duration-300 shadow-sm">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
