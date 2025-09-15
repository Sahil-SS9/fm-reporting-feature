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
    <div className="space-y-2">
      <DonutChartWithCenter 
        data={maintenanceData}
        size={180}
        strokeWidth={14}
        centerContent={
          <div className="text-center">
            <div className="text-3xl font-bold">{totalMaintenance}</div>
            <div className="text-xs text-muted-foreground">Scheduled Items</div>
          </div>
        }
      />
      
      <div className="space-y-1">
        {maintenanceData.map((item) => (
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
        <div className="pt-2 mt-2 border-t border-muted/20">
          <div className="flex justify-center items-center text-xs text-muted-foreground min-h-[1.5rem]">
            <span className="text-warning">↑ +5 this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}