import React, { useState } from 'react';
import { 
  Users, Award, ShieldAlert, Cpu, Bell, Sliders, Play, 
  CheckCircle, ToggleLeft, ToggleRight, Shield, AlertTriangle 
} from 'lucide-react';
import ReportsTable from './ReportsTable';
import ReportDrawer from './ReportDrawer';
import { mockReports, mockOfficers, mockNotifications, mockHotspots } from './mockData';

// 1. ACTIVE CASES VIEW
export function ActiveCasesView() {
  const [reports, setReports] = useState(mockReports.filter(r => r.currentStatus === 'Work In Progress' || r.currentStatus === 'Officer Assigned'));
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleExpand = (report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Cases</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Dispatched teams currently executing AI resolution checklists on-site.</p>
      </div>

      <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 rounded-[2rem] overflow-hidden">
        {reports.length > 0 ? (
          <ReportsTable reports={reports} onExpand={handleExpand} />
        ) : (
          <div className="p-12 text-center text-slate-400 font-semibold">No active field cases.</div>
        )}
      </div>

      <ReportDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} report={reports.find(r => r.id === selectedReport?.id)} setReports={setReports} readOnly={true} />
    </div>
  );
}

// 2. ASSIGNED TASKS VIEW
export function AssignedTasksView() {
  const [reports, setReports] = useState(mockReports.filter(r => r.assignedOfficer === 'Arjun Singh' || r.assignedOfficer === 'Vikram Das'));
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleExpand = (report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Tasks</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Operational tasks directly assigned to your specific division team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 rounded-3xl p-6 relative flex flex-col justify-between hover:scale-[1.01] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">{report.id}</span>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-750 text-[10px] font-black uppercase rounded border border-purple-100">
                  {report.currentStatus}
                </span>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">{report.issueCategory}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">{report.location}</p>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">{report.description}</p>
            </div>
            
            <div className="border-t border-slate-200/50 pt-4 mt-6 flex justify-between items-center">
              <div>
                <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Assigned Officer</div>
                <div className="text-xs font-bold text-slate-705">{report.assignedOfficer}</div>
              </div>
              <button 
                onClick={() => handleExpand(report)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>

      <ReportDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} report={reports.find(r => r.id === selectedReport?.id)} setReports={setReports} readOnly={true} />
    </div>
  );
}

// 3. AI RECOMMENDATIONS VIEW
export function AIRecommendationsView() {
  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Intelligence & Recommendations</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Space-based temporal analysis of environmental anomalies and pollution hotspots.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Anomaly Detection */}
        <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem] space-y-6">
          <div className="flex items-center space-x-3 text-[#15803D]">
            <Cpu className="w-6 h-6" />
            <h3 className="text-lg font-black text-slate-900">AQI Deviation Alerts</h3>
          </div>
          <div className="space-y-4">
            {[
              { location: "Ward 45 (Dwarka)", anomaly: "Particulate PM2.5 spike +85μg/m³ detected above baseline.", time: "10 mins ago" },
              { location: "Ward 88 (Okhla)", anomaly: "Sudden temporal heat signature signature anomaly near chimney stack.", time: "2 hours ago" },
            ].map((alert, idx) => (
              <div key={idx} className="p-4 bg-rose-50/80 border border-rose-100 rounded-2xl flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-900">{alert.location}</div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">{alert.anomaly}</p>
                  <span className="text-[10px] text-slate-450 font-bold block mt-1">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Dispatch Recommendation */}
        <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem] space-y-6">
          <div className="flex items-center space-x-3 text-[#15803D]">
            <Cpu className="w-6 h-6" />
            <h3 className="text-lg font-black text-slate-900">Pre-emptive Dispatch Guide</h3>
          </div>
          <p className="text-xs text-slate-655 leading-relaxed font-medium">
            Based on current satellite atmospheric dispersion grids, air particulate matter is trending towards residential zone Dwarka Sector 10.
          </p>
          <div className="p-4 bg-[#f1f5f9] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] border border-transparent rounded-2xl space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Recommended Routing Strategy</div>
            <div className="text-sm font-bold text-slate-800">Deploy 2 Wet Suppression Tankers to Sector 10 Bypass Roadway within 1.5 hours to intercept dispersion.</div>
          </div>
          <button className="w-full py-3 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-[0_4px_12px_rgba(21,128,61,0.25)] cursor-pointer">
            <Play className="w-3.5 h-3.5" />
            <span>Generate Requisition Ticket</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// 4. COMPLETED CASES VIEW
export function CompletedCasesView() {
  const [reports, setReports] = useState(mockReports.filter(r => r.currentStatus === 'Completed'));
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleExpand = (report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Completed Cases</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Audit log of resolved complaints with uploaded GPS verification proof.</p>
      </div>

      <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 rounded-[2rem] overflow-hidden">
        {reports.length > 0 ? (
          <ReportsTable reports={reports} onExpand={handleExpand} />
        ) : (
          <div className="p-12 text-center text-slate-400 font-semibold">No completed cases logged.</div>
        )}
      </div>

      <ReportDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} report={reports.find(r => r.id === selectedReport?.id)} setReports={setReports} readOnly={true} />
    </div>
  );
}

// 5. NOTIFICATIONS VIEW
export function NotificationsView() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Notifications</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Audit logs, critical updates, and system level events.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-[#15803D] hover:text-[#166534] transition"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 rounded-[2rem] overflow-hidden divide-y divide-slate-200/60">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-5 flex items-start justify-between transition-colors ${notif.read ? 'bg-[#f1f5f9]/10' : 'bg-[#15803D]/5'}`}>
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-xl mt-0.5 ${
                notif.type === 'Urgent' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                notif.type === 'SLA Warning' ? 'bg-amber-50 text-amber-605 border border-amber-100' :
                'bg-slate-200/50 text-slate-500 border border-slate-200'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{notif.message}</div>
                <div className="flex items-center space-x-2 mt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>{notif.type}</span>
                  <span>&bull;</span>
                  <span>{notif.time}</span>
                </div>
              </div>
            </div>
            {!notif.read && (
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 animate-pulse"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. REPORTS & ANALYTICS VIEW
export function AnalyticsView() {
  return (
    <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Monthly environmental resolution performance and ward breakdown tables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Performance SVG */}
        <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem]">
          <h3 className="text-lg font-black text-slate-900 mb-6">Weekly Resolution Rate</h3>
          <div className="relative h-64 w-full flex items-end justify-between px-4 pb-2">
            {[65, 80, 45, 95, 70, 85, 90].map((height, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2 w-10">
                <div className="w-full bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] rounded-t-lg relative group overflow-hidden" style={{ height: '180px' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#15803D] rounded-t-lg transition-all duration-500 group-hover:bg-[#166534]" style={{ height: `${height}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-slate-450">Wk {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Breakdown */}
        <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 p-6 rounded-[2rem]">
          <h3 className="text-lg font-black text-slate-900 mb-6">Pollution Category Breakdown</h3>
          <div className="space-y-4">
            {[
              { category: "Industrial Air Smoke", percentage: 42, count: "524 cases", color: "bg-amber-500" },
              { category: "Illegal Waste Dumping", percentage: 28, count: "349 cases", color: "bg-blue-500" },
              { category: "River foam / Water Effluents", percentage: 18, count: "224 cases", color: "bg-teal-500" },
              { category: "Municipal Garbage burning", percentage: 12, count: "151 cases", color: "bg-rose-500" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.category}</span>
                  <span className="text-slate-450">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. TEAM MANAGEMENT VIEW
export function TeamManagementView() {
  const [officers] = useState(mockOfficers);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Team Management</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Field operations directory, division active workloads, and operational statuses.</p>
      </div>

      <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-200/20 border-b border-slate-200/60 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <th className="py-5 px-6">Officer Name</th>
              <th className="py-5 px-6">Department</th>
              <th className="py-5 px-6">Active Cases</th>
              <th className="py-5 px-6">Rating</th>
              <th className="py-5 px-6">Contact</th>
              <th className="py-5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {officers.map((officer) => (
              <tr key={officer.id} className="hover:bg-slate-250/20 transition">
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-sm text-slate-700 uppercase border border-slate-200">
                    {officer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{officer.name}</div>
                    <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{officer.id}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-slate-700">{officer.department}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-bold text-slate-800">{officer.activeCases} cases</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-bold text-amber-600">{officer.rating} ★</span>
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-slate-550">{officer.contact}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                    officer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {officer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 8. SETTINGS VIEW
export function SettingsView() {
  const [autoRoute, setAutoRoute] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Configure threshold indices, automatic dispatch systems, and warning levels.</p>
      </div>

      <div className="bg-[#f1f5f9] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] border border-white/40 rounded-[2rem] p-8 space-y-8">
        
        {/* Dispatch Options */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200/50 pb-3 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#15803D]" />
            <span>Automated Fleet Routing</span>
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-sm">Auto Route CleanAir Fleet</div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 leading-normal max-w-md">
                Automatically allocate ward inspectors and heavy wet suppression tankers immediately when the AI confirms coordinates.
              </p>
            </div>
            <button onClick={() => setAutoRoute(!autoRoute)} className="focus:outline-none cursor-pointer">
              {autoRoute ? <ToggleRight className="w-12 h-12 text-[#15803D]" /> : <ToggleLeft className="w-12 h-12 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Notification options */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200/50 pb-3 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#15803D]" />
            <span>Citizen Notice Systems</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-sm">SMS & Email Status Updates</div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 leading-normal max-w-md">
                Dispatch automated progress notifications to citizens upon task assignment, work-in-progress, and final evidence validation.
              </p>
            </div>
            <button onClick={() => setSmsAlerts(!smsAlerts)} className="focus:outline-none cursor-pointer">
              {smsAlerts ? <ToggleRight className="w-12 h-12 text-[#15803D]" /> : <ToggleLeft className="w-12 h-12 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Security Options */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200/50 pb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#15803D]" />
            <span>System Threshold Parameters</span>
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">Critical SLA Limit</label>
              <select className="w-full bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
                <option>2 Hours (Standard)</option>
                <option>4 Hours (Extended)</option>
                <option>1 Hour (Fast-track)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">AI Confidence Limit</label>
              <select className="w-full bg-[#f1f5f9] shadow-[inset_2px_2px_4px_#cbd5e1] border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
                <option>75% Confidence Rating</option>
                <option>85% High Filter</option>
                <option>60% Open Intake</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
