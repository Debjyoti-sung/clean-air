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
  const seed = Math.abs(Math.sin(lat) * Math.cos(lng) * 100) % 1;

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

  // Generate 4-day forecast: Today and the next 3 days
  const forecast = [];
  const forecastLabels = lang === 'EN' 
    ? ["Today", "Tomorrow", "Day +2", "Day +3"]
    : ["आज", "कल", "दिन +2", "दिन +3"];
    
  for (let i = 0; i < 4; i++) {
    const fSeed = Math.abs(Math.sin(lat - i * 2) * Math.cos(lng + i * 3) * 100) % 1;
    // Today matches baseAqi
    let change = i === 0 ? 0 : Math.floor((fSeed - 0.4) * 40);
    const fAqi = Math.max(15, baseAqi + change);
    const confidence = 87 + Math.floor(fSeed * 11); // 87% - 98%

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
      aqi: fAqi,
      confidence,
      weatherIcon
    });
  }

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

  // Health Advisories depending on AQI value
  let advisories = [];
  let bestTime = "";
  const isEnglish = lang === 'EN';

  // Base AQI Advisories
  if (baseAqi <= 50) {
    advisories.push(isEnglish ? "Air quality is excellent. Ideal for outdoor workouts and leisure." : "वायु गुणवत्ता उत्कृष्ट है। बाहरी कसरत और मनोरंजन के लिए आदर्श।");
    bestTime = isEnglish ? "Any time of day" : "दिन में किसी भी समय";
  } else if (baseAqi <= 100) {
    advisories.push(isEnglish ? "Air quality is acceptable. Safe for outdoor exercise." : "वायु गुणवत्ता स्वीकार्य है। बाहरी व्यायाम के लिए सुरक्षित।");
    bestTime = isEnglish ? "11:00 AM - 04:00 PM (winds are active)" : "सुबह 11:00 बजे - शाम 04:00 बजे (हवाएं सक्रिय हैं)";
  } else if (baseAqi <= 200) {
    advisories.push(isEnglish ? "Air quality is poor. Sensitive groups should limit prolonged outdoor physical activities." : "वायु गुणवत्ता खराब है। संवेदनशील समूहों को लंबे समय तक बाहरी शारीरिक गतिविधियों को सीमित करना चाहिए।");
    bestTime = isEnglish ? "01:00 PM - 03:00 PM (maximum dispersion)" : "दोपहर 01:00 बजे - दोपहर 03:00 बजे (अधिकतम प्रसार)";
  } else if (baseAqi <= 300) {
    advisories.push(isEnglish ? "Air quality is very poor. Wear certified N95 masks for any outdoor activity or transit." : "वायु गुणवत्ता बहुत खराब है। किसी भी बाहरी गतिविधि या यात्रा के लिए प्रमाणित N95 मास्क पहनें।");
    bestTime = isEnglish ? "Avoid outdoor exposure" : "बाहर जाने से बचें";
  } else {
    advisories.push(isEnglish ? "Severe air crisis. Avoid all outdoor exposures and use continuous air filtration indoors." : "गंभीर वायु संकट। सभी बाहरी जोखिमों से बचें और घर के अंदर निरंतर वायु निस्पंदन का उपयोग करें।");
    bestTime = isEnglish ? "Emergency transit only" : "केवल आपातकालीन यात्रा";
  }

  // Weather conditions
  if (windSpeed > 16) {
    advisories.push(isEnglish ? "High wind speeds are helping disperse pollutants. Ensure windows are secured against dust." : "तेज हवा की गति प्रदूषकों को फैलाने में मदद कर रही है। सुनिश्चित करें कि खिड़कियां धूल से सुरक्षित हैं।");
  } else if (windSpeed < 9) {
    advisories.push(isEnglish ? "Low wind conditions are causing pollutants to stagnate. Keep indoor spaces well-ventilated if possible." : "हवा की गति कम होने से प्रदूषक जमा हो रहे हैं। यदि संभव हो तो इनडोर स्थानों को अच्छी तरह हवादार रखें।");
  }

  if (parseFloat(rainfall) > 0.0) {
    advisories.push(isEnglish ? "Heavy rainfall is washing out airborne particulate matter, rapidly improving air quality." : "भारी वर्षा हवा में मौजूद कणों को साफ कर रही है, जिससे वायु गुणवत्ता में तेजी से सुधार हो रहा है।");
  }

  // Pollutant sources
  if (constructionDust > 3) {
    advisories.push(isEnglish ? "High construction activity detected nearby. Wear protective masks when traveling through affected zones." : "आस-पास भारी निर्माण गतिविधि का पता चला है। प्रभावित क्षेत्रों से यात्रा करते समय सुरक्षात्मक मास्क पहनें।");
  }

  if (seed > 0.45) { // Smoke detected
    advisories.push(isEnglish ? "Smoke plumes have been detected in the vicinity. Keep windows closed to prevent indoor contamination." : "आस-पास धुएं के गुबार पाए गए हैं। घर के अंदर प्रदूषण को रोकने के लिए खिड़कियां बंद रखें।");
  }

  if (industrialSmoke > 2) {
    advisories.push(isEnglish ? "Industrial emissions are elevating local PM levels. Avoid prolonged exposure in industrial corridors." : "औद्योगिक उत्सर्जन स्थानीय पीएम स्तर बढ़ा रहा है। औद्योगिक गलियारों में लंबे समय तक रहने से बचें।");
  }

  if (garbageBurning > 1) {
    advisories.push(isEnglish ? "Local garbage burning is significantly impacting air quality. Report incidents to municipal authorities." : "स्थानीय कचरा जलाना वायु गुणवत्ता को काफी प्रभावित कर रहा है। नगर निगम अधिकारियों को घटनाओं की रिपोर्ट करें।");
  }

  if (seed > 0.35) { // Elevated dust
    advisories.push(isEnglish ? "Noticeable dust accumulation is expected. Use HEPA air purifiers indoors for relief." : "उल्लेखनीय धूल संचय की उम्मीद है। राहत के लिए घर के अंदर HEPA एयर प्यूरीफायर का उपयोग करें।");
  }
  
  // Trend (Improving / Deteriorating)
  let nextDayAqi = forecast[1]?.aqi || baseAqi;
  if (nextDayAqi > baseAqi + 20) {
    advisories.push(isEnglish ? "Air quality is expected to deteriorate tomorrow. Plan outdoor activities accordingly." : "कल वायु गुणवत्ता खराब होने की उम्मीद है। तदनुसार बाहरी गतिविधियों की योजना बनाएं।");
  } else if (nextDayAqi < baseAqi - 20) {
    advisories.push(isEnglish ? "Air quality is steadily improving. Favorable conditions for outdoor planning soon." : "वायु गुणवत्ता में लगातार सुधार हो रहा है। जल्द ही बाहरी योजना के लिए अनुकूल परिस्थितियां।");
  }

  // Ensure we show at most 5 advisories to not clutter the UI
  if (advisories.length > 5) {
    advisories = advisories.slice(0, 5);
  }

  let summaryText = "";
  if (baseAqi > 200) {
    summaryText = lang === 'EN'
      ? "Stagnant boundary layer combined with satellite-detected smoke and municipal citizen complaints has triggered significant PM2.5 and PM10 accumulation."
      : "ठहरी हुई वायुमंडलीय परत, सैटेलाइट-पहचाने गए धुएं और नागरिक शिकायतों के कारण पीएम2.5 और पीएम10 का गंभीर संचय हुआ है।";
  } else if (baseAqi < 75) {
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
  const renderHistoryGraph = () => {
    if (!aiData || !aiData.history) return null;
    const history = aiData.history;
    
    // SVG Dimensions
    const width = 700;
    const height = 280;
    const paddingLeft = 50;
    const paddingRight = 30;
    const paddingTop = 40;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxAqi = 350;

    const points = history.map((item, idx) => {
      const x = paddingLeft + idx * (chartWidth / 6);
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

    return (
      <div className="relative w-full overflow-x-auto select-none bg-slate-55/30 p-2 md:p-4 rounded-xl border border-slate-100">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="min-w-[650px] overflow-visible">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
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
                  className="text-[10px] font-bold fill-slate-400"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bottom border & X-Axis label positions */}
          <line 
            x1={paddingLeft} 
            y1={height - paddingBottom} 
            x2={width - paddingRight} 
            y2={height - paddingBottom} 
            stroke="#cbd5e1" 
            strokeWidth="1.5"
          />

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
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animated-line"
              style={{
                strokeDasharray: '1000',
                strokeDashoffset: '1000',
                animation: 'drawLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            />
          )}

          {/* Render hover interaction areas & dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <text 
                x={p.x} 
                y={height - paddingBottom + 20} 
                textAnchor="middle" 
                className="text-[11.5px] font-bold fill-slate-500"
              >
                {p.day}
              </text>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredDot === idx ? 7 : 5}
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredDot === idx 
                    ? 'fill-emerald-650 stroke-white stroke-[2px] filter drop-shadow-md' 
                    : 'fill-[#10B981] stroke-white stroke-[1.5px]'
                }`}
                onMouseEnter={() => setHoveredDot(idx)}
                onMouseLeave={() => setHoveredDot(null)}
              />
              {/* Invisible larger hover zone circle for ease of touch/hover */}
              <circle
                cx={p.x}
                cy={p.y}
                r={20}
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
            className="absolute bg-white/95 backdrop-blur-md border border-slate-200/80 p-3.5 rounded-xl shadow-xl z-25 pointer-events-none text-left w-56 animate-fadeIn"
            style={{
              left: `${Math.min(points[hoveredDot].x + 12, chartWidth - 140)}px`,
              top: `${Math.max(10, points[hoveredDot].y - 90)}px`
            }}
          >
            <div className="font-extrabold text-slate-800 border-b border-slate-100 pb-1.5 mb-2 flex justify-between items-center text-[12.5px]">
              <span>{points[hoveredDot].day}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shadow-sm ${getAqiCategory(points[hoveredDot].aqi).bg} ${getAqiCategory(points[hoveredDot].aqi).text}`}>
                {getAqiCategory(points[hoveredDot].aqi).name}
              </span>
            </div>
            <div className="space-y-1.5 text-[11.5px] font-bold text-slate-655">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t.estimatedAQI}:</span>
                <span className="text-slate-900 font-extrabold text-[12px]">{points[hoveredDot].aqi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t.temp}:</span>
                <span className="text-slate-800">{points[hoveredDot].temp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t.humidity}:</span>
                <span className="text-slate-800">{points[hoveredDot].humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t.windSpeed}:</span>
                <span className="text-slate-800">{points[hoveredDot].windSpeed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t.citizenReports}:</span>
                <span className="text-slate-800">{points[hoveredDot].citizenReports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t.smoke}:</span>
                <span className="text-slate-800 truncate max-w-[100px]">{points[hoveredDot].satelliteStatus}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full py-10 bg-[#F8FAFC] px-4 md:px-8 min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto space-y-6">

        {/* PAGE HEADER NAVIGATION BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200 pb-5">
          <div className="flex items-start space-x-3 text-left">
            <button
              onClick={onBack}
              className="p-2.5 mt-1 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-655 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start lg:self-center bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-sm shrink-0 w-full sm:w-auto">
            {localLocation ? (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center space-x-2 bg-[#F1F5F9] px-3.5 py-2 rounded-xl text-[13px] font-extrabold text-slate-700">
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
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-[12.5px] font-bold text-left">
                      <div className="text-[9.5px] uppercase text-emerald-600 font-black tracking-wider leading-none">{t.confidence}</div>
                      <div className="mt-0.5 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 animate-bounce" />
                        <span>{aiData.confidence}%</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-[12.5px] font-bold text-left hidden md:block">
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
                  className="bg-[#15803D] hover:bg-[#166534] text-white text-[12.5px] font-bold px-4 py-2 rounded-lg shadow transition cursor-pointer"
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[400px]">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
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
              className="text-[14px] font-black text-white bg-[#15803D] hover:bg-[#166534] px-6 py-3 rounded-xl shadow hover:shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>📍 {t.chooseLocation}</span>
            </button>
          </div>
        ) : loadingStep >= 0 ? (
          /* STEPPED PIPELINE LOADING ANIMATION */
          <div className="bg-white rounded-3xl border border-slate-250/80 shadow-md p-10 md:p-16 text-center flex flex-col items-center justify-center min-h-[450px] space-y-8 animate-fadeIn">
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Outer scanning rings */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-slate-100 border-b-[#15803D]/60 animate-spin-slow"></div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-inner">
                <Brain className="w-6 h-6 text-[#15803D] animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-800">{t.refreshPrediction}</h4>
              <p className="text-[13.5px] text-slate-450 font-bold tracking-wide uppercase">{loadingSteps[loadingStep]?.[language.toLowerCase() || 'en']}</p>
            </div>

            {/* Stepped Checklist Progress */}
            <div className="w-full max-w-sm space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left font-semibold">
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-850">{t.historyTitle}</h3>
                  <p className="text-[12.5px] text-slate-400 font-medium">This graph represents the historical AQI data of the previous seven days.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-500">
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
                      className={`bg-white rounded-2xl border-t-4 ${cat.border} border-x border-b border-slate-200/80 p-5 shadow-sm hover:shadow hover:-translate-y-1 transition duration-200 flex flex-col justify-between relative`}
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
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
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3 text-[13px] font-bold text-slate-700"
                  >
                    <div className="p-2 bg-white rounded-lg border border-slate-150 shrink-0">
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
            <div className="bg-white rounded-2xl border border-slate-250/80 shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
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

            {/* SECTION 6: AI ESTIMATION WORKFLOW */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="text-center space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 flex items-center justify-center space-x-2">
                  <Brain className="w-5 h-5 text-[#15803D]" />
                  <span>{t.workflowTitle}</span>
                </h3>
                <p className="text-[13px] text-slate-500 font-medium max-w-xl mx-auto">
                  Step-by-step aggregation and pipeline processing map demonstrating how environmental signals are transformed into predicted AQI forecasts.
                </p>
              </div>

              {/* Connected node timeline */}
              <div className="flex flex-col space-y-3 max-w-lg mx-auto py-3">
                {/* Node 1: Selected Location */}
                <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-150 flex items-center justify-center text-red-650 shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div className="text-left font-bold"><div className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">Step 1</div><span className="text-[13.5px] text-slate-800">{t.nodes.location}</span></div>
                </div>

                <div className="flex justify-center py-0.5"><div className="h-6 w-0.5 bg-dashed border-l-2 border-slate-300" /></div>

                {/* Node 2-4: Ingestion Layers */}
                <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl space-y-3">
                  <div className="text-[10.5px] text-slate-400 uppercase font-black tracking-wider leading-none text-left">Step 2: Aggregated Raw Inputs</div>
                  <div className="space-y-2 font-bold text-[13px] text-slate-750">
                    <div className="flex items-center space-x-3"><CloudRain className="w-4 h-4 text-blue-500 shrink-0" /> <span>{t.nodes.weather}</span></div>
                    <div className="flex items-center space-x-3"><Layers className="w-4 h-4 text-purple-500 shrink-0" /> <span>{t.nodes.satellite}</span></div>
                    <div className="flex items-center space-x-3"><AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" /> <span>{t.nodes.citizen}</span></div>
                  </div>
                </div>

                <div className="flex justify-center py-0.5"><div className="h-6 w-0.5 bg-dashed border-l-2 border-slate-300" /></div>

                {/* Node 5: Estimated AQI History */}
                <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-650 shrink-0"><Activity className="w-5 h-5" /></div>
                  <div className="text-left font-bold"><div className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">Step 3</div><span className="text-[13.5px] text-slate-800">{t.nodes.history}</span></div>
                </div>

                <div className="flex justify-center py-0.5"><div className="h-6 w-0.5 bg-dashed border-l-2 border-slate-300" /></div>

                {/* Node 6: AI Prediction Model */}
                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-emerald-500 to-[#15803D] text-white rounded-xl shadow-sm border border-emerald-600">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0"><Brain className="w-5 h-5" /></div>
                  <div className="text-left font-extrabold"><div className="text-[10px] text-emerald-150 uppercase font-black tracking-wider leading-none">Step 4: AI Model Engine</div><span className="text-[13.5px]">{t.nodes.aiModel}</span></div>
                </div>

                <div className="flex justify-center py-0.5"><div className="h-6 w-0.5 bg-dashed border-l-2 border-slate-300" /></div>

                {/* Node 7: Estimated AQI Forecast */}
                <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-655 shrink-0"><Gauge className="w-5 h-5" /></div>
                  <div className="text-left font-bold"><div className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">Step 5: Output Generation</div><span className="text-[13.5px] text-slate-800">{t.nodes.forecast}</span></div>
                </div>
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
