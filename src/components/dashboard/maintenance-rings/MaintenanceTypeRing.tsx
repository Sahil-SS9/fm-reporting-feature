import { Badge } from "@/components/ui/badge";
import { PieChartWithCenter } from "@/components/ui/enhanced-charts";
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
    <div className="space-y-2 flex flex-col items-center">
      <h4 className="text-sm font-semibold text-center border-b border-border pb-1">Maintenance Types</h4>
      <div className="flex justify-center">
        <PieChartWithCenter 
          data={typeData}
          size={180}
          centerContent={
            <div className="text-center">
              <div className="text-3xl font-bold">{totalTypes}</div>
            </div>
          }
        />
      </div>
      
      <div className="space-y-1">
        {typeData.map((item) => (
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
      </div>
    </div>
  );
}