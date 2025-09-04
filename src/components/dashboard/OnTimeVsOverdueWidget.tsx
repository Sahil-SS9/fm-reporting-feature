import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SemiCircularGauge } from "@/components/ui/enhanced-charts";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { mockWorkOrders } from "@/data/mockData";

export function OnTimeVsOverdueWidget() {
  const completedOrders = mockWorkOrders.filter(wo => wo.status === "Completed" && wo.completedDate);
  
  // Mock calculation for on-time vs overdue
  const onTimeCount = Math.floor(completedOrders.length * 0.742); // Based on reference showing 74.2%
  const overdueCount = completedOrders.length - onTimeCount;
  const onTimePercentage = completedOrders.length > 0 ? (onTimeCount / completedOrders.length) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">On Time Performance</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Semi-circular Gauge */}
        <div className="flex justify-center">
          <SemiCircularGauge 
            value={onTimePercentage} 
            size={140}
            strokeWidth={12}
            color={onTimePercentage >= 80 ? "hsl(var(--dashboard-complete))" : 
                   onTimePercentage >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
            label="On Time Rate"
          />
        </div>

        {/* Count Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-dashboard-complete/5 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-dashboard-complete" />
              <span className="text-sm font-medium">On Time</span>
            </div>
            <div className="text-2xl font-bold text-dashboard-complete">{onTimeCount}</div>
            <div className="text-xs text-muted-foreground">
              {onTimePercentage.toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center p-3 bg-destructive/5 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
            <div className="text-xs text-muted-foreground">
              {(100 - onTimePercentage).toFixed(1)}% of total
            </div>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="flex justify-center">
          <Badge 
            variant={onTimePercentage >= 80 ? "default" : 
                    onTimePercentage >= 60 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {onTimePercentage >= 80 ? "Excellent" : 
             onTimePercentage >= 60 ? "Good" : "Needs Improvement"} Performance
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}