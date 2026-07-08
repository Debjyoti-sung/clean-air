import React from 'react';
import { 
  Camera, 
  Eye, 
  CloudSun, 
  Orbit, 
  ShieldCheck, 
  Globe, 
  Users, 
  CheckCircle
} from 'lucide-react';

export default function AIWorkflow({ language }) {
  const steps = [
    {
      id: 1,
      title: language === 'EN' ? 'Citizen Upload' : 'नागरिक अपलोड',
      desc: language === 'EN' ? 'Photo & geolocation submitted.' : 'फोटो और जीपीएस स्थान दर्ज।',
      icon: Camera,
      color: 'text-blue-600 border-blue-200 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      stepNumColor: 'text-blue-655 bg-blue-50 border-blue-100'
    },
    {
      id: 2,
      title: language === 'EN' ? 'AI Vision' : 'एआई विजन',
      desc: language === 'EN' ? 'Vision identifies category.' : 'श्रेणी की पहचान की जाती है।',
      icon: Eye,
      color: 'text-purple-600 border-purple-205 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)]',
      stepNumColor: 'text-purple-655 bg-purple-50 border-purple-100'
    },
    {
      id: 3,
      title: language === 'EN' ? 'Weather' : 'मौसम एकीकरण',
      desc: language === 'EN' ? 'Integrates wind & direction.' : 'हवा और दिशा का एकीकरण।',
      icon: CloudSun,
      color: 'text-amber-600 border-amber-205 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      stepNumColor: 'text-amber-655 bg-amber-50 border-amber-100'
    },
    {
      id: 4,
      title: language === 'EN' ? 'Satellite' : 'उपग्रह मिलान',
      desc: language === 'EN' ? 'Cross-checked with INSAT.' : 'इनसैट डेटा से तुलना।',
      icon: Orbit,
      color: 'text-indigo-600 border-indigo-205 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.15)]',
      stepNumColor: 'text-indigo-655 bg-indigo-50 border-indigo-100'
    },
    {
      id: 5,
      title: language === 'EN' ? 'Confidence' : 'आत्मविश्वास स्तर',
      desc: language === 'EN' ? 'Scored for verification.' : 'सत्यापन स्कोर की गणना।',
      icon: ShieldCheck,
      color: 'text-rose-600 border-rose-205 hover:border-rose-500 hover:shadow-[0_0_15px_rgba(225,29,72,0.15)]',
      stepNumColor: 'text-rose-655 bg-rose-50 border-rose-100'
    },
    {
      id: 6,
      title: language === 'EN' ? 'Published' : 'प्रकाशित हॉटस्पॉट',
      desc: language === 'EN' ? 'Hotspot mapped on portal.' : 'नक्शे पर हॉटस्पॉट शामिल।',
      icon: Globe,
      color: 'text-cyan-600 border-cyan-205 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      stepNumColor: 'text-cyan-655 bg-cyan-50 border-cyan-100'
    },
    {
      id: 7,
      title: language === 'EN' ? 'Assignment' : 'विभाग आवंटन',
      desc: language === 'EN' ? 'Dispatched to ward officer.' : 'वार्ड अधिकारी को निर्देशित।',
      icon: Users,
      color: 'text-slate-600 border-slate-300 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(71,85,105,0.15)]',
      stepNumColor: 'text-slate-655 bg-slate-100 border-slate-200'
    },
    {
      id: 8,
      title: language === 'EN' ? 'Resolved' : 'समस्या का निवारण',
      desc: language === 'EN' ? 'Municipal team closes log.' : 'वार्ड टीम द्वारा लॉग बंद।',
      icon: CheckCircle,
      color: 'text-emerald-600 border-emerald-205 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      stepNumColor: 'text-emerald-655 bg-emerald-50 border-emerald-100'
    }
  ];

  return (
    <section className="w-full py-16 bg-[#F8FAFC] px-4 md:px-8 border-b border-slate-200 max-w-[1440px] mx-auto overflow-hidden">
      <div className="space-y-12">
        {/* Headings */}
        <div className="text-left">
          <h2 className="text-[32px] md:text-[36px] font-bold text-slate-900 tracking-tight">
            {language === 'EN' ? 'AI End-to-End Workflow' : 'एआई वर्कफ़्लो'}
          </h2>
          <p className="text-[16px] text-slate-500 mt-1 font-medium">
            {language === 'EN' 
              ? 'Telemetry flow tracing the full resolution lifecycle of a pollution incident.' 
              : 'प्रदूषण की घटना के समाधान जीवन चक्र की लाइव प्रगति।'}
          </p>
        </div>

        {/* Responsive Ingest Steps Timeline */}
        <div className="w-full relative">
          
          {/* Horizontal Layout for Desktop (lg and up) */}
          <div className="hidden lg:flex items-start justify-between w-full relative z-10 py-6">
            
            {/* Connecting Continuous Line behind bubbles */}
            <div className="absolute top-[52px] left-[6%] right-[6%] h-[3px] bg-gradient-to-r from-blue-400 via-purple-400 via-indigo-400 via-rose-400 to-emerald-400 rounded-full opacity-40 z-0" />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center text-center space-y-4 flex-1 relative px-2 z-10">
                  {/* Step Bubble with Badge */}
                  <div className="relative">
                    <div 
                      className={`w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 shadow-sm transition-all duration-300 hover:scale-110 cursor-pointer ${step.color}`}
                      title={step.title}
                    >
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    
                    {/* Step Number Badge */}
                    <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border border-slate-200/60 shadow-sm ${step.stepNumColor}`}>
                      0{step.id}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[15px] font-bold text-slate-900 tracking-tight">
                      {step.title}
                    </h4>
                    <p className="text-[11.5px] text-slate-500 max-w-[125px] mx-auto leading-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical Layout for Mobile/Tablet (less than lg) */}
          <div className="flex lg:hidden flex-col items-stretch space-y-5 max-w-md mx-auto relative px-4 z-10">
            {/* Connecting Vertical Line behind bubbles */}
            <div className="absolute top-4 bottom-4 left-[38px] w-[3px] bg-gradient-to-b from-blue-400 via-purple-400 via-indigo-400 via-rose-400 to-emerald-400 rounded-full opacity-40 z-0" />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative z-10 flex items-center space-x-5 bg-white/80 backdrop-blur-xl p-4.5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)] transition-all duration-300">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-black border border-slate-200/60 shadow-sm ${step.stepNumColor}`}>
                      0{step.id}
                    </span>
                  </div>
                  <div className="text-left space-y-0.5">
                    <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">{step.title}</h4>
                    <p className="text-[12.5px] text-slate-500 leading-normal">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
