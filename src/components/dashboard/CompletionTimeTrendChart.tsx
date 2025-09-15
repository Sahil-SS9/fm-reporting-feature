import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart } from '@mui/x-charts';
import { useState } from "react";
import { mockWorkOrders } from "@/data/mockData";

interface CompletionTimeTrendChartProps {
  className?: string;
}

export function CompletionTimeTrendChart({ className }: CompletionTimeTrendChartProps) {
  const [timeRange, setTimeRange] = useState("30");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Generate comprehensive trend data
  const generateTrendData = (days: number, priority: string) => {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Filter work orders by priority if specified
      let filteredOrders = mockWorkOrders.filter(wo => wo.status === "Completed");
      if (priority !== "all") {
        filteredOrders = filteredOrders.filter(wo => wo.priority === priority);
      }
      
      // Mock completion times with realistic variation
      const baseTime = priority === "High" ? 2.8 : priority === "Medium" ? 4.2 : priority === "Low" ? 8.5 : 5.2;
      const variation = (Math.random() - 0.5) * 2;
      const completionTime = Math.max(0.5, baseTime + variation);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        completionTime: parseFloat(completionTime.toFixed(1)),
        workOrderCount: Math.floor(Math.random() * 8) + 2
      });
    }
    
    return data;
  };

  const trendData = generateTrendData(parseInt(timeRange), priorityFilter);
  const averageTime = trendData.reduce((sum, d) => sum + d.completionTime, 0) / trendData.length;
  const trend = trendData.length >= 2 ? trendData[trendData.length - 1].completionTime - trendData[0].completionTime : 0;
  const isImproving = trend <= 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Completion Time Trends</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isImproving ? "default" : "destructive"} className="text-xs">
              {isImproving ? "Improving" : "Declining"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{averageTime.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Days</div>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1">
                {isImproving ? (
                  <TrendingDown className="h-4 w-4 text-success" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                )}
                <div className="text-lg font-bold">{Math.abs(trend).toFixed(1)}</div>
              </div>
              <div className="text-sm text-muted-foreground">Change</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30d</SelectItem>
                <SelectItem value="60">60d</SelectItem>
                <SelectItem value="90">90d</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High Only</SelectItem>
                <SelectItem value="Medium">Medium Only</SelectItem>
                <SelectItem value="Low">Low Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <LineChart
            series={[{
              data: trendData.map(d => d.completionTime),
              color: 'hsl(var(--primary))',
              label: 'Completion Time',
            }]}
            xAxis={[{
              scaleType: 'point',
              data: trendData.map(d => d.date),
            }]}
            yAxis={[{
              label: 'Days'
            }]}
            width={undefined}
            height={300}
            margin={{ top: 5, right: 30, left: 40, bottom: 40 }}
          />
        </div>
      </CardContent>
    </Card>
  );
}