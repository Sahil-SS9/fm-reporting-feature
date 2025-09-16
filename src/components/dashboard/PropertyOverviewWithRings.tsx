import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Search,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { mockProperties, mockWorkOrders, mockAssets, mockInvoices } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";

interface PropertyMetrics {
  property: any;
  healthScore: number;
  workOrders: {
    open: number;
    overdue: number;
    completed: number;
  };
  priority: {
    low: number;
    medium: number;
    high: number;
  };
  preventativeMaintenance: {
    open: number;
    overdue: number;
    completed: number;
  };
  assetStatus: {
    operational: number;
    pendingRepair: number;
    outOfService: number;
  };
  invoicing: {
    outstanding: number;
    overdue: number;
    paid: number;
  };
  complianceScore: number;
  operationalScore: number;
}

function getPropertyInitials(name: string) {
  return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
}

function getHealthScoreGrade(score: number) {
  if (score >= 90) return { grade: 'A', variant: 'default' as const };
  if (score >= 80) return { grade: 'B', variant: 'secondary' as const };
  if (score >= 70) return { grade: 'C', variant: 'secondary' as const };
  return { grade: 'D', variant: 'destructive' as const };
}

function getHealthScoreColor(score: number) {
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-warning";
  return "text-destructive";
}

export function PropertyOverviewWithRings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    type: string;
    propertyId: string;
    filter: string;
  }>({
    isOpen: false,
    type: '',
    propertyId: '',
    filter: 'all'
  });

  // Calculate comprehensive metrics for each property
  const propertyMetrics: PropertyMetrics[] = mockProperties.map(property => {
    const propertyWorkOrders = mockWorkOrders.filter(wo => wo.propertyId === property.id);
    const propertyAssets = mockAssets.filter(asset => asset.propertyId === property.id);
    const propertyInvoices = mockInvoices.filter(invoice => invoice.propertyId === property.id);
    
    // Work Orders breakdown
    const openWorkOrders = propertyWorkOrders.filter(wo => wo.status === 'Open').length;
    const overdueWorkOrders = propertyWorkOrders.filter(wo => {
      return wo.status !== 'Completed' && new Date(wo.dueDate) < new Date();
    }).length;
    const completedWorkOrders = propertyWorkOrders.filter(wo => wo.status === 'Completed').length;
    
    // Priority breakdown
    const lowPriority = propertyWorkOrders.filter(wo => wo.priority === 'Low').length;
    const mediumPriority = propertyWorkOrders.filter(wo => wo.priority === 'Medium').length;
    const highPriority = propertyWorkOrders.filter(wo => wo.priority === 'High' || wo.priority === 'Critical').length;
    
    // Preventative Maintenance (mock data based on work order patterns)
    const pmOpen = Math.round(openWorkOrders * 0.3);
    const pmOverdue = Math.round(overdueWorkOrders * 0.2);
    const pmCompleted = Math.round(completedWorkOrders * 0.4);
    
    // Asset Status breakdown
    const operationalAssets = propertyAssets.filter(asset => asset.status === 'Operational').length;
    const pendingRepairAssets = propertyAssets.filter(asset => asset.status === 'Pending Repair').length;
    const outOfServiceAssets = propertyAssets.filter(asset => asset.status === 'Out of Service').length;
    
    // Invoicing breakdown
    const paidInvoices = propertyInvoices.filter(invoice => invoice.paymentStatus === 'Paid').length;
    const outstandingInvoices = propertyInvoices.filter(invoice => invoice.paymentStatus === 'Outstanding').length;
    const overdueInvoices = propertyInvoices.filter(invoice => invoice.paymentStatus === 'Overdue').length;
    
    // Calculate scores
    const completionRate = propertyWorkOrders.length > 0 ? (completedWorkOrders / propertyWorkOrders.length) * 100 : 100;
    const assetHealthRate = propertyAssets.length > 0 ? (operationalAssets / propertyAssets.length) * 100 : 100;
    const healthScore = Math.round((completionRate * 0.4 + assetHealthRate * 0.6));
    
    const complianceScore = Math.round(75 + Math.random() * 25);
    const operationalScore = Math.round(healthScore * 0.8 + Math.random() * 20);
    
    return {
      property,
      healthScore: Math.min(100, Math.max(0, healthScore)),
      workOrders: {
        open: openWorkOrders,
        overdue: overdueWorkOrders,
        completed: completedWorkOrders,
      },
      priority: {
        low: lowPriority,
        medium: mediumPriority,
        high: highPriority,
      },
      preventativeMaintenance: {
        open: pmOpen,
        overdue: pmOverdue,
        completed: pmCompleted,
      },
      assetStatus: {
        operational: operationalAssets,
        pendingRepair: pendingRepairAssets,
        outOfService: outOfServiceAssets,
      },
      invoicing: {
        outstanding: outstandingInvoices,
        overdue: overdueInvoices,
        paid: paidInvoices,
      },
      complianceScore,
      operationalScore,
    };
  });

  // Filter properties based on search and type
  const filteredProperties = propertyMetrics.filter(({ property }) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyTypeFilter === "all" || property.type === propertyTypeFilter;
    return matchesSearch && matchesType;
  });

  // Sort by health score and limit to top 10 unless showing all
  const sortedProperties = filteredProperties.sort((a, b) => b.healthScore - a.healthScore);
  const displayedProperties = showAll ? sortedProperties : sortedProperties.slice(0, 10);

  const getChartData = (type: string, propertyId: string, filter: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    const propertyWorkOrders = mockWorkOrders.filter(wo => wo.propertyId === propertyId);
    const propertyAssets = mockAssets.filter(asset => asset.propertyId === propertyId);
    const propertyInvoices = mockInvoices.filter(invoice => invoice.propertyId === propertyId);

    switch (type) {
      case 'workOrders':
        if (filter === 'priority') {
          const priorityCounts = {
            'Low': propertyWorkOrders.filter(wo => wo.priority === 'Low').length,
            'Medium': propertyWorkOrders.filter(wo => wo.priority === 'Medium').length,
            'High': propertyWorkOrders.filter(wo => wo.priority === 'High').length,
            'Critical': propertyWorkOrders.filter(wo => wo.priority === 'Critical').length,
          };
          return Object.entries(priorityCounts).map(([priority, count]) => ({
            name: priority,
            value: count,
          }));
        } else {
          return [
            { name: 'Open', value: propertyWorkOrders.filter(wo => wo.status === 'Open').length },
            { name: 'In Progress', value: propertyWorkOrders.filter(wo => wo.status === 'In Progress').length },
            { name: 'Completed', value: propertyWorkOrders.filter(wo => wo.status === 'Completed').length },
          ];
        }
      case 'preventativeMaintenance':
        return [
          { name: 'On Time', value: Math.round(propertyWorkOrders.length * 0.7) },
          { name: 'Late', value: Math.round(propertyWorkOrders.length * 0.3) },
        ];
      case 'assets':
        if (filter === 'status') {
          return [
            { name: 'Operational', value: propertyAssets.filter(asset => asset.status === 'Operational').length },
            { name: 'Pending Repair', value: propertyAssets.filter(asset => asset.status === 'Pending Repair').length },
            { name: 'Out of Service', value: propertyAssets.filter(asset => asset.status === 'Out of Service').length },
          ];
        } else {
          return propertyAssets.reduce((acc, asset) => {
            const existing = acc.find(item => item.name === asset.type);
            if (existing) {
              existing.value += 1;
            } else {
              acc.push({ name: asset.type, value: 1 });
            }
            return acc;
          }, [] as { name: string; value: number }[]);
        }
      case 'invoicing':
        return [
          { name: 'Paid', value: propertyInvoices.filter(invoice => invoice.paymentStatus === 'Paid').length },
          { name: 'Outstanding', value: propertyInvoices.filter(invoice => invoice.paymentStatus === 'Outstanding').length },
          { name: 'Overdue', value: propertyInvoices.filter(invoice => invoice.paymentStatus === 'Overdue').length },
        ];
      default:
        return [];
    }
  };

  const getTableData = (type: string, propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    const propertyWorkOrders = mockWorkOrders.filter(wo => wo.propertyId === propertyId);
    const propertyAssets = mockAssets.filter(asset => asset.propertyId === propertyId);
    const propertyInvoices = mockInvoices.filter(invoice => invoice.propertyId === propertyId);

    switch (type) {
      case 'workOrders':
        return {
          data: propertyWorkOrders.map(wo => ({
            id: wo.id,
            title: wo.title,
            status: wo.status,
            priority: wo.priority,
            dueDate: wo.dueDate,
            category: wo.category,
          })),
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'status', label: 'Status' },
            { key: 'priority', label: 'Priority' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'category', label: 'Category' },
          ],
        };
      case 'preventativeMaintenance':
        return {
          data: propertyWorkOrders.filter(wo => wo.category === 'Preventive Maintenance').map(wo => ({
            id: wo.id,
            title: wo.title,
            status: wo.status,
            dueDate: wo.dueDate,
            schedule: 'Monthly', // Mock data
          })),
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Task' },
            { key: 'status', label: 'Status' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'schedule', label: 'Schedule' },
          ],
        };
      case 'assets':
        return {
          data: propertyAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            status: asset.status,
            type: asset.type,
            location: asset.location,
            lastInspection: asset.lastInspection || 'N/A',
          })),
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Asset Name' },
            { key: 'status', label: 'Status' },
            { key: 'type', label: 'Type' },
            { key: 'location', label: 'Location' },
            { key: 'lastInspection', label: 'Last Inspection' },
          ],
        };
      case 'invoicing':
        return {
          data: propertyInvoices.map(invoice => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            description: invoice.description,
            amount: `$${invoice.amount.toLocaleString()}`,
            dueDate: invoice.dueDate,
            paymentStatus: invoice.paymentStatus,
          })),
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'invoiceNumber', label: 'Invoice #' },
            { key: 'description', label: 'Description' },
            { key: 'amount', label: 'Amount' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'paymentStatus', label: 'Status' },
          ],
        };
      default:
        return { data: [], columns: [] };
    }
  };

  const openDetailsModal = (type: string, propertyId: string) => {
    setDetailsModal({
      isOpen: true,
      type,
      propertyId,
      filter: 'all'
    });
  };

  const getWorkOrderRingData = (metrics: PropertyMetrics) => [
    { name: 'Open', value: metrics.workOrders.open, color: '#f59e0b' },
    { name: 'Overdue', value: metrics.workOrders.overdue, color: '#ef4444' },
    { name: 'Completed', value: metrics.workOrders.completed, color: '#10b981' },
  ];

  const getPreventiveMaintenanceRingData = (metrics: PropertyMetrics) => [
    { name: 'Open', value: metrics.preventativeMaintenance.open, color: '#3b82f6' },
    { name: 'Overdue', value: metrics.preventativeMaintenance.overdue, color: '#ef4444' },
    { name: 'Completed', value: metrics.preventativeMaintenance.completed, color: '#10b981' },
  ];

  const getAssetStatusRingData = (metrics: PropertyMetrics) => [
    { name: 'Operational', value: metrics.assetStatus.operational, color: '#10b981' },
    { name: 'Pending Repair', value: metrics.assetStatus.pendingRepair, color: '#f59e0b' },
    { name: 'Out of Service', value: metrics.assetStatus.outOfService, color: '#ef4444' },
  ];

  const getInvoicingRingData = (metrics: PropertyMetrics) => [
    { name: 'Paid', value: metrics.invoicing.paid, color: '#10b981' },
    { name: 'Outstanding', value: metrics.invoicing.outstanding, color: '#f59e0b' },
    { name: 'Overdue', value: metrics.invoicing.overdue, color: '#ef4444' },
  ];

  // Calculate totals for the rings in headers
  const totalWorkOrders = displayedProperties.reduce((sum, m) => sum + m.workOrders.open + m.workOrders.overdue + m.workOrders.completed, 0);
  const totalPreventiveMaintenance = displayedProperties.reduce((sum, m) => sum + m.preventativeMaintenance.open + m.preventativeMaintenance.overdue + m.preventativeMaintenance.completed, 0);
  const totalAssets = displayedProperties.reduce((sum, m) => sum + m.assetStatus.operational + m.assetStatus.pendingRepair + m.assetStatus.outOfService, 0);
  const totalInvoicing = displayedProperties.reduce((sum, m) => sum + m.invoicing.paid + m.invoicing.outstanding + m.invoicing.overdue, 0);

  const headerWorkOrdersData = [
    { name: 'Open', value: displayedProperties.reduce((sum, m) => sum + m.workOrders.open, 0), color: '#f59e0b' },
    { name: 'Overdue', value: displayedProperties.reduce((sum, m) => sum + m.workOrders.overdue, 0), color: '#ef4444' },
    { name: 'Completed', value: displayedProperties.reduce((sum, m) => sum + m.workOrders.completed, 0), color: '#10b981' },
  ];

  const headerPreventiveMaintenanceData = [
    { name: 'Open', value: displayedProperties.reduce((sum, m) => sum + m.preventativeMaintenance.open, 0), color: '#3b82f6' },
    { name: 'Overdue', value: displayedProperties.reduce((sum, m) => sum + m.preventativeMaintenance.overdue, 0), color: '#ef4444' },
    { name: 'Completed', value: displayedProperties.reduce((sum, m) => sum + m.preventativeMaintenance.completed, 0), color: '#10b981' },
  ];

  const headerAssetsData = [
    { name: 'Operational', value: displayedProperties.reduce((sum, m) => sum + m.assetStatus.operational, 0), color: '#10b981' },
    { name: 'Pending Repair', value: displayedProperties.reduce((sum, m) => sum + m.assetStatus.pendingRepair, 0), color: '#f59e0b' },
    { name: 'Out of Service', value: displayedProperties.reduce((sum, m) => sum + m.assetStatus.outOfService, 0), color: '#ef4444' },
  ];

  const headerInvoicingData = [
    { name: 'Paid', value: displayedProperties.reduce((sum, m) => sum + m.invoicing.paid, 0), color: '#10b981' },
    { name: 'Outstanding', value: displayedProperties.reduce((sum, m) => sum + m.invoicing.outstanding, 0), color: '#f59e0b' },
    { name: 'Overdue', value: displayedProperties.reduce((sum, m) => sum + m.invoicing.overdue, 0), color: '#ef4444' },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Property Performance Overview - Ring View</h2>
            <p className="text-muted-foreground">
              Visual breakdown of property metrics with interactive donut charts
            </p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Property Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Property Types</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Warehouse">Warehouse</SelectItem>
              <SelectItem value="Mixed Use">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-sm">
            {displayedProperties.length} of {filteredProperties.length} Properties
          </Badge>
        </div>

        {/* Property Performance Table with Rings */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Property</TableHead>
                <TableHead className="text-center w-32">Health Score</TableHead>
                <TableHead className="text-center w-40">
                  <div className="flex flex-col items-center space-y-2">
                    <span>Work Orders</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="cursor-pointer"
                          onClick={() => openDetailsModal('workOrders', 'all')}
                        >
                          <DonutChartWithCenter
                            data={headerWorkOrdersData}
                            size={60}
                            strokeWidth={6}
                            centerContent={<span className="text-xs font-medium">{totalWorkOrders}</span>}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div>Open: {headerWorkOrdersData[0].value}</div>
                          <div>Overdue: {headerWorkOrdersData[1].value}</div>
                          <div>Completed: {headerWorkOrdersData[2].value}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="text-center w-44">
                  <div className="flex flex-col items-center space-y-2">
                    <span>Preventative Maintenance</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="cursor-pointer"
                          onClick={() => openDetailsModal('preventativeMaintenance', 'all')}
                        >
                          <DonutChartWithCenter
                            data={headerPreventiveMaintenanceData}
                            size={60}
                            strokeWidth={6}
                            centerContent={<span className="text-xs font-medium">{totalPreventiveMaintenance}</span>}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div>Open: {headerPreventiveMaintenanceData[0].value}</div>
                          <div>Overdue: {headerPreventiveMaintenanceData[1].value}</div>
                          <div>Completed: {headerPreventiveMaintenanceData[2].value}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="text-center w-40">
                  <div className="flex flex-col items-center space-y-2">
                    <span>Asset Status</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="cursor-pointer"
                          onClick={() => openDetailsModal('assets', 'all')}
                        >
                          <DonutChartWithCenter
                            data={headerAssetsData}
                            size={60}
                            strokeWidth={6}
                            centerContent={<span className="text-xs font-medium">{totalAssets}</span>}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div>Operational: {headerAssetsData[0].value}</div>
                          <div>Pending Repair: {headerAssetsData[1].value}</div>
                          <div>Out of Service: {headerAssetsData[2].value}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="text-center w-36">
                  <div className="flex flex-col items-center space-y-2">
                    <span>Invoicing</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="cursor-pointer"
                          onClick={() => openDetailsModal('invoicing', 'all')}
                        >
                          <DonutChartWithCenter
                            data={headerInvoicingData}
                            size={60}
                            strokeWidth={6}
                            centerContent={<span className="text-xs font-medium">{totalInvoicing}</span>}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div>Paid: {headerInvoicingData[0].value}</div>
                          <div>Outstanding: {headerInvoicingData[1].value}</div>
                          <div>Overdue: {headerInvoicingData[2].value}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="text-center w-32">Compliance</TableHead>
                <TableHead className="text-center w-32">Operational</TableHead>
                <TableHead className="text-center w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedProperties.map((metrics) => {
                const { grade, variant } = getHealthScoreGrade(metrics.healthScore);
                
                return (
                  <React.Fragment key={metrics.property.id}>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
                            {getPropertyInitials(metrics.property.name)}
                          </div>
                          <div>
                            <div className="font-medium">{metrics.property.name}</div>
                            <div className="text-sm text-muted-foreground">{metrics.property.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Badge variant={variant} className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                            {grade}
                          </Badge>
                          <span className={`text-sm font-bold ${getHealthScoreColor(metrics.healthScore)}`}>
                            {metrics.healthScore}%
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="flex justify-center cursor-pointer"
                              onClick={() => openDetailsModal('workOrders', metrics.property.id)}
                            >
                              <DonutChartWithCenter
                                data={getWorkOrderRingData(metrics)}
                                size={50}
                                strokeWidth={5}
                                centerContent={
                                  <span className="text-xs font-medium">
                                    {metrics.workOrders.open + metrics.workOrders.overdue + metrics.workOrders.completed}
                                  </span>
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div>Open: {metrics.workOrders.open}</div>
                              <div>Overdue: {metrics.workOrders.overdue}</div>
                              <div>Completed: {metrics.workOrders.completed}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="flex justify-center cursor-pointer"
                              onClick={() => openDetailsModal('preventativeMaintenance', metrics.property.id)}
                            >
                              <DonutChartWithCenter
                                data={getPreventiveMaintenanceRingData(metrics)}
                                size={50}
                                strokeWidth={5}
                                centerContent={
                                  <span className="text-xs font-medium">
                                    {metrics.preventativeMaintenance.open + metrics.preventativeMaintenance.overdue + metrics.preventativeMaintenance.completed}
                                  </span>
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div>Open: {metrics.preventativeMaintenance.open}</div>
                              <div>Overdue: {metrics.preventativeMaintenance.overdue}</div>
                              <div>Completed: {metrics.preventativeMaintenance.completed}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="flex justify-center cursor-pointer"
                              onClick={() => openDetailsModal('assets', metrics.property.id)}
                            >
                              <DonutChartWithCenter
                                data={getAssetStatusRingData(metrics)}
                                size={50}
                                strokeWidth={5}
                                centerContent={
                                  <span className="text-xs font-medium">
                                    {metrics.assetStatus.operational + metrics.assetStatus.pendingRepair + metrics.assetStatus.outOfService}
                                  </span>
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div>Operational: {metrics.assetStatus.operational}</div>
                              <div>Pending Repair: {metrics.assetStatus.pendingRepair}</div>
                              <div>Out of Service: {metrics.assetStatus.outOfService}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="flex justify-center cursor-pointer"
                              onClick={() => openDetailsModal('invoicing', metrics.property.id)}
                            >
                              <DonutChartWithCenter
                                data={getInvoicingRingData(metrics)}
                                size={50}
                                strokeWidth={5}
                                centerContent={
                                  <span className="text-xs font-medium">
                                    {metrics.invoicing.paid + metrics.invoicing.outstanding + metrics.invoicing.overdue}
                                  </span>
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div>Paid: {metrics.invoicing.paid}</div>
                              <div>Outstanding: {metrics.invoicing.outstanding}</div>
                              <div>Overdue: {metrics.invoicing.overdue}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {metrics.complianceScore}%
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {metrics.operationalScore}%
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailsModal('workOrders', metrics.property.id)}>
                              View Work Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDetailsModal('assets', metrics.property.id)}>
                              View Assets
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDetailsModal('invoicing', metrics.property.id)}>
                              View Invoicing
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Show More Button */}
        {!showAll && filteredProperties.length > 10 && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAll(true)}
              className="flex items-center space-x-2"
            >
              <span>Show More Properties</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Enhanced Details Modal */}
        <Dialog open={detailsModal.isOpen} onOpenChange={(open) => setDetailsModal({ ...detailsModal, isOpen: open })}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>
                  {detailsModal.type === 'workOrders' && 'Work Orders Details'}
                  {detailsModal.type === 'preventativeMaintenance' && 'Preventative Maintenance Details'}
                  {detailsModal.type === 'assets' && 'Assets Details'}
                  {detailsModal.type === 'invoicing' && 'Invoicing Details'}
                </span>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={detailsModal.filter} 
                    onValueChange={(value) => setDetailsModal({ ...detailsModal, filter: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {detailsModal.type === 'workOrders' && (
                        <>
                          <SelectItem value="status">By Status</SelectItem>
                          <SelectItem value="priority">By Priority</SelectItem>
                        </>
                      )}
                      {detailsModal.type === 'assets' && (
                        <>
                          <SelectItem value="status">By Status</SelectItem>
                          <SelectItem value="type">By Type</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Distribution Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData(detailsModal.type, detailsModal.propertyId, detailsModal.filter)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detailed Breakdown</h3>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {getTableData(detailsModal.type, detailsModal.propertyId).columns.map((column) => (
                          <TableHead key={column.key} className="text-xs">{column.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getTableData(detailsModal.type, detailsModal.propertyId).data.map((row: any, index) => (
                        <TableRow key={index}>
                          {getTableData(detailsModal.type, detailsModal.propertyId).columns.map((column) => (
                            <TableCell key={column.key} className="text-xs">
                              {column.key === 'status' || column.key === 'priority' || column.key === 'paymentStatus' ? (
                                <Badge variant={
                                  (row[column.key] === 'Completed' || row[column.key] === 'Paid' || row[column.key] === 'Operational') ? 'default' :
                                  (row[column.key] === 'Overdue' || row[column.key] === 'Critical' || row[column.key] === 'Out of Service') ? 'destructive' :
                                  'secondary'
                                } className="text-xs">
                                  {row[column.key]}
                                </Badge>
                              ) : (
                                row[column.key]
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}