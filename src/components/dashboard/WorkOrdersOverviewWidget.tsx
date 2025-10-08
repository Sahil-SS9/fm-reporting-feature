import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, AlertCircle, ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { SemiCircularGauge, StatusRing, MiniTrendChart } from "@/components/ui/enhanced-charts";

export function WorkOrdersOverviewWidget() {
  const navigate = useNavigate();
  // Calculate work order statistics
  const totalWorkOrders = mockWorkOrders.length;
  const completedWorkOrders = mockWorkOrders.filter(wo => wo.status === "Completed").length;
  const inProgressWorkOrders = mockWorkOrders.filter(wo => wo.status === "In Progress").length;
  const overdueWorkOrders = mockWorkOrders.filter(wo => wo.status === "Overdue").length;
  const openWorkOrders = mockWorkOrders.filter(wo => wo.status === "Open").length;
  
  const completionRate = Math.round((completedWorkOrders / totalWorkOrders) * 100);
  const inProgressRate = Math.round((inProgressWorkOrders / totalWorkOrders) * 100);
  
  // Mock trend data for the mini chart
  const trendData = [
    { value: 45 }, { value: 52 }, { value: 48 }, { value: 61 }, 
    { value: 55 }, { value: 67 }, { value: completionRate }
  ];

  // Status segments for the ring chart
  const statusSegments = [
    { value: completedWorkOrders, color: "hsl(var(--dashboard-complete))", label: "Completed" },
    { value: inProgressWorkOrders, color: "hsl(var(--warning))", label: "In Progress" },
    { value: openWorkOrders, color: "hsl(var(--primary))", label: "Open" },
    { value: overdueWorkOrders, color: "hsl(var(--destructive))", label: "Overdue" }
  ].filter(segment => segment.value > 0);
  
  const handleClick = () => {
    navigate('/cases', { 
      state: { 
        filter: { status: ['Open', 'In Progress', 'Completed'] }
      }
    });
  };
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span>Work Orders Overview</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {totalWorkOrders} Total
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Metrics Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Completion Rate Gauge */}
          <div className="flex flex-col items-center">
            <SemiCircularGauge 
              value={completionRate} 
              size={120}
              color="hsl(var(--dashboard-complete))"
              label="Completion Rate"
            />
          </div>
          
          {/* Status Ring */}
          <div className="flex flex-col items-center">
            <StatusRing 
              segments={statusSegments}
              size={100}
              centerContent={
                <div className="text-center">
                  <div className="text-lg font-bold">{totalWorkOrders}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              }
            />
          </div>
        </div>

        {/* Trend and Performance */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">7-Day Trend</span>
          </div>
          <MiniTrendChart 
            data={trendData} 
            width={80} 
            height={30}
            color="hsl(var(--primary))"
          />
        </div>
        
        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <Badge variant="default" className="bg-dashboard-complete text-white">
                {completedWorkOrders}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Badge variant="secondary" className="bg-warning text-warning-foreground">
                {inProgressWorkOrders}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Open</span>
              <Badge variant="outline">
                {openWorkOrders}
              </Badge>
            </div>
            {overdueWorkOrders > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3 text-destructive" />
                  <span className="text-sm text-destructive font-medium">Overdue</span>
                </div>
                <Badge variant="destructive">
                  {overdueWorkOrders}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}