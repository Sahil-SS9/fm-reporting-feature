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
    <div className="space-y-2">
      <DonutChartWithCenter 
        data={priorityData}
        size={180}
        strokeWidth={14}
        centerContent={
          <div className="text-center">
            <div className="text-3xl font-bold">{totalPriority}</div>
            <div className="text-xs text-muted-foreground">Priority</div>
          </div>
        }
      />
      
      <div className="space-y-1">
        {priorityData.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-1 rounded bg-muted/10">
            <div className="flex items-center space-x-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium">{item.name}</span>
            </div>
            <Badge variant="outline" className="text-xs h-4">
              {item.value}
            </Badge>
          </div>
        ))}
        <div className="pt-1 border-t border-muted/20">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="text-destructive">↑ +2 critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}