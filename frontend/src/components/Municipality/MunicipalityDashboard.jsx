import React, { useState } from 'react';
import MunicipalitySidebar from './MunicipalitySidebar';
import MunicipalityTopNav from './MunicipalityTopNav';
import CitizenReportsView from './CitizenReportsView';
import DashboardView from './DashboardView';
import { 
  ActiveCasesView, 
  AssignedTasksView, 
  AIRecommendationsView, 
  CompletedCasesView, 
  NotificationsView, 
  AnalyticsView, 
  TeamManagementView, 
  SettingsView 
} from './AllViews';

export default function MunicipalityDashboard({ language, onBack, user }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'Citizen Reports':
        return <CitizenReportsView language={language} />;
      case 'Active Cases':
        return <ActiveCasesView />;
      case 'Assigned Tasks':
        return <AssignedTasksView />;
      case 'Completed Cases':
        return <CompletedCasesView />;
      case 'Notifications':
        return <NotificationsView />;
      case 'Reports & Analytics':
        return <AnalyticsView />;
      case 'Team Management':
        return <TeamManagementView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-450">
            <h2 className="text-2xl font-bold mb-2">{activeTab}</h2>
            <p>Module under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-sans text-slate-800 antialiased overflow-x-hidden relative">
      <MunicipalitySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 ml-72 flex flex-col min-h-screen relative z-10">
        <MunicipalityTopNav onBack={onBack} user={user} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
