import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import StepperSidebar from './CitizenReporting/StepperSidebar';
import UploadCard from './CitizenReporting/UploadCard';
import LocationCard from './CitizenReporting/LocationCard';
import OverpassAnalysisCard from './CitizenReporting/OverpassAnalysisCard';
import AQICard from './CitizenReporting/AQICard';
import WeatherCard from './CitizenReporting/WeatherCard';
import SatelliteCard from './CitizenReporting/SatelliteCard';
import ReportSummaryCard from './CitizenReporting/ReportSummaryCard';
import AuthPromptCard from './CitizenReporting/AuthPromptCard';
import SuccessCard from './CitizenReporting/SuccessCard';
import { SupabaseService } from '../services/supabase.service';
import { EmailService } from '../services/email.service';
import { useEffect } from 'react';
import { mockReports, saveMockReports } from './Municipality/mockData';

export default function CitizenReporting({ language = 'EN', onBack, user, onUserChange }) {
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('citizen_wizard_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Shared state payload
  const [reportData, setReportData] = useState(() => {
    const saved = sessionStorage.getItem('citizen_wizard_data');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      image: null,
      location: null,
      analysis: null,
      user: null,
      notes: "",
      trackingId: null
    };
  });

  useEffect(() => {
    sessionStorage.setItem('citizen_wizard_step', step.toString());
  }, [step]);

  useEffect(() => {
    try {
      sessionStorage.setItem('citizen_wizard_data', JSON.stringify(reportData));
    } catch(e) {
      console.warn("Could not save wizard data to sessionStorage (possibly too large)", e);
    }
  }, [reportData]);

  useEffect(() => {
    if (user) {
      setReportData(prev => ({ ...prev, user }));
    } else {
      setReportData(prev => ({ ...prev, user: null }));
    }
  }, [user]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 10));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Determine if 'Next' button should be disabled
  const isNextDisabled = () => {
    if (step === 1 && !reportData.image) return true;
    if (step === 2 && !reportData.location?.lat) return true;
    if (step === 8 && !reportData.user) return true;
    return false;
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In production, upload the image to Supabase Storage first
      // const imageUrl = await SupabaseService.uploadImage(reportData.image);
      
      const res = await SupabaseService.submitReport(reportData);
      
      const trackingId = res.trackingId || `CIT-${Math.floor(Math.random() * 90000) + 10000}`;
      
      const newReport = {
        id: trackingId,
        citizenName: reportData.user?.user_metadata?.name || reportData.user?.user_metadata?.full_name || reportData.user?.email?.split('@')[0] || "Citizen",
        citizenEmail: reportData.user?.email || "citizen@AerioN.org",
        contactNumber: reportData.user?.user_metadata?.phone || "+91 99999 99999",
        issueCategory: reportData.analysis?.category || "Ambient Air Quality",
        priority: reportData.analysis?.severity === 'critical' ? 'Critical' : (reportData.analysis?.severity === 'high' ? 'High' : 'Moderate'),
        severity: reportData.analysis?.severity === 'critical' ? 'High' : (reportData.analysis?.severity === 'high' ? 'High' : 'Moderate'),
        location: reportData.location?.address ? reportData.location.address.split('\n')[0] : "Reported Location",
        wardNumber: "Ward 45",
        submittedDate: new Date().toISOString(),
        currentStatus: "New",
        assignedOfficer: null,
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        description: reportData.notes || "No description provided.",
        images: reportData.image ? [reportData.image] : [],
        aiSummary: {
          pollutionType: reportData.analysis?.category || "Visual Plume Signature",
          impactScore: reportData.analysis?.confidence || 85,
          explanation: reportData.analysis?.verification || "AI Verified plume boundaries.",
          nearbySensitiveAreas: ["Residential Zone (50m)"]
        },
        aiResolutionPlan: null,
        resourceRequest: null
      };

      mockReports.unshift(newReport);
      saveMockReports();
      
      setReportData(prev => ({ ...prev, trackingId: trackingId }));
      
      // Simulate sending confirmation email
      if (reportData.user?.email) {
        await EmailService.sendConfirmation(reportData.user.email, { trackingId: trackingId });
      }
      
      nextStep(); // Go to step 10 (Success)
    } catch (error) {
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActiveStep = () => {
    switch (step) {
      case 1:
        return <UploadCard 
          language={language} 
          onImageUploaded={(img) => setReportData(prev => ({ ...prev, image: img }))} 
        />;
      case 2:
        return <LocationCard 
          language={language}
          onLocationSelected={(loc) => setReportData(prev => ({ ...prev, location: loc }))}
        />;
      case 3:
        return <OverpassAnalysisCard coords={reportData.location} />;
      case 4:
        return <AQICard coords={reportData.location} />;
      case 5:
        return <WeatherCard coords={reportData.location} />;
      case 6:
        return <SatelliteCard coords={reportData.location} />;
      case 7:
        return <ReportSummaryCard 
          data={reportData} 
          notes={reportData.notes}
          setNotes={(val) => setReportData(prev => ({ ...prev, notes: val }))}
        />;
      case 8:
        return <AuthPromptCard 
          user={user}
          onAuthenticated={(loggedInUser) => {
            if (onUserChange) onUserChange(loggedInUser);
            setReportData(prev => ({ ...prev, user: loggedInUser }));
            nextStep();
          }}
        />;
      case 9:
        return (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Ready to Submit?</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
              By clicking submit, you confirm that this environmental report is accurate to the best of your knowledge.
            </p>
            <button 
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-8 py-4 text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black transition shadow-md flex items-center justify-center gap-2 mx-auto w-full md:w-auto min-w-[200px]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isSubmitting ? 'Transmitting Data...' : 'Submit Environmental Report'}
            </button>
          </div>
        );
      case 10:
        return (
          <SuccessCard 
            trackingId={reportData.trackingId} 
            reportData={reportData} 
            onBack={() => {
              sessionStorage.removeItem('citizen_wizard_step');
              sessionStorage.removeItem('citizen_wizard_data');
              onBack();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f1f5f9] text-slate-900 pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 text-left">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-600 hover:text-emerald-500 transition cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'EN' ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस जाएं'}</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <span>{language === 'EN' ? 'Citizen Intelligence Gateway' : 'नागरिक रिपोर्टिंग'}</span>
              <span className="text-[11px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full shadow-sm hidden sm:inline-block">
                Live Data Ingestion
              </span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-3xl">
              Report environmental violations. AI and space-based satellites verify and route report payloads to local wards instantly.
            </p>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          <StepperSidebar currentStep={step} language={language} />

          <div className="flex-1 flex flex-col min-h-[500px]">
            <div className="neu-flat rounded-[2.5rem] p-6 md:p-8 relative flex flex-col flex-1">
              
              {/* Dynamic Content */}
              <div className="flex-1 pb-8">
                {renderActiveStep()}
              </div>

              {/* Navigation Footer (Hide on Success step) */}
              {step < 10 && (
                <div className="pt-6 border-t border-slate-200/50 flex items-center justify-between mt-auto">
                  <button 
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                      step === 1 ? 'opacity-0 pointer-events-none' : 'neu-button text-slate-700'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  {step < 9 && step !== 8 && (
                    <button 
                      onClick={nextStep}
                      disabled={isNextDisabled()}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                        isNextDisabled() 
                          ? 'neu-pressed text-slate-400 cursor-not-allowed opacity-70' 
                          : 'neu-button text-emerald-700'
                      }`}
                    >
                      <span>Proceed to Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
