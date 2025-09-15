import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart } from '@mui/x-charts';
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
            <div className="h-48">
              <BarChart
                series={[
                  {
                    data: workOrderComparison.map(d => d.open),
                    color: 'hsl(var(--warning))',
                    label: 'Open',
                  },
                  {
                    data: workOrderComparison.map(d => d.closed),
                    color: 'hsl(var(--success))',
                    label: 'Closed',
                  }
                ]}
                xAxis={[{
                  scaleType: 'band',
                  data: workOrderComparison.map(d => d.name),
                }]}
                width={undefined}
                height={200}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <BarChart
                series={[
                  {
                    data: maintenanceComparison.map(d => d.onTime),
                    color: 'hsl(var(--success))',
                    label: 'On Time',
                  },
                  {
                    data: maintenanceComparison.map(d => d.late),
                    color: 'hsl(var(--destructive))',
                    label: 'Late',
                  }
                ]}
                xAxis={[{
                  scaleType: 'band',
                  data: maintenanceComparison.map(d => d.name),
                }]}
                width={undefined}
                height={200}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Status Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <BarChart
                series={[
                  {
                    data: invoiceComparison.map(d => d.paid),
                    color: 'hsl(var(--success))',
                    label: 'Paid',
                  },
                  {
                    data: invoiceComparison.map(d => d.unpaid),
                    color: 'hsl(var(--warning))',
                    label: 'Unpaid',
                  }
                ]}
                xAxis={[{
                  scaleType: 'band',
                  data: invoiceComparison.map(d => d.name),
                }]}
                width={undefined}
                height={200}
              />
            </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}