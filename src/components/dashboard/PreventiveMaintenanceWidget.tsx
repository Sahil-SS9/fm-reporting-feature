import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { RadialProgress } from "@/components/ui/enhanced-charts";

export function PreventiveMaintenanceWidget() {
  const navigate = useNavigate();
  
  // Preventive maintenance tracking (separate from inspections)
  const preventiveMaintenanceDue = mockAssets.filter(asset => {
    // Mock preventive maintenance logic (separate from inspections)
    return asset.status === "Operational" && Math.random() > 0.7; // Mock 30% due for PM
  });
  
  const totalAssets = mockAssets.length;
  const pmPercentage = (preventiveMaintenanceDue.length / totalAssets) * 100;
  
  const handleClick = () => {
    navigate('/maintenance', { 
      state: { 
        filter: { type: 'preventive' }
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
            <span className="text-base">Preventive Maintenance</span>
          </div>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-lg font-bold">{preventiveMaintenanceDue.length}</div>
            <div className="text-sm text-muted-foreground">assets due</div>
          </div>
          <RadialProgress 
            value={pmPercentage} 
            size={60}
            color="hsl(var(--primary))"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Scheduled maintenance tasks requiring attention
        </div>
        <Badge 
          variant={pmPercentage > 20 ? "destructive" : "secondary"} 
          className="text-xs w-full justify-center"
        >
          {pmPercentage.toFixed(0)}% of assets
        </Badge>
      </CardContent>
    </Card>
  );
}