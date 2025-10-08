import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { RadialProgress, StatusRing } from "@/components/ui/enhanced-charts";
import { cn } from "@/lib/utils";

export function CriticalPriorityWidget() {
  const navigate = useNavigate();
  // Get critical and high priority work orders that need attention
  const criticalWorkOrders = mockWorkOrders.filter(
    wo => (wo.priority === "Critical" || wo.priority === "High") && wo.status !== "Completed"
  );
  
  const urgentCount = criticalWorkOrders.filter(wo => wo.priority === "Critical").length;
  const highCount = criticalWorkOrders.filter(wo => wo.priority === "High").length;
  
  const handleClick = () => {
    navigate('/cases', { 
      state: { 
        filter: { priority: ['Critical', 'High'], status: ['Open', 'In Progress', 'On Hold'] }
      }
    });
  };
  
  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow cursor-pointer group",
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
          <div className="flex items-center space-x-2">
            {criticalWorkOrders.length > 0 ? (
              <Badge variant="destructive" className="animate-pulse">
                Action Required
              </Badge>
            ) : (
              <Badge variant="secondary">All Clear</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {criticalWorkOrders.length === 0 ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <RadialProgress 
                value={100} 
                size={80}
                color="hsl(var(--dashboard-complete))"
                label="All Clear"
              />
            </div>
            <p className="text-sm text-muted-foreground">No critical items requiring attention</p>
          </div>
        ) : (
          <>
            {/* Priority Status Ring */}
            <div className="flex justify-center">
              <StatusRing 
                segments={[
                  ...(urgentCount > 0 ? [{ value: urgentCount, color: "hsl(var(--destructive))", label: "Critical" }] : []),
                  ...(highCount > 0 ? [{ value: highCount, color: "hsl(var(--warning))", label: "High" }] : [])
                ]}
                size={100}
                centerContent={
                  <div className="text-center">
                    <div className="text-lg font-bold text-destructive">{criticalWorkOrders.length}</div>
                    <div className="text-xs text-muted-foreground">Priority</div>
                  </div>
                }
              />
            </div>

            {/* Priority Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-destructive/5 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Critical</span>
                </div>
                <div className="text-2xl font-bold text-destructive">{urgentCount}</div>
              </div>
              
              <div className="text-center p-3 bg-warning/5 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">High</span>
                </div>
                <div className="text-2xl font-bold text-warning">{highCount}</div>
              </div>
            </div>
            
            {/* Critical Items List */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Immediate Attention:</div>
              {criticalWorkOrders.slice(0, 3).map((workOrder) => (
                <div 
                  key={workOrder.id} 
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border",
                    workOrder.priority === "Critical" 
                      ? "bg-destructive/5 border-destructive/20" 
                      : "bg-warning/5 border-warning/20"
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
                  <Badge variant="outline" className="text-xs">
                    +{criticalWorkOrders.length - 3} more items
                  </Badge>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}