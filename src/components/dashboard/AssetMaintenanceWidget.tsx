import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { OverdueVsUpcomingRing } from "./maintenance-rings/OverdueVsUpcomingRing";
import { PriorityLevelRing } from "./maintenance-rings/PriorityLevelRing";
import { MaintenanceTypeRing } from "./maintenance-rings/MaintenanceTypeRing";

interface AssetMaintenanceWidgetProps {
  filteredAssets?: any[];
}

export function AssetMaintenanceWidget({ filteredAssets = [] }: AssetMaintenanceWidgetProps) {
  const navigate = useNavigate();
  
  // Calculate total maintenance items for badge from filtered assets
  const assetsWithMaintenance = filteredAssets.filter(asset => asset.nextInspection);
  const totalMaintenance = assetsWithMaintenance.length;
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { maintenance: 'overview' }
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
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-base font-semibold">Asset Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {totalMaintenance} Items
            </Badge>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <OverdueVsUpcomingRing />
          </div>
          
          <div className="text-center">
            <PriorityLevelRing />
          </div>
          
          <div className="text-center">
            <MaintenanceTypeRing />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}