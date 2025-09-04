import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, ArrowRight, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { SemiCircularGauge, RadialProgress, MiniTrendChart } from "@/components/ui/enhanced-charts";

export function AverageCompletionTimeWidget() {
  const navigate = useNavigate();
  
  // Calculate average completion times
  const completedWorkOrders = mockWorkOrders.filter(wo => wo.status === "Completed" && wo.completedDate);
  
  const completionTimes = completedWorkOrders.map(wo => {
    const created = new Date(wo.createdDate);
    const completed = new Date(wo.completedDate!);
    return Math.round((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)); // days
  });
  
  const avgCompletionTime = completionTimes.length > 0 ? 
    Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length) : 0;
  
  const targetTime = 5; // Target 5 days
  const previousAvg = 7.2; // Mock previous period
  const trend = avgCompletionTime - previousAvg;
  
  // Performance against target
  const performanceRate = Math.max(0, Math.min(100, ((targetTime / Math.max(avgCompletionTime, 0.1)) * 100)));
  
  // Breakdown by priority
  const highPriorityAvg = 2.8;
  const mediumPriorityAvg = 4.2;
  const lowPriorityAvg = 8.5;

  // Mock trend data for completion times
  const trendData = [
    { value: 7.8 }, { value: 7.2 }, { value: 6.9 }, { value: 6.1 }, 
    { value: 5.8 }, { value: 5.2 }, { value: avgCompletionTime }
  ];
  
  const handleClick = () => {
    navigate('/reporting', { 
      state: { 
        reportType: 'completion-times',
        filter: { status: 'Completed' }
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
          <span className="text-lg font-semibold">Avg Completion Time</span>
        </CardTitle>
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Performance Gauge */}
        <div className="flex justify-center">
          <SemiCircularGauge 
            value={Math.round(performanceRate)} 
            size={140}
            color={performanceRate >= 80 ? "hsl(var(--dashboard-complete))" : 
                   performanceRate >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
            label="Performance vs Target"
          />
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold">{avgCompletionTime}</div>
            <div className="text-sm text-muted-foreground">Avg Days</div>
            <div className="flex items-center justify-center space-x-1 mt-1">
              {trend <= 0 ? (
                <TrendingDown className="h-3 w-3 text-dashboard-complete" />
              ) : (
                <TrendingUp className="h-3 w-3 text-destructive" />
              )}
              <span className={`text-xs ${trend <= 0 ? 'text-dashboard-complete' : 'text-destructive'}`}>
                {trend <= 0 ? '' : '+'}{trend.toFixed(1)}
              </span>
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-primary" />
              <div className="text-2xl font-bold">{targetTime}</div>
            </div>
            <div className="text-sm text-muted-foreground">Target Days</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="p-3 bg-muted/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">30-Day Trend</span>
            <MiniTrendChart 
              data={trendData} 
              width={100} 
              height={30}
              color={trend <= 0 ? "hsl(var(--dashboard-complete))" : "hsl(var(--destructive))"}
            />
          </div>
        </div>
        
        {/* Priority Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <RadialProgress 
              value={Math.round((targetTime / highPriorityAvg) * 100)} 
              size={60}
              color="hsl(var(--destructive))"
            />
            <div className="text-sm font-semibold mt-1">{highPriorityAvg}d</div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
          <div className="text-center">
            <RadialProgress 
              value={Math.round((targetTime / mediumPriorityAvg) * 100)} 
              size={60}
              color="hsl(var(--warning))"
            />
            <div className="text-sm font-semibold mt-1">{mediumPriorityAvg}d</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </div>
          <div className="text-center">
            <RadialProgress 
              value={Math.round((targetTime / lowPriorityAvg) * 100)} 
              size={60}
              color="hsl(var(--dashboard-low))"
            />
            <div className="text-sm font-semibold mt-1">{lowPriorityAvg}d</div>
            <div className="text-xs text-muted-foreground">Low</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}