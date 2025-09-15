import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Eye,
  Search
} from "lucide-react";
import { mockProperties, mockWorkOrders, mockAssets, mockInvoices } from "@/data/mockData";
import { DetailedViewModal } from "@/components/ui/detailed-view-modal";

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
    notDue: number;
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

export function PropertyOverviewTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");

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
    const outstandingInvoices = propertyInvoices.filter(invoice => invoice.paymentStatus === 'Outstanding').length;
    const overdueInvoices = propertyInvoices.filter(invoice => invoice.paymentStatus === 'Overdue').length;
    const notDueInvoices = propertyInvoices.filter(invoice => {
      return invoice.paymentStatus === 'Outstanding' && new Date(invoice.dueDate) > new Date();
    }).length;
    
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
        notDue: notDueInvoices,
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

  const getDetailedViewData = (type: string, propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    const propertyWorkOrders = mockWorkOrders.filter(wo => wo.propertyId === propertyId);
    const propertyAssets = mockAssets.filter(asset => asset.propertyId === propertyId);
    const propertyInvoices = mockInvoices.filter(invoice => invoice.propertyId === propertyId);

    switch (type) {
      case 'workOrders':
        return {
          title: `Work Orders - ${property?.name}`,
          chartComponent: <div className="h-64 flex items-center justify-center text-muted-foreground">Chart visualization coming soon</div>,
          tableData: propertyWorkOrders.map(wo => ({
            id: wo.id,
            title: wo.title,
            status: wo.status,
            priority: wo.priority,
            dueDate: wo.dueDate,
            category: wo.category,
          })),
          tableColumns: [
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'status', label: 'Status' },
            { key: 'priority', label: 'Priority' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'category', label: 'Category' },
          ],
        };
      case 'assets':
        return {
          title: `Asset Status - ${property?.name}`,
          chartComponent: <div className="h-64 flex items-center justify-center text-muted-foreground">Chart visualization coming soon</div>,
          tableData: propertyAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            status: asset.status,
            type: asset.type,
            location: asset.location,
            lastInspection: asset.lastInspection || 'N/A',
          })),
          tableColumns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Asset Name' },
            { key: 'status', label: 'Status' },
            { key: 'type', label: 'Type' },
            { key: 'location', label: 'Location' },
            { key: 'lastInspection', label: 'Last Inspection' },
          ],
        };
      case 'invoices':
        return {
          title: `Invoicing - ${property?.name}`,
          chartComponent: <div className="h-64 flex items-center justify-center text-muted-foreground">Chart visualization coming soon</div>,
          tableData: propertyInvoices.map(invoice => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            description: invoice.description,
            amount: `$${invoice.amount.toLocaleString()}`,
            dueDate: invoice.dueDate,
            paymentStatus: invoice.paymentStatus,
          })),
          tableColumns: [
            { key: 'id', label: 'ID' },
            { key: 'invoiceNumber', label: 'Invoice #' },
            { key: 'description', label: 'Description' },
            { key: 'amount', label: 'Amount' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'paymentStatus', label: 'Status' },
          ],
        };
      default:
        return {
          title: `Details - ${property?.name}`,
          chartComponent: <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>,
          tableData: [],
          tableColumns: [],
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Performance Overview</h2>
          <p className="text-muted-foreground">
            Comprehensive view of all property metrics and performance indicators
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
          {filteredProperties.length} Properties
        </Badge>
      </div>

      {/* Property Performance Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Property</TableHead>
              <TableHead className="text-center w-32">Health Score</TableHead>
              <TableHead className="text-center w-40">Work Orders</TableHead>
              <TableHead className="text-center w-36">Priority</TableHead>
              <TableHead className="text-center w-44">Preventative Maintenance</TableHead>
              <TableHead className="text-center w-40">Asset Status</TableHead>
              <TableHead className="text-center w-36">Invoicing</TableHead>
              <TableHead className="text-center w-32">Compliance</TableHead>
              <TableHead className="text-center w-32">Operational</TableHead>
              <TableHead className="text-center w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((metrics) => {
              const { grade, variant } = getHealthScoreGrade(metrics.healthScore);
              
              return (
                <TableRow key={metrics.property.id} className="hover:bg-muted/50">
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
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1">
                        <span>Open</span>
                        <span>Overdue</span>
                        <span>Completed</span>
                      </div>
                      <div className="text-sm font-medium grid grid-cols-3 gap-1">
                        <span>{metrics.workOrders.open}</span>
                        <span className="text-destructive">{metrics.workOrders.overdue}</span>
                        <span className="text-success">{metrics.workOrders.completed}</span>
                      </div>
                      <DetailedViewModal {...getDetailedViewData('workOrders', metrics.property.id)}>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </DetailedViewModal>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1">
                        <span>Low</span>
                        <span>Med</span>
                        <span>High</span>
                      </div>
                      <div className="text-sm font-medium grid grid-cols-3 gap-1">
                        <span>{metrics.priority.low}</span>
                        <span className="text-warning">{metrics.priority.medium}</span>
                        <span className="text-destructive">{metrics.priority.high}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1">
                        <span>Open</span>
                        <span>Overdue</span>
                        <span>Completed</span>
                      </div>
                      <div className="text-sm font-medium grid grid-cols-3 gap-1">
                        <span>{metrics.preventativeMaintenance.open}</span>
                        <span className="text-destructive">{metrics.preventativeMaintenance.overdue}</span>
                        <span className="text-success">{metrics.preventativeMaintenance.completed}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1">
                        <span>Operational</span>
                        <span>Repair</span>
                        <span>Out</span>
                      </div>
                      <div className="text-sm font-medium grid grid-cols-3 gap-1">
                        <span className="text-success">{metrics.assetStatus.operational}</span>
                        <span className="text-warning">{metrics.assetStatus.pendingRepair}</span>
                        <span className="text-destructive">{metrics.assetStatus.outOfService}</span>
                      </div>
                      <DetailedViewModal {...getDetailedViewData('assets', metrics.property.id)}>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </DetailedViewModal>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1">
                        <span>Outstanding</span>
                        <span>Overdue</span>
                        <span>Not Due</span>
                      </div>
                      <div className="text-sm font-medium grid grid-cols-3 gap-1">
                        <span>{metrics.invoicing.outstanding}</span>
                        <span className="text-destructive">{metrics.invoicing.overdue}</span>
                        <span>{metrics.invoicing.notDue}</span>
                      </div>
                      <DetailedViewModal {...getDetailedViewData('invoices', metrics.property.id)}>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </DetailedViewModal>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <Progress value={metrics.complianceScore} className="w-16 h-2 mx-auto" />
                      <span className="text-sm font-medium">{metrics.complianceScore}%</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <Progress value={metrics.operationalScore} className="w-16 h-2 mx-auto" />
                      <span className="text-sm font-medium">{metrics.operationalScore}%</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Select>
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Details</SelectItem>
                        <SelectItem value="edit">Edit Property</SelectItem>
                        <SelectItem value="reports">Generate Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}