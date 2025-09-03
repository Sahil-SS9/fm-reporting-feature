import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";

export function WorkOrdersCreatedClosedWidget() {
  const navigate = useNavigate();
  
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Calculate work orders created vs closed in last 7 days (using category to distinguish work orders)
  const workOrdersCreatedThisWeek = mockWorkOrders.filter(wo => 
    new Date(wo.createdDate) >= sevenDaysAgo && wo.category !== "Service Request"
  ).length;
  
  const workOrdersClosedThisWeek = mockWorkOrders.filter(wo => 
    wo.completedDate && 
    new Date(wo.completedDate) >= sevenDaysAgo && 
    wo.category !== "Service Request"
  ).length;
  
  const previousWeekCreated = 42; // Mock previous week data
  const previousWeekClosed = 38;
  
  const createdTrend = workOrdersCreatedThisWeek - previousWeekCreated;
  const closedTrend = workOrdersClosedThisWeek - previousWeekClosed;
  
  const closureRate = workOrdersCreatedThisWeek > 0 ? (workOrdersClosedThisWeek / workOrdersCreatedThisWeek) * 100 : 0;
  
  const handleClick = () => {
    navigate('/cases', { 
      state: { 
        filter: { category: 'Maintenance', dateRange: 'last7days' }
      }
    });
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">Work Orders This Week</CardTitle>
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <div className="flex items-center space-x-1">
                {createdTrend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-primary" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs ${createdTrend >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {createdTrend >= 0 ? '+' : ''}{createdTrend}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{workOrdersCreatedThisWeek}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Closed</span>
              <div className="flex items-center space-x-1">
                {closedTrend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-primary" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs ${closedTrend >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {closedTrend >= 0 ? '+' : ''}{closedTrend}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{workOrdersClosedThisWeek}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Closure Rate</span>
            <Badge variant={closureRate >= 85 ? "default" : closureRate >= 70 ? "secondary" : "destructive"}>
              {closureRate.toFixed(0)}%
            </Badge>
          </div>
          <Progress value={closureRate} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}