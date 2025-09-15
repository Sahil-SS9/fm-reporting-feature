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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { mockProperties, mockWorkOrders, mockAssets, mockInvoices } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  // Get top performers and needs attention
  const topPerformers = sortedProperties.slice(0, 3);
  const needsAttention = sortedProperties.slice(-3).reverse();

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

      {/* Top Performers and Needs Attention - New Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800">Top Performers</h3>
          </div>
          <div className="space-y-4">
            {topPerformers.map((metrics, index) => (
              <div key={metrics.property.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-100">
                <div>
                  <div className="font-medium text-gray-900">{metrics.property.name}</div>
                  <div className="text-sm text-gray-600 mt-1">Operational Score: {metrics.operationalScore}%</div>
                  <div className="text-sm text-gray-600">Compliance Score: {metrics.complianceScore}%</div>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 px-6"
                  onClick={() => openDetailsModal('workOrders', metrics.property.id)}
                >
                  VIE
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.664 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800">Needs Attention</h3>
          </div>
          <div className="space-y-4">
            {needsAttention.map((metrics, index) => (
              <div key={metrics.property.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100">
                <div>
                  <div className="font-medium text-gray-900">{metrics.property.name}</div>
                  <div className="text-sm text-gray-600 mt-1">Operational Score: {metrics.operationalScore}%</div>
                  <div className="text-sm text-gray-600">Compliance Score: {metrics.complianceScore}%</div>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 px-6"
                  onClick={() => openDetailsModal('workOrders', metrics.property.id)}
                >
                  VIE
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Details Modal */}
      <Dialog open={detailsModal.isOpen} onOpenChange={(open) => setDetailsModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {detailsModal.type === 'workOrders' && 'Work Orders Details'}
                {detailsModal.type === 'preventativeMaintenance' && 'Preventative Maintenance Details'}
                {detailsModal.type === 'assets' && 'Asset Status Details'}
                {detailsModal.type === 'invoicing' && 'Invoicing Details'}
                {' - '}{mockProperties.find(p => p.id === detailsModal.propertyId)?.name}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <Select 
                value={detailsModal.filter} 
                onValueChange={(value) => setDetailsModal(prev => ({ ...prev, filter: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {detailsModal.type === 'workOrders' && (
                    <>
                      <SelectItem value="priority">By Priority</SelectItem>
                      <SelectItem value="status">By Status</SelectItem>
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

            {/* Bar Chart */}
            <div className="bg-card rounded-lg p-8 border">
              <h3 className="text-xl font-semibold mb-6">
                {detailsModal.type === 'workOrders' && 'Work Orders Distribution'}
                {detailsModal.type === 'preventativeMaintenance' && 'Maintenance Schedule Performance'}
                {detailsModal.type === 'assets' && 'Asset Status Overview'}
                {detailsModal.type === 'invoicing' && 'Invoice Payment Status'}
              </h3>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData(detailsModal.type, detailsModal.propertyId, detailsModal.filter)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-card rounded-lg p-8 border">
              <h3 className="text-xl font-semibold mb-6">Detailed Data</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {getTableData(detailsModal.type, detailsModal.propertyId).columns.map(column => (
                        <TableHead key={column.key}>{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getTableData(detailsModal.type, detailsModal.propertyId).data.map((row, index) => (
                      <TableRow key={index}>
                        {getTableData(detailsModal.type, detailsModal.propertyId).columns.map(column => (
                          <TableCell key={column.key}>
                            {row[column.key as keyof typeof row]}
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
  );
}