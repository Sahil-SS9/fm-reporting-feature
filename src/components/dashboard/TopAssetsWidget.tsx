import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets, mockWorkOrders } from "@/data/mockData";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";

export function TopAssetsWidget() {
  const navigate = useNavigate();
  
  // Top 5 assets by work order volume (mock enhanced data)
  const assetWorkOrderCounts = mockAssets.map(asset => {
    const workOrderCount = mockWorkOrders.filter(wo => wo.title.includes(asset.name) || wo.description.includes(asset.name)).length;
    return {
      name: asset.name.length > 15 ? asset.name.substring(0, 15) + "..." : asset.name,
      value: workOrderCount + Math.floor(Math.random() * 8) // Enhanced mock data
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { 
          sortBy: 'ticket-volume',
          showHighMaintenance: true
        }
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
            <TrendingUp className="h-4 w-4 text-warning" />
            <span className="text-base">High Maintenance Assets</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Top 5
            </Badge>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Enhanced Bar Chart */}
        <VerticalBarChart 
          data={assetWorkOrderCounts}
          height={100}
          color="hsl(var(--warning))"
        />
        
        {/* Asset List with Details */}
        <div className="space-y-1">
          {assetWorkOrderCounts.slice(0, 3).map((asset, index) => (
            <div key={asset.name} className="flex items-center justify-between p-1.5 bg-muted/10 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-xs">{asset.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs h-4">
                {asset.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}