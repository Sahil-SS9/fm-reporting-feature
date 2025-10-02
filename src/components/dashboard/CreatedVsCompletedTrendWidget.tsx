import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface CreatedVsCompletedTrendWidgetProps {
  filteredWorkOrders?: any[];
}

const generateTrendData = (days: number) => {
  const now = new Date();
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Mock data generation
    const created = Math.floor(Math.random() * 30) + 15;
    const completed = Math.floor(Math.random() * 25) + 10;
    
    data.push({
      period: date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      }),
      created,
      completed
    });
  }
  
  return data;
};

export function CreatedVsCompletedTrendWidget({ filteredWorkOrders = [] }: CreatedVsCompletedTrendWidgetProps) {
  const [days, setDays] = useState(7);
  const trendData = generateTrendData(days);
  
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">Created vs Completed</CardTitle>
        <Select value={days.toString()} onValueChange={(value) => setDays(parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="180">Last 180 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                name="Created"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--dashboard-complete))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--dashboard-complete))", r: 4 }}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {trendData.reduce((sum, item) => sum + item.created, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Created</div>
          </div>
          <div className="text-center p-3 bg-dashboard-complete/5 rounded-lg">
            <div className="text-2xl font-bold text-dashboard-complete">
              {trendData.reduce((sum, item) => sum + item.completed, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}