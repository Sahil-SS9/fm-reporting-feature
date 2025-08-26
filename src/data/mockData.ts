// Mock data for the FM Portal Reporting Module

export interface Property {
  id: string;
  name: string;
  location: string;
  type: "Office" | "Retail" | "Warehouse" | "Mixed Use";
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Completed" | "Overdue";
  priority: "Low" | "Medium" | "High" | "Critical";
  propertyId: string;
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
  type: string;
  propertyId: string;
  status: "Active" | "Maintenance" | "Decommissioned";
  lastInspection?: string;
  nextInspection?: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  location: string;
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
  uploadDate: string;
  expiryDate?: string;
  category: string;
  size: string;
  status: "Active" | "Expired" | "Pending Review";
}

// Mock Properties
export const mockProperties: Property[] = [
  { id: "1", name: "Downtown Office Tower", location: "123 Main St, London", type: "Office" },
  { id: "2", name: "Westfield Shopping Centre", location: "456 High St, Manchester", type: "Retail" },
  { id: "3", name: "Industrial Park A", location: "789 Industrial Rd, Birmingham", type: "Warehouse" },
  { id: "4", name: "Metro Business Complex", location: "321 Business Ave, Leeds", type: "Mixed Use" },
  { id: "5", name: "Riverside Office Park", location: "654 River St, Bristol", type: "Office" },
];

// Mock Work Orders
export const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO001",
    title: "HVAC System Maintenance",
    description: "Quarterly maintenance of air conditioning units",
    status: "In Progress",
    priority: "Medium",
    propertyId: "1",
    assigneeId: "tech001",
    createdDate: "2024-01-15",
    dueDate: "2024-01-25",
    category: "HVAC",
    estimatedHours: 8,
    actualHours: 6
  },
  {
    id: "WO002",
    title: "Elevator Repair",
    description: "Main elevator not responding to calls",
    status: "Overdue",
    priority: "High",
    propertyId: "1",
    assigneeId: "tech002",
    createdDate: "2024-01-10",
    dueDate: "2024-01-20",
    category: "Elevator",
    estimatedHours: 12
  },
  {
    id: "WO003",
    title: "Lighting Fixture Replacement",
    description: "Replace LED fixtures in lobby area",
    status: "Completed",
    priority: "Low",
    propertyId: "2",
    assigneeId: "tech003",
    createdDate: "2024-01-08",
    dueDate: "2024-01-18",
    completedDate: "2024-01-16",
    category: "Electrical",
    estimatedHours: 4,
    actualHours: 3
  },
  {
    id: "WO004",
    title: "Plumbing Leak Investigation",
    description: "Water leak reported in floor 5 bathroom",
    status: "Open",
    priority: "Critical",
    propertyId: "3",
    assigneeId: "tech001",
    createdDate: "2024-01-20",
    dueDate: "2024-01-22",
    category: "Plumbing",
    estimatedHours: 6
  },
  {
    id: "WO005",
    title: "Security System Check",
    description: "Monthly security system inspection",
    status: "Completed",
    priority: "Medium",
    propertyId: "4",
    assigneeId: "tech004",
    createdDate: "2024-01-05",
    dueDate: "2024-01-15",
    completedDate: "2024-01-12",
    category: "Security",
    estimatedHours: 3,
    actualHours: 2
  }
];

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: "AS001",
    name: "Central HVAC Unit 1",
    type: "HVAC System",
    propertyId: "1",
    status: "Active",
    lastInspection: "2024-01-01",
    nextInspection: "2024-04-01",
    purchaseDate: "2020-03-15",
    warrantyExpiry: "2025-03-15",
    location: "Rooftop"
  },
  {
    id: "AS002",
    name: "Main Elevator A",
    type: "Elevator",
    propertyId: "1",
    status: "Maintenance",
    lastInspection: "2024-01-10",
    nextInspection: "2024-02-10",
    purchaseDate: "2018-06-20",
    location: "Core"
  },
  {
    id: "AS003",
    name: "Generator Backup Unit",
    type: "Power System",
    propertyId: "2",
    status: "Active",
    lastInspection: "2023-12-15",
    nextInspection: "2024-03-15",
    purchaseDate: "2019-09-10",
    warrantyExpiry: "2024-09-10",
    location: "Basement"
  },
  {
    id: "AS004",
    name: "Fire Suppression System",
    type: "Safety Equipment",
    propertyId: "3",
    status: "Active",
    lastInspection: "2024-01-05",
    nextInspection: "2024-07-05",
    purchaseDate: "2021-11-30",
    warrantyExpiry: "2026-11-30",
    location: "Throughout Building"
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
    uploadDate: "2023-06-15",
    expiryDate: "2024-06-15",
    category: "Safety",
    size: "2.3 MB",
    status: "Active"
  },
  {
    id: "DOC002",
    name: "HVAC Maintenance Manual",
    type: "Manual",
    propertyId: "1",
    uploadDate: "2023-03-20",
    category: "Equipment",
    size: "15.7 MB",
    status: "Active"
  },
  {
    id: "DOC003",
    name: "Building Insurance Policy",
    type: "Policy",
    propertyId: "2",
    uploadDate: "2024-01-01",
    expiryDate: "2024-12-31",
    category: "Insurance",
    size: "1.8 MB",
    status: "Active"
  },
  {
    id: "DOC004",
    name: "Elevator Inspection Report",
    type: "Report",
    propertyId: "1",
    uploadDate: "2024-01-10",
    category: "Inspection",
    size: "890 KB",
    status: "Pending Review"
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
      { key: "status", label: "Status", type: "select", options: ["Active", "Maintenance", "Decommissioned"] },
      { key: "propertyId", label: "Property", type: "text" },
      { key: "lastInspection", label: "Last Inspection", type: "date" },
      { key: "nextInspection", label: "Next Inspection", type: "date" },
      { key: "purchaseDate", label: "Purchase Date", type: "date" },
      { key: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
      { key: "location", label: "Location", type: "text" }
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
      { key: "uploadDate", label: "Upload Date", type: "date" },
      { key: "expiryDate", label: "Expiry Date", type: "date" },
      { key: "category", label: "Category", type: "text" },
      { key: "size", label: "File Size", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Expired", "Pending Review"] }
    ]
  }
};

// Quick report templates
export const quickReportTemplates = [
  {
    id: "template-1",
    title: "Cases report",
    description: "Report about performance",
    dataSource: "Work Orders",
    defaultColumns: ["id", "title", "status", "priority", "createdDate", "dueDate"],
    defaultFilters: { status: ["Open", "In Progress"] },
    icon: "FileText"
  },
  {
    id: "template-2", 
    title: "Inspections report",
    description: "Report about inspections",
    dataSource: "Assets",
    defaultColumns: ["id", "name", "type", "lastInspection", "nextInspection", "status"],
    defaultFilters: { status: ["Active"] },
    icon: "TrendingUp"
  },
  {
    id: "template-3",
    title: "Maintenance report",
    description: "Report about maintenance", 
    dataSource: "Work Orders",
    defaultColumns: ["id", "title", "category", "status", "actualHours", "completedDate"],
    defaultFilters: { category: ["HVAC", "Electrical", "Plumbing"] },
    icon: "BarChart3"
  }
];