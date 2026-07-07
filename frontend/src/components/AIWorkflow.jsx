import React from 'react';
import { 
  Camera, 
  Eye, 
  CloudSun, 
  Orbit, 
  ShieldCheck, 
  Globe, 
  Users, 
  CheckCircle,
  ArrowRight,
  ArrowDown
} from 'lucide-react';

export default function AIWorkflow({ language }) {
  const steps = [
    {
      id: 1,
      title: language === 'EN' ? 'Citizen Upload' : 'नागरिक अपलोड',
      desc: language === 'EN' ? 'Photo & geolocation submitted.' : 'फोटो और जीपीएस स्थान दर्ज।',
      icon: Camera,
      color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-400'
    },
    {
      id: 2,
      title: language === 'EN' ? 'AI Vision' : 'एआई विजन',
      desc: language === 'EN' ? 'Vision identifies category.' : 'श्रेणी की पहचान की जाती है।',
      icon: Eye,
      color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-400'
    },
    {
      id: 3,
      title: language === 'EN' ? 'Weather' : 'मौसम एकीकरण',
      desc: language === 'EN' ? 'Integrates wind & direction.' : 'हवा और दिशा का एकीकरण।',
      icon: CloudSun,
      color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-400'
    },
    {
      id: 4,
      title: language === 'EN' ? 'Satellite' : 'उपग्रह मिलान',
      desc: language === 'EN' ? 'Cross-checked with INSAT.' : 'इनसैट डेटा से तुलना।',
      icon: Orbit,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-400'
    },
    {
      id: 5,
      title: language === 'EN' ? 'Confidence' : 'आत्मविश्वास स्तर',
      desc: language === 'EN' ? 'Scored for verification.' : 'सत्यापन स्कोर की गणना।',
      icon: ShieldCheck,
      color: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-400'
    },
    {
      id: 6,
      title: language === 'EN' ? 'Published' : 'प्रकाशित हॉटस्पॉट',
      desc: language === 'EN' ? 'Hotspot mapped on portal.' : 'नक्शे पर हॉटस्पॉट शामिल।',
      icon: Globe,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:border-cyan-400'
    },
    {
      id: 7,
      title: language === 'EN' ? 'Assignment' : 'विभाग आवंटन',
      desc: language === 'EN' ? 'Dispatched to ward officer.' : 'वार्ड अधिकारी को निर्देशित।',
      icon: Users,
      color: 'bg-slate-50 text-slate-600 border-slate-250 hover:border-slate-400'
    },
    {
      id: 8,
      title: language === 'EN' ? 'Resolved' : 'समस्या का निवारण',
      desc: language === 'EN' ? 'Municipal team closes log.' : 'वार्ड टीम द्वारा लॉग बंद।',
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-400'
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
        <div className="w-full">
          {/* Horizontal Layout for Desktop (lg and up) */}
          <div className="hidden lg:flex items-center justify-between w-full relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step bubble */}
                  <div className="flex flex-col items-center text-center space-y-3 flex-1 relative px-2">
                    <div 
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-200 cursor-pointer ${step.color}`}
                      title={step.title}
                    >
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[15px] font-bold text-slate-900 tracking-tight">
                        {step.title}
                      </h4>
                      <p className="text-[11.5px] text-slate-500 max-w-[120px] mx-auto leading-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {!isLast && (
                    <div className="flex items-center justify-center shrink-0 w-8">
                      <ArrowRight className="w-5 h-5 text-slate-300 animate-pulse stroke-[2.5]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Vertical Layout for Mobile/Tablet (less than lg) */}
          <div className="flex lg:hidden flex-col items-center space-y-4 max-w-sm mx-auto">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  <div className="w-full flex items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <span className="text-[12px] font-extrabold uppercase text-slate-400 tracking-wider">Step {step.id}</span>
                      <h4 className="text-[15px] font-bold text-slate-900">{step.title}</h4>
                      <p className="text-[12px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>

                  {!isLast && (
                    <ArrowDown className="w-5 h-5 text-slate-300 animate-pulse my-1 stroke-[2.5]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
