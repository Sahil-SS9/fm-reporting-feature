import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

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
}

export function MiniTrendChart({ 
  data, 
  width = 100, 
  height = 40, 
  color = "hsl(var(--primary))",
  className = ""
}: MiniTrendChartProps) {
  return (
    <div className={cn("", className)} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
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