import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowLeft,
  Lock,
  RefreshCw,
  Thermometer,
  Wind,
  Droplets,
  CloudRain,
  Sun,
  Cloud,
  FileText,
  AlertTriangle,
  MapPin,
  Compass,
  Layers,
  Heart,
  Brain,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Zap,
  Clock,
  Gauge,
  Info
} from 'lucide-react';
import { getDisplayNameFromCoords } from './LocationModal';
import LocationModal from './LocationModal';

// Language Translations Dictionary
const translations = {
  EN: {
    title: "AI AQI Estimation & Prediction",
    subtitle: "Estimate historical AQI and predict future air quality using AI-powered environmental intelligence.",
    confidence: "Prediction Confidence",
    lastUpdated: "Last Updated",
    noLocation: "No location selected",
    chooseLocation: "Choose Location",
    editLocation: "Edit Location",
    refreshPrediction: "Refresh Prediction",
    weatherAnalysis: "Weather Analysis",
    satelliteAnalysis: "Satellite Analysis",
    citizenReports: "Citizen Reports",
    environmentalSummary: "Environmental Summary",
    temp: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    rainfall: "Rainfall",
    smoke: "Smoke Detection",
    dust: "Dust Detection",
    thermal: "Thermal Activity",
    garbage: "Garbage Burning",
    construction: "Construction Dust",
    industrial: "Industrial Smoke",
    roadDust: "Road Dust",
    histConditions: "Historical Environmental Conditions",
    historyTitle: "Historical AQI Trend (Past 7 Days)",
    aiForecast: "AI Forecast",
    whyAIPredicted: "Why AI Predicted This",
    healthAdvisory: "Health Advisory",
    workflowTitle: "AI Estimation Workflow",
    backBtn: "Back to Dashboard",
    nodes: {
      location: "Selected Location",
      weather: "Weather Forecast Analysis",
      satellite: "Satellite Data Analysis",
      citizen: "Citizen Report Analysis",
      history: "Estimated AQI History (Past 7 Days)",
      aiModel: "AI Prediction Model",
      forecast: "Estimated AQI Forecast (Today + Next 3 Days)"
    },
    advisoryNotes: "AI Model Advisory Notes",
    bestOutdoorTime: "Best outdoor time",
    activeReports: "reports",
    clear: "None Detected",
    normal: "Normal Range",
    inactive: "Inactive",
    confidenceScore: "Confidence Score"
  },
  HI: {
    title: "एआई एक्यूआई आकलन और भविष्यवाणी",
    subtitle: "एआई-संचालित पर्यावरणीय खुफिया जानकारी का उपयोग करके ऐतिहासिक एक्यूआई का अनुमान लगाएं और भविष्य की वायु गुणवत्ता की भविष्यवाणी करें।",
    confidence: "भविष्यवाणी का विश्वास",
    lastUpdated: "अंतिम अपडेट",
    noLocation: "कोई स्थान चयनित नहीं है",
    chooseLocation: "स्थान चुनें",
    editLocation: "स्थान बदलें",
    refreshPrediction: "भविष्यवाणी ताज़ा करें",
    weatherAnalysis: "मौसम विश्लेषण",
    satelliteAnalysis: "सैटेलाइट विश्लेषण",
    citizenReports: "नागरिक रिपोर्ट",
    environmentalSummary: "पर्यावरणीय सारांश",
    temp: "तापमान",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
    rainfall: "वर्षा",
    smoke: "धुआं पहचान",
    dust: "धूल पहचान",
    thermal: "थर्मल गतिविधि",
    garbage: "कचरा जलाना",
    construction: "निर्माण धूल",
    industrial: "औद्योगिक धुआं",
    roadDust: "सड़क की धूल",
    histConditions: "ऐतिहासिक पर्यावरणीय स्थितियाँ",
    historyTitle: "ऐतिहासिक एक्यूआई रुझान (पिछले 7 दिन)",
    aiForecast: "एआई पूर्वानुमान",
    whyAIPredicted: "एआई ने यह भविष्यवाणी क्यों की",
    healthAdvisory: "स्वास्थ्य सलाह",
    workflowTitle: "एआई आकलन कार्यप्रवाह",
    backBtn: "डैशबोर्ड पर वापस जाएं",
    nodes: {
      location: "चयनित स्थान",
      weather: "मौसम पूर्वानुमान विश्लेषण",
      satellite: "सैटेलाइट डेटा विश्लेषण",
      citizen: "नागरिक रिपोर्ट विश्लेषण",
      history: "अनुमानित एक्यूआई इतिहास (पिछले 7 दिन)",
      aiModel: "एआई भविष्यवाणी मॉडल",
      forecast: "अनुमानित एक्यूआई पूर्वानुमान (आज + अगले 3 दिन)"
    },
    advisoryNotes: "एआई मॉडल सलाह नोट्स",
    bestOutdoorTime: "बाहर जाने का सबसे अच्छा समय",
    activeReports: "रिपोर्ट",
    clear: "कोई पहचान नहीं",
    normal: "सामान्य सीमा",
    inactive: "निष्क्रिय",
    confidenceScore: "विश्वास स्कोर"
  }
};

// Deterministic mock data generator using coordinate seed to simulate backend APIs
export function generateAIModelData(location, lang = 'EN') {
  if (!location) return null;
  const lat = parseFloat(location.latitude) || 28.6273;
  const lng = parseFloat(location.longitude) || 77.3725;
  const todayDate = new Date();
  const dateOffset = todayDate.getDate() + todayDate.getMonth() * 30;
  const seed = Math.abs(Math.sin(lat + dateOffset) * Math.cos(lng - dateOffset) * 100) % 1;

  // Set base AQI range according to major Indian metropolitan nodes
  let baseAqi = 120;
  const displayName = (location.displayName || "").toLowerCase();
  if (displayName.includes("delhi") || displayName.includes("dwarka") || displayName.includes("connaught")) {
    baseAqi = 230 + Math.floor(seed * 70); // 230 - 300
  } else if (displayName.includes("bangalore") || displayName.includes("electronic") || displayName.includes("indiranagar")) {
    baseAqi = 42 + Math.floor(seed * 28); // 42 - 70
  } else if (displayName.includes("pune") || displayName.includes("aundh") || displayName.includes("hinjawadi")) {
    baseAqi = 65 + Math.floor(seed * 35); // 65 - 100
  } else if (displayName.includes("kolkata") || displayName.includes("salt lake") || displayName.includes("bidhannagar") || displayName.includes("rajarhat") || displayName.includes("bengal")) {
    baseAqi = 125 + Math.floor(seed * 45); // 125 - 170
  } else {
    baseAqi = 50 + Math.floor(seed * 190); // 50 - 240
  }

  // Generate simulated Weather Forecast variables
  const temp = 22 + Math.floor(seed * 14); // 22 - 36 °C
  const humidity = 45 + Math.floor(seed * 35); // 45 - 80%
  const windSpeed = 6 + Math.floor(seed * 16); // 6 - 22 km/h
  const rainfall = seed > 0.65 ? (seed * 8).toFixed(1) : "0.0"; // mm

  // Generate simulated Satellite telemetry
  const smoke = seed > 0.45 ? (lang === 'EN' ? "Smoke Detected (Plume Signature)" : "धुआं पाया गया (प्लम हस्ताक्षर)") : (lang === 'EN' ? "None Detected" : "कोई नहीं मिला");
  const dust = seed > 0.35 ? (lang === 'EN' ? "Elevated PM10 Dust" : "बढ़ी हुई पीएम10 धूल") : (lang === 'EN' ? "Normal Range" : "सामान्य सीमा");
  const thermal = seed > 0.7 ? (lang === 'EN' ? "Active Agricultural Fires" : "सक्रिय कृषि आग") : (lang === 'EN' ? "Inactive" : "निष्क्रिय");

  // Generate simulated Citizen Reports
  const garbageBurning = Math.floor(seed * 5);
  const constructionDust = Math.floor(seed * 8);
  const industrialSmoke = Math.floor(seed * 3);
  const roadDust = Math.floor(seed * 6);

  // Generate 7-day Historical Estimated AQI sequence
  const daysOfWeek = lang === 'EN' 
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  const history = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dayLabel = daysOfWeek[d.getDay()];
    const daySeed = Math.abs(Math.sin(lat + i) * Math.cos(lng - i) * 100) % 1;
    const historyAqi = Math.max(15, baseAqi + Math.floor((daySeed - 0.5) * 50));
    
    history.push({
      day: dayLabel,
      aqi: historyAqi,
      temp: 20 + Math.floor(daySeed * 16),
      humidity: 40 + Math.floor(daySeed * 40),
      windSpeed: 5 + Math.floor(daySeed * 14),
      citizenReports: Math.floor(daySeed * 10),
      satelliteStatus: daySeed > 0.5 ? (lang === 'EN' ? "Clear" : "साफ़") : (lang === 'EN' ? "Smoke Detected" : "धुआं पाया गया")
    });
  }

  // Generate 7-day forecast based on the historical average
  const historyAvgAqi = history.reduce((sum, item) => sum + item.aqi, 0) / history.length;
  
  const forecast = [];
  const forecastLabels = lang === 'EN' 
    ? ["Today", "Tomorrow", "Day +2", "Day +3", "Day +4", "Day +5", "Day +6"]
    : ["आज", "कल", "दिन +2", "दिन +3", "दिन +4", "दिन +5", "दिन +6"];
    
  for (let i = 0; i < 7; i++) {
    const fSeed = Math.abs(Math.sin(lat - i * 2) * Math.cos(lng + i * 3) * 100) % 1;
    
    // Today matches baseAqi for continuity. Future days trend towards the historical average + variance.
    let fAqi;
    if (i === 0) {
      fAqi = baseAqi;
    } else {
      // Trend slightly towards historical average with some random variance
      const trend = (historyAvgAqi - baseAqi) * (i / 7);
      const variance = (fSeed - 0.5) * 60;
      fAqi = Math.max(15, baseAqi + trend + variance);
    }
    
    const confidence = 85 + Math.floor(fSeed * 14); // 85% - 99%

    // Determine Weather Icon name
    let weatherIcon = "sunny";
    if (parseFloat(rainfall) > 2.0 && i === 1) {
      weatherIcon = "rainy";
    } else if (fAqi > 200) {
      weatherIcon = "hazy";
    } else if (windSpeed > 16) {
      weatherIcon = "windy";
    } else if (humidity > 72) {
      weatherIcon = "cloudy";
    }

    forecast.push({
      label: forecastLabels[i],
      aqi: Math.round(fAqi),
      confidence,
      weatherIcon
    });
  }

  // Calculate Severity Score (0-100)
  // Higher AQI, low wind speed, high temperature increase severity
  let severityScore = (baseAqi / 500) * 100;
  if (windSpeed < 8) severityScore += 10;
  if (temp > 35) severityScore += 5;
  if (parseFloat(rainfall) > 5) severityScore -= 15;
  severityScore = Math.max(0, Math.min(100, Math.round(severityScore)));

  // Generate AI Insights explaining variables' impacts on AQI
  const insights = [];
  if (temp > 30) {
    insights.push({
      text: lang === 'EN' ? "High temperature increased photochemical ozone formation rate" : "उच्च तापमान ने फोटोकैमिकल ओजोन गठन दर को बढ़ाया",
      impact: lang === 'EN' ? "High" : "उच्च",
      isIncrease: true,
      type: "temp"
    });
  } else {
    insights.push({
      text: lang === 'EN' ? "Moderate temperature reduced chemical reaction rates" : "मध्यम तापमान ने रासायनिक प्रतिक्रिया दरों को कम किया",
      impact: lang === 'EN' ? "Low" : "निम्न",
      isIncrease: false,
      type: "temp"
    });
  }

  if (windSpeed < 9) {
    insights.push({
      text: lang === 'EN' ? "Low wind speed restricted atmospheric dispersion (stagnation dome)" : "कम हवा की गति ने वायुमंडलीय प्रसार को प्रतिबंधित किया (स्थिरता गुंबद)",
      impact: lang === 'EN' ? "Critical" : "गंभीर",
      isIncrease: true,
      type: "wind"
    });
  } else {
    insights.push({
      text: lang === 'EN' ? "Strong wind speed cleared particulate matter accumulation" : "तेज हवा की गति ने कण पदार्थ के संचय को साफ किया",
      impact: lang === 'EN' ? "High" : "उच्च",
      isIncrease: false,
      type: "wind"
    });
  }

  if (parseFloat(rainfall) > 0.0) {
    insights.push({
      text: lang === 'EN' ? `Precipitation (${rainfall} mm) washed out airborne particulate matter` : `वर्षा (${rainfall} मिमी) ने हवा में उड़ने वाले कणों को साफ किया`,
      impact: lang === 'EN' ? "High" : "उच्च",
      isIncrease: false,
      type: "rain"
    });
  }

  if (seed > 0.45) {
    insights.push({
      text: lang === 'EN' ? "Satellite detected industrial/agriculture smoke plumes nearby" : "सैटेलाइट ने पास में औद्योगिक/कृषि धुएं के गुबारों का पता लगाया",
      impact: lang === 'EN' ? "High" : "उच्च",
      isIncrease: true,
      type: "satellite"
    });
  }

  if (constructionDust > 3 || garbageBurning > 1) {
    insights.push({
      text: lang === 'EN' ? "Citizen reports indicate increased construction dust and waste burning activities." : "नागरिक रिपोर्टों ने निर्माण धूल और कचरा जलाने की गतिविधियों में वृद्धि का संकेत दिया है।",
      impact: lang === 'EN' ? "High" : "उच्च",
      isIncrease: true,
      type: "garbage"
    });
  }

  // Health Advisories depending on Severity Score
  let advisories = [];
  let bestTime = "";
  const isEnglish = lang === 'EN';

  if (baseAqi <= 50) {
    advisories.push(isEnglish ? "Air quality is excellent. Ideal for outdoor workouts and leisure." : "वायु गुणवत्ता उत्कृष्ट है। बाहरी कसरत और मनोरंजन के लिए आदर्श।");
    advisories.push(isEnglish ? "Open windows to let fresh air circulate indoors." : "ताजी हवा को घर के अंदर प्रसारित करने के लिए खिड़कियां खोलें।");
    bestTime = isEnglish ? "Any time of day" : "दिन में किसी भी समय";
  } else if (baseAqi <= 100) {
    advisories.push(isEnglish ? "Air quality is acceptable. Safe for most outdoor exercise." : "वायु गुणवत्ता स्वीकार्य है। अधिकांश बाहरी व्यायाम के लिए सुरक्षित।");
    advisories.push(isEnglish ? "Unusually sensitive people should consider reducing prolonged outdoor exertion." : "असामान्य रूप से संवेदनशील लोगों को लंबे समय तक बाहरी परिश्रम को कम करने पर विचार करना चाहिए।");
    bestTime = isEnglish ? "11:00 AM - 04:00 PM (winds are active)" : "सुबह 11:00 बजे - शाम 04:00 बजे (हवाएं सक्रिय हैं)";
  } else if (baseAqi <= 150) {
    advisories.push(isEnglish ? "Air quality is poor for sensitive groups. Reduce heavy outdoor exertion." : "संवेदनशील समूहों के लिए वायु गुणवत्ता खराब है। भारी बाहरी व्यायाम कम करें।");
    advisories.push(isEnglish ? "Asthma patients should carry inhalers and avoid dusty roads." : "अस्थमा के मरीजों को इनहेलर रखना चाहिए और धूल भरी सड़कों से बचना चाहिए।");
    bestTime = isEnglish ? "01:00 PM - 03:00 PM (maximum dispersion)" : "दोपहर 01:00 बजे - दोपहर 03:00 बजे (अधिकतम प्रसार)";
  } else if (baseAqi <= 200) {
    advisories.push(isEnglish ? "Air quality is unhealthy. Everyone may begin to experience health effects." : "वायु गुणवत्ता अस्वस्थ है। हर किसी को स्वास्थ्य प्रभाव का अनुभव होना शुरू हो सकता है।");
    advisories.push(isEnglish ? "Avoid exercising near high-traffic roads or industrial areas." : "अधिक यातायात वाली सड़कों या औद्योगिक क्षेत्रों के पास व्यायाम करने से बचें।");
    bestTime = isEnglish ? "Short durations only" : "केवल कम अवधि";
  } else if (baseAqi <= 300) {
    advisories.push(isEnglish ? "Air quality is very poor. Wear certified N95 masks for any outdoor activity or transit." : "वायु गुणवत्ता बहुत खराब है। किसी भी बाहरी गतिविधि या यात्रा के लिए प्रमाणित N95 मास्क पहनें।");
    advisories.push(isEnglish ? "Keep all windows closed and activate HEPA air filtration." : "सभी खिड़कियां बंद रखें और HEPA एयर निस्पंदन सक्रिय करें।");
    bestTime = isEnglish ? "Avoid outdoor exposure" : "बाहर जाने से बचें";
  } else {
    advisories.push(isEnglish ? "Severe air crisis. Avoid all outdoor exposures and use continuous air filtration indoors." : "गंभीर वायु संकट। सभी बाहरी जोखिमों से बचें और घर के अंदर निरंतर वायु निस्पंदन का उपयोग करें।");
    advisories.push(isEnglish ? "If travel is absolutely necessary, strictly use N95 or N99 respirator masks." : "यदि यात्रा नितांत आवश्यक है, तो सख्ती से N95 या N99 श्वासयंत्र मास्क का उपयोग करें।");
    advisories.push(isEnglish ? "Do not perform any strenuous physical activities." : "कोई भी ज़ोरदार शारीरिक गतिविधि न करें।");
    bestTime = isEnglish ? "Emergency transit only" : "केवल आपातकालीन यात्रा";
  }

  let summaryText = "";
  if (severityScore > 60) {
    summaryText = lang === 'EN'
      ? "Stagnant boundary layer combined with satellite-detected smoke and municipal citizen complaints has triggered significant PM2.5 and PM10 accumulation."
      : "ठहरी हुई वायुमंडलीय परत, सैटेलाइट-पहचाने गए धुएं और नागरिक शिकायतों के कारण पीएम2.5 और पीएम10 का गंभीर संचय हुआ है।";
  } else if (severityScore < 30) {
    summaryText = lang === 'EN'
      ? "High wind dispersion speed and zero active citizen alerts have cleaned the boundary layer, yielding exceptionally low particulate concentrations."
      : "हवा की तेज प्रसार गति और शून्य सक्रिय नागरिक अलर्ट ने वातावरण को साफ कर दिया है, जिससे कणों की सांद्रता बहुत कम हो गई है।";
  } else {
    summaryText = lang === 'EN'
      ? "Moderate ambient temperatures and active wind vectors keep dispersion stable, balanced by minor dust and construction activities."
      : "मध्यम तापमान और सक्रिय हवा की गति प्रसार को स्थिर रखती है, जिसे धूल और निर्माण गतिविधियों द्वारा संतुलित किया जाता है।";
  }

  return {
    aqi: baseAqi,
    temp,
    humidity,
    windSpeed,
    rainfall,
    smoke,
    dust,
    thermal,
    garbageBurning,
    constructionDust,
    industrialSmoke,
    roadDust,
    environmentalSummary: summaryText,
    history,
    forecast,
    insights,
    advisories,
    bestTime,
    severityScore,
    confidence: 91 + Math.floor(seed * 7), // 91% - 98%
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

export default function PredictionPage({ language, selectedLocation, onOpenLocationModal, onBack }) {
  // Local Location overrides - ensures prediction page updates do not leak to other parts of App
  const [localLocation, setLocalLocation] = useState(null);
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);

  // Sync with global location only when component mounts or when local state is empty and parent selection is available
  useEffect(() => {
    if (selectedLocation && !localLocation) {
      setLocalLocation(selectedLocation);
    }
  }, [selectedLocation]);

  // Telemetry model data state
  const [aiData, setAiData] = useState(null);
  
  // Loading pipeline states
  const [loadingStep, setLoadingStep] = useState(-1); // -1: idle/ready, 0-4: loading steps
  const [hoveredDot, setHoveredDot] = useState(null);

  const t = translations[language] || translations.EN;

  const loadingSteps = [
    { en: "Collecting Weather Data...", hi: "मौसम डेटा एकत्र किया जा रहा है..." },
    { en: "Analysing Satellite Data...", hi: "सैटेलाइट डेटा का विश्लेषण किया जा रहा है..." },
    { en: "Processing Citizen Reports...", hi: "नागरिक रिपोर्टों को संसाधित किया जा रहा है..." },
    { en: "Generating Estimated AQI...", hi: "अनुमानित एक्यूआई उत्पन्न किया जा रहा है..." },
    { en: "Prediction Ready.", hi: "भविष्यवाणी तैयार है।" }
  ];

  // Pipeline execution triggers sequential progress updates
  const runPredictionPipeline = () => {
    if (!localLocation) return;
    setLoadingStep(0);
  };

  // Pipeline timer loops
  useEffect(() => {
    if (loadingStep >= 0 && loadingStep < 4) {
      const timer = setTimeout(() => {
        setLoadingStep(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else if (loadingStep === 4) {
      const timer = setTimeout(() => {
        setLoadingStep(-1);
        setAiData(generateAIModelData(localLocation, language));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loadingStep, localLocation, language]);

  // Whenever local location changes, automatically trigger AI pipeline refresh
  useEffect(() => {
    if (localLocation) {
      runPredictionPipeline();
    } else {
      setAiData(null);
    }
  }, [localLocation]);

  const getAqiCategory = (val) => {
    if (val <= 50) return { name: language === 'EN' ? 'Good' : 'अच्छा', bg: 'bg-[#22C55E]', text: 'text-white', border: 'border-[#22C55E]', textHex: '#22C55E' };
    if (val <= 100) return { name: language === 'EN' ? 'Moderate' : 'मध्यम', bg: 'bg-[#EAB308]', text: 'text-slate-900', border: 'border-[#EAB308]', textHex: '#EAB308' };
    if (val <= 200) return { name: language === 'EN' ? 'Poor' : 'खराब', bg: 'bg-[#F97316]', text: 'text-white', border: 'border-[#F97316]', textHex: '#F97316' };
    if (val <= 300) return { name: language === 'EN' ? 'Very Poor' : 'बहुत खराब', bg: 'bg-[#EF4444]', text: 'text-white', border: 'border-[#EF4444]', textHex: '#EF4444' };
    return { name: language === 'EN' ? 'Severe' : 'गंभीर', bg: 'bg-[#7E22CE]', text: 'text-white', border: 'border-[#7E22CE]', textHex: '#7E22CE' };
  };

  const getWeatherIcon = (name) => {
    switch (name) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-slate-400" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'windy':
        return <Wind className="w-8 h-8 text-teal-500 animate-pulse" />;
      case 'hazy':
      default:
        return <Layers className="w-8 h-8 text-orange-400" />;
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'temp': return <Thermometer className="w-5 h-5 text-red-500" />;
      case 'wind': return <Wind className="w-5 h-5 text-blue-500" />;
      case 'rain': return <CloudRain className="w-5 h-5 text-emerald-500" />;
      case 'satellite': return <Layers className="w-5 h-5 text-purple-500" />;
      case 'construction': return <FileText className="w-5 h-5 text-amber-600" />;
      case 'garbage': return <AlertTriangle className="w-5 h-5 text-[#DC2626]" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  // SVG coordinate mapper for history graph
  // SVG coordinate mapper for 14-day timeline graph (History + Forecast)
  const renderHistoryGraph = () => {
    if (!aiData || !aiData.history || !aiData.forecast) return null;
    
    // Combine history (7 days) and forecast (7 days)
    const history = aiData.history.map(item => ({ ...item, isForecast: false }));
    const forecast = aiData.forecast.map(item => ({ 
      day: item.label === "Today" ? "Today" : item.label.replace("Day +", "D+"),
      aqi: item.aqi,
      temp: aiData.temp, // simplified
      humidity: aiData.humidity,
      windSpeed: aiData.windSpeed,
      citizenReports: 0,
      satelliteStatus: "AI Predicted",
      isForecast: true 
    }));
    const fullTimeline = [...history, ...forecast];
    
    // SVG Dimensions
    const width = 1000;
    const height = 320;
    const paddingLeft = 50;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 50;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxAqi = 400;

    const points = fullTimeline.map((item, idx) => {
      const x = paddingLeft + idx * (chartWidth / (fullTimeline.length - 1));
      const y = height - paddingBottom - (item.aqi / maxAqi) * chartHeight;
      return { x, y, ...item };
    });

    const linePath = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z` 
      : "";

    // Threshold lines for Y-axis
    const thresholdValues = [50, 100, 200, 300];
    const todayIndex = 6; // Index 6 is 'Today' (the 7th item)
    const todayX = points[todayIndex]?.x || 0;

    return (
      <div className="relative w-full overflow-x-auto select-none neu-pressed p-4 md:p-6 rounded-3xl">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="min-w-[800px] overflow-visible">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {thresholdValues.map((val) => {
            const y = height - paddingBottom - (val / maxAqi) * chartHeight;
            return (
              <g key={val} className="opacity-40">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#94A3B8" 
                  strokeDasharray="4 4" 
                  strokeWidth="1"
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[11px] font-bold fill-slate-500"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bottom border */}
          <line 
            x1={paddingLeft} 
            y1={height - paddingBottom} 
            x2={width - paddingRight} 
            y2={height - paddingBottom} 
            stroke="#94A3B8" 
            strokeWidth="2"
            className="opacity-50"
          />

          {/* Today Divider */}
          <line 
            x1={todayX} 
            y1={paddingTop - 20} 
            x2={todayX} 
            y2={height - paddingBottom} 
            stroke="#64748B" 
            strokeWidth="2"
            strokeDasharray="6 6"
            className="opacity-60"
          />
          <rect x={todayX - 45} y={paddingTop - 35} width="90" height="24" rx="12" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <text x={todayX} y={paddingTop - 18} textAnchor="middle" className="text-[11px] font-black fill-slate-600 uppercase tracking-widest">
            TODAY
          </text>
          
          <text x={paddingLeft + 40} y={paddingTop - 18} textAnchor="start" className="text-[11px] font-black fill-emerald-600 uppercase tracking-widest">
            ← HISTORICAL
          </text>
          
          <text x={width - paddingRight - 40} y={paddingTop - 18} textAnchor="end" className="text-[11px] font-black fill-blue-600 uppercase tracking-widest">
            FORECAST →
          </text>

          {/* Render Area Path */}
          {areaPath && (
            <path 
              d={areaPath} 
              fill="url(#chartGlow)"
              className="animate-fadeIn"
            />
          )}

          {/* Render Line Path */}
          {linePath && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animated-line drop-shadow-md"
              style={{
                strokeDasharray: '2000',
                strokeDashoffset: '2000',
                animation: 'drawLine 2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            />
          )}

          {/* Render dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <text 
                x={p.x} 
                y={height - paddingBottom + 25} 
                textAnchor="middle" 
                className={`text-[12px] font-extrabold ${p.isForecast ? 'fill-blue-600' : 'fill-slate-500'}`}
              >
                {p.day}
              </text>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredDot === idx ? 8 : 6}
                className={`transition-all duration-300 cursor-pointer ${
                  hoveredDot === idx 
                    ? p.isForecast ? 'fill-blue-600 stroke-white stroke-[3px] filter drop-shadow-lg' : 'fill-emerald-600 stroke-white stroke-[3px] filter drop-shadow-lg'
                    : p.isForecast ? 'fill-blue-500 stroke-white stroke-[2px]' : 'fill-[#10B981] stroke-white stroke-[2px]'
                }`}
                onMouseEnter={() => setHoveredDot(idx)}
                onMouseLeave={() => setHoveredDot(null)}
              />
              {/* Invisible larger hover zone */}
              <circle
                cx={p.x}
                cy={p.y}
                r={24}
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setHoveredDot(idx)}
                onMouseLeave={() => setHoveredDot(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip display */}
        {hoveredDot !== null && points[hoveredDot] && (
          <div 
            className="absolute bg-[#F1F5F9] border border-slate-200/80 p-4 rounded-2xl shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] z-25 pointer-events-none text-left w-64 animate-fadeIn"
            style={{
              left: `${Math.min(points[hoveredDot].x + 20, chartWidth - 160)}px`,
              top: `${Math.max(10, points[hoveredDot].y - 120)}px`
            }}
          >
            <div className="font-extrabold text-slate-800 border-b border-slate-200 pb-2 mb-3 flex justify-between items-center text-[13px]">
              <span className="uppercase tracking-wider">{points[hoveredDot].day}</span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold shadow-inner ${getAqiCategory(points[hoveredDot].aqi).bg} ${getAqiCategory(points[hoveredDot].aqi).text}`}>
                {getAqiCategory(points[hoveredDot].aqi).name}
              </span>
            </div>
            <div className="space-y-2 text-[12px] font-bold text-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">{t.estimatedAQI}:</span>
                <span className={`text-xl font-black ${getAqiCategory(points[hoveredDot].aqi).textHex ? `text-[${getAqiCategory(points[hoveredDot].aqi).textHex}]` : 'text-slate-900'}`}>{points[hoveredDot].aqi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Type:</span>
                <span className={points[hoveredDot].isForecast ? "text-blue-600 font-extrabold" : "text-emerald-600 font-extrabold"}>
                  {points[hoveredDot].isForecast ? "AI Forecast" : "Historical"}
                </span>
              </div>
              {!points[hoveredDot].isForecast && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">{t.temp}:</span>
                    <span className="text-slate-800">{points[hoveredDot].temp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">{t.windSpeed}:</span>
                    <span className="text-slate-800">{points[hoveredDot].windSpeed} km/h</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full pt-32 pb-10 bg-[#F1F5F9] px-4 md:px-8 min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto space-y-6">

        {/* PAGE HEADER NAVIGATION BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200 pb-5">
          <div className="flex items-start space-x-3 text-left">
            <button
              onClick={onBack}
              className="neu-button p-2.5 mt-1 text-slate-500 rounded-xl transition cursor-pointer"
              title={t.backBtn}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <h2 className="text-[26px] md:text-[30px] font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2.5">
                <Brain className="w-8 h-8 text-[#15803D] animate-pulse" />
                <span>{t.title}</span>
              </h2>
              <p className="text-[14px] md:text-[15px] text-slate-500 font-medium max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* TOP RIGHT TELEMETRY AND LOCATION BADGE */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start lg:self-center neu-flat p-3 rounded-2xl shrink-0 w-full sm:w-auto">
            {localLocation ? (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center space-x-2 neu-pressed px-3.5 py-2 rounded-xl text-[13px] font-extrabold text-slate-700">
                  <MapPin className="w-4 h-4 text-[#15803D]" />
                  <span className="truncate max-w-[140px] md:max-w-[200px]">
                    {localLocation.displayName || getDisplayNameFromCoords(localLocation.latitude, localLocation.longitude)}
                  </span>
                  <button
                    onClick={() => setIsLocalModalOpen(true)}
                    className="text-xs text-[#15803D] hover:underline font-extrabold ml-1 cursor-pointer"
                  >
                    [{t.editLocation}]
                  </button>
                </div>

                {aiData && (
                  <>
                    <div className="neu-pressed text-emerald-800 px-3.5 py-2 rounded-xl text-[12.5px] font-bold text-left">
                      <div className="text-[9.5px] uppercase text-emerald-600 font-black tracking-wider leading-none">{t.confidence}</div>
                      <div className="mt-0.5 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 animate-bounce" />
                        <span>{aiData.confidence}%</span>
                      </div>
                    </div>

                    <div className="neu-pressed text-slate-700 px-3.5 py-2 rounded-xl text-[12.5px] font-bold text-left hidden md:block">
                      <div className="text-[9.5px] uppercase text-slate-400 font-black tracking-wider leading-none">{t.lastUpdated}</div>
                      <div className="mt-0.5 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{aiData.lastUpdated}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <span className="text-[13px] font-bold text-slate-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                  {t.noLocation}
                </span>
                <button
                  onClick={() => setIsLocalModalOpen(true)}
                  className="neu-button text-emerald-600 text-[12.5px] font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  📍 {t.chooseLocation}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE PAGE CONTAINER */}
        {!localLocation ? (
          /* NO LOCATION AWAITING CONFIGURATION */
          <div className="neu-flat rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[400px]">
            <div className="w-16 h-16 rounded-2xl neu-pressed flex items-center justify-center text-slate-400">
              <Lock className="w-7 h-7 text-slate-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">AI Environmental Estimation Stalled</h3>
              <p className="text-[14.5px] text-slate-550 max-w-lg font-semibold leading-relaxed">
                Hyperlocal environmental intelligence modeling requires a coordinates anchor. Select a node location below to initialize the AI prediction pipelines.
              </p>
            </div>
            <button
              onClick={() => setIsLocalModalOpen(true)}
              className="text-[14px] font-black text-emerald-600 neu-button px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>📍 {t.chooseLocation}</span>
            </button>
          </div>
        ) : loadingStep >= 0 ? (
          /* STEPPED PIPELINE LOADING ANIMATION */
          <div className="neu-flat rounded-3xl p-10 md:p-16 text-center flex flex-col items-center justify-center min-h-[450px] space-y-8 animate-fadeIn">
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Outer scanning rings */}
              <div className="absolute inset-0 rounded-full border-4 border-[#F1F5F9] border-t-emerald-500 animate-spin shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]"></div>
              <div className="absolute inset-2 rounded-full border-4 border-[#F1F5F9] border-b-emerald-600 animate-spin-slow"></div>
              <div className="w-12 h-12 rounded-2xl neu-pressed flex items-center justify-center">
                <Brain className="w-6 h-6 text-[#15803D] animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-800">{t.refreshPrediction}</h4>
              <p className="text-[13.5px] text-slate-450 font-bold tracking-wide uppercase">{loadingSteps[loadingStep]?.[language.toLowerCase() || 'en']}</p>
            </div>

            {/* Stepped Checklist Progress */}
            <div className="w-full max-w-sm space-y-3 neu-pressed p-6 rounded-2xl text-left font-semibold">
              {loadingSteps.map((step, idx) => {
                const isCompleted = idx < loadingStep;
                const isActive = idx === loadingStep;
                
                return (
                  <div key={idx} className="flex items-center space-x-3 text-[13.5px]">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-650 shrink-0" />
                    ) : isActive ? (
                      <RefreshCw className="w-4 h-4 text-[#15803D] animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 bg-white shrink-0" />
                    )}
                    <span className={`transition-all duration-150 ${isCompleted ? 'text-slate-400 line-through' : isActive ? 'text-slate-850 font-bold' : 'text-slate-400 font-medium'}`}>
                      {step[language.toLowerCase() || 'en']}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : aiData ? (
          /* RENDER FULL PREDICTIONS DASHBOARD */
          <div className="space-y-8 animate-fadeIn text-left">



            {/* SECTION 2: ESTIMATED AQI HISTORY GRAPH */}
            <div className="neu-flat rounded-3xl p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-850">{t.historyTitle}</h3>
                  <p className="text-[12.5px] text-slate-400 font-medium">This graph represents the historical AQI data of the previous seven days.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-bold neu-pressed text-slate-500">
                  📈 {t.title}
                </span>
              </div>
              {renderHistoryGraph()}
            </div>

            {/* SECTION 3: AI FORECAST */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-[#15803D]" />
                <span>{t.aiForecast} (Today + Next 3 Days)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {aiData.forecast.map((f, idx) => {
                  const cat = getAqiCategory(f.aqi);
                  return (
                    <div 
                      key={idx} 
                      className={`neu-pressed rounded-3xl border-t-4 ${cat.border} border-x border-b border-transparent p-5 hover:-translate-y-1 transition duration-200 flex flex-col justify-between relative`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[12px] text-slate-400 font-black uppercase tracking-wider">{f.label}</span>
                        {getWeatherIcon(f.weatherIcon)}
                      </div>

                      <div className="my-4 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">{t.estimatedAQI}</div>
                        <div className="text-4xl font-black text-slate-900 mt-1">{f.aqi}</div>
                        <span className={`inline-block text-[11.5px] font-black px-3.5 py-1 rounded-full mt-2.5 shadow-sm ${cat.bg} ${cat.text}`}>
                          {cat.name}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[11.5px] font-bold text-slate-500 mt-1">
                        <span>{t.confidenceScore}:</span>
                        <span className="text-slate-800 font-extrabold">{f.confidence}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4: WHY AI PREDICTED THIS */}
            <div className="neu-flat rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#111827] flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-[#15803D]" />
                  <span>{t.whyAIPredicted} ({t.title})</span>
                </h3>
                <p className="text-[12.5px] text-slate-400 font-medium">Environmental correlation analysis representing atmospheric dependencies mapped by CleanAir neural weights.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiData.insights.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl neu-pressed flex items-start space-x-3 text-[13px] font-bold text-slate-700"
                  >
                    <div className="p-2 neu-flat rounded-xl shrink-0">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-slate-800 leading-normal text-[13.5px]">{insight.text}</p>
                      <div className="flex items-center space-x-3 text-[11px] font-black tracking-wide uppercase">
                        <span className="text-slate-400 font-bold">Impact: <strong className="text-slate-700 font-black">{insight.impact}</strong></span>
                        <span className={`inline-flex items-center space-x-1 ${insight.isIncrease ? 'text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full' : 'text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full'}`}>
                          {insight.isIncrease ? (
                            <>
                              <TrendingUp className="w-3 h-3 stroke-[3]" />
                              <span>AQI Increase</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 stroke-[3]" />
                              <span>AQI Decrease</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: HEALTH ADVISORY */}
            <div className="neu-flat rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="space-y-3 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-200 pb-5 lg:pb-0 lg:pr-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-650 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full flex items-center space-x-1.5 w-fit">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>{t.healthAdvisory}</span>
                </span>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{t.advisoryNotes}</h4>
                <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                  Localized health recommendations derived by correlating active Estimated AQI levels with municipal health hazard boundaries.
                </p>
                {aiData.bestTime && (
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-[12.5px] font-extrabold text-emerald-800">
                    <span className="block text-[9.5px] uppercase tracking-wider text-emerald-600 font-black">{t.bestOutdoorTime}</span>
                    <span className="mt-0.5">{aiData.bestTime}</span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-3 font-semibold text-[13.5px] text-slate-750 text-left">
                {aiData.advisories.map((adv, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-150 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-slate-700">{adv}</p>
                  </div>
                ))}
              </div>
            </div>


          </div>
        ) : null}

      </div>

      {/* Localized Scope Location Modal */}
      <LocationModal
        isOpen={isLocalModalOpen}
        onClose={() => setIsLocalModalOpen(false)}
        language={language}
        selectedLocation={localLocation}
        setSelectedLocation={(loc) => {
          setLocalLocation(loc);
          setIsLocalModalOpen(false);
        }}
      />

      {/* SVG drawing helper styles */}
      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .animated-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
