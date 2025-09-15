import { Badge } from "@/components/ui/badge";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import { mockAssets } from "@/data/mockData";

export function MaintenanceTypeRing() {
  // Calculate maintenance type breakdown
  const assetsWithMaintenance = mockAssets.filter(asset => asset.nextInspection && asset.maintenanceType);
  
  const workOrderCount = assetsWithMaintenance.filter(asset => asset.maintenanceType === "Work Order").length;
  const inspectionCount = assetsWithMaintenance.filter(asset => asset.maintenanceType === "Inspection").length;
  const auditCount = assetsWithMaintenance.filter(asset => asset.maintenanceType === "Audit").length;
  
  const typeData = [
    { name: "Work Order", value: workOrderCount, color: "hsl(var(--primary))" },
    { name: "Inspection", value: inspectionCount, color: "hsl(var(--secondary))" },
    { name: "Audit", value: auditCount, color: "hsl(var(--accent))" }
  ].filter(item => item.value > 0);
  
  const totalTypes = workOrderCount + inspectionCount + auditCount;
  
  return (
    <div className="flex items-center gap-3">
      <DonutChartWithCenter 
        data={typeData}
        size={160}
        strokeWidth={12}
        centerContent={
          <div className="text-center">
            <div className="text-2xl font-bold">{totalTypes}</div>
            <div className="text-xs text-muted-foreground">Types</div>
          </div>
        }
      />
      
      <div className="flex-1 space-y-1">
        {typeData.map((item) => (
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