import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { mockProperties, mockWorkOrders, mockInvoices } from "@/data/mockData";

interface PropertyComparisonChartProps {
  className?: string;
  onPropertyClick?: (propertyId: string) => void;
}

export function PropertyComparisonChart({ className, onPropertyClick }: PropertyComparisonChartProps) {
  // Enhanced property metrics calculation
  const propertyMetrics = mockProperties.map(property => {
    const propertyWorkOrders = mockWorkOrders.filter(wo => wo.propertyId === property.id);
    const propertyInvoices = mockInvoices.filter(inv => inv.propertyId === property.id);
    
    const openWorkOrders = propertyWorkOrders.filter(wo => wo.status === "Open" || wo.status === "In Progress").length;
    const closedWorkOrders = propertyWorkOrders.filter(wo => wo.status === "Completed").length;
    const overdueWorkOrders = propertyWorkOrders.filter(wo => wo.status === "Overdue").length;
    
    const paidInvoices = propertyInvoices.filter(inv => inv.paymentStatus === "Paid").length;
    const unpaidInvoices = propertyInvoices.filter(inv => inv.paymentStatus === "Outstanding" || inv.paymentStatus === "Overdue").length;
    
    // Mock on-time maintenance data
    const onTimeMaintenanceTasks = Math.floor(Math.random() * 20) + 5;
    const lateMaintenanceTasks = Math.floor(Math.random() * 8) + 1;
    
    const totalWorkOrders = propertyWorkOrders.length;
    const completionRate = totalWorkOrders > 0 ? Math.round((closedWorkOrders / totalWorkOrders) * 100) : 100;
    
    // Enhanced health score calculation
    const baseScore = 70;
    const completionBonus = Math.min(20, (completionRate / 100) * 20);
    const overduesPenalty = overdueWorkOrders * 3;
    const maintenancePenalty = lateMaintenanceTasks * 2;
    const invoicePenalty = unpaidInvoices * 1.5;
    
    const healthScore = Math.max(0, Math.min(100, 
      baseScore + completionBonus - overduesPenalty - maintenancePenalty - invoicePenalty
    ));
    
    return {
      ...property,
      openWorkOrders,
      closedWorkOrders,
      overdueWorkOrders,
      paidInvoices,
      unpaidInvoices,
      onTimeMaintenanceTasks,
      lateMaintenanceTasks,
      completionRate,
      healthScore: Math.round(healthScore),
      totalIssues: openWorkOrders + overdueWorkOrders + unpaidInvoices + lateMaintenanceTasks
    };
  });

  // Sort properties: Top 5 and Worst 5
  const sortedByHealth = [...propertyMetrics].sort((a, b) => b.healthScore - a.healthScore);
  const topPerformers = sortedByHealth.slice(0, 5);
  const worstPerformers = sortedByHealth.slice(-5).reverse();

  // Prepare data for comparison charts
  const workOrderComparison = propertyMetrics.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
    open: p.openWorkOrders,
    closed: p.closedWorkOrders,
    healthScore: p.healthScore
  }));

  const maintenanceComparison = propertyMetrics.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
    onTime: p.onTimeMaintenanceTasks,
    late: p.lateMaintenanceTasks,
    healthScore: p.healthScore
  }));

  const invoiceComparison = propertyMetrics.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
    paid: p.paidInvoices,
    unpaid: p.unpaidInvoices,
    healthScore: p.healthScore
  }));

  const getBarColor = (healthScore: number) => {
    if (healthScore >= 80) return "hsl(var(--success))";
    if (healthScore >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top vs Worst Performers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-success/5 border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Top 5 Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topPerformers.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-2 bg-success/10 rounded">
                <div>
                  <div className="font-medium text-sm">{index + 1}. {property.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {property.completionRate}% completion, {property.totalIssues} issues
                  </div>
                </div>
                <Badge variant="default" className="text-xs">
                  {property.healthScore}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm">Needs Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {worstPerformers.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                <div>
                  <div className="font-medium text-sm">{index + 1}. {property.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {property.overdueWorkOrders} overdue, {property.unpaidInvoices} unpaid invoices
                  </div>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {property.healthScore}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Work Orders Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Work Orders: Open vs Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workOrderComparison} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="open" fill="hsl(var(--warning))" name="Open" radius={[2, 2, 0, 0]} />
                <Bar dataKey="closed" fill="hsl(var(--success))" name="Closed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Maintenance: On-Time vs Late</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={maintenanceComparison} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="onTime" fill="hsl(var(--success))" name="On Time" radius={[2, 2, 0, 0]} />
                <Bar dataKey="late" fill="hsl(var(--destructive))" name="Late/Missed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Invoices: Paid vs Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={invoiceComparison} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="paid" fill="hsl(var(--success))" name="Paid" radius={[2, 2, 0, 0]} />
                <Bar dataKey="unpaid" fill="hsl(var(--warning))" name="Unpaid" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}