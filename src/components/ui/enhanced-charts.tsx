import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar, CartesianGrid, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SemiCircularGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  color?: string;
}

export function SemiCircularGauge({ 
  value, 
  size = 120, 
  strokeWidth = 8, 
  className = "",
  label = "",
  color = "hsl(var(--primary))"
}: SemiCircularGaugeProps) {
  const data = [
    { value: value, fill: color },
    { value: 100 - value, fill: "hsl(var(--muted))" }
  ];

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size / 2 + 20 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <div className="text-2xl font-bold" style={{ color }}>{value}%</div>
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
      </div>
    </div>
  );
}

interface RadialProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  color?: string;
}

export function RadialProgress({ 
  value, 
  size = 80, 
  strokeWidth = 6, 
  className = "",
  label = "",
  color = "hsl(var(--primary))"
}: RadialProgressProps) {
  const data = [
    { value: value, fill: color },
    { value: 100 - value, fill: "hsl(var(--muted))" }
  ];

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold" style={{ color }}>{value}%</div>
        {label && <div className="text-xs text-muted-foreground text-center">{label}</div>}
      </div>
    </div>
  );
}

interface MiniTrendChartProps {
  data: { value: number }[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  tooltipContent?: string;
}

export function MiniTrendChart({ 
  data, 
  width = 100, 
  height = 40, 
  color = "hsl(var(--primary))",
  className = "",
  tooltipContent
}: MiniTrendChartProps) {
  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const trend = currentValue - previousValue;
  const trendPercent = previousValue !== 0 ? ((trend / previousValue) * 100).toFixed(1) : "0.0";
  
  return (
    <div 
      className={cn("group relative cursor-help", className)} 
      style={{ width, height }}
      title={tooltipContent || `Current: ${currentValue}, Trend: ${trend > 0 ? '+' : ''}${trendPercent}%`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "4px",
              fontSize: "11px",
              padding: "4px 8px"
            }}
            formatter={(value) => [`${value}`, "Value"]}
            labelFormatter={() => ""}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* Enhanced tooltip overlay */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {tooltipContent || `Trend: ${trend > 0 ? '+' : ''}${trendPercent}% vs previous`}
      </div>
    </div>
  );
}

interface StatusRingProps {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  centerContent?: React.ReactNode;
}

export function StatusRing({ 
  segments, 
  size = 100, 
  strokeWidth = 8, 
  className = "",
  centerContent
}: StatusRingProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const data = segments.map(seg => ({
    ...seg,
    value: (seg.value / total) * 100
  }));

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center">
          {centerContent}
        </div>
      )}
    </div>
  );
}

// Enhanced Donut Chart with Center Content
interface DonutChartWithCenterProps {
  data: { name: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  centerContent?: React.ReactNode;
}

export function DonutChartWithCenter({ 
  data, 
  size = 120, 
  strokeWidth = 12, 
  className = "",
  centerContent
}: DonutChartWithCenterProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, ""]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {centerContent || (
          <>
            <div className="text-2xl font-bold text-foreground">{total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </>
        )}
      </div>
    </div>
  );
}

// Vertical Bar Chart Component
interface VerticalBarChartProps {
  data: { name: string; value: number }[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function VerticalBarChart({ 
  data, 
  width = 300, 
  height = 200, 
  color = "hsl(var(--primary))",
  className = ""
}: VerticalBarChartProps) {
  return (
    <div className={cn("", className)} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
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
          <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Enhanced Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  color?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  subtitle, 
  color = "hsl(var(--primary))",
  className = ""
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {change !== undefined && (
                <div className={cn("flex items-center space-x-1", trendColor)}>
                  <TrendIcon className="h-3 w-3" />
                  <span className="text-xs font-medium">{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div 
            className="w-1 h-12 rounded-full ml-4" 
            style={{ backgroundColor: color }}
          />
        </div>
      </CardContent>
    </Card>
  );
}