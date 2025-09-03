import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, AlertCircle } from "lucide-react";
import { mockWorkOrders } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function WorkOrdersOverviewWidget() {
  // Calculate work order statistics
  const totalWorkOrders = mockWorkOrders.length;
  const completedWorkOrders = mockWorkOrders.filter(wo => wo.status === "Completed").length;
  const inProgressWorkOrders = mockWorkOrders.filter(wo => wo.status === "In Progress").length;
  const overdueWorkOrders = mockWorkOrders.filter(wo => wo.status === "Overdue").length;
  const openWorkOrders = mockWorkOrders.filter(wo => wo.status === "Open").length;
  
  const completionRate = Math.round((completedWorkOrders / totalWorkOrders) * 100);
  const inProgressRate = Math.round((inProgressWorkOrders / totalWorkOrders) * 100);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span>Work Orders Overview</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {totalWorkOrders} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Circular Progress Indicator */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{completionRate}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <div className="flex items-center space-x-2">
              <Progress value={completionRate} className="w-16 h-2" />
              <span className="text-sm font-medium w-8">{completedWorkOrders}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">In Progress</span>
            <div className="flex items-center space-x-2">
              <Progress value={inProgressRate} className="w-16 h-2" />
              <span className="text-sm font-medium w-8">{inProgressWorkOrders}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Open</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-secondary rounded-full">
                <div 
                  className="h-full bg-muted rounded-full"
                  style={{ width: `${(openWorkOrders / totalWorkOrders) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8">{openWorkOrders}</span>
            </div>
          </div>
          
          {overdueWorkOrders > 0 && (
            <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">Overdue</span>
              </div>
              <Badge variant="destructive" className="text-xs">
                {overdueWorkOrders}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}