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
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { mockProperties, mockWorkOrders, mockAssets, mockInvoices } from "@/data/mockData";
import { useDashboardContext } from "@/pages/Dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PropertyMetrics {
  property: any;
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

type SortField = 'property' | 'compliance' | 'operational';
type SortDirection = 'asc' | 'desc' | null;

export function PropertyOverviewTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  
  // Get selected property from context
  let selectedProperty = "all";
  try {
    const { selectedProperty: contextSelectedProperty } = useDashboardContext();
    selectedProperty = contextSelectedProperty;
  } catch {
    // Context not available, use default
  }
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
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
  const allPropertyMetrics: PropertyMetrics[] = mockProperties.map(property => {
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
    const complianceScore = Math.round(75 + Math.random() * 25);
    const operationalScore = Math.round(70 + Math.random() * 30);
    
    return {
      property,
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

  // Apply property filter from context first
  const propertyFilteredMetrics = selectedProperty === "all" 
    ? allPropertyMetrics 
    : allPropertyMetrics.filter(metric => metric.property.id === selectedProperty);

  // Filter properties based on search
  const filteredProperties = propertyFilteredMetrics.filter(({ property }) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  // Sort properties based on selected field and direction
  let sortedProperties = [...filteredProperties];
  if (sortField && sortDirection) {
    sortedProperties.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortField) {
        case 'property':
          aValue = a.property.name.toLowerCase();
          bValue = b.property.name.toLowerCase();
          break;
        case 'compliance':
          aValue = a.complianceScore;
          bValue = b.complianceScore;
          break;
        case 'operational':
          aValue = a.operationalScore;
          bValue = b.operationalScore;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });
  } else {
    // Default sort by compliance score descending
    sortedProperties.sort((a, b) => b.complianceScore - a.complianceScore);
  }
  
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
        <Badge variant="outline" className="text-sm">
          {displayedProperties.length} of {filteredProperties.length} Properties
        </Badge>
      </div>


      {/* Property Performance Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('property')}
                >
                  <span className="flex items-center gap-2">
                    Property
                    {getSortIcon('property')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="text-center w-40">Work Orders</TableHead>
              <TableHead className="text-center w-40">Asset Status</TableHead>
              <TableHead className="text-center w-36">Invoicing</TableHead>
              <TableHead className="text-center w-32">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('compliance')}
                >
                  <span className="flex items-center gap-2">
                    Compliance
                    {getSortIcon('compliance')}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="text-center w-32">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('operational')}
                >
                  <span className="flex items-center gap-2">
                    Operational
                    {getSortIcon('operational')}
                  </span>
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedProperties.map((metrics) => {
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
                      <div className="space-y-2">
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
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="space-y-2">
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
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="space-y-2">
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
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Show More Button */}
      {!showAll && filteredProperties.length > 10 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2"
          >
            Show {filteredProperties.length - 10} More Properties
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showAll && filteredProperties.length > 10 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(false)}
            className="flex items-center gap-2"
          >
            Show Less Properties
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      )}

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
            <div className="bg-card rounded-lg p-10 border">
              <h3 className="text-xl font-semibold mb-6">
                {detailsModal.type === 'workOrders' && 'Work Orders Distribution'}
                {detailsModal.type === 'preventativeMaintenance' && 'Maintenance Schedule Performance'}
                {detailsModal.type === 'assets' && 'Asset Status Overview'}
                {detailsModal.type === 'invoicing' && 'Invoice Payment Status'}
              </h3>
              <div className="h-[700px] w-full">
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