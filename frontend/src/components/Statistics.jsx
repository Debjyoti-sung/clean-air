import React, { useState, useEffect } from 'react';
import { ClipboardList, Flame, BarChart3, Users } from 'lucide-react';

function AnimatedNumber({ value, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Statistics({ language }) {
  const stats = [
    {
      label: language === 'EN' ? 'Reports Submitted' : 'प्रस्तुत रिपोर्ट',
      target: 12480,
      suffix: '+',
      desc: language === 'EN' ? 'Verified citizen submissions.' : 'सत्यापित नागरिक प्रस्तुतियां।',
      icon: ClipboardList,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      label: language === 'EN' ? 'Hotspots Detected' : 'हॉटस्पॉट जांच',
      target: 843,
      suffix: '',
      desc: language === 'EN' ? 'Resolved pollution sources.' : 'सुलझाए गए प्रदूषण स्रोत।',
      icon: Flame,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      label: language === 'EN' ? 'Prediction Accuracy' : 'पूर्वानुमान सटीकता',
      target: 91,
      suffix: '%',
      desc: language === 'EN' ? 'AI meteorological match.' : 'एआई मौसम संबंधी मिलान सटीकता।',
      icon: BarChart3,
      color: 'text-[#15803D] bg-emerald-50 border-emerald-100'
    },
    {
      label: language === 'EN' ? 'Teams Deployed' : 'तैनात टीमें',
      target: 128,
      suffix: '',
      desc: language === 'EN' ? 'Active field inspection units.' : 'सक्रिय फील्ड निरीक्षण इकाइयां।',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    }
  ];

  return (
    <section className="w-full py-16 bg-[#F8FAFC] px-4 md:px-8 border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto text-left">
        {/* Section Heading */}
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-[32px] md:text-[36px] font-bold text-slate-900 tracking-tight">
            {language === 'EN' ? 'National Impact Metrics' : 'राष्ट्रीय प्रभाव मेट्रिक्स'}
          </h2>
          <p className="text-[16px] text-slate-500 mt-1 font-medium">
            {language === 'EN' 
              ? 'Telemetry analytics reflecting platform operations across active municipalities.' 
              : 'सक्रिय नगरपालिकाओं में प्लेटफ़ॉर्म संचालन को दर्शाने वाले टेलीमेट्री विश्लेषण।'}
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between text-left space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    <AnimatedNumber value={item.target} suffix={item.suffix} />
                  </div>
                  <p className="text-[13px] text-slate-400 font-medium leading-normal">
                    {item.desc}
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
