import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { OverdueVsUpcomingRing } from "./maintenance-rings/OverdueVsUpcomingRing";
import { PriorityLevelRing } from "./maintenance-rings/PriorityLevelRing";
import { MaintenanceTypeRing } from "./maintenance-rings/MaintenanceTypeRing";

export function AssetMaintenanceWidget() {
  const navigate = useNavigate();
  
  // Calculate total maintenance items for badge
  const assetsWithMaintenance = mockAssets.filter(asset => asset.nextInspection);
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
            <span className="text-base">Asset Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {totalMaintenance} Items
            </Badge>
            <Eye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overdue vs Upcoming Ring */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Overdue vs Upcoming</h4>
          <OverdueVsUpcomingRing />
        </div>
        
        {/* Priority Level Ring */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Priority Level</h4>
          <PriorityLevelRing />
        </div>
        
        {/* Maintenance Type Ring */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Maintenance Type</h4>
          <MaintenanceTypeRing />
        </div>
      </CardContent>
    </Card>
  );
}