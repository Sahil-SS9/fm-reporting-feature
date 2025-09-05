import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, ArrowRight, Target, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { MiniTrendChart, VerticalBarChart } from "@/components/ui/enhanced-charts";

export function EnhancedAverageCompletionTimeWidget() {
  const navigate = useNavigate();
  
  // Calculate completion time metrics
  const completedWorkOrders = mockWorkOrders.filter(wo => wo.status === "Completed" && wo.completedDate);
  
  const completionTimes = completedWorkOrders.map(wo => {
    const created = new Date(wo.createdDate);
    const completed = new Date(wo.completedDate!);
    return Math.round((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  });
  
  const avgCompletionTime = completionTimes.length > 0 ? 
    Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length) : 0;
  
  const targetTime = 5;
  const previousAvg = 7.2;
  const trend = avgCompletionTime - previousAvg;
  const isOnTarget = avgCompletionTime <= targetTime;
  
  // Priority breakdown with realistic data
  const priorityBreakdown = [
    { name: "High", value: 2.8, target: 3 },
    { name: "Med", value: 4.2, target: 5 }, 
    { name: "Low", value: 8.5, target: 10 }
  ];
  
  // Enhanced trend data (30 days)
  const trendData = [
    { value: 7.8 }, { value: 7.4 }, { value: 7.1 }, { value: 6.8 }, 
    { value: 6.3 }, { value: 5.9 }, { value: 5.4 }, { value: avgCompletionTime }
  ];
  
  const handleClick = () => {
    navigate('/reporting', { 
      state: { 
        reportType: 'completion-times-detailed',
        filter: { status: 'Completed' },
        showTrendAnalysis: true
      }
    });
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span className="text-lg font-semibold">Completion Times</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant={isOnTarget ? "default" : "destructive"} className="text-xs">
            {isOnTarget ? "On Target" : "Over Target"}
          </Badge>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold">{avgCompletionTime}</div>
            <div className="text-sm text-muted-foreground">Days Avg</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-dashboard-accent">{targetTime}</div>
            <div className="text-sm text-muted-foreground">Target</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${isOnTarget ? 'text-dashboard-complete' : 'text-dashboard-warning'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">vs Last Period</div>
            <Badge variant={isOnTarget ? "default" : "secondary"} className="text-xs mt-1">
              {isOnTarget ? "On Target" : "Attention"}
            </Badge>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-3">Average Time by Priority vs Target</h4>
          <div className="h-32">
            <VerticalBarChart 
              data={priorityBreakdown}
              color="hsl(var(--primary))"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}