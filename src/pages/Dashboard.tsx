import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetMaintenanceWidget } from "@/components/dashboard/AssetMaintenanceWidget";
import { AssetStatusWidget } from "@/components/dashboard/AssetStatusWidget";
import { WarrantyExpiryWidget } from "@/components/dashboard/WarrantyExpiryWidget"; 
import { PreventiveMaintenanceWidget } from "@/components/dashboard/PreventiveMaintenanceWidget";
import { TopAssetsWidget } from "@/components/dashboard/TopAssetsWidget";
import { OutstandingInvoicesWidget } from "@/components/dashboard/OutstandingInvoicesWidget";
import { PropertyPerformanceWidget } from "@/components/dashboard/PropertyPerformanceWidget";
import { PropertyComparisonChart } from "@/components/dashboard/PropertyComparisonChart";
import { PropertyOverviewTab } from "@/components/dashboard/PropertyOverviewTab";
import { DocumentExpiryWidget } from "@/components/dashboard/DocumentExpiryWidget";
import { CasesCreatedClosedWidget } from "@/components/dashboard/CasesCreatedClosedWidget";
import { WorkOrdersCreatedClosedWidget } from "@/components/dashboard/WorkOrdersCreatedClosedWidget";
import { AverageCompletionTimeWidget } from "@/components/dashboard/AverageCompletionTimeWidget";
import { EnhancedAverageCompletionTimeWidget } from "@/components/dashboard/EnhancedAverageCompletionTimeWidget";
import { CompletionTimeTrendChart } from "@/components/dashboard/CompletionTimeTrendChart";
import { PriorityInboxWidget } from "@/components/dashboard/PriorityInboxWidget";
import { EssentialMetricsCard } from "@/components/dashboard/EssentialMetricsCard";
import { CreatedVsCompletedTrendWidget } from "@/components/dashboard/CreatedVsCompletedTrendWidget";
import { WorkOrderPriorityWidget } from "@/components/dashboard/WorkOrderPriorityWidget";
import { OnTimeVsOverdueWidget } from "@/components/dashboard/OnTimeVsOverdueWidget";
import { SchedulingWidget } from "@/components/dashboard/SchedulingWidget";
import { PerformanceSummaryWidget } from "@/components/dashboard/PerformanceSummaryWidget";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import {
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Target
} from "lucide-react";
import { calculateKPIMetrics } from "@/lib/kpi-calculations";
import { mockWorkOrders, mockProperties } from "@/data/mockData";

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
  const kpiMetrics = calculateKPIMetrics(mockWorkOrders);
  
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground">Command Centre</h1>
        <p className="text-muted-foreground mt-2">
          Critical insights and actionable items for facilities management
        </p>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="operations" className="text-xs">Operations</TabsTrigger>
          <TabsTrigger value="assets" className="text-xs">Assets</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs">Maintenance</TabsTrigger>
          <TabsTrigger value="property" className="text-xs">Property</TabsTrigger>
          <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Priority Inbox */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <PriorityInboxWidget />
            </div>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-8">
          {/* Essential Metrics */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Today's Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EssentialMetricsCard
                title="Due Today"
                value={kpiMetrics.dueToday}
                icon={Clock}
                variant={kpiMetrics.dueToday > 5 ? "warning" : "default"}
                description="Work orders due today"
              />
              <EssentialMetricsCard
                title="Overdue Items"
                value={kpiMetrics.overdue}
                icon={AlertTriangle}
                variant={kpiMetrics.overdue > 0 ? "critical" : "success"}
                description="Past due work orders"
              />
              <EssentialMetricsCard
                title="Critical Issues"
                value={kpiMetrics.critical}
                icon={AlertTriangle}
                variant={kpiMetrics.critical > 0 ? "critical" : "success"}
                description="High priority items"
              />
              <EssentialMetricsCard
                title="On-Time Rate"
                value={`${kpiMetrics.onTimeRate}%`}
                icon={Target}
                variant={kpiMetrics.onTimeRate >= 80 ? "success" : kpiMetrics.onTimeRate >= 60 ? "warning" : "critical"}
                change={{
                  value: `${kpiMetrics.weeklyTrend > 0 ? '+' : ''}${kpiMetrics.weeklyTrend}%`,
                  type: kpiMetrics.weeklyTrend > 0 ? "positive" : kpiMetrics.weeklyTrend < 0 ? "negative" : "neutral",
                  label: "vs last week"
                }}
                description="Completed on time"
              />
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-foreground">Performance Insights</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <EssentialMetricsCard
                title="Avg Completion Time"
                value={`${kpiMetrics.avgCompletionTime}`}
                subValue="days"
                icon={TrendingUp}
                variant={kpiMetrics.avgCompletionTime <= 3 ? "success" : kpiMetrics.avgCompletionTime <= 7 ? "warning" : "critical"}
                description="Average time to complete"
              />
              <EssentialMetricsCard
                title="Closure Rate"
                value={`${kpiMetrics.closureRate}%`}
                icon={CheckCircle}
                variant={kpiMetrics.closureRate >= 80 ? "success" : "warning"}
                description="Work orders completed"
              />
              <PerformanceSummaryWidget />
            </div>
          </div>
          
          {/* Trend Analysis */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Trend Analysis</h3>
            <div className="space-y-6">
              <CompletionTimeTrendChart />
              <CreatedVsCompletedTrendWidget />
            </div>
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          {/* Core Asset Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AssetStatusWidget />
            <WarrantyExpiryWidget />
            <PreventiveMaintenanceWidget />
          </div>
          
          {/* High Maintenance Assets */}
          <TopAssetsWidget />
        </TabsContent>

        {/* Preventive Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PreventiveMaintenanceWidget />
            <AssetMaintenanceWidget />
          </div>
        </TabsContent>

        {/* Property Overview Tab */}
        <TabsContent value="property" className="space-y-6">
          <PropertyOverviewTab />
        </TabsContent>

        {/* Financial Performance Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OutstandingInvoicesWidget />
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span className="text-2xl font-bold text-success">$248,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Outstanding</span>
                    <span className="text-lg font-semibold text-warning">$52,300</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Collection Rate</span>
                    <span className="text-lg font-semibold">92.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <PropertyComparisonChart />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentExpiryWidget />
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}