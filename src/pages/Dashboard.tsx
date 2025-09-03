import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkOrdersOverviewWidget } from "@/components/dashboard/WorkOrdersOverviewWidget";
import { CriticalPriorityWidget } from "@/components/dashboard/CriticalPriorityWidget";
import { AssetMaintenanceWidget } from "@/components/dashboard/AssetMaintenanceWidget";
import { OutstandingInvoicesWidget } from "@/components/dashboard/OutstandingInvoicesWidget";
import { PropertyPerformanceWidget } from "@/components/dashboard/PropertyPerformanceWidget";
import { DocumentExpiryWidget } from "@/components/dashboard/DocumentExpiryWidget";
import { CasesCreatedClosedWidget } from "@/components/dashboard/CasesCreatedClosedWidget";
import { WorkOrdersCreatedClosedWidget } from "@/components/dashboard/WorkOrdersCreatedClosedWidget";
import { AverageCompletionTimeWidget } from "@/components/dashboard/AverageCompletionTimeWidget";
import { DueTodayWidget } from "@/components/dashboard/DueTodayWidget";
import {
  Building2,
  Activity,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { mockWorkOrders, mockProperties } from "@/data/mockData";

const statusData = [
  { name: "Open", value: 45, color: "#3b82f6" },
  { name: "In Progress", value: 30, color: "#f59e0b" },
  { name: "Completed", value: 75, color: "#10b981" },
  { name: "On Hold", value: 15, color: "#ef4444" },
];

const propertyData = [
  { name: "Westgate Mall", value: 275 },
  { name: "City Central", value: 185 },
  { name: "Riverside SC", value: 165 },
  { name: "Lakeside Plaza", value: 150 },
  { name: "Metro Plaza", value: 125 },
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

      {/* Operations Command Center - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WorkOrdersOverviewWidget />
        <CriticalPriorityWidget />
        <DueTodayWidget />
      </div>

      {/* Performance Metrics - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AverageCompletionTimeWidget />
        <CasesCreatedClosedWidget />
        <WorkOrdersCreatedClosedWidget />
      </div>

      {/* Asset & Compliance - Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetMaintenanceWidget />
        <DocumentExpiryWidget />
      </div>

      {/* Financial & Property - Fourth Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OutstandingInvoicesWidget />
        <PropertyPerformanceWidget />
      </div>

      {/* Analytics Charts - Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Work Orders by Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Properties by Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Top 5 Properties by Volume</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
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
    </div>
  );
}