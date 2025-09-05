import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, TrendingUp } from "lucide-react";
import { calculateKPIMetrics } from "@/lib/kpi-calculations";
import { mockWorkOrders } from "@/data/mockData";

export function PerformanceSummaryWidget() {
  const kpiMetrics = calculateKPIMetrics(mockWorkOrders);
  
  // Calculate total labor hours and avg response time from work orders
  const totalLaborHours = mockWorkOrders.reduce((total, wo) => {
    // Mock calculation: estimate 4-8 hours per work order based on priority
    const priorityMultiplier = wo.priority === 'Critical' ? 8 : 
                              wo.priority === 'High' ? 6 : 
                              wo.priority === 'Medium' ? 4 : 2;
    return total + priorityMultiplier;
  }, 0);
  
  const avgResponseTime = 2.4; // Mock average response time in hours
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Performance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Total Labor Hours</span>
            </div>
            <span className="text-lg font-semibold">{totalLaborHours}h</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Avg Response Time</span>
            </div>
            <span className="text-lg font-semibold">{avgResponseTime}h</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Resolution Time</span>
            </div>
            <span className="text-lg font-semibold">{kpiMetrics.avgCompletionTime}d</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}