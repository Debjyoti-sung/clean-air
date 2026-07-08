import React, { useState, useEffect } from 'react';
import {
  Map,
  Camera,
  ChevronLeft,
  ChevronRight,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Clock,
  FileText,
  Cpu,
  MapPin,
  Loader2
} from 'lucide-react';
import { fetchLocationAQI } from '../utils/aqiApi';

// Animated counter component for numeric values
function AnimatedCounter({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const stringVal = value.toString();
    const isPercent = stringVal.endsWith('%');
    const numericValue = parseFloat(stringVal);

    if (isNaN(numericValue)) {
      setCount(value);
      return;
    }

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = progress * numericValue;

      if (isPercent) {
        setCount(current.toFixed(1) + '%');
      } else if (stringVal.includes('.')) {
        setCount(current.toFixed(1));
      } else {
        setCount(Math.floor(current));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function HeroSection({
  onReportClick,
  language = 'EN',
  setCurrentPage,
  selectedLocation = null,
  isLocationLoading = false,
  onOpenLocationModal
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [displayedAqiData, setDisplayedAqiData] = useState(null);

  useEffect(() => {
    if (!selectedLocation) {
      setDisplayedAqiData(null);
      return;
    }
    if (!isLocationLoading) {
      setDisplayedAqiData(fetchLocationAQI(selectedLocation));
    }
  }, [selectedLocation, isLocationLoading]);

  // Translation dictionary for Indian Government portal feel
  const t = {
    EN: {
      badge: "AI Powered Environmental Monitoring",
      slogan1: "Detect.",
      slogan2: "Predict.",
      slogan3: "Act.",
      exploreBtn: "Explore Live Map",
      reportBtn: "Report Pollution",
      liveAqi: "Live Air Quality",
      aqi: "AQI",
      temp: "Temperature",
      humidity: "Humidity",
      wind: "Wind",
      hotspots: "Active Hotspots",
      lastUpdated: "Last Updated",
      justNow: "Just Now",
      currentAqi: "Avg India AQI",
      activeHotspots: "Active Hotspots (India)",
      reportsToday: "People Affected",
      aiAccuracy: "Projected Improvement",
      statusModerate: "Moderate",
      statusSevere: "Severe",
      statusPoor: "Poor",
      statusGood: "Good",
      statusVeryPoor: "Very Poor",
      locationRequired: "Location Required",
      noLocationSelected: "No location selected"
    },
    HI: {
      badge: "एआई-संचालित पर्यावरणीय निगरानी",
      slogan1: "पहचानें.",
      slogan2: "पूर्वानुमान करें.",
      slogan3: "कार्रवाई करें.",
      exploreBtn: "लाइव नक्शा देखें",
      reportBtn: "प्रदूषण की रिपोर्ट करें",
      liveAqi: "लाइव वायु गुणवत्ता",
      aqi: "एक्यूआई",
      temp: "तापमान",
      humidity: "आर्द्रता",
      wind: "हवा की गति",
      hotspots: "सक्रिय हॉटस्पॉट",
      lastUpdated: "अंतिम अपडेट",
      justNow: "अभी-अभी",
      currentAqi: "औसत भारत एक्यूआई",
      activeHotspots: "सक्रिय हॉटस्पॉट (भारत)",
      reportsToday: "प्रभावित लोग",
      aiAccuracy: "संभावित सुधार",
      statusModerate: "मध्यम",
      statusSevere: "गंभीर",
      statusPoor: "खराब",
      statusGood: "अच्छा",
      statusVeryPoor: "बहुत खराब",
      locationRequired: "स्थान आवश्यक",
      noLocationSelected: "कोई स्थान चयनित नहीं"
    }
  };

  // High-quality slide images representing specific environmental/government scenarios
  const slides = [
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlApDhSJmAVI_vInp4os6103t9BWMcSxcY_rHPmHyg6w&s=10",
      title: language === 'EN'
        ? "Hyperlocal Pollution Intelligence for Every Neighborhood."
        : "प्रत्येक क्षेत्र के लिए स्थानीयकृत प्रदूषण स्तर की सटीक जानकारी।",
      subtitle: language === 'EN'
        ? "Empowering citizens and municipalities with AI-driven pollution monitoring, real-time hotspot detection, live AQI insights, and faster environmental action."
        : "एआई-संचालित प्रदूषण निगरानी, वास्तविक समय में हॉटस्पॉट का पता लगाने, लाइव एक्यूआई (AQI) जानकारी और त्वरित पर्यावरणीय कार्रवाई के साथ नागरिकों और नगर पालिकाओं को सशक्त बनाना।"
    },
    {
      image: "https://www.shutterstock.com/image-photo/free-woman-breathing-clean-air-260nw-1802552131.jpg",
      title: language === 'EN'
        ? "Empowering Citizens to Report Pollution Instantly."
        : "नागरिकों को तुरंत प्रदूषण की रिपोर्ट करने के लिए सशक्त बनाना।",
      subtitle: language === 'EN'
        ? "Use your smartphone to capture and upload images of localized pollution, automatically routing data to relevant municipal authorities with AI verification."
        : "स्थानीयकृत प्रदूषण की छवियों को कैप्चर और अपलोड करने के लिए अपने स्मार्टफोन का उपयोग करें, एआई सत्यापन के साथ संबंधित नगर पालिका अधिकारियों को डेटा भेजें।"
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hw7MHOmnkNC_XtYwfOwgDUxxUDtTyQxbTlox3oVfvg&s",
      title: language === 'EN'
        ? "Rapid Action Teams for Cleaner Neighborhoods."
        : "स्वच्छ पड़ोस के लिए त्वरित कार्रवाई दल।",
      subtitle: language === 'EN'
        ? "Connecting municipal workers directly with citizen reports, facilitating rapid cleanup of public spaces and addressing environmental concerns on the ground."
        : "नगर पालिका कर्मचारियों को सीधे नागरिक रिपोर्टों से जोड़ना, सार्वजनिक स्थानों की त्वरित सफाई की सुविधा प्रदान करना और जमीनी स्तर पर पर्यावरणीय चिंताओं को दूर करना।"
    },
    {
      image: "https://www.shutterstock.com/image-photo/green-refinery-oil-gas-petrochemical-260nw-2644379361.jpg",
      title: language === 'EN'
        ? "Smart City Infrastructure with AI Monitoring Grids."
        : "एआई निगरानी ग्रिड के साथ स्मार्ट सिटी बुनियादी ढांचा।",
      subtitle: language === 'EN'
        ? "Integrating internet-of-things (IoT) air quality sensors across major intersections to feed real-time particulate matter statistics into our predictive models."
        : "हमारे पूर्वानुमानित मॉडलों में वास्तविक समय के पार्टिकुलेट मैटर आंकड़ों को फीड करने के लिए प्रमुख चौराहों पर इंटरनेट-ऑफ-थिंग्स (IoT) वायु गुणवत्ता सेंसरों को एकीकृत करना।"
    },
    {
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80",
      title: language === 'EN'
        ? "Restoring Green Cover and Renewable Energy."
        : "हरित आवरण और नवीकरणीय ऊर्जा को पुनर्स्थापित करना।",
      subtitle: language === 'EN'
        ? "Fostering sustainable urban forestry and monitoring clean wind/solar energy outputs to ensure AerioN and lower industrial carbon footprint."
        : "स्वच्छ हवा और कम औद्योगिक कार्बन फुटप्रिंट सुनिश्चित करने के लिए टिकाऊ शहरी वानिकी को बढ़ावा देना और स्वच्छ पवन/सौर ऊर्जा आउटपुट की निगरानी करना।"
    },
    {
      image: "https://static.india.com/wp-content/uploads/2020/10/hands-1790059_960_720.jpg?impolicy=Medium_Widthonly&w=400",
      title: language === 'EN'
        ? "Centralized Control Room for Strategic Oversight."
        : "रणनीतिक निगरानी के लिए केंद्रीकृत नियंत्रण कक्ष।",
      subtitle: language === 'EN'
        ? "Visualizing regional AQI maps, coordinating municipal teams, and tracking AI-driven predictive insights inside our advanced monitoring centers."
        : "हमारे उन्नत निगरानी केंद्रों के भीतर क्षेत्रीय AQI मानचित्रों की कल्पना करना, नगर पालिका टीमों का समन्वय करना और एआई-संचालित पूर्वानुमानित अंतर्दृष्टि को ट्रैक करना।"
    }
  ];

  // Carousel auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Mobile swipe handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const getStatusTextAndColor = (status) => {
    if (status === 'Good') return { text: t[language].statusGood, colorClass: 'bg-green-500/25 text-green-300 border-green-500/35' };
    if (status === 'Moderate') return { text: t[language].statusModerate, colorClass: 'bg-amber-500/25 text-amber-300 border-amber-500/35' };
    if (status === 'Poor') return { text: t[language].statusPoor, colorClass: 'bg-orange-500/25 text-orange-300 border-orange-500/35' };
    if (status === 'Very Poor') return { text: t[language].statusVeryPoor, colorClass: 'bg-red-500/25 text-red-300 border-red-500/35' };
    if (status === 'Severe') return { text: t[language].statusSevere, colorClass: 'bg-purple-500/25 text-purple-300 border-purple-500/35' };
    return { text: t[language].locationRequired, colorClass: 'bg-slate-500/25 text-slate-300 border-slate-500/35' };
  };

  const getShortAddress = () => {
    if (!selectedLocation) return t[language].noLocationSelected;
    const city = selectedLocation.city;
    const state = selectedLocation.state;
    const dist = selectedLocation.district;
    
    if (city === 'GPS Location' || !city) {
      const lat = parseFloat(selectedLocation.latitude);
      const lng = parseFloat(selectedLocation.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return `📍 ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
      }
    }
    
    if (city) {
      if (state) {
        return `📍 ${city}, ${state}`;
      } else if (dist) {
        return `📍 ${city}, ${dist}`;
      }
      return `📍 ${city}`;
    }
    return `📍 ${selectedLocation.displayName || selectedLocation.address.split('\n')[0]}`;
  };

  const { text: statusText, colorClass: statusColorClass } = getStatusTextAndColor(displayedAqiData ? displayedAqiData.status : 'Location Required');

  return (
    <section id="home" className="relative w-full bg-[#0B1E36] overflow-visible">
      {/* 1. Carousel Container */}
      <div
        className="relative w-full overflow-hidden h-[350px] sm:h-[450px] lg:h-[580px] group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Images (Smooth Fade transition) */}
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <img
              src={slide.image}
              alt={`Slide Background ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay (45%) for optimal text contrast */}
            <div className="absolute inset-0 bg-black/45 z-10"></div>
          </div>
        ))}

        {/* Content Overlays */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 h-full pt-24 pb-12 sm:pb-16 lg:pt-28 lg:pb-0">

            {/* Left Column: Text & CTAs (Max width 550px) */}
            <div className="w-full lg:max-w-[550px] text-left flex flex-col justify-center h-full space-y-4 md:space-y-5">

              {/* Small Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-wider text-emerald-200 bg-emerald-950/75 border border-emerald-600/40 rounded-full w-fit uppercase select-none shadow-sm backdrop-blur-sm animate-fade-in">
                {t[language].badge}
              </div>

              {/* H1 Slogan - subtle tri-color government feel */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight select-none drop-shadow-md">
                <span className="text-[#FF9933]">{t[language].slogan1} </span>
                <span className="text-white">{t[language].slogan2} </span>
                <span className="text-[#138808]">{t[language].slogan3}</span>
              </h1>

              {/* Dynamic Subheadings (Forces fade-in-up animation on key change) */}
              <div key={currentSlide} className="animate-fade-in-up space-y-3">
                {/* H2 Title */}
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug tracking-tight drop-shadow-sm">
                  {slides[currentSlide].title}
                </h2>
                {/* H3 Subtitle */}
                <p className="text-xs sm:text-sm md:text-base text-slate-200 font-light leading-relaxed drop-shadow-sm">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary: Explore Live Map (Glass Neomorphism) */}
                <button
                  onClick={() => {
                    console.log("Clicked");
                    console.log(setCurrentPage);
                    setCurrentPage("live-map");
                  }}
                  className="bg-white/10 backdrop-blur-md text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.1)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-4px_-4px_16px_rgba(255,255,255,0.15)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2 select-none group"
                >
                  <Map className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{t[language].exploreBtn}</span>
                </button>

                {/* Secondary: Report Pollution (Glass Neomorphism) */}
                <button
                  onClick={onReportClick}
                  className="bg-black/20 backdrop-blur-md text-slate-200 font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.05)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-4px_-4px_16px_rgba(255,255,255,0.1)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Camera className="w-5 h-5 text-slate-300 group-hover:text-emerald-300 transition-colors" />
                  <span>{t[language].reportBtn}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Floating Glassmorphic Status Card (Desktop only) */}
            <div className="hidden lg:block w-[330px] shrink-0 animate-float select-none">
              <div className="relative overflow-hidden bg-white/10 backdrop-blur-md rounded-[20px] p-6 shadow-2xl text-white transition-all duration-300 hover:border-white/35">

                {/* Loading animation overlay */}
                {isLocationLoading && (
                  <div className="absolute inset-0 bg-[#0B1E36]/70 backdrop-blur-sm rounded-[20px] flex flex-col items-center justify-center space-y-2.5 z-30 transition-all duration-300">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-[11px] font-bold text-slate-200 tracking-wider">Syncing Telemetry...</span>
                  </div>
                )}

                {/* Header info */}
                <div className="flex items-center justify-between mb-5 border-b border-white/15 pb-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">{language === 'EN' ? 'National Network' : 'राष्ट्रीय नेटवर्क'}</span>
                    <h4 className="text-lg font-bold tracking-tight">{t[language].liveAqi}</h4>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={onOpenLocationModal}
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white shadow-[4px_4px_8px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.1)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] transition-all cursor-pointer flex items-center justify-center shrink-0 group"
                      title={language === 'EN' ? 'Set Live Location' : 'स्थान निर्धारित करें'}
                    >
                      <MapPin className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="p-2.5 bg-emerald-500/10 backdrop-blur-md border-t border-l border-emerald-400/20 rounded-xl text-emerald-400 shrink-0 shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_8px_rgba(255,255,255,0.05)]">
                      <Activity className="w-4 h-4 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Inner Body with key-based fade transition */}
                <div
                  key={selectedLocation ? `${selectedLocation.latitude},${selectedLocation.longitude}` : 'empty'}
                  className="animate-fade-in"
                >
                  {/* AQI Display */}
                  <div className="text-left mb-6">
                    <p className="text-[11px] text-white/60 font-medium uppercase tracking-wider">{t[language].aqi}</p>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-5xl font-black tracking-tighter">
                        {displayedAqiData && typeof displayedAqiData.aqi === 'number' ? (
                          <AnimatedCounter value={displayedAqiData.aqi} />
                        ) : (
                          '--'
                        )}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusColorClass}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>

                  {/* Metric Items Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-left">
                    <div className="flex items-center gap-2.5">
                      <Thermometer className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-[10px] text-white/50">{t[language].temp}</p>
                        <p className="font-semibold text-slate-100">{displayedAqiData ? displayedAqiData.temperature : '--'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Droplets className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-[10px] text-white/50">{t[language].humidity}</p>
                        <p className="font-semibold text-slate-100">{displayedAqiData ? displayedAqiData.humidity : '--'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Wind className="w-5 h-5 text-teal-300" />
                      <div>
                        <p className="text-[10px] text-white/50">{t[language].wind}</p>
                        <p className="font-semibold text-slate-100">{displayedAqiData ? displayedAqiData.windSpeed : '--'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-[10px] text-white/50">{t[language].hotspots}</p>
                        <p className="font-semibold text-slate-100">
                          {displayedAqiData && typeof displayedAqiData.hotspots === 'number' ? (
                            <AnimatedCounter value={displayedAqiData.hotspots} />
                          ) : (
                            '--'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer and timestamp */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/50 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t[language].lastUpdated}: {displayedAqiData ? (language === 'EN' ? 'Just Now' : 'अभी-अभी') : '--'}</span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 max-w-[130px] truncate" title={selectedLocation ? selectedLocation.displayName : ''}>
                      {getShortAddress()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Previous and Next Navigation Arrows (Glass Neomorphism) */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 backdrop-blur-md border-t border-l border-white/20 text-white shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_10px_rgba(255,255,255,0.1)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 backdrop-blur-md border-t border-l border-white/20 text-white shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_10px_rgba(255,255,255,0.1)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Centered Dots Indicators */}
        <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-35 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-[#FF9933]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Floating Bottom Information Strip (Light Neomorphism) */}
      
      {/* Desktop/Tablet view overlapping bottom edge */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-11/12 max-w-[1400px] z-30 hidden sm:block">
        <div className="bg-[#f1f5f9] rounded-[2rem] shadow-[0_10px_30px_rgb(0,0,0,0.15)] py-6 px-8 grid grid-cols-4 gap-6">

          {/* Item 1: Current AQI */}
          <div className="flex items-center gap-5 px-2 justify-start text-left bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] p-4 rounded-3xl">
            <div className="p-3.5 bg-[#f1f5f9] rounded-2xl text-emerald-600 shrink-0 shadow-[4px_4px_8px_#cbd5e1]">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[26px] font-black text-slate-800 tracking-tight leading-none flex items-center gap-2">
                <AnimatedCounter value={142} />
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-100/50 text-amber-700 border border-amber-200/50 shadow-sm">
                  {t[language].statusModerate}
                </span>
              </p>
              <p className="text-[11.5px] text-slate-500 font-bold tracking-widest uppercase mt-1.5">{t[language].currentAqi}</p>
            </div>
          </div>

          {/* Item 2: Active Hotspots */}
          <div className="flex items-center gap-5 px-2 justify-start text-left bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] p-4 rounded-3xl">
            <div className="p-3.5 bg-[#f1f5f9] rounded-2xl text-amber-600 shrink-0 shadow-[4px_4px_8px_#cbd5e1]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[26px] font-black text-slate-800 tracking-tight leading-none">
                <AnimatedCounter value={682} />
              </p>
              <p className="text-[11.5px] text-slate-500 font-bold tracking-widest uppercase mt-1.5">{t[language].activeHotspots}</p>
            </div>
          </div>

          {/* Item 3: Reports Today */}
          <div className="flex items-center gap-5 px-2 justify-start text-left bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] p-4 rounded-3xl">
            <div className="p-3.5 bg-[#f1f5f9] rounded-2xl text-blue-600 shrink-0 shadow-[4px_4px_8px_#cbd5e1]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[26px] font-black text-slate-800 tracking-tight leading-none">
                <AnimatedCounter value={1.2} />
                <span className="text-sm font-bold text-slate-500 ml-0.5">B+</span>
              </p>
              <p className="text-[11.5px] text-slate-500 font-bold tracking-widest uppercase mt-1.5">{t[language].reportsToday}</p>
            </div>
          </div>

          {/* Item 4: AI Accuracy */}
          <div className="flex items-center gap-5 px-2 justify-start text-left bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] p-4 rounded-3xl">
            <div className="p-3.5 bg-[#f1f5f9] rounded-2xl text-purple-600 shrink-0 shadow-[4px_4px_8px_#cbd5e1]">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[26px] font-black text-[#15803D] tracking-tight leading-none">
                <span>+</span>
                <AnimatedCounter value={35} />
                <span className="text-sm font-bold text-[#15803D] ml-0.5">%</span>
              </p>
              <p className="text-[11.5px] text-slate-500 font-bold tracking-widest uppercase mt-1.5">{t[language].aiAccuracy}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile view directly below carousel */}
      <div className="block sm:hidden w-11/12 mx-auto py-8 select-none text-left">
        <div className="bg-[#f1f5f9] rounded-[2rem] shadow-[0_10px_30px_rgb(0,0,0,0.15)] grid grid-cols-2 gap-4 p-5">

          <div className="flex flex-col items-start gap-3 p-4 bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl">
            <div className="p-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] rounded-xl text-emerald-600 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-none">142</p>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">{t[language].currentAqi}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 p-4 bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl">
            <div className="p-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] rounded-xl text-amber-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-none">682</p>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">{t[language].activeHotspots}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 p-4 bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl">
            <div className="p-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] rounded-xl text-blue-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-none">1.2B+</p>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">{t[language].reportsToday}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 p-4 bg-[#f1f5f9] shadow-[inset_4px_4px_8px_#cbd5e1] rounded-2xl">
            <div className="p-2.5 bg-[#f1f5f9] shadow-[4px_4px_8px_#cbd5e1] rounded-xl text-purple-600 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-[#15803D] leading-none">+35%</p>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">{t[language].aiAccuracy}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Spacer to balance the overlapping card on desktop/tablet */}
      <div className="hidden sm:block h-[48px]"></div>
    </section>
  );
}
