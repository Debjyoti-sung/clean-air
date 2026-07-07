import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function CallToAction({ onReportClick, onToastAdd, language }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    onToastAdd(
      language === 'EN' ? 'Newsletter Subscription Active!' : 'समाचार पत्र की सदस्यता सक्रिय!',
      language === 'EN' ? `We will send air quality advisories to ${email}` : `हम ${email} पर वायु गुणवत्ता सलाह भेजेंगे`
    );
    setEmail('');
  };

  return (
    <section className="w-full py-20 bg-white px-4 md:px-8 border-b border-slate-200">
      <div className="bg-[#f1f5f9] rounded-[2.5rem] shadow-[12px_12px_24px_#cbd5e1] p-10 md:p-14 text-slate-800 relative text-center max-w-5xl mx-auto">
        
        <div className="relative z-10 space-y-7 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] px-4 py-1.5 rounded-full text-[12px] font-extrabold tracking-widest uppercase text-emerald-700">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{language === 'EN' ? 'National Citizen Mission' : 'राष्ट्रीय नागरिक मिशन'}</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
            {language === 'EN' ? 'Join the Mission for Cleaner Cities' : 'स्वच्छ शहरों के मिशन में शामिल हों'}
          </h2>
          <p className="text-[15px] md:text-[17px] text-slate-500 leading-relaxed font-bold px-4">
            Receive hyperlocal air quality advisories, high-emission alerts, and community response notifications directly in your inbox.
          </p>

          {/* Newsletter Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto pt-4">
            <div className="relative w-full">
              <Mail className="w-5 h-5 text-emerald-600 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'EN' ? 'Enter municipal email address' : 'अपना ईमेल पता दर्ज करें'}
                className="w-full bg-[#f1f5f9] shadow-[inset_6px_6px_12px_#cbd5e1] focus:shadow-[inset_4px_4px_8px_#cbd5e1] focus:outline-none placeholder-slate-400 font-bold text-[15px] text-slate-700 rounded-2xl pl-12 pr-5 py-4 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1] active:shadow-[inset_4px_4px_8px_#cbd5e1] text-emerald-700 font-extrabold text-[15px] px-8 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>{language === 'EN' ? 'Subscribe' : 'सदस्यता लें'}</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8 max-w-lg mx-auto">
            <button
              onClick={onReportClick}
              className="text-[15px] font-extrabold text-amber-700 bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1] active:shadow-[inset_4px_4px_8px_#cbd5e1] px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center space-x-2.5 w-full sm:w-auto"
            >
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>{language === 'EN' ? 'Report Violation' : 'उल्लंघन की रिपोर्ट करें'}</span>
            </button>
            <a
              href="#map-page"
              className="text-[15px] font-extrabold text-slate-700 bg-[#f1f5f9] shadow-[6px_6px_12px_#cbd5e1] active:shadow-[inset_4px_4px_8px_#cbd5e1] px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center space-x-2 w-full sm:w-auto group"
            >
              <span>{language === 'EN' ? 'Explore Telemetry' : 'टेलीमेट्री देखें'}</span>
              <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
