import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetMaintenanceWidget } from "@/components/dashboard/AssetMaintenanceWidget";
import { AssetStatusWidget } from "@/components/dashboard/AssetStatusWidget";
import { AssetConditionWidget } from "@/components/dashboard/AssetConditionWidget";
import { WarrantyExpiryWidget } from "@/components/dashboard/WarrantyExpiryWidget";
import { PreventiveMaintenanceWidget } from "@/components/dashboard/PreventiveMaintenanceWidget";
import { TopAssetsWidget } from "@/components/dashboard/TopAssetsWidget";
import { OutstandingInvoicesWidget } from "@/components/dashboard/OutstandingInvoicesWidget";
import { IssuedInvoicesWidget } from "@/components/dashboard/IssuedInvoicesWidget";
import { PropertyPerformanceWidget } from "@/components/dashboard/PropertyPerformanceWidget";

import { PropertyOverviewTab } from "@/components/dashboard/PropertyOverviewTab";
import { ContractorInvoicingWidget } from "@/components/dashboard/ContractorInvoicingWidget";
import { DocumentExpiryWidget } from "@/components/dashboard/DocumentExpiryWidget";
import { CasesCreatedClosedWidget } from "@/components/dashboard/CasesCreatedClosedWidget";
import { WorkOrdersCreatedClosedWidget } from "@/components/dashboard/WorkOrdersCreatedClosedWidget";
import { AverageCompletionTimeWidget } from "@/components/dashboard/AverageCompletionTimeWidget";
import { EnhancedAverageCompletionTimeWidget } from "@/components/dashboard/EnhancedAverageCompletionTimeWidget";
import { CompletionTimeTrendChart } from "@/components/dashboard/CompletionTimeTrendChart";
import { EnhancedCompletionTimeTrendChart } from "@/components/dashboard/EnhancedCompletionTimeTrendChart";
import { PriorityInboxWidget } from "@/components/dashboard/PriorityInboxWidget";
import { EssentialMetricsCard } from "@/components/dashboard/EssentialMetricsCard";
import { EnhancedEssentialMetricsCard } from "@/components/dashboard/EnhancedEssentialMetricsCard";
import { CreatedVsCompletedTrendWidget } from "@/components/dashboard/CreatedVsCompletedTrendWidget";
import { WorkOrderPriorityWidget } from "@/components/dashboard/WorkOrderPriorityWidget";
import { EnhancedWorkOrderPriorityWidget } from "@/components/dashboard/EnhancedWorkOrderPriorityWidget";
import { OnTimeVsOverdueWidget } from "@/components/dashboard/OnTimeVsOverdueWidget";
import { WorkOrderStatusWidget } from "@/components/dashboard/WorkOrderStatusWidget";
import { getPerformanceMetrics } from "@/components/dashboard/PerformanceSummaryWidget";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import {
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Target,
  Filter,
  PlayCircle,
  FileCheck,
  CheckCircle2
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateKPIMetrics } from "@/lib/kpi-calculations";
import { mockWorkOrders, mockProperties, mockAssets, mockInvoices } from "@/data/mockData";
import { useState, createContext, useContext } from "react";

// Create context for current tab and selected property
const DashboardContext = createContext<{
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedProperty: string;
  setSelectedProperty: (property: string) => void;
}>({
  currentTab: "overview",
  setCurrentTab: () => {},
  selectedProperty: "all",
  setSelectedProperty: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

const statusData = [
  { name: "Open", value: 45, color: "hsl(var(--primary))" },
  { name: "In Progress", value: 30, color: "hsl(var(--warning))" },
  { name: "Completed", value: 75, color: "hsl(var(--success))" },
  { name: "On Hold", value: 15, color: "hsl(var(--destructive))" },
];

const recentActivities = [
  { id: 1, action: "Work order #WO-2024-001 completed", time: "2 minutes ago", type: "completion" },
  { id: 2, action: "New maintenance request created", time: "15 minutes ago", type: "creation" },
  { id: 3, action: "Asset #A-001 inspection scheduled", time: "1 hour ago", type: "schedule" },
  { id: 4, action: "Contractor assigned to WO-2024-003", time: "2 hours ago", type: "assignment" },
  { id: 5, action: "Emergency repair completed", time: "3 hours ago", type: "completion" },
];

export default function Dashboard() {
  // Filter work orders and other data based on selected property
  const getFilteredWorkOrders = (selectedProperty: string) => {
    return selectedProperty === "all" 
      ? mockWorkOrders 
      : mockWorkOrders.filter(wo => wo.propertyId === selectedProperty);
  };

  const getFilteredAssets = (selectedProperty: string) => {
    return selectedProperty === "all" 
      ? mockAssets 
      : mockAssets.filter(asset => asset.propertyId === selectedProperty);
  };

  const getFilteredInvoices = (selectedProperty: string) => {
    return selectedProperty === "all" 
      ? mockInvoices 
      : mockInvoices.filter(invoice => invoice.propertyId === selectedProperty);
  };

  const kpiMetrics = calculateKPIMetrics(mockWorkOrders);
  const performanceMetrics = getPerformanceMetrics();
  
  // Pass current tab and property filter to layout  
  const [currentTab, setCurrentTab] = useState("overview");
  const [selectedProperty, setSelectedProperty] = useState("all");

  // Get filtered data based on selected property
  const filteredWorkOrders = getFilteredWorkOrders(selectedProperty);
  const filteredAssets = getFilteredAssets(selectedProperty);  
  const filteredInvoices = getFilteredInvoices(selectedProperty);
  const filteredKpiMetrics = calculateKPIMetrics(filteredWorkOrders);
  
  // Calculate status counts (mapping to available statuses)
  const approvedCount = filteredWorkOrders.filter(wo => wo.status === "Open").length;
  const inProgressCount = filteredWorkOrders.filter(wo => wo.status === "In Progress").length;
  const inReviewCount = 0; // Not available in current data model
  const completedCount = filteredWorkOrders.filter(wo => wo.status === "Completed").length;
  
  return (
    <DashboardContext.Provider value={{ currentTab, setCurrentTab, selectedProperty, setSelectedProperty }}>
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Command Centre</h1>
            <p className="text-muted-foreground mt-2">
              Critical insights and actionable items for facilities management
              {selectedProperty !== "all" && (
                <span className="ml-2 text-primary font-medium">
                  - {mockProperties.find(p => p.id === selectedProperty)?.name}
                </span>
              )}
            </p>
          </div>
          {selectedProperty !== "all" && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Filtered by Property</div>
              <div className="text-lg font-semibold text-primary">
                {mockProperties.find(p => p.id === selectedProperty)?.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={(value) => {
        setCurrentTab(value);
        // Reset property filter to "all" when switching to property tab
        if (value === "property") {
          setSelectedProperty("all");
        }
      }}>
        <div className="flex items-center justify-between">
          <TabsList className="inline-flex h-12 items-center justify-start gap-2 bg-transparent p-0 border-b border-border rounded-none w-full">
            <TabsTrigger 
              value="overview" 
              className="relative px-6 py-3 text-sm font-medium transition-all duration-200 bg-transparent border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none hover:text-primary/80 min-w-[100px]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="property" 
              className="relative px-6 py-3 text-sm font-medium transition-all duration-200 bg-transparent border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none hover:text-primary/80 min-w-[100px]"
            >
              Property
            </TabsTrigger>
            <TabsTrigger 
              value="operations" 
              className="relative px-6 py-3 text-sm font-medium transition-all duration-200 bg-transparent border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none hover:text-primary/80 min-w-[100px]"
            >
              Operations
            </TabsTrigger>
            <TabsTrigger 
              value="assets" 
              className="relative px-6 py-3 text-sm font-medium transition-all duration-200 bg-transparent border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none hover:text-primary/80 min-w-[100px]"
            >
              Assets
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="relative px-6 py-3 text-sm font-medium transition-all duration-200 bg-transparent border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none hover:text-primary/80 min-w-[100px]"
            >
              Financial
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="relative px-6 py-3 text-sm font-medium transition-all duration-200 bg-transparent border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none hover:text-primary/80 min-w-[100px]"
            >
              Documents
            </TabsTrigger>
          </TabsList>
          
          {/* Property Filter Dropdown - Only show when not on property tab */}
          {currentTab !== "property" && (
            <div className="relative">
              <Select 
                value={selectedProperty} 
                onValueChange={setSelectedProperty}
              >
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">All Properties</SelectItem>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Overview Tab - Priority Inbox */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <PriorityInboxWidget 
                selectedProperty={selectedProperty}
                filteredWorkOrders={filteredWorkOrders}
              />
            </div>
          </div>
        </TabsContent>

        {/* Property Overview Tab */}
        <TabsContent value="property" className="space-y-8">
          {/* Property Overview */}
          <PropertyOverviewTab />
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-8">
          {/* Essential Metrics */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Today's Metrics</h3>
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <EnhancedEssentialMetricsCard
                title="Due Today"
                value={filteredKpiMetrics.dueToday}
                icon={Clock}
                variant={filteredKpiMetrics.dueToday > 5 ? "warning" : "default"}
                description="Work orders due today"
              />
              <EnhancedEssentialMetricsCard
                title="Overdue Items"
                value={filteredKpiMetrics.overdue}
                icon={AlertTriangle}
                variant={filteredKpiMetrics.overdue > 0 ? "critical" : "success"}
                description="Past due work orders"
              />
              <EnhancedEssentialMetricsCard
                title="Critical Issues"
                value={filteredKpiMetrics.critical}
                icon={AlertTriangle}
                variant={filteredKpiMetrics.critical > 0 ? "critical" : "success"}
                description="High priority items"
              />
            </div>
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EnhancedEssentialMetricsCard
                title="Approved Work Orders"
                value={approvedCount}
                icon={CheckCircle2}
                variant="default"
                description="Work orders approved"
              />
              <EnhancedEssentialMetricsCard
                title="In-Progress Work Orders"
                value={inProgressCount}
                icon={PlayCircle}
                variant="default"
                description="Work orders in progress"
              />
              <EnhancedEssentialMetricsCard
                title="In Review Work Orders"
                value={inReviewCount}
                icon={FileCheck}
                variant="default"
                description="Work orders in review"
              />
              <EnhancedEssentialMetricsCard
                title="Completed Work Orders"
                value={completedCount}
                icon={CheckCircle}
                variant="success"
                description="Work orders completed"
              />
            </div>
          </div>

          {/* Work Order Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EnhancedWorkOrderPriorityWidget 
              selectedProperty={selectedProperty}
              filteredWorkOrders={filteredWorkOrders}
            />
            <WorkOrderStatusWidget filteredWorkOrders={filteredWorkOrders} />
            <OnTimeVsOverdueWidget filteredWorkOrders={filteredWorkOrders} />
          </div>

          {/* Performance Insights - Work Orders */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Performance Insights - Work Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EnhancedEssentialMetricsCard
                title="Avg Completion Time"
                value={`${filteredKpiMetrics.avgCompletionTime}`}
                subValue="days"
                icon={TrendingUp}
                variant={filteredKpiMetrics.avgCompletionTime <= 3 ? "success" : filteredKpiMetrics.avgCompletionTime <= 7 ? "warning" : "critical"}
                description="Average time to complete"
              />
              <EnhancedEssentialMetricsCard
                title="Closure Rate" 
                value={`${filteredKpiMetrics.closureRate}%`}
                icon={CheckCircle}
                variant={filteredKpiMetrics.closureRate >= 80 ? "success" : "warning"}
                description="Work orders completed"
              />
              <EnhancedEssentialMetricsCard
                title="Resolution Time"
                value={`${performanceMetrics.avgCompletionTime}`}
                subValue="days"
                icon={Activity}
                variant={performanceMetrics.avgCompletionTime <= 3 ? "success" : performanceMetrics.avgCompletionTime <= 7 ? "warning" : "critical"}
                description="Time to resolve issues"
              />
            </div>
          </div>

          {/* Performance Insights - Cases */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Performance Insights - Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EnhancedEssentialMetricsCard
                title="Avg Completion Time"
                value={`${filteredKpiMetrics.avgCompletionTime}`}
                subValue="days"
                icon={TrendingUp}
                variant={filteredKpiMetrics.avgCompletionTime <= 3 ? "success" : filteredKpiMetrics.avgCompletionTime <= 7 ? "warning" : "critical"}
                description="Average time to complete"
              />
              <EnhancedEssentialMetricsCard
                title="Closure Rate" 
                value={`${filteredKpiMetrics.closureRate}%`}
                icon={CheckCircle}
                variant={filteredKpiMetrics.closureRate >= 80 ? "success" : "warning"}
                description="Cases completed"
              />
              <EnhancedEssentialMetricsCard
                title="Resolution Time"
                value={`${performanceMetrics.avgCompletionTime}`}
                subValue="days"
                icon={Activity}
                variant={performanceMetrics.avgCompletionTime <= 3 ? "success" : performanceMetrics.avgCompletionTime <= 7 ? "warning" : "critical"}
                description="Time to resolve cases"
              />
            </div>
          </div>
          
          {/* Trend Analysis */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Trend Analysis</h3>
            <CreatedVsCompletedTrendWidget filteredWorkOrders={filteredWorkOrders} />
          </div>

          
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          {/* Core Asset Widgets - Asset Status and Condition compact, Asset Maintenance wider */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-1">
              <AssetStatusWidget filteredAssets={filteredAssets} />
            </div>
            <div className="lg:col-span-1">
              <AssetConditionWidget filteredAssets={filteredAssets} />
            </div>
            <div className="lg:col-span-3">
              <AssetMaintenanceWidget filteredAssets={filteredAssets} />
            </div>
            <div className="lg:col-span-1">
              <WarrantyExpiryWidget />
            </div>
          </div>
          
          {/* High Maintenance Assets */}
          <TopAssetsWidget filteredAssets={filteredAssets} filteredWorkOrders={filteredWorkOrders} />
          
          {/* Preventive Maintenance - Full Width Bottom Section */}
          <div className="w-full">
            <PreventiveMaintenanceWidget />
          </div>
        </TabsContent>


        {/* Financial Performance Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OutstandingInvoicesWidget filteredInvoices={filteredInvoices} />
            <IssuedInvoicesWidget filteredInvoices={filteredInvoices} />
          </div>
          <ContractorInvoicingWidget />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentExpiryWidget />
        </TabsContent>

      </Tabs>
    </div>
    </DashboardContext.Provider>
  );
}