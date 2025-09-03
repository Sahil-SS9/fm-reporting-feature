import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";

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
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{avgCompletionTime}<span className="text-sm font-normal text-muted-foreground ml-1">days</span></div>
            <div className="flex items-center space-x-1 mt-1">
              {trend <= 0 ? (
                <TrendingDown className="h-3 w-3 text-primary" />
              ) : (
                <TrendingUp className="h-3 w-3 text-destructive" />
              )}
              <span className={`text-xs ${trend <= 0 ? 'text-primary' : 'text-destructive'}`}>
                {trend <= 0 ? '' : '+'}{trend.toFixed(1)} vs last period
              </span>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={performanceRate >= 80 ? "default" : performanceRate >= 60 ? "secondary" : "destructive"}>
              {performanceRate.toFixed(0)}%
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">vs target</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Performance vs Target ({targetTime} days)</span>
          </div>
          <Progress value={performanceRate} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="text-sm font-semibold text-destructive">{highPriorityAvg}d</div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-primary">{mediumPriorityAvg}d</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-muted-foreground">{lowPriorityAvg}d</div>
            <div className="text-xs text-muted-foreground">Low</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}