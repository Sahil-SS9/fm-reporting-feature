import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";
import { mockWorkOrders } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function CriticalPriorityWidget() {
  // Get critical and high priority work orders that need attention
  const criticalWorkOrders = mockWorkOrders.filter(
    wo => (wo.priority === "Critical" || wo.priority === "High") && wo.status !== "Completed"
  );
  
  const urgentCount = criticalWorkOrders.filter(wo => wo.priority === "Critical").length;
  const highCount = criticalWorkOrders.filter(wo => wo.priority === "High").length;
  
  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow",
      criticalWorkOrders.length > 0 && "border-destructive/50 shadow-sm"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className={cn(
              "h-5 w-5",
              criticalWorkOrders.length > 0 ? "text-destructive" : "text-muted-foreground"
            )} />
            <span>Priority Items</span>
          </div>
          {criticalWorkOrders.length > 0 ? (
            <Badge variant="destructive" className="animate-pulse">
              Action Required
            </Badge>
          ) : (
            <Badge variant="secondary">All Clear</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {criticalWorkOrders.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-muted-foreground mb-2">0</div>
            <p className="text-sm text-muted-foreground">No critical items requiring attention</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Numbers */}
            <div className="flex justify-center space-x-8">
              {urgentCount > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{urgentCount}</div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
              )}
              {highCount > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{highCount}</div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
              )}
            </div>
            
            {/* Critical Items List */}
            <div className="space-y-2">
              {criticalWorkOrders.slice(0, 3).map((workOrder) => (
                <div 
                  key={workOrder.id} 
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border",
                    workOrder.priority === "Critical" 
                      ? "bg-destructive/5 border-destructive/20" 
                      : "bg-orange-50 border-orange-200"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {workOrder.title}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(workOrder.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge 
                    variant={workOrder.priority === "Critical" ? "destructive" : "outline"}
                    className="ml-2 text-xs"
                  >
                    {workOrder.priority}
                  </Badge>
                </div>
              ))}
              
              {criticalWorkOrders.length > 3 && (
                <div className="text-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    +{criticalWorkOrders.length - 3} more items
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}