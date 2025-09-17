import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";

interface AssetStatusWidgetProps {
  filteredAssets?: any[];
}

export function AssetStatusWidget({ filteredAssets = [] }: AssetStatusWidgetProps) {
  const navigate = useNavigate();
  
  // Enhanced asset status breakdown from filtered assets
  const assetStatusBreakdown = {
    operational: filteredAssets.filter(asset => asset.status === "Operational").length,
    pendingRepair: filteredAssets.filter(asset => asset.status === "Pending Repair").length,
    outOfService: filteredAssets.filter(asset => asset.status === "Out of Service").length,
    missing: filteredAssets.filter(asset => asset.status === "Missing").length
  };
  
  const statusData = [
    { name: "Operational", value: assetStatusBreakdown.operational, color: "hsl(var(--success))" },
    { name: "Pending Repair", value: assetStatusBreakdown.pendingRepair, color: "hsl(var(--warning))" },
    { name: "Out of Service", value: assetStatusBreakdown.outOfService, color: "hsl(var(--destructive))" },
    { name: "Missing", value: assetStatusBreakdown.missing, color: "hsl(var(--muted-foreground))" }
  ].filter(status => status.value > 0);
  
  const totalAssets = filteredAssets.length;
  const healthScore = Math.round((assetStatusBreakdown.operational / totalAssets) * 100);
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { status: 'status-overview' }
      }
    });
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-base font-semibold">Asset Status</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {healthScore}% Health
            </Badge>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-center">
            <DonutChartWithCenter 
              data={statusData}
              size={180}
              strokeWidth={14}
              centerContent={
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalAssets}</div>
                  <div className="text-xs text-muted-foreground">Assets</div>
                </div>
              }
            />
          </div>
          
          <div className="space-y-1">
            {statusData.map((status) => (
              <div key={status.name} className="flex items-center justify-between p-1 rounded bg-muted/10">
                <div className="flex items-center space-x-1.5">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-xs font-medium">{status.name}</span>
                </div>
                <Badge variant="outline" className="text-xs h-4">
                  {status.value}
                </Badge>
              </div>
            ))}
            <div className="pt-1 border-t border-muted/20">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="text-success">↑ +3 this week</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}