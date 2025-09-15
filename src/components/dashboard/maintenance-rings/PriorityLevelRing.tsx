import { Badge } from "@/components/ui/badge";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import { mockAssets } from "@/data/mockData";

export function PriorityLevelRing() {
  // Calculate priority level breakdown
  const assetsWithMaintenance = mockAssets.filter(asset => asset.nextInspection && asset.priorityLevel);
  
  const criticalCount = assetsWithMaintenance.filter(asset => asset.priorityLevel === "Critical").length;
  const mediumCount = assetsWithMaintenance.filter(asset => asset.priorityLevel === "Medium").length;
  const lowCount = assetsWithMaintenance.filter(asset => asset.priorityLevel === "Low").length;
  
  const priorityData = [
    { name: "Critical", value: criticalCount, color: "hsl(var(--destructive))" },
    { name: "Medium", value: mediumCount, color: "hsl(var(--warning))" },
    { name: "Low", value: lowCount, color: "hsl(var(--success))" }
  ].filter(item => item.value > 0);
  
  const totalPriority = criticalCount + mediumCount + lowCount;
  
  return (
    <div className="flex items-center gap-3">
      <DonutChartWithCenter 
        data={priorityData}
        size={160}
        strokeWidth={12}
        centerContent={
          <div className="text-center">
            <div className="text-2xl font-bold">{totalPriority}</div>
            <div className="text-xs text-muted-foreground">Priority</div>
          </div>
        }
      />
      
      <div className="flex-1 space-y-1">
        {priorityData.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-muted/10">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <Badge variant="outline" className="text-xs h-5">
              {item.value}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}