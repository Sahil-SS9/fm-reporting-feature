import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";
import { mockWorkOrders } from "@/data/mockData";

export function EnhancedCompletionTimeTrendChart() {
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Completion Time Trends</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
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
          <Badge variant={isImproving ? "default" : "destructive"} className="text-xs">
            {isImproving ? "Improving" : "Declining"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px"
              }}
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value, name) => [
                `${value} days`, 
                'Avg Completion'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="completionTime" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              name="Completion Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}