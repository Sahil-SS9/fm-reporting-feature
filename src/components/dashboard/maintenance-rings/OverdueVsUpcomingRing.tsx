import { Badge } from "@/components/ui/badge";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import { mockAssets } from "@/data/mockData";

export function OverdueVsUpcomingRing() {
  // Calculate overdue vs upcoming maintenance
  const currentDate = new Date();
  
  const assetsWithMaintenance = mockAssets.filter(asset => asset.nextInspection);
  
  const overdueCount = assetsWithMaintenance.filter(asset => {
    const nextInspection = new Date(asset.nextInspection!);
    return nextInspection < currentDate;
  }).length;
  
  const upcomingCount = assetsWithMaintenance.filter(asset => {
    const nextInspection = new Date(asset.nextInspection!);
    return nextInspection >= currentDate;
  }).length;
  
  const maintenanceData = [
    { name: "Overdue", value: overdueCount, color: "hsl(var(--destructive))" },
    { name: "Upcoming", value: upcomingCount, color: "hsl(var(--warning))" }
  ].filter(item => item.value > 0);
  
  const totalMaintenance = overdueCount + upcomingCount;
  
  return (
    <div className="flex items-center gap-3">
      <DonutChartWithCenter 
        data={maintenanceData}
        size={160}
        strokeWidth={12}
        centerContent={
          <div className="text-center">
            <div className="text-2xl font-bold">{totalMaintenance}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        }
      />
      
      <div className="flex-1 space-y-1">
        {maintenanceData.map((item) => (
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