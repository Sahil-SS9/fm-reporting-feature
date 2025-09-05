import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AssetMaintenanceWidget } from "@/components/dashboard/AssetMaintenanceWidget";
import { EnhancedAssetMaintenanceWidget } from "@/components/dashboard/EnhancedAssetMaintenanceWidget";
import { OutstandingInvoicesWidget } from "@/components/dashboard/OutstandingInvoicesWidget";
import { PropertyPerformanceWidget } from "@/components/dashboard/PropertyPerformanceWidget";
import { PropertyComparisonChart } from "@/components/dashboard/PropertyComparisonChart";
import { DocumentExpiryWidget } from "@/components/dashboard/DocumentExpiryWidget";
import { CasesCreatedClosedWidget } from "@/components/dashboard/CasesCreatedClosedWidget";
import { WorkOrdersCreatedClosedWidget } from "@/components/dashboard/WorkOrdersCreatedClosedWidget";
import { AverageCompletionTimeWidget } from "@/components/dashboard/AverageCompletionTimeWidget";
import { EnhancedAverageCompletionTimeWidget } from "@/components/dashboard/EnhancedAverageCompletionTimeWidget";
import { CompletionTimeTrendChart } from "@/components/dashboard/CompletionTimeTrendChart";
import { DueTodayWidget } from "@/components/dashboard/DueTodayWidget";
import { CreatedVsCompletedTrendWidget } from "@/components/dashboard/CreatedVsCompletedTrendWidget";
import { WorkOrderPriorityWidget } from "@/components/dashboard/WorkOrderPriorityWidget";
import { OnTimeVsOverdueWidget } from "@/components/dashboard/OnTimeVsOverdueWidget";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import {
  Activity,
} from "lucide-react";
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
      <Accordion type="multiple" defaultValue={["operations", "performance", "assets", "financial", "analytics", "activity"]} className="space-y-4">
        
        {/* Operations Command Center */}
        <AccordionItem value="operations" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Operations Command Center
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-6">
              {/* Enhanced Trend Chart - Full Width */}
              <CompletionTimeTrendChart />
              
              {/* Original Trend Chart - Full Width */}
              <CreatedVsCompletedTrendWidget />
              
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Work Order Status Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Work Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <DonutChartWithCenter 
                        data={statusData}
                        size={140}
                        strokeWidth={16}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {statusData.map((status) => (
                        <div key={status.name} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: status.color }}
                          />
                          <span className="text-xs text-muted-foreground">{status.name}: {status.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <WorkOrderPriorityWidget />
                <OnTimeVsOverdueWidget />
                <DueTodayWidget />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Performance Metrics */}
        <AccordionItem value="performance" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Performance Metrics
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <EnhancedAverageCompletionTimeWidget />
              <CasesCreatedClosedWidget />
              <WorkOrdersCreatedClosedWidget />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Asset & Compliance */}
        <AccordionItem value="assets" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Asset & Compliance Management
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedAssetMaintenanceWidget />
              <DocumentExpiryWidget />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Financial & Property */}
        <AccordionItem value="financial" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Financial & Property Performance
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OutstandingInvoicesWidget />
                <PropertyPerformanceWidget />
              </div>
              <PropertyComparisonChart />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Analytics Charts */}
        <AccordionItem value="analytics" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Analytics & Insights
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="text-muted-foreground text-center py-8">
              Additional analytics and insights will be displayed here based on your facility management needs.
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