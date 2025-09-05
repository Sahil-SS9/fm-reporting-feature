import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRight, Calendar, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { SemiCircularGauge, MiniTrendChart, RadialProgress } from "@/components/ui/enhanced-charts";

export function CasesCreatedClosedWidget() {
  const navigate = useNavigate();
  
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Calculate cases created vs closed in last 7 days (using category to distinguish cases)
  const casesCreatedThisWeek = mockWorkOrders.filter(wo => 
    new Date(wo.createdDate) >= sevenDaysAgo && wo.category === "Service Request"
  ).length;
  
  const casesClosedThisWeek = mockWorkOrders.filter(wo => 
    wo.completedDate && 
    new Date(wo.completedDate) >= sevenDaysAgo && 
    wo.category === "Service Request"
  ).length;
  
  const previousWeekCreated = 28; // Mock previous week data
  const previousWeekClosed = 24;
  
  const createdTrend = casesCreatedThisWeek - previousWeekCreated;
  const closedTrend = casesClosedThisWeek - previousWeekClosed;
  
  const closureRate = casesCreatedThisWeek > 0 ? (casesClosedThisWeek / casesCreatedThisWeek) * 100 : 0;
  
  const handleClick = () => {
    navigate('/cases', { 
      state: { 
        filter: { category: 'Service Request', dateRange: 'last7days' }
      }
    });
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">Cases This Week</CardTitle>
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Compact Metrics Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold">{casesCreatedThisWeek}</div>
            <div className="text-xs text-muted-foreground">Created</div>
            <div className="flex items-center justify-center space-x-1">
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
          
          <div className="text-center">
            <div className="text-lg font-bold">{casesClosedThisWeek}</div>
            <div className="text-xs text-muted-foreground">Closed</div>
            <div className="flex items-center justify-center space-x-1">
              {closedTrend >= 0 ? (
                <TrendingUp className="h-3 w-3 text-dashboard-complete" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={`text-xs ${closedTrend >= 0 ? 'text-dashboard-complete' : 'text-destructive'}`}>
                {closedTrend >= 0 ? '+' : ''}{closedTrend}
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold">{closureRate.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Rate</div>
            <Badge variant={closureRate >= 80 ? "default" : closureRate >= 60 ? "secondary" : "destructive"} className="text-xs">
              {closureRate >= 80 ? "Good" : closureRate >= 60 ? "Fair" : "Poor"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}