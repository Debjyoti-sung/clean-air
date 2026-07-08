import React from 'react';
import {
  Camera,
  CloudSun,
  Orbit,
  CalendarClock,
  BellRing,
  ListTodo,
  Smartphone,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function PlatformOverview({ language }) {
  const features = [
    {
      title: language === 'EN' ? 'AI Image Detection' : 'एआई छवि जांच',
      description: language === 'EN' ? 'Instantly categorizes smoke plumes, garbage burning, and road dust using vision models.' : 'विजन मॉडल का उपयोग करके तुरंत कचरा जलाने, निर्माण धूल और धुएं के गुबार को वर्गीकृत करता है।',
      icon: Camera,
    },
    {
      title: language === 'EN' ? 'Weather Fusion' : 'मौसम एकीकरण',
      description: language === 'EN' ? 'Integrates localized wind vectoring, relative humidity, and solar index data.' : 'स्थानीयकृत हवा के प्रवाह, सापेक्ष आर्द्रता और सौर सूचकांक डेटा को एकीकृत करता है।',
      icon: CloudSun,
    },
    {
      title: language === 'EN' ? 'Satellite Validation' : 'उपग्रह सत्यापन',
      description: language === 'EN' ? 'Cross-references citizen uploads against Sentinel and INSAT thermal bands.' : 'प्रदूषण रिपोर्ट को सेंटिनल और इनसैट थर्मल बैंड के साथ क्रॉस-सत्यापित करता है।',
      icon: Orbit,
    },
    {
      title: language === 'EN' ? 'Live Forecast' : 'लाइव पूर्वानुमान',
      description: language === 'EN' ? 'Calculates upcoming pollution movements using historical and atmospheric inputs.' : 'ऐतिहासिक और वायुमंडलीय इनपुट का उपयोग करके आगामी प्रदूषण गतिविधियों की गणना करता है।',
      icon: CalendarClock,
    },
    {
      title: language === 'EN' ? 'Real-time Notifications' : 'त्वरित सूचनाएं',
      description: language === 'EN' ? 'Notifies citizens and nearby facilities when safe particulate levels are breached.' : 'सुरक्षित पार्टिकुलेट स्तर का उल्लंघन होने पर नागरिकों और आसपास के क्षेत्रों को सूचित करता है।',
      icon: BellRing,
    },
    {
      title: language === 'EN' ? 'Municipal Task Queue' : 'नगरपालिका कार्य कतार',
      description: language === 'EN' ? 'Autogenerates action orders and triggers field inspections for local ward officers.' : 'कार्य आदेश स्वचालित रूप से उत्पन्न करता है और वार्ड अधिकारियों के लिए निरीक्षण ट्रिगर करता।',
      icon: ListTodo,
    }
  ];

  return (
    <section id="about" className="relative w-full py-24 bg-white overflow-hidden border-b border-slate-200">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/50 to-emerald-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-50/50 to-rose-50/50 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />
      
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
  
          {/* Left Side: Pipeline Workflow Illustration */}
          <div className="lg:col-span-5 relative group order-2 lg:order-1 mt-10 lg:mt-0">
            {/* Glassmorphism Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/40 to-blue-200/40 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] h-full min-h-[500px] flex flex-col justify-center transform transition-transform duration-500 hover:scale-[1.01]">
              
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-[13px] font-black uppercase tracking-widest text-emerald-700 flex items-center space-x-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span>AI Pipeline Active</span>
                </h3>
                <div className="px-3.5 py-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm flex items-center space-x-1.5">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span>Live Telemetry</span>
                </div>
              </div>
  
              {/* Interactive Ingestion Blocks */}
              <div className="flex flex-col space-y-6 relative">
                {/* Glowing animated line connecting nodes */}
                <div className="absolute left-[1.65rem] top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full opacity-30 z-0"></div>
                <div className="absolute left-[1.65rem] top-8 bottom-8 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-emerald-400 rounded-full z-0 animate-pulse"></div>
  
                {/* Block 1: Citizen Ingestion */}
                <div className="flex items-start space-x-5 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md relative z-10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 group/block">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-inner group-hover/block:scale-110 group-hover/block:bg-blue-500 group-hover/block:text-white transition-all duration-300">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col space-y-1.5 pt-1">
                    <span className="text-[15.5px] font-extrabold text-slate-900">Citizen Ingestion</span>
                    <span className="text-[13px] text-slate-500 font-medium leading-relaxed">Image upload & metadata extracted via native app.</span>
                    <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded border border-blue-100/50 self-start mt-1">1.2s avg upload</span>
                  </div>
                </div>
  
                {/* Block 2: AI Computer Vision */}
                <div className="flex items-start space-x-5 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md relative z-10 transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 group/block">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 shadow-inner group-hover/block:scale-110 group-hover/block:bg-purple-500 group-hover/block:text-white transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-400/20 animate-pulse" />
                    <Cpu className="w-6 h-6 relative z-10" />
                  </div>
                  <div className="flex flex-col space-y-1.5 pt-1">
                    <span className="text-[15.5px] font-extrabold text-slate-900">AI Vision Engine</span>
                    <span className="text-[13px] text-slate-500 font-medium leading-relaxed">Violation classification & particulate boundary mapping.</span>
                    <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-100/50 self-start mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>94.8% Match</span>
                    </div>
                  </div>
                </div>
  
                {/* Block 3: Satellite Cross-verification */}
                <div className="flex items-start space-x-5 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md relative z-10 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 group/block">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner group-hover/block:scale-110 group-hover/block:bg-indigo-500 group-hover/block:text-white transition-all duration-300">
                    <Orbit className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col space-y-1.5 pt-1">
                    <span className="text-[15.5px] font-extrabold text-slate-900">Satellite Cross-verification</span>
                    <span className="text-[13px] text-slate-500 font-medium leading-relaxed">Compares localized telemetry with INSAT IR imagery.</span>
                    <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded border border-slate-200 self-start mt-1">
                      INSAT-3DR 10.8 µm Band Match
                    </span>
                  </div>
                </div>
  
                {/* Block 4: Municipal Work Request */}
                <div className="flex items-start space-x-5 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md relative z-10 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 group/block">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner group-hover/block:scale-110 group-hover/block:bg-emerald-500 group-hover/block:text-white transition-all duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col space-y-1.5 pt-1">
                    <span className="text-[15.5px] font-extrabold text-slate-900">Government Action Request</span>
                    <span className="text-[13px] text-slate-500 font-medium leading-relaxed">Dispatches report to ward officer's municipal queue.</span>
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-100/50 self-start mt-1">Automatic routing &lt; 0.8s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Right Side: Overview Copy & Feature Grid */}
          <div className="lg:col-span-7 flex flex-col space-y-10 text-left lg:pl-10 order-1 lg:order-2">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                <span>Platform Architecture</span>
              </div>
              <h2 className="text-[38px] md:text-[48px] font-black text-slate-900 leading-[1.15] tracking-tight">
                {language === 'EN' ? 'National Environmental Safeguard' : 'राष्ट्रीय पर्यावरण सुरक्षा'}
              </h2>
              <p className="text-[17px] text-slate-500 font-medium leading-relaxed max-w-2xl">
                AerioN is engineered as a robust, resilient digital backbone for municipalities, pollution control boards, and environmental researchers. By integrating crowdsourced alerts with advanced space-based monitoring, we remove systemic delays in identifying and resolving air violations.
              </p>
            </div>
  
            {/* Grid of 6 features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 pt-6 border-t border-slate-200/60">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="group flex items-start space-x-4 text-left rounded-2xl hover:bg-slate-50 transition-colors duration-300 p-2 -ml-2">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 shrink-0 group-hover:border-[#15803D] group-hover:text-[#15803D] group-hover:shadow transition-all duration-300 mt-0.5">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <h4 className="text-[17px] font-extrabold text-slate-900 tracking-tight group-hover:text-[#15803D] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  
        </div>
      </div>
    </section>
  );
}
