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
      <CardContent className="space-y-6">
        {/* Clear Current vs Target Display */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">{avgCompletionTime}</div>
            <div className="text-sm text-muted-foreground">Current Avg</div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>
          
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{targetTime}</div>
            </div>
            <div className="text-sm text-muted-foreground">Target</div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>
          
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              {trend <= 0 ? (
                <TrendingDown className="h-4 w-4 text-success" />
              ) : (
                <TrendingUp className="h-4 w-4 text-destructive" />
              )}
              <div className="text-2xl font-bold">
                {trend <= 0 ? '' : '+'}{trend.toFixed(1)}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">vs Previous</div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>
        </div>

        {/* Enhanced 30-Day Trend */}
        <div className="p-4 bg-muted/5 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">30-Day Trend</span>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <MiniTrendChart 
            data={trendData} 
            width={280} 
            height={60}
            color={trend <= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
            tooltipContent={`Improving ${Math.abs(trend).toFixed(1)} days over 30 days. Target: ${targetTime} days`}
          />
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>30 days ago: {trendData[0]?.value}d</span>
            <span>Today: {avgCompletionTime}d</span>
          </div>
        </div>
        
        {/* Priority Performance Bar Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Priority Breakdown</span>
            <span className="text-xs text-muted-foreground">vs Targets</span>
          </div>
          <VerticalBarChart 
            data={priorityBreakdown}
            height={120}
            color="hsl(var(--primary))"
          />
          <div className="grid grid-cols-3 gap-2 text-xs">
            {priorityBreakdown.map((priority, index) => (
              <div key={priority.name} className="text-center">
                <div className="font-medium">{priority.value}d / {priority.target}d</div>
                <div className="text-muted-foreground">{priority.name} Priority</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}