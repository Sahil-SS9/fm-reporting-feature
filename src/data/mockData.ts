// Mock data for the FM Portal Reporting Module

export interface Property {
  id: string;
  name: string;
  location: string;
  type: "Office" | "Retail" | "Warehouse" | "Mixed Use";
}

export interface SavedReport {
  id: string;
  name: string;
  description: string;
  dataSource: string;
  columns: string[];
  filters: Record<string, any>;
  createdDate: string;
  lastRun?: string;
  lastSent?: string;
  favorite: boolean;
  userId: string;
  reportType: 'Activity' | 'Performance';
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  timezone: string;
  recipients: string[];
  ccRecipients?: string[];
  status: 'active' | 'paused' | 'expired';
  nextRun: string;
  lastRun?: string;
  createdDate: string;
  startDate: string;
  endDate?: string;
  enabled: boolean;
}

export interface EmailHistory {
  id: string;
  reportId: string;
  reportName: string;
  sentDate: string;
  recipients: string[];
  ccRecipients?: string[];
  subject: string;
  type: 'manual' | 'scheduled';
  status: 'sent' | 'failed' | 'pending';
  attachmentSize?: string;
  userId: string;
}

export interface UserAccess {
  userId: string;
  propertyIds: string[];
  role: 'admin' | 'manager' | 'technician';
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Completed" | "Overdue";
  priority: "Low" | "Medium" | "High" | "Critical";
  propertyId: string;
  property?: string; // Property name for display
  assigneeId: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  category: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Asset {
  id: string;
  name: string;
  group?: string;
  status: "Operational" | "Pending Repair" | "Missing" | "Out of Service";
  description?: string;
  serialNumber?: string;
  purchaseCost?: number;
  depreciationRate?: number;
  estimatedValue?: number;
  estimatedLifetime?: number;
  installationDate?: string;
  contractorResponsible?: string;
  warrantyExpirationDate?: string;
  location: string;
  propertyId: string;
  parentAssetId?: string; // For sub-assets
  subAssets?: string[]; // Array of sub-asset IDs
  type: string;
  lastInspection?: string;
  nextInspection?: string;
  purchaseDate: string;
  invoiceIds?: string[]; // Links to invoices
}

export interface Invoice {
  id: string;
  type: "Received" | "Issued";
  invoiceNumber: string;
  description: string;
  contractorTenant: string;
  amount: number;
  dateIssued: string;
  dueDate: string;
  paymentStatus: "Outstanding" | "Overdue" | "Paid";
  taxRate?: number;
  assignedWorkOrderId?: string;
  propertyId: string;
}

export interface Contractor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  specialty: string;
  rating: number;
  activeProjects: number;
  totalCompleted: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  propertyId?: string;
  modified: string;
  expires?: string;
}

// Mock Properties
export const mockProperties: Property[] = [
  { id: "1", name: "Downtown Office Tower", location: "123 Main St, London", type: "Office" },
  { id: "2", name: "Westfield Shopping Centre", location: "456 High St, Manchester", type: "Retail" },
  { id: "3", name: "Industrial Park A", location: "789 Industrial Rd, Birmingham", type: "Warehouse" },
  { id: "4", name: "Metro Business Complex", location: "321 Business Ave, Leeds", type: "Mixed Use" },
  { id: "5", name: "Riverside Office Park", location: "654 River St, Bristol", type: "Office" },
  { id: "6", name: "Gateway Shopping Mall", location: "987 Commercial Blvd, Edinburgh", type: "Retail" },
  { id: "7", name: "Tech Hub Central", location: "147 Innovation Dr, Cambridge", type: "Office" },
  { id: "8", name: "Distribution Center North", location: "258 Logistics Way, Glasgow", type: "Warehouse" },
  { id: "9", name: "City Square Complex", location: "369 Urban Plaza, Liverpool", type: "Mixed Use" },
  { id: "10", name: "Harbor View Offices", location: "741 Marina Rd, Southampton", type: "Office" },
  { id: "11", name: "Royal Crown Mall", location: "852 Regent St, Newcastle", type: "Retail" },
  { id: "12", name: "Industrial Estate B", location: "963 Factory Lane, Sheffield", type: "Warehouse" },
  { id: "13", name: "Corporate Plaza West", location: "159 Executive Ave, Cardiff", type: "Office" },
  { id: "14", name: "Heritage Market Centre", location: "357 Historic Square, York", type: "Mixed Use" },
  { id: "15", name: "Logistics Hub South", location: "468 Transport Rd, Portsmouth", type: "Warehouse" },
  { id: "16", name: "Premier Business Park", location: "579 Professional Dr, Nottingham", type: "Office" },
  { id: "17", name: "Oceanfront Retail Plaza", location: "681 Coastal Ave, Brighton", type: "Retail" },
  { id: "18", name: "Innovation Quarter", location: "792 Research Blvd, Oxford", type: "Mixed Use" },
  { id: "19", name: "Storage Facility Central", location: "893 Warehouse St, Coventry", type: "Warehouse" },
  { id: "20", name: "Executive Tower North", location: "915 Corporate Way, Derby", type: "Office" },
];

// Mock Work Orders - Expanded with realistic asset-specific maintenance scenarios
export const mockWorkOrders: WorkOrder[] = [
  // Central HVAC Unit 1 - High Maintenance Asset (7 work orders)
  {
    id: "WO001",
    title: "Central HVAC Unit 1 - Quarterly Maintenance",
    description: "Quarterly maintenance of primary HVAC system for floors 1-10",
    status: "In Progress",
    priority: "Medium",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech001",
    createdDate: "2024-12-01",
    dueDate: "2024-12-05",
    category: "HVAC",
    estimatedHours: 8,
    actualHours: 6
  },
  {
    id: "WO002", 
    title: "Central HVAC Unit 1 - Temperature Control Issues",
    description: "Unit struggling to maintain temperature - possible compressor issues",
    status: "Open",
    priority: "High",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech001",
    createdDate: "2024-11-15",
    dueDate: "2024-11-20",
    category: "HVAC",
    estimatedHours: 6
  },
  {
    id: "WO003",
    title: "Central HVAC Unit 1 - Filter Replacement Emergency",
    description: "Filters severely clogged causing system strain and poor air quality",
    status: "Completed",
    priority: "Critical", 
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech001",
    createdDate: "2024-10-28",
    dueDate: "2024-10-29",
    completedDate: "2024-10-29",
    category: "HVAC",
    estimatedHours: 4,
    actualHours: 5
  },
  {
    id: "WO004",
    title: "Central HVAC Unit 1 - Refrigerant Leak Repair", 
    description: "Detected refrigerant leak requiring immediate attention",
    status: "Completed",
    priority: "Critical",
    propertyId: "1", 
    property: "Downtown Office Tower",
    assigneeId: "tech001",
    createdDate: "2024-09-12",
    dueDate: "2024-09-13",
    completedDate: "2024-09-14",
    category: "HVAC",
    estimatedHours: 8,
    actualHours: 12
  },
  {
    id: "WO005",
    title: "Central HVAC Unit 1 - Fan Belt Replacement",
    description: "Fan belt showing signs of wear, replacement needed",
    status: "Completed",
    priority: "Medium",
    propertyId: "1",
    property: "Downtown Office Tower", 
    assigneeId: "tech001",
    createdDate: "2024-08-20",
    dueDate: "2024-08-25",
    completedDate: "2024-08-23",
    category: "HVAC",
    estimatedHours: 3,
    actualHours: 2
  },
  {
    id: "WO006",
    title: "Central HVAC Unit 1 - Thermostat Calibration",
    description: "Multiple tenant complaints about temperature inconsistencies",
    status: "Completed",
    priority: "High",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech001", 
    createdDate: "2024-07-08",
    dueDate: "2024-07-10",
    completedDate: "2024-07-09",
    category: "HVAC",
    estimatedHours: 4,
    actualHours: 3
  },
  {
    id: "WO007",
    title: "Central HVAC Unit 1 - Electrical Connection Issues",
    description: "Intermittent power issues causing system shutdowns",
    status: "Completed", 
    priority: "Critical",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech002",
    createdDate: "2024-06-15",
    dueDate: "2024-06-16", 
    completedDate: "2024-06-17",
    category: "HVAC",
    estimatedHours: 6,
    actualHours: 8
  },
  
  // Main Elevator A - High Maintenance Asset (5 work orders)
  {
    id: "WO008",
    title: "Main Elevator A - Emergency Repair", 
    description: "Elevator stuck between floors 8-9, passengers trapped",
    status: "Open",
    priority: "Critical",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech003",
    createdDate: "2024-12-04",
    dueDate: "2024-12-04",
    category: "Elevator",
    estimatedHours: 8
  },
  {
    id: "WO009",
    title: "Main Elevator A - Door Mechanism Repair",
    description: "Doors not closing properly, safety concern",
    status: "Completed",
    priority: "High", 
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech003",
    createdDate: "2024-11-02",
    dueDate: "2024-11-05",
    completedDate: "2024-11-04",
    category: "Elevator",
    estimatedHours: 6,
    actualHours: 7
  },
  {
    id: "WO010",
    title: "Main Elevator A - Annual Safety Inspection",
    description: "Mandatory annual elevator safety inspection and certification",
    status: "Completed",
    priority: "High",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech003",
    createdDate: "2024-09-20", 
    dueDate: "2024-09-30",
    completedDate: "2024-09-28",
    category: "Elevator",
    estimatedHours: 4,
    actualHours: 5
  },
  {
    id: "WO011",
    title: "Main Elevator A - Cable Inspection and Adjustment",
    description: "Routine cable tension inspection and adjustment",
    status: "Completed",
    priority: "Medium",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech003",
    createdDate: "2024-08-10",
    dueDate: "2024-08-15",
    completedDate: "2024-08-12",
    category: "Elevator",
    estimatedHours: 5,
    actualHours: 4
  },
  {
    id: "WO012",
    title: "Main Elevator A - Control System Update",
    description: "Software update for elevator control system",
    status: "Completed",
    priority: "Medium",
    propertyId: "1", 
    property: "Downtown Office Tower",
    assigneeId: "tech003",
    createdDate: "2024-07-25",
    dueDate: "2024-07-30",
    completedDate: "2024-07-27",
    category: "Elevator", 
    estimatedHours: 3,
    actualHours: 2
  },

  // Chiller System A - High Maintenance Asset (4 work orders)
  {
    id: "WO013",
    title: "Chiller System A - Compressor Failure",
    description: "Primary compressor failed, system operating at reduced capacity",
    status: "In Progress",
    priority: "Critical",
    propertyId: "4",
    property: "Metro Business Complex",
    assigneeId: "tech001",
    createdDate: "2024-12-03",
    dueDate: "2024-12-06",
    category: "HVAC",
    estimatedHours: 12
  },
  {
    id: "WO014",
    title: "Chiller System A - Water Treatment Issues",
    description: "Water chemistry imbalance causing corrosion concerns", 
    status: "Completed",
    priority: "High",
    propertyId: "4",
    property: "Metro Business Complex",
    assigneeId: "tech004",
    createdDate: "2024-10-15",
    dueDate: "2024-10-20",
    completedDate: "2024-10-18",
    category: "HVAC",
    estimatedHours: 6,
    actualHours: 8
  },
  {
    id: "WO015", 
    title: "Chiller System A - Refrigerant Recharge",
    description: "System showing low refrigerant levels, recharge required",
    status: "Completed",
    priority: "Medium",
    propertyId: "4",
    property: "Metro Business Complex",
    assigneeId: "tech001",
    createdDate: "2024-09-05",
    dueDate: "2024-09-10",
    completedDate: "2024-09-08",
    category: "HVAC",
    estimatedHours: 4,
    actualHours: 3
  },
  {
    id: "WO016",
    title: "Chiller System A - Condenser Cleaning",
    description: "Condenser coils heavily fouled, affecting efficiency",
    status: "Completed",
    priority: "Medium", 
    propertyId: "4",
    property: "Metro Business Complex",
    assigneeId: "tech001",
    createdDate: "2024-08-01",
    dueDate: "2024-08-05",
    completedDate: "2024-08-03",
    category: "HVAC",
    estimatedHours: 5,
    actualHours: 4
  },

  // Backup Generator 2 - High Maintenance Asset (4 work orders)  
  {
    id: "WO017",
    title: "Backup Generator 2 - Engine Overhaul",
    description: "Engine showing signs of wear, comprehensive overhaul needed",
    status: "Open",
    priority: "High",
    propertyId: "3",
    property: "Industrial Park A",
    assigneeId: "tech002",
    createdDate: "2024-11-28", 
    dueDate: "2024-12-10",
    category: "Power",
    estimatedHours: 16
  },
  {
    id: "WO018",
    title: "Backup Generator 2 - Fuel System Cleaning",
    description: "Fuel contamination detected, system cleaning required",
    status: "Completed",
    priority: "Medium",
    propertyId: "3",
    property: "Industrial Park A",
    assigneeId: "tech002",
    createdDate: "2024-10-12",
    dueDate: "2024-10-18",
    completedDate: "2024-10-15",
    category: "Power",
    estimatedHours: 8,
    actualHours: 10
  },
  {
    id: "WO019",
    title: "Backup Generator 2 - Battery Replacement",
    description: "Starting battery failing, replacement needed",
    status: "Completed", 
    priority: "High",
    propertyId: "3",
    property: "Industrial Park A",
    assigneeId: "tech002",
    createdDate: "2024-09-22",
    dueDate: "2024-09-25",
    completedDate: "2024-09-24",
    category: "Power",
    estimatedHours: 2,
    actualHours: 3
  },
  {
    id: "WO020",
    title: "Backup Generator 2 - Oil Leak Repair",
    description: "Oil leak from engine block, environmental concern",
    status: "Completed",
    priority: "Critical",
    propertyId: "3",
    property: "Industrial Park A",
    assigneeId: "tech002", 
    createdDate: "2024-08-18",
    dueDate: "2024-08-20",
    completedDate: "2024-08-19",
    category: "Power", 
    estimatedHours: 6,
    actualHours: 7
  },

  // Boiler System Main - High Maintenance Asset (3 work orders)
  {
    id: "WO021",
    title: "Boiler System Main - Critical System Failure",
    description: "Boiler system showing multiple error codes, immediate attention required",
    status: "Open",
    priority: "Critical",
    propertyId: "4",
    property: "Metro Business Complex",
    assigneeId: "tech001",
    createdDate: "2024-12-04",
    dueDate: "2024-12-05",
    category: "HVAC",
    estimatedHours: 10
  },
  {
    id: "WO022",
    title: "Boiler System Main - Pressure Valve Replacement",
    description: "Safety pressure valve not functioning within specifications",
    status: "Completed",
    priority: "Critical",
    propertyId: "4",
    property: "Metro Business Complex",
    assigneeId: "tech001",
    createdDate: "2024-10-08",
    dueDate: "2024-10-10",
    completedDate: "2024-10-09",
    category: "HVAC",
    estimatedHours: 4,
    actualHours: 5
  },
  {
    id: "WO023",
    title: "Boiler System Main - Annual Inspection",
    description: "Mandatory annual boiler safety inspection and certification", 
    status: "Completed",
    priority: "High",
    propertyId: "4",
    property: "Metro Business Complex",
    assigneeId: "tech001",
    createdDate: "2024-09-01",
    dueDate: "2024-09-15",
    completedDate: "2024-09-10",
    category: "HVAC",
    estimatedHours: 6,
    actualHours: 5
  },

  // Additional work orders for other assets (lower maintenance)
  {
    id: "WO024",
    title: "Generator Backup Unit - Monthly Test Run",
    description: "Routine monthly generator test and maintenance check", 
    status: "Completed",
    priority: "Medium",
    propertyId: "2",
    property: "Westfield Shopping Centre",
    assigneeId: "tech002",
    createdDate: "2024-11-20",
    dueDate: "2024-11-25",
    completedDate: "2024-11-22",
    category: "Power",
    estimatedHours: 2,
    actualHours: 1
  },
  {
    id: "WO025",
    title: "Fire Suppression System - Quarterly Inspection",
    description: "Routine quarterly fire safety system inspection",
    status: "Open",
    priority: "Medium",
    propertyId: "3",
    property: "Industrial Park A",
    assigneeId: "tech004",
    createdDate: "2024-12-01",
    dueDate: "2024-12-08",
    category: "Safety",
    estimatedHours: 4
  },
  {
    id: "WO026",
    title: "LED Lighting System - Bulb Replacements",
    description: "Replace failed LED bulbs in common areas",
    status: "In Progress",
    priority: "Low",
    propertyId: "5",
    property: "Riverside Office Park",
    assigneeId: "tech003",
    createdDate: "2024-11-30",
    dueDate: "2024-12-07",
    category: "Electrical",
    estimatedHours: 3,
    actualHours: 1
  },
  {
    id: "WO027",
    title: "Security System Main - Camera Adjustment",
    description: "Adjust security camera angles after renovation",
    status: "Completed",
    priority: "Low",
    propertyId: "1",
    property: "Downtown Office Tower",
    assigneeId: "tech004",
    createdDate: "2024-11-18",
    dueDate: "2024-11-22",
    completedDate: "2024-11-20",
    category: "Security",
    estimatedHours: 2,
    actualHours: 1
  },
  {
    id: "WO028",
    title: "Water Treatment System - Filter Replacement",
    description: "Scheduled water filter replacement",
    status: "Completed",
    priority: "Medium",
    propertyId: "2",
    property: "Westfield Shopping Centre",
    assigneeId: "tech003",
    createdDate: "2024-11-10",
    dueDate: "2024-11-15",
    completedDate: "2024-11-12",
    category: "Plumbing",
    estimatedHours: 3,
    actualHours: 2
  }
];

// Mock Assets - Expanded with realistic maintenance scenarios
export const mockAssets: Asset[] = [
  // High Maintenance Assets - These will show up prominently in dashboard
  {
    id: "AS001",
    name: "Central HVAC Unit 1",
    type: "HVAC System",
    propertyId: "1",
    status: "Pending Repair",
    description: "Primary air conditioning system for floors 1-10 - frequent issues",
    serialNumber: "HVAC-2020-001",
    purchaseCost: 75000,
    depreciationRate: 0.1,
    estimatedValue: 52500,
    estimatedLifetime: 15,
    installationDate: "2020-03-15",
    contractorResponsible: "CON001",
    warrantyExpirationDate: "2025-03-15",
    lastInspection: "2024-11-15",
    nextInspection: "2024-12-15",
    purchaseDate: "2020-03-15",
    location: "Rooftop",
    group: "HVAC Systems",
    invoiceIds: ["INV001", "INV005"]
  },
  {
    id: "AS002",
    name: "Main Elevator A",
    type: "Elevator",
    propertyId: "1",
    status: "Out of Service",
    description: "Primary passenger elevator - currently experiencing critical issues",
    serialNumber: "ELEV-2018-A",
    purchaseCost: 120000,
    depreciationRate: 0.08,
    estimatedValue: 64000,
    estimatedLifetime: 25,
    installationDate: "2018-06-20",
    contractorResponsible: "CON004",
    lastInspection: "2024-11-02",
    nextInspection: "2025-02-02",
    purchaseDate: "2018-06-20",
    location: "Core",
    group: "Vertical Transport"
  },
  {
    id: "AS003",
    name: "Chiller System A",
    type: "HVAC System",
    propertyId: "4",
    status: "Pending Repair",
    description: "Main chiller system - high maintenance requirements",
    serialNumber: "CHILL-2020-A",
    purchaseCost: 125000,
    depreciationRate: 0.1,
    estimatedValue: 87500,
    estimatedLifetime: 20,
    installationDate: "2020-07-30",
    contractorResponsible: "CON001",
    warrantyExpirationDate: "2025-07-30",
    lastInspection: "2024-10-15",
    nextInspection: "2025-01-15",
    purchaseDate: "2020-07-30",
    location: "Mechanical Room",
    group: "HVAC Systems"
  },
  {
    id: "AS004",
    name: "Backup Generator 2",
    type: "Power System",
    propertyId: "3",
    status: "Out of Service",
    description: "Secondary emergency power - requires major overhaul",
    serialNumber: "GEN-2018-004",
    purchaseCost: 55000,
    depreciationRate: 0.12,
    estimatedValue: 35000,
    estimatedLifetime: 20,
    installationDate: "2018-11-12",
    contractorResponsible: "CON002",
    warrantyExpirationDate: "2023-11-12",
    lastInspection: "2024-10-12",
    nextInspection: "2025-01-12",
    purchaseDate: "2018-11-12",
    location: "Basement Level 2",
    group: "Power Systems"
  },
  {
    id: "AS005",
    name: "Boiler System Main",
    type: "HVAC System",
    propertyId: "4",
    status: "Pending Repair",
    description: "Main building heating boiler - critical maintenance needs",
    serialNumber: "BOILER-2017-001",
    purchaseCost: 98000,
    depreciationRate: 0.1,
    estimatedValue: 49000,
    estimatedLifetime: 20,
    installationDate: "2017-10-12",
    contractorResponsible: "CON001",
    warrantyExpirationDate: "2022-10-12",
    lastInspection: "2024-10-08",
    nextInspection: "2025-01-08",
    purchaseDate: "2017-10-12",
    location: "Boiler Room",
    group: "HVAC Systems"
  },

  // Medium Maintenance Assets
  {
    id: "AS006",
    name: "Central HVAC Unit 2",
    type: "HVAC System",
    propertyId: "2",
    status: "Operational",
    description: "Secondary air conditioning system for floors 11-20",
    serialNumber: "HVAC-2021-002",
    purchaseCost: 82000,
    depreciationRate: 0.1,
    estimatedValue: 65600,
    estimatedLifetime: 15,
    installationDate: "2021-05-20",
    contractorResponsible: "CON001",
    warrantyExpirationDate: "2026-05-20",
    lastInspection: "2024-09-15",
    nextInspection: "2024-12-15",
    purchaseDate: "2021-05-20",
    location: "Rooftop",
    group: "HVAC Systems"
  },
  {
    id: "AS007",
    name: "Freight Elevator B",
    type: "Elevator",
    propertyId: "3",
    status: "Operational",
    description: "Heavy-duty freight elevator for warehouse operations",
    serialNumber: "ELEV-2019-B",
    purchaseCost: 150000,
    depreciationRate: 0.08,
    estimatedValue: 105000,
    estimatedLifetime: 25,
    installationDate: "2019-03-10",
    contractorResponsible: "CON004",
    warrantyExpirationDate: "2024-03-10",
    lastInspection: "2024-08-05",
    nextInspection: "2024-11-05",
    purchaseDate: "2019-03-10",
    location: "Warehouse Core",
    group: "Vertical Transport"
  },

  // Low Maintenance Assets - Newer and more reliable
  {
    id: "AS008",
    name: "Generator Backup Unit",
    type: "Power System",
    propertyId: "2",
    status: "Operational",
    description: "Emergency backup power generation system",
    serialNumber: "GEN-2019-003",
    purchaseCost: 45000,
    depreciationRate: 0.12,
    estimatedValue: 28000,
    estimatedLifetime: 20,
    installationDate: "2019-09-10",
    contractorResponsible: "CON002",
    warrantyExpirationDate: "2024-09-10",
    lastInspection: "2024-11-20",
    nextInspection: "2025-02-20",
    purchaseDate: "2019-09-10",
    location: "Basement",
    group: "Power Systems",
    invoiceIds: ["INV003"]
  },
  {
    id: "AS009",
    name: "Fire Suppression System",
    type: "Safety Equipment",
    propertyId: "3",
    status: "Operational",
    description: "Comprehensive fire detection and suppression system",
    serialNumber: "FIRE-2021-001",
    purchaseCost: 85000,
    depreciationRate: 0.05,
    estimatedValue: 72250,
    estimatedLifetime: 30,
    installationDate: "2021-11-30",
    contractorResponsible: "CON004",
    warrantyExpirationDate: "2026-11-30",
    lastInspection: "2024-09-05",
    nextInspection: "2025-03-05",
    purchaseDate: "2021-11-30",
    location: "Throughout Building",
    group: "Safety Systems"
  },
  {
    id: "AS010",
    name: "Security System Main",
    type: "Security Equipment",
    propertyId: "1",
    status: "Operational",
    description: "Main building security and access control system",
    serialNumber: "SEC-2022-001",
    purchaseCost: 95000,
    depreciationRate: 0.15,
    estimatedValue: 76000,
    estimatedLifetime: 10,
    installationDate: "2022-08-15",
    contractorResponsible: "CON004",
    warrantyExpirationDate: "2027-08-15",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    purchaseDate: "2022-08-15",
    location: "Security Office",
    group: "Security Systems"
  },
  {
    id: "AS011",
    name: "Water Treatment System",
    type: "Plumbing System",
    propertyId: "2",
    status: "Operational",
    description: "Building water filtration and treatment system",
    serialNumber: "WATER-2021-001",
    purchaseCost: 65000,
    depreciationRate: 0.08,
    estimatedValue: 50700,
    estimatedLifetime: 25,
    installationDate: "2021-09-15",
    contractorResponsible: "CON003",
    warrantyExpirationDate: "2026-09-15",
    lastInspection: "2024-11-10",
    nextInspection: "2025-02-10",
    purchaseDate: "2021-09-15",
    location: "Utility Room",
    group: "Plumbing Systems"
  },
  {
    id: "AS012",
    name: "LED Lighting System",
    type: "Electrical System",
    propertyId: "5",
    status: "Operational",
    description: "Smart LED lighting control system for entire building",
    serialNumber: "LED-2023-001",
    purchaseCost: 45000,
    depreciationRate: 0.12,
    estimatedValue: 39600,
    estimatedLifetime: 15,
    installationDate: "2023-02-28",
    contractorResponsible: "CON002",
    warrantyExpirationDate: "2028-02-28",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    purchaseDate: "2023-02-28",
    location: "Throughout Building",
    group: "Electrical Systems"
  },

  // Additional newer assets with minimal maintenance
  {
    id: "AS013",
    name: "Rooftop HVAC Unit 3",
    type: "HVAC System", 
    propertyId: "5",
    status: "Operational",
    description: "New energy-efficient HVAC unit for office complex",
    serialNumber: "HVAC-2023-003",
    purchaseCost: 95000,
    depreciationRate: 0.08,
    estimatedValue: 87400,
    estimatedLifetime: 18,
    installationDate: "2023-04-10",
    contractorResponsible: "CON001",
    warrantyExpirationDate: "2028-04-10",
    lastInspection: "2024-10-10",
    nextInspection: "2025-01-10",
    purchaseDate: "2023-04-10",
    location: "Rooftop East",
    group: "HVAC Systems"
  },
  {
    id: "AS014",
    name: "Passenger Elevator C",
    type: "Elevator",
    propertyId: "2",
    status: "Operational",
    description: "Modern passenger elevator with advanced safety features",
    serialNumber: "ELEV-2022-C",
    purchaseCost: 140000,
    depreciationRate: 0.06,
    estimatedValue: 123200,
    estimatedLifetime: 30,
    installationDate: "2022-12-15",
    contractorResponsible: "CON004",
    warrantyExpirationDate: "2027-12-15",
    lastInspection: "2024-09-15",
    nextInspection: "2025-03-15",
    purchaseDate: "2022-12-15",
    location: "North Tower",
    group: "Vertical Transport"
  },
  {
    id: "AS015",
    name: "Solar Power System",
    type: "Power System",
    propertyId: "5",
    status: "Operational",
    description: "Rooftop solar panel array with battery storage",
    serialNumber: "SOLAR-2023-001",
    purchaseCost: 180000,
    depreciationRate: 0.05,
    estimatedValue: 171000,
    estimatedLifetime: 25,
    installationDate: "2023-06-20",
    contractorResponsible: "CON002",
    warrantyExpirationDate: "2033-06-20",
    lastInspection: "2024-09-20",
    nextInspection: "2025-03-20",
    purchaseDate: "2023-06-20",
    location: "Rooftop",
    group: "Power Systems"
  }
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: "INV001",
    type: "Received",
    invoiceNumber: "HVAC-2024-001",
    description: "HVAC quarterly maintenance service",
    contractorTenant: "HVAC Solutions Ltd",
    amount: 2500.00,
    dateIssued: "2024-01-15",
    dueDate: "2024-02-15",
    paymentStatus: "Outstanding",
    taxRate: 0.20,
    assignedWorkOrderId: "WO001",
    propertyId: "1"
  },
  {
    id: "INV002",
    type: "Issued",
    invoiceNumber: "RENT-2024-001",
    description: "Monthly rent - Office Tower Unit 5A",
    contractorTenant: "TechCorp Ltd",
    amount: 8500.00,
    dateIssued: "2024-01-01",
    dueDate: "2024-01-31",
    paymentStatus: "Paid",
    taxRate: 0.00,
    propertyId: "1"
  },
  {
    id: "INV003",
    type: "Received",
    invoiceNumber: "ELEC-2024-007",
    description: "Emergency elevator repair",
    contractorTenant: "ElectriCorp",
    amount: 4200.00,
    dateIssued: "2024-01-12",
    dueDate: "2024-02-12",
    paymentStatus: "Overdue",
    taxRate: 0.20,
    assignedWorkOrderId: "WO002",
    propertyId: "1"
  },
  {
    id: "INV004",
    type: "Received",
    invoiceNumber: "SEC-2024-003", 
    description: "Security system monthly monitoring",
    contractorTenant: "SecureGuard Systems",
    amount: 750.00,
    dateIssued: "2024-01-05",
    dueDate: "2024-02-05",
    paymentStatus: "Paid",
    taxRate: 0.20,
    assignedWorkOrderId: "WO005",
    propertyId: "4"
  },
  {
    id: "INV005",
    type: "Issued",
    invoiceNumber: "UTIL-2024-001",
    description: "Utility charges - Shopping Centre",
    contractorTenant: "RetailCorp",
    amount: 3200.00,
    dateIssued: "2024-01-20",
    dueDate: "2024-02-20",
    paymentStatus: "Outstanding",
    taxRate: 0.00,
    propertyId: "2"
  }
];

// Mock Contractors
export const mockContractors: Contractor[] = [
  {
    id: "CON001",
    name: "John Smith",
    company: "HVAC Solutions Ltd",
    email: "j.smith@hvacsolutions.com",
    phone: "+44 20 1234 5678",
    specialty: "HVAC",
    rating: 4.8,
    activeProjects: 3,
    totalCompleted: 127
  },
  {
    id: "CON002",
    name: "Sarah Johnson",
    company: "ElectriCorp",
    email: "s.johnson@electricorp.com",
    phone: "+44 161 987 6543",
    specialty: "Electrical",
    rating: 4.6,
    activeProjects: 2,
    totalCompleted: 89
  },
  {
    id: "CON003",
    name: "Mike Wilson",
    company: "PlumbPro Services",
    email: "m.wilson@plumbpro.com",
    phone: "+44 121 555 0123",
    specialty: "Plumbing",
    rating: 4.9,
    activeProjects: 1,
    totalCompleted: 156
  },
  {
    id: "CON004",
    name: "Emma Davis",
    company: "SecureGuard Systems",
    email: "e.davis@secureguard.com",
    phone: "+44 113 444 9876",
    specialty: "Security",
    rating: 4.7,
    activeProjects: 4,
    totalCompleted: 92
  }
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: "DOC001",
    name: "Fire Safety Certificate",
    type: "Certificate",
    propertyId: "1",
    modified: "2023-06-15",
    expires: "2024-06-15"
  },
  {
    id: "DOC002",
    name: "HVAC Maintenance Manual",
    type: "Manual",
    propertyId: "1",
    modified: "2023-03-20"
  },
  {
    id: "DOC003",
    name: "Building Insurance Policy",
    type: "Policy",
    propertyId: "2",
    modified: "2024-01-01",
    expires: "2024-12-31"
  },
  {
    id: "DOC004",
    name: "Elevator Inspection Report",
    type: "Report",
    propertyId: "1",
    modified: "2024-01-10",
    expires: "2024-04-10"
  },
  {
    id: "DOC005",
    name: "Electrical Safety Certificate",
    type: "Certificate",
    propertyId: "3",
    modified: "2023-08-15",
    expires: "2024-02-15"
  }
];

export interface ColumnConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: string[];
}

// Data source configurations
export const dataSourceConfig = {
  "Work Orders": {
    label: "Work Orders",
    data: mockWorkOrders,
    columns: [
      { key: "id", label: "Work Order ID", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Completed", "Overdue"] },
      { key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"] },
      { key: "propertyId", label: "Property", type: "text" },
      { key: "assigneeId", label: "Assignee", type: "text" },
      { key: "createdDate", label: "Created Date", type: "date" },
      { key: "dueDate", label: "Due Date", type: "date" },
      { key: "completedDate", label: "Completed Date", type: "date" },
      { key: "category", label: "Category", type: "text" },
      { key: "estimatedHours", label: "Estimated Hours", type: "number" },
      { key: "actualHours", label: "Actual Hours", type: "number" }
    ]
  },
  "Assets": {
    label: "Assets",
    data: mockAssets,
    columns: [
      { key: "id", label: "Asset ID", type: "text" },
      { key: "name", label: "Asset Name", type: "text" },
      { key: "type", label: "Asset Type", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Operational", "Pending Repair", "Missing", "Out of Service"] },
      { key: "propertyId", label: "Property", type: "text" },
      { key: "group", label: "Asset Group", type: "text" },
      { key: "serialNumber", label: "Serial Number", type: "text" },
      { key: "purchaseCost", label: "Purchase Cost", type: "number" },
      { key: "estimatedValue", label: "Current Value", type: "number" },
      { key: "installationDate", label: "Installation Date", type: "date" },
      { key: "contractorResponsible", label: "Contractor", type: "text" },
      { key: "lastInspection", label: "Last Inspection", type: "date" },
      { key: "nextInspection", label: "Next Inspection", type: "date" },
      { key: "purchaseDate", label: "Purchase Date", type: "date" },
      { key: "warrantyExpirationDate", label: "Warranty Expiry", type: "date" },
      { key: "location", label: "Location", type: "text" }
    ]
  },
  "Invoices": {
    label: "Invoices",
    data: mockInvoices,
    columns: [
      { key: "id", label: "Invoice ID", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["Received", "Issued"] },
      { key: "invoiceNumber", label: "Invoice Number", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "contractorTenant", label: "Contractor/Tenant", type: "text" },
      { key: "amount", label: "Amount", type: "number" },
      { key: "dateIssued", label: "Date Issued", type: "date" },
      { key: "dueDate", label: "Due Date", type: "date" },
      { key: "paymentStatus", label: "Payment Status", type: "select", options: ["Outstanding", "Overdue", "Paid"] },
      { key: "taxRate", label: "Tax Rate", type: "number" },
      { key: "assignedWorkOrderId", label: "Work Order", type: "text" },
      { key: "propertyId", label: "Property", type: "text" }
    ]
  },
  "Contractors": {
    label: "Contractors",
    data: mockContractors,
    columns: [
      { key: "id", label: "Contractor ID", type: "text" },
      { key: "name", label: "Name", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "specialty", label: "Specialty", type: "text" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "activeProjects", label: "Active Projects", type: "number" },
      { key: "totalCompleted", label: "Total Completed", type: "number" }
    ]
  },
  "Documents": {
    label: "Documents",
    data: mockDocuments,
    columns: [
      { key: "id", label: "Document ID", type: "text" },
      { key: "name", label: "Document Name", type: "text" },
      { key: "type", label: "Document Type", type: "text" },
      { key: "propertyId", label: "Property", type: "text" },
      { key: "modified", label: "Modified Date", type: "date" },
      { key: "expires", label: "Expires Date", type: "date" }
    ]
  }
};

// Mock saved reports
export const mockSavedReports: SavedReport[] = [
  {
    id: "report-1",
    name: "Weekly Work Orders Summary",
    description: "Summary of work orders created and completed this week",
    dataSource: "Work Orders",
    columns: ["id", "title", "status", "priority", "createdDate", "completedDate"],
    filters: { status: ["Completed"] },
    createdDate: "2024-01-15T10:30:00Z",
    lastRun: "2024-01-22T09:15:00Z",
    lastSent: "2024-01-22T09:20:00Z",
    favorite: true,
    userId: "user1",
    reportType: 'Activity'
  },
  {
    id: "report-2",
    name: "Asset Maintenance Schedule",
    description: "Upcoming maintenance schedule for all active assets",
    dataSource: "Assets",
    columns: ["name", "type", "nextInspection", "status", "location"],
    filters: { status: ["Active"] },
    createdDate: "2024-01-10T14:20:00Z",
    lastRun: "2024-01-20T08:30:00Z",
    favorite: false,
    userId: "user1",
    reportType: 'Performance'
  },
  {
    id: "report-3",
    name: "Critical Priority Tasks",
    description: "All high and critical priority work orders",
    dataSource: "Work Orders",
    columns: ["id", "title", "priority", "status", "dueDate", "assigneeId"],
    filters: { priority: ["High", "Critical"] },
    createdDate: "2024-01-08T11:45:00Z",
    lastRun: "2024-01-21T16:10:00Z",
    lastSent: "2024-01-21T16:15:00Z",
    favorite: true,
    userId: "user1",
    reportType: 'Activity'
  }
];

// Mock scheduled reports
export const mockScheduledReports: ScheduledReport[] = [
  {
    id: "sched-1",
    reportId: "report-1",
    frequency: 'weekly',
    time: '09:00',
    timezone: 'GMT',
    recipients: ['manager@company.com', 'supervisor@company.com'],
    status: 'active',
    nextRun: "2024-01-29T09:00:00Z",
    lastRun: "2024-01-22T09:00:00Z",
    createdDate: "2024-01-15T10:35:00Z",
    startDate: "2024-01-15T10:35:00Z",
    enabled: true
  },
  {
    id: "sched-2",
    reportId: "report-3",
    frequency: 'daily',
    time: '08:30',
    timezone: 'GMT',
    recipients: ['alerts@company.com'],
    ccRecipients: ['manager@company.com'],
    status: 'paused',
    nextRun: "2024-01-23T08:30:00Z",
    lastRun: "2024-01-19T08:30:00Z",
    createdDate: "2024-01-08T11:50:00Z",
    startDate: "2024-01-08T11:50:00Z",
    enabled: false
  }
];

// Mock email history
export const mockEmailHistory: EmailHistory[] = [
  {
    id: "email-1",
    reportId: "report-1",
    reportName: "Weekly Work Orders Summary",
    sentDate: "2024-01-22T09:20:00Z",
    recipients: ['manager@company.com', 'supervisor@company.com'],
    subject: "Weekly Work Orders Summary - January 22, 2024",
    type: 'scheduled',
    status: 'sent',
    attachmentSize: "245 KB",
    userId: "user1"
  },
  {
    id: "email-2",
    reportId: "report-3",
    reportName: "Critical Priority Tasks",
    sentDate: "2024-01-21T16:15:00Z",
    recipients: ['alerts@company.com'],
    ccRecipients: ['manager@company.com'],
    subject: "Critical Priority Tasks - Urgent Review Required",
    type: 'manual',
    status: 'sent',
    attachmentSize: "189 KB",
    userId: "user1"
  },
  {
    id: "email-3",
    reportId: "report-2",
    reportName: "Asset Maintenance Schedule",
    sentDate: "2024-01-20T10:45:00Z",
    recipients: ['maintenance@company.com'],
    subject: "Monthly Asset Maintenance Schedule",
    type: 'manual',
    status: 'sent',
    attachmentSize: "312 KB",
    userId: "user1"
  },
  {
    id: "email-4",
    reportId: "report-1",
    reportName: "Weekly Work Orders Summary",
    sentDate: "2024-01-15T09:20:00Z",
    recipients: ['manager@company.com', 'supervisor@company.com'],
    subject: "Weekly Work Orders Summary - January 15, 2024",
    type: 'scheduled',
    status: 'sent',
    attachmentSize: "298 KB",
    userId: "user1"
  }
];

// Mock user access control
export const mockUserAccess: UserAccess[] = [
  {
    userId: "user1",
    propertyIds: ["1", "2", "3", "4", "5"],
    role: "admin"
  },
  {
    userId: "user2",
    propertyIds: ["1", "2"],
    role: "manager"
  },
  {
    userId: "user3",
    propertyIds: ["3"],
    role: "technician"
  }
];

// Quick report templates with enhanced column suggestions
export const quickReportTemplates = [
  {
    id: "template-1",
    title: "Cases report",
    description: "Activity report focusing on work order tracking and task completion",
    dataSource: "Work Orders",
    defaultColumns: ["id", "title", "status", "priority", "createdDate", "dueDate"],
    defaultFilters: { status: ["Open", "In Progress"] },
    reportType: 'Activity',
    icon: "FileText",
    suggestedColumns: {
      activity: ["id", "title", "status", "priority", "createdDate", "dueDate", "assigneeId", "category"],
      performance: ["status", "priority", "estimatedHours", "actualHours", "completedDate"]
    }
  },
  {
    id: "template-2", 
    title: "Inspections report",
    description: "Performance report analyzing asset inspection schedules and compliance",
    dataSource: "Assets",
    defaultColumns: ["id", "name", "type", "lastInspection", "nextInspection", "status"],
    defaultFilters: { status: ["Active"] },
    reportType: 'Performance',
    icon: "TrendingUp",
    suggestedColumns: {
      activity: ["id", "name", "type", "location", "status", "lastInspection"],
      performance: ["lastInspection", "nextInspection", "status", "purchaseDate", "warrantyExpiry"]
    }
  },
  {
    id: "template-3",
    title: "Maintenance report",
    description: "Activity report detailing maintenance tasks and resource utilization", 
    dataSource: "Work Orders",
    defaultColumns: ["id", "title", "category", "status", "actualHours", "completedDate"],
    defaultFilters: { category: ["HVAC", "Electrical", "Plumbing"] },
    reportType: 'Activity',
    icon: "BarChart3",
    suggestedColumns: {
      activity: ["id", "title", "category", "status", "createdDate", "completedDate", "assigneeId"],
      performance: ["category", "estimatedHours", "actualHours", "status", "completedDate"]
    }
  }
];