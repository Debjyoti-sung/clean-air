const defaultMockReports = [
  {
    id: "AER-2026-00124",
    citizenName: "Rahul Sharma",
    citizenEmail: "rahul.s@example.com",
    contactNumber: "+91 98765 43210",
    issueCategory: "Illegal Dumping",
    priority: "Critical",
    severity: "High",
    location: "Dwarka Sector 10 Bypass Roadway",
    wardNumber: "Ward 45",
    submittedDate: "2026-07-08T09:14:00Z",
    currentStatus: "New",
    assignedOfficer: null,
    deadline: "2026-07-10T09:00:00Z",
    description: "Large amount of construction and mixed waste dumped overnight near the residential boundary.",
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80"
    ],
    aiSummary: {
      pollutionType: "Solid Waste / Illegal Dumping",
      impactScore: 88,
      explanation: "Image verified. Large volume of unregulated waste blocking pedestrian pathways with high risk of soil contamination.",
      nearbySensitiveAreas: ["St. Mary's School (200m)", "Sector 10 Residential Zone (50m)"]
    },
    aiResolutionPlan: null,
    resourceRequest: null
  },
  {
    id: "AER-2026-00125",
    citizenName: "Priya Patel",
    citizenEmail: "priya.p@example.com",
    contactNumber: "+91 91234 56789",
    issueCategory: "Air Pollution",
    priority: "High",
    severity: "High",
    location: "Okhla Industrial Area, Phase 2",
    wardNumber: "Ward 88",
    submittedDate: "2026-07-08T08:30:00Z",
    currentStatus: "Officer Assigned",
    assignedOfficer: "Arjun Singh",
    deadline: "2026-07-09T18:00:00Z",
    description: "Thick black smoke emitting from factory chimney since morning. Very difficult to breathe.",
    images: [
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80"
    ],
    aiSummary: {
      pollutionType: "Industrial Smoke",
      impactScore: 95,
      explanation: "High confidence plume signature matches unregulated industrial emissions. Critical air quality hazard.",
      nearbySensitiveAreas: ["ESI Hospital (800m)"]
    },
    aiResolutionPlan: {
      budget: "₹25,000",
      team: "2 Inspectors, 1 Drone Pilot",
      duration: "3 Days",
      riskAnalysis: "High risk of respiratory issues for nearby residents. Ensure personnel wear N95 masks.",
      checklist: [
        { id: 1, task: "Visit Site & Verify Complaint", completed: true },
        { id: 2, task: "Capture Initial Images", completed: true },
        { id: 3, task: "Secure Area / Issue Notice", completed: false },
        { id: 4, task: "Execute Mitigation Strategy", completed: false },
        { id: 5, task: "Sanitize / Clear Area", completed: false },
        { id: 6, task: "Capture Final Images", completed: false },
        { id: 7, task: "Supervisor Verification", completed: false },
      ]
    },
    resourceRequest: {
      item: "50x N95 Respirator Masks & 1x Portable Gas Detector",
      status: "Pending"
    }
  },
  {
    id: "AER-2026-00121",
    citizenName: "Amit Kumar",
    citizenEmail: "amit.k@example.com",
    contactNumber: "+91 99887 76655",
    issueCategory: "Water Pollution",
    priority: "Medium",
    severity: "Medium",
    location: "Yamuna Bank, near Metro Station",
    wardNumber: "Ward 12",
    submittedDate: "2026-07-07T14:20:00Z",
    currentStatus: "Work In Progress",
    assignedOfficer: "Vikram Das",
    deadline: "2026-07-12T12:00:00Z",
    description: "Chemical foam floating on the river surface.",
    images: [
      "https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=600&q=80"
    ],
    aiSummary: {
      pollutionType: "Chemical Effluents",
      impactScore: 75,
      explanation: "Surface water contamination detected. Froth and unnatural discoloration present.",
      nearbySensitiveAreas: ["Yamuna Biodiversity Park (2km)"]
    },
    aiResolutionPlan: {
      budget: "₹45,000",
      team: "3 Water Quality Inspectors",
      duration: "5 Days",
      checklist: [
        { id: 1, task: "Collect Water Samples", completed: true, timestamp: "2026-07-07T16:00:00Z", officer: "Vikram Das" },
        { id: 2, task: "Lab Analysis", completed: true, timestamp: "2026-07-08T10:00:00Z", officer: "Dr. Meena" },
        { id: 3, task: "Identify Source Pipe", completed: false },
        { id: 4, task: "Issue Notice to Factory", completed: false },
        { id: 5, task: "Deploy Anti-foaming Agents", completed: false }
      ]
    },
    resourceRequest: {
      item: "2x Additional Water Sampling Kits",
      status: "Approved & Dispatched"
    }
  },
  {
    id: "AER-2026-00118",
    citizenName: "Sneha Reddy",
    citizenEmail: "sneha.r@example.com",
    contactNumber: "+91 98712 34567",
    issueCategory: "Garbage",
    priority: "Low",
    severity: "Low",
    location: "Koramangala 4th Block Park",
    wardNumber: "Ward 151",
    submittedDate: "2026-07-06T10:05:00Z",
    currentStatus: "Completed",
    assignedOfficer: "Ramesh Babu",
    deadline: "2026-07-08T18:00:00Z",
    description: "Overflowing public dustbins.",
    images: [
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80"
    ],
    aiSummary: {
      pollutionType: "Municipal Solid Waste",
      impactScore: 30,
      explanation: "Minor sanitation issue. Bins require clearing.",
      nearbySensitiveAreas: ["Public Park (0m)"]
    },
    aiResolutionPlan: {
      budget: "₹2,000",
      team: "1 Sanitation Worker",
      duration: "1 Day",
      checklist: [
        { id: 1, task: "Dispatch Garbage Truck", completed: true },
        { id: 2, task: "Clear Bins", completed: true },
        { id: 3, task: "Replace Bin Bags", completed: true },
        { id: 4, task: "Verify Cleanliness", completed: true }
      ]
    },
    resourceRequest: null
  }
];

export const mockReports = JSON.parse(localStorage.getItem('mockReports')) || defaultMockReports;

export const saveMockReports = () => {
  localStorage.setItem('mockReports', JSON.stringify(mockReports));
};

export const mockOfficers = [
  { id: "OFF-01", name: "Arjun Singh", department: "Sanitation Dept", activeCases: 3, rating: "4.8", contact: "+91 98223 11223", status: "Active" },
  { id: "OFF-02", name: "Vikram Das", department: "Water Quality", activeCases: 1, rating: "4.5", contact: "+91 98334 22334", status: "Active" },
  { id: "OFF-03", name: "Meera Reddy", department: "Air Quality Control", activeCases: 0, rating: "4.9", contact: "+91 98445 33445", status: "On Leave" },
  { id: "OFF-04", name: "Ramesh Babu", department: "Solid Waste Management", activeCases: 4, rating: "4.2", contact: "+91 98556 44556", status: "Active" },
  { id: "OFF-05", name: "Dr. Meena", department: "Environmental Lab Analyst", activeCases: 2, rating: "4.7", contact: "+91 98667 55667", status: "Active" },
];

export const mockNotifications = [
  { id: "NTF-01", type: "Urgent", message: "New Critical Priority alert received from Dwarka Sector 10.", time: "5 mins ago", read: false },
  { id: "NTF-02", type: "SLA Warning", message: "Ticket AER-2026-00125 is approaching its 24hr resolution SLA.", time: "1 hour ago", read: false },
  { id: "NTF-03", type: "Update", message: "Officer Ramesh Babu uploaded closure evidence for ticket AER-2026-00118.", time: "3 hours ago", read: true },
  { id: "NTF-04", type: "System", message: "Weekly AI anomaly report is now available.", time: "1 day ago", read: true }
];

export const mockHotspots = [
  { area: "Okhla Phase 2", category: "Industrial Air Pollution", frequency: 24, hazardIndex: 89 },
  { area: "Dwarka Sector 10", category: "Illegal Garbage Dumping", frequency: 18, hazardIndex: 72 },
  { area: "Yamuna Metro Bank", category: "Chemical Effluents Discharge", frequency: 14, hazardIndex: 81 },
  { area: "Koramangala 4th Block", category: "Commercial Waste Overflow", frequency: 9, hazardIndex: 45 },
];

export const generateAIPlan = (issueCategory) => {
  return {
    budget: issueCategory === 'Air Pollution' ? '₹25,000' : '₹18,000',
    team: issueCategory === 'Air Pollution' ? '2 Inspectors, 1 Drone Pilot' : '5 Sanitation Workers',
    duration: '3 Days',
    riskAnalysis: 'High risk of respiratory issues for nearby residents. Ensure personnel wear N95 masks.',
    checklist: [
      { id: 1, task: "Visit Site & Verify Complaint", completed: false },
      { id: 2, task: "Capture Initial Images", completed: false },
      { id: 3, task: "Secure Area / Issue Notice", completed: false },
      { id: 4, task: "Execute Mitigation Strategy", completed: false },
      { id: 5, task: "Sanitize / Clear Area", completed: false },
      { id: 6, task: "Capture Final Images", completed: false },
      { id: 7, task: "Supervisor Verification", completed: false },
    ]
  };
};
