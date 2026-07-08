import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Map,
  AlertTriangle,
  Camera,
  Check,
  Bell,
  ChevronDown,
  ChevronUp,
  Activity,
  Loader2,
  FileImage,
  Flame,
  LayoutDashboard
} from 'lucide-react';

// Subcomponents import

import MainNavigation from './components/MainNavigation';
import HeroSection from './components/HeroSection';
import QuickAccess from './components/QuickAccess';
import LivePollution from './components/LivePollution';
import PlatformOverview from './components/PlatformOverview';
import AIWorkflow from './components/AIWorkflow';

import WhyCleanAir from './components/WhyCleanAir';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import LocationModal from './components/LocationModal';
import LiveMapPage from './components/LiveMapPage';
import PredictionPage from './components/PredictionPage';
import CitizenReporting from './components/CitizenReporting';
import MunicipalityDashboard from './components/Municipality/MunicipalityDashboard';
import AuthModal from './components/AuthModal';
import { SupabaseService, supabase } from './services/supabase.service';

export default function App() {
  // Global States
  const [textSize, setTextSize] = useState('base'); // sm, base, lg
  const [language, setLanguage] = useState('EN'); // EN, HI
  const [isDarkMode, setIsDarkMode] = useState(false); // High Contrast mode
  const [selectedLocation, setSelectedLocation] = useState(null); // { source, address, latitude, longitude, accuracy, lastUpdated }
  const [currentPage, setCurrentPage] = useState(() => {
    return sessionStorage.getItem('current_page') || 'landing';
  }); // 'landing' | 'live-map' | 'prediction' | 'citizen' | 'municipality'

  useEffect(() => {
    sessionStorage.setItem('current_page', currentPage);
  }, [currentPage]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');

  useEffect(() => {
    // Initial fetch of logged-in user from Supabase session
    SupabaseService.getUser().then(u => {
      if (u) setUser(u);
    });

    // Listen to auth state changes (handles Google OAuth redirect, sign in/out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
      setUser(null);
      addToast(
        language === 'EN' ? 'Signed Out' : 'लॉग आउट किया गया',
        language === 'EN' ? 'You have successfully signed out.' : 'आप सफलतापूर्वक लॉग आउट हो गए हैं।'
      );
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      setIsLocationLoading(true);
      const timer = setTimeout(() => {
        setIsLocationLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLocationLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    console.log("Current Page:", currentPage);
  }, [currentPage]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // UI Modal / Action States
  const [searchOpen, setSearchOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Citizen report states
  const [reportCategory, setReportCategory] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [reportFiles, setReportFiles] = useState(null);
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiMatchScore, setAiMatchScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Accordion State
  const [activeFaq, setActiveFaq] = useState(null);

  // Telemetry loading simulation state
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(true);

  // Trigger telemetry fetch simulation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTelemetryLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Toast handler
  const addToast = (title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Simulated AI Vision Model verification
  const handleAIEvaluation = () => {
    if (!reportCategory) {
      alert('Please select a violation category first.');
      return;
    }
    setIsEvaluatingAI(true);
    setAiMatchScore(null);

    setTimeout(() => {
      setIsEvaluatingAI(false);
      // Simulate verification score
      setAiMatchScore({
        confidence: Math.floor(Math.random() * 15) + 85, // 85% - 99%
        verification: 'Verified: High confidence plume signature matches construction dust/smoke boundaries.'
      });
      addToast(
        language === 'EN' ? 'AI Ingestion Matched!' : 'एआई जांच पूरी हुई!',
        language === 'EN' ? 'Violation verified via cloud vision bounds.' : 'क्लाउड विज़न सीमाओं के माध्यम से उल्लंघन सत्यापित किया गया।'
      );
    }, 1500);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportCategory || !reportLocation) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReportOpen(false);
      addToast(
        language === 'EN' ? 'Report Logged Successfully!' : 'रिपोर्ट सफलतापूर्वक दर्ज की गई!',
        language === 'EN'
          ? `Grievance registered under ID: CIT-${Math.floor(Math.random() * 9000) + 1000}. Municipal ward team notified.`
          : `शिकायत आईडी: CIT-${Math.floor(Math.random() * 9000) + 1000} के तहत पंजीकृत। वार्ड टीम को सूचित किया गया।`
      );
      // Reset form
      setReportCategory('');
      setReportLocation('');
      setReportFiles(null);
      setAiMatchScore(null);
    }, 1200);
  };

  // Search execution
  const searchItems = [
    { name: 'Live Map Telemetry', link: '#map' },
    { name: 'Predictive AQI Trends', link: '#prediction' },
    { name: 'Report Ambient Violation', action: 'report' },
    { name: 'Municipal Action SLA Logs', link: '#about' },
    { name: 'Open API & Sensors Integration', link: '#api' },
    { name: 'FAQ & Citizen Redressal', link: '#faq' }
  ];

  const filteredSearch = searchItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTextClass = () => {
    if (textSize === 'sm') return 'text-[15px]';
    if (textSize === 'lg') return 'text-[17px]';
    return 'text-[16px]';
  };

  // Dynamic High Contrast Style Object
  const highContrastStyles = isDarkMode
    ? "bg-slate-950 text-white border-slate-700 select-none shadow-amber-950"
    : "bg-[#F8FAFC] text-[#111827] border-[#E5E7EB]";

  const faqData = [
    {
      question: language === 'EN' ? 'How long does a municipal team take to respond to a critical alert?' : 'वार्ड अधिकारी गंभीर अलर्ट पर प्रतिक्रिया देने में कितना समय लेते हैं?',
      answer: language === 'EN'
        ? 'Under our official SLA (Service Level Agreement), critical category violations (AQI spikes above 300 or severe garbage burning) trigger automated ward assignments with a response mandate of under 2 hours. Teams deploy immediately for wet suppression or physical inspection.'
        : 'हमारे आधिकारिक एसएलए के तहत, गंभीर श्रेणी के उल्लंघनों के लिए प्रतिक्रिया अधिदेश 2 घंटे से कम है। भौतिक निरीक्षण या शमन के लिए टीमें तुरंत तैनात हो जाती हैं।'
    },
    {
      question: language === 'EN' ? 'How does the AI vision filter out duplicate or fake reports?' : 'एआई नकली या डुप्लिकेट रिपोर्ट को कैसे फ़िल्टर करता है?',
      answer: language === 'EN'
        ? 'CleanAir processes submissions using space-based temporal verification. When a citizen uploads an incident image, the system cross-references the coordinate grid against nearby active static sensors and weather vectors to confirm the particulate dispersion signature. Multiple uploads within 50 meters are automatically merged into a single ticket.'
        : 'क्राउडसोर्स रिपोर्ट को आसपास के सक्रिय भौतिक सेंसर और इनसैट उपग्रह डेटा के साथ मिलाया जाता है। एक ही स्थान से कई रिपोर्टों को स्वचालित रूप से एक टिकट में विलय कर दिया जाता है।'
    },
    {
      question: language === 'EN' ? 'Can citizens track the resolution progress of their reports?' : 'क्या नागरिक अपनी शिकायतों के निवारण की स्थिति की जांच कर सकते हैं?',
      answer: language === 'EN'
        ? 'Yes. Upon submitting a photo, you are issued an encrypted ticket ID (e.g. CIT-4890). You can query this ticket directly inside the Municipal Dashboard or citizen portal to inspect verification scores, dispatcher logs, ward inspection updates, and final closure proofs uploaded by field officials.'
        : 'हां। फोटो जमा करने पर एक टिकट आईडी प्रदान की जाती है। आप नगरपालिका पोर्टल पर इसकी लाइव प्रगति और फील्ड अधिकारियों द्वारा अपलोड किए गए बंद होने के सबूत की जांच कर सकते हैं।'
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-900'} ${getTextClass()}`}>



      {/* 2. MAIN NAVIGATION */}
      {currentPage !== 'municipality' && (
        <MainNavigation
          onSearchClick={() => setSearchOpen(true)}
          onReportClick={() => setReportOpen(true)}
          language={language}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          onLoginClick={() => { setAuthModalMode('signin'); setAuthModalOpen(true); }}
          onRegisterClick={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
          onLogoutClick={handleLogout}
        />
      )}

      {/* Page Routing */}
      {currentPage === 'landing' ? (
        <>
          {/* Skeleton loader simulation for satellite telemetry on initial load */}
          {isTelemetryLoading ? (
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 flex flex-col space-y-6 animate-pulse select-none bg-white border-b border-slate-200">
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="h-16 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-10 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-12 bg-slate-200 rounded w-1/3"></div>
                </div>
                <div className="h-[360px] bg-slate-200 rounded-2xl"></div>
              </div>
            </div>
          ) : (
            /* 3. HERO SECTION */
            <HeroSection
              onReportClick={() => setCurrentPage('citizen')}
              language={language}
              setCurrentPage={setCurrentPage}
              selectedLocation={selectedLocation}
              isLocationLoading={isLocationLoading}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
            />
          )}

          {/* 4. QUICK ACCESS SERVICES */}
          <QuickAccess
            onReportClick={() => setCurrentPage('citizen')}
            language={language}
          />

          {/* 5. LIVE POLLUTION STATUS */}
          <LivePollution
            language={language}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            isLocationLoading={isLocationLoading}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />

          {/* 6. PLATFORM OVERVIEW */}
          <PlatformOverview
            language={language}
          />

          {/* 7. AI WORKFLOW TIMELINE */}
          <AIWorkflow
            language={language}
          />



          {/* 10. WHY CLEANAIR */}
          <WhyCleanAir
            language={language}
          />

          {/* Grievance FAQs Accordion Section */}
          <section id="faq" className="w-full py-16 bg-white px-4 md:px-8 border-b border-slate-200 max-w-[1440px] mx-auto">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">Citizen Grievance Redressal</h2>
                <p className="text-[16px] text-slate-500 font-medium">How the CleanAir portal connects public alerts with local authorities.</p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-200">
                {faqData.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div key={index} className="bg-white">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full py-4 px-6 flex justify-between items-center hover:bg-slate-50 transition-colors text-left font-semibold text-slate-800 text-[16px]"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-[#15803D]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-[14.5px] text-slate-600 leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 11. CALL TO ACTION */}
          <CallToAction
            onReportClick={() => setCurrentPage('citizen')}
            onToastAdd={addToast}
            language={language}
          />
        </>
      ) : currentPage === 'live-map' ? (
        <LiveMapPage
          language={language}
          selectedLocation={selectedLocation}
          isLocationLoading={isLocationLoading}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onLocationChange={(loc) => setSelectedLocation(loc)}
          onBack={() => setCurrentPage('landing')}
        />
      ) : currentPage === 'citizen' ? (
        <CitizenReporting
          language={language}
          setSelectedLocation={setSelectedLocation}
          onBack={() => setCurrentPage('landing')}
          user={user}
          onUserChange={setUser}
        />
      ) : currentPage === 'municipality' ? (
        <MunicipalityDashboard
          language={language}
          onBack={() => setCurrentPage('landing')}
          user={user}
        />
      ) : (
        <PredictionPage
          language={language}
          selectedLocation={selectedLocation}
          isLocationLoading={isLocationLoading}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onBack={() => setCurrentPage('landing')}
        />
      )}

      {/* 12. FOOTER */}
      {currentPage !== 'municipality' && (
        <Footer
          language={language}
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-2 select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#0B1E36] text-white px-4 py-3.5 rounded-xl border border-slate-700 shadow-2xl flex items-center space-x-3 w-80 animate-slideIn text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex-1 space-y-0.5 font-medium">
              <h5 className="text-[13px] font-bold text-slate-100 leading-tight">{toast.title}</h5>
              <p className="text-[11.5px] text-slate-300 leading-snug">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search Overlay / Command Palette Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn text-left">
            <div className="p-4 border-b border-slate-150 flex items-center space-x-3 bg-[#F8FAFC]">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search services, portals, and telemetry data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[15px] text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded bg-slate-100 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-[300px] overflow-y-auto">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider px-3 pb-2 block">
                Command Results
              </span>

              {filteredSearch.length > 0 ? (
                <div className="space-y-1">
                  {filteredSearch.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link || '#'}
                      onClick={(e) => {
                        if (item.action === 'report') {
                          e.preventDefault();
                          setSearchOpen(false);
                          setReportOpen(true);
                        } else {
                          setSearchOpen(false);
                        }
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition text-[13.5px] font-medium text-slate-700 hover:text-[#15803D]"
                    >
                      <span>{item.name}</span>
                      <span className="text-[10.5px] text-slate-400 border border-slate-200 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase">
                        {item.action === 'report' ? 'Action' : 'Navigate'}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-[13.5px] text-slate-400 font-medium">
                  No matching services or documents found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Citizen Report Pollution Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-250 shadow-2xl overflow-hidden animate-scaleIn text-left flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="bg-[#15803D] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <span className="font-bold text-[15px]">Citizen Ingest - Report Violation</span>
              </div>
              <button
                onClick={() => {
                  setReportOpen(false);
                  setReportCategory('');
                  setReportLocation('');
                  setReportFiles(null);
                  setAiMatchScore(null);
                }}
                className="p-1 text-emerald-100 hover:text-white rounded hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleReportSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-slate-700 block uppercase tracking-wider">
                  Violation Category
                </label>
                <select
                  required
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#15803D] focus:outline-none text-[14px] text-slate-800 rounded-lg px-3 py-2.5 transition-colors font-semibold"
                >
                  <option value="">Select violation category</option>
                  <option value="Garbage Burning">Garbage/Waste Burning</option>
                  <option value="Construction Dust">Construction Dust Violation</option>
                  <option value="Industrial Plume">Industrial Smoke Plume</option>
                  <option value="Other">Other Ambient Violation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-bold text-slate-700 block uppercase tracking-wider">
                  Location details
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dwarka Sector 10 Bypass Roadway"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#15803D] focus:outline-none text-[14px] text-slate-800 rounded-lg px-3 py-2.5 transition-colors font-medium"
                />
              </div>

              {/* Photo upload simulator */}
              <div className="space-y-1.5">
                <span className="text-[13px] font-bold text-slate-700 block uppercase tracking-wider">
                  Incident Photo Attachment
                </span>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition cursor-pointer relative bg-slate-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        setReportFiles(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <FileImage className="w-8 h-8 text-slate-400" />
                    {reportFiles ? (
                      <span className="text-[13px] text-slate-700 font-bold">{reportFiles.name}</span>
                    ) : (
                      <>
                        <span className="text-[13px] text-slate-500 font-bold">Click to upload photo payload</span>
                        <span className="text-[11px] text-slate-400">Supported formats: JPEG, PNG up to 8MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Vision Model Verification Simulator */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold text-slate-800">AI Vision Verification</span>
                  <button
                    type="button"
                    onClick={handleAIEvaluation}
                    disabled={isEvaluatingAI}
                    className="text-[11.5px] font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] px-3 py-1.5 rounded transition disabled:opacity-55 disabled:cursor-not-allowed shrink-0"
                  >
                    {isEvaluatingAI ? (
                      <span className="flex items-center space-x-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Evaluating...</span>
                      </span>
                    ) : 'Auto evaluate with AI'}
                  </button>
                </div>

                {aiMatchScore ? (
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-slate-500">Confidence Score:</span>
                      <span className="text-emerald-700 font-bold">{aiMatchScore.confidence}% Confirmed</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${aiMatchScore.confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal border-t border-slate-200 pt-1.5 mt-1.5">
                      {aiMatchScore.verification}
                    </p>
                  </div>
                ) : (
                  <div className="text-[11.5px] text-slate-400 leading-normal text-center py-1">
                    Evaluate details using computer vision before submitting to expedite response routing.
                  </div>
                )}
              </div>
            </form>

            {/* Modal Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setReportOpen(false);
                  setReportCategory('');
                  setReportLocation('');
                  setReportFiles(null);
                  setAiMatchScore(null);
                }}
                className="text-[14px] font-semibold text-slate-700 hover:bg-slate-150 border border-slate-300 px-4 py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportSubmit}
                disabled={isSubmitting}
                className="text-[14px] font-bold text-white bg-[#15803D] hover:bg-[#166534] px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition disabled:opacity-60 flex items-center space-x-1.5"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Global Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        language={language}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        defaultMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={(usr) => {
          setUser(usr);
        }}
      />

    </div>
  );
}
