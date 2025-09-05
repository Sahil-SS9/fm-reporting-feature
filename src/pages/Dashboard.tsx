import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AssetMaintenanceWidget } from "@/components/dashboard/AssetMaintenanceWidget";
import { AssetStatusWidget } from "@/components/dashboard/AssetStatusWidget";
import { WarrantyExpiryWidget } from "@/components/dashboard/WarrantyExpiryWidget"; 
import { PreventiveMaintenanceWidget } from "@/components/dashboard/PreventiveMaintenanceWidget";
import { TopAssetsWidget } from "@/components/dashboard/TopAssetsWidget";
import { OutstandingInvoicesWidget } from "@/components/dashboard/OutstandingInvoicesWidget";
import { PropertyPerformanceWidget } from "@/components/dashboard/PropertyPerformanceWidget";
import { PropertyComparisonChart } from "@/components/dashboard/PropertyComparisonChart";
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
      <div>
        <h1 className="text-2xl font-bold">Command Centre</h1>
        <p className="text-muted-foreground">
          Critical insights and actionable items for facilities management
        </p>
      </div>

      {/* Dashboard Sections with Accordion */}
      <Accordion type="multiple" defaultValue={["overview", "operations", "assets", "documents", "property"]} className="space-y-4">
        
        {/* Overview Section - Priority Inbox */}
        <AccordionItem value="overview" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Overview
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <PriorityInboxWidget />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Operations Command Center */}
        <AccordionItem value="operations" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Operations Command Center
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-8">
              {/* Essential Metrics - Visual Chunking */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-foreground">Today's Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Performance Insights - Grouped */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-foreground">Performance Insights</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <div>
                <h3 className="text-lg font-medium mb-4">Trend Analysis</h3>
                <div className="space-y-6">
                  <CompletionTimeTrendChart />
                  <CreatedVsCompletedTrendWidget />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>


        {/* Asset Management */}
        <AccordionItem value="assets" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Asset Management
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-6">
              {/* Core Asset Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <AssetStatusWidget />
                <WarrantyExpiryWidget />
                <PreventiveMaintenanceWidget />
              </div>
              
              {/* Expanded High Maintenance Assets */}
              <div className="grid grid-cols-1 gap-4">
                <TopAssetsWidget />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Document Management */}
        <AccordionItem value="documents" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Document Management
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <DocumentExpiryWidget />
          </AccordionContent>
        </AccordionItem>

        {/* Property & Financial Performance */}
        <AccordionItem value="property" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Property & Financial Performance
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PropertyPerformanceWidget />
                <OutstandingInvoicesWidget />
              </div>
              <PropertyComparisonChart />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recent Activity */}
        <AccordionItem value="activity" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Recent Activity
          </AccordionTrigger>
          <AccordionContent className="pt-4">
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
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}