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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="h-screen bg-[#f1f5f9] flex font-sans text-slate-800 antialiased overflow-hidden relative">
      <MunicipalitySidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`flex-1 transition-all duration-300 flex flex-col h-screen relative z-10 w-full box-border ${isSidebarOpen ? 'pl-72' : 'pl-0'}`}>
        <MunicipalityTopNav 
          onBack={onBack} 
          user={user} 
          setActiveTab={setActiveTab} 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
