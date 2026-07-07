import React from 'react';

export default function Footer({ language }) {
  return (
    <footer className="w-full bg-[#0B1E36] text-slate-300 text-[14px] pt-12 pb-6 px-4 md:px-8 border-t-4 border-[#15803D] max-w-[1440px] mx-auto text-left">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: Platform */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-[15px] border-l-2 border-[#15803D] pl-2 uppercase tracking-wider">
            {language === 'EN' ? 'Platform Modules' : 'प्लेटफ़ॉर्म मॉड्यूल'}
          </h4>
          <ul className="space-y-2.5 font-medium text-[13px]">
            <li><a href="#home" className="hover:text-white transition">Home Dashboard</a></li>
            <li><a href="#map" className="hover:text-white transition">Live Pollution Map</a></li>
            <li><a href="#prediction" className="hover:text-white transition">AQI Prediction models</a></li>
            <li><a href="#analytics" className="hover:text-white transition">Analytics & Reports</a></li>
          </ul>
        </div>

        {/* Col 2: Citizen */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-[15px] border-l-2 border-[#15803D] pl-2 uppercase tracking-wider">
            {language === 'EN' ? 'Citizen Services' : 'नागरिक सेवाएं'}
          </h4>
          <ul className="space-y-2.5 font-medium text-[13px]">
            <li><a href="#alerts" className="hover:text-white transition">Report Violations</a></li>
            <li><a href="#alerts" className="hover:text-white transition">Live Warning Feed</a></li>
            <li><a href="#faq" className="hover:text-white transition">Citizen Grievance FAQs</a></li>
            <li><a href="#about" className="hover:text-white transition">Municipal SLA Metrics</a></li>
          </ul>
        </div>

        {/* Col 3: Resources */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-[15px] border-l-2 border-[#15803D] pl-2 uppercase tracking-wider">
            {language === 'EN' ? 'Developer & API' : 'डेवलपर और एपीआई'}
          </h4>
          <ul className="space-y-2.5 font-medium text-[13px]">
            <li><a href="#api" className="hover:text-white transition">CleanAir Open API</a></li>
            <li><a href="#docs" className="hover:text-white transition">Sensor Integration Docs</a></li>
            <li><a href="#research" className="hover:text-white transition">Environmental Research Data</a></li>
            <li><a href="#source" className="hover:text-white transition">Source Code Repository</a></li>
          </ul>
        </div>

        {/* Col 4: Support */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-[15px] border-l-2 border-[#15803D] pl-2 uppercase tracking-wider">
            {language === 'EN' ? 'Compliance & Contact' : 'अनुपालन और संपर्क'}
          </h4>
          <ul className="space-y-2.5 font-medium text-[13px]">
            <li><a href="#contact" className="hover:text-white transition">Contact Ward Officers</a></li>
            <li><a href="#privacy" className="hover:text-white transition">Data Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-white transition">Terms of Service</a></li>
            <li><a href="#disclaimer" className="hover:text-white transition">Official Disclaimer</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright and Credits */}
      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[12px] text-slate-400 gap-4 md:gap-0 font-medium">
        <div className="flex items-center space-x-2 text-center md:text-left flex-wrap justify-center">
          <span>&copy; {new Date().getFullYear()} CleanAir Environmental Monitoring System. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-3 text-[12px]">
          <span className="text-slate-300">Developed by <strong>Team Vega</strong></span>
          <span>|</span>
          <span className="text-emerald-500 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
            Google Solution Challenge 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
