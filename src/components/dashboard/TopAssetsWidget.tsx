import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, ArrowRight, DollarSign, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets, mockWorkOrders } from "@/data/mockData";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";

export function TopAssetsWidget() {
  const navigate = useNavigate();
  
  // Calculate comprehensive asset metrics
  const assetMetrics = mockAssets.map(asset => {
    const workOrders = mockWorkOrders.filter(wo => wo.title.includes(asset.name) || wo.description?.includes(asset.name));
    const workOrderCount = workOrders.length;
    
    // Mock labor hours calculation (4-8h per WO based on priority)
    const laborHours = workOrders.reduce((total, wo) => {
      const priorityMultiplier = wo.priority === 'Critical' ? 8 : 
                                wo.priority === 'High' ? 6 : 
                                wo.priority === 'Medium' ? 4 : 2;
      return total + priorityMultiplier;
    }, 0);
    
    // Mock maintenance cost calculation ($50-150/hour based on asset type)
    const hourlyRate = asset.type === 'HVAC' ? 150 : 
                      asset.type === 'Electrical' ? 120 :
                      asset.type === 'Plumbing' ? 100 : 75;
    const maintenanceCost = laborHours * hourlyRate;
    
    return {
      ...asset,
      workOrderCount,
      laborHours,
      maintenanceCost
    };
  }).sort((a, b) => b.workOrderCount - a.workOrderCount).slice(0, 5);

  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { sortBy: 'workOrderCount', order: 'desc' }
      }
    });
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group col-span-full" 
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-lg">High Maintenance Assets</span>
          </div>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Labor Hours Panel */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Labor Hours</h4>
            </div>
            <div className="h-32">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
                  value: asset.laborHours
                }))}
                color="hsl(var(--primary))"
              />
            </div>
            <div className="space-y-1">
              {assetMetrics.slice(0, 3).map((asset, index) => (
                <div key={`labor-${asset.id}`} className="flex items-center justify-between text-xs">
                  <span className="truncate text-muted-foreground">{asset.name}</span>
                  <span className="font-medium">{asset.laborHours}h</span>
                </div>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />
          
          {/* Work Order Count Panel */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-dashboard-medium" />
              <h4 className="font-medium">Work Orders</h4>
            </div>
            <div className="h-32">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
                  value: asset.workOrderCount
                }))}
                color="hsl(var(--dashboard-medium))"
              />
            </div>
            <div className="space-y-1">
              {assetMetrics.slice(0, 3).map((asset, index) => (
                <div key={`wo-${asset.id}`} className="flex items-center justify-between text-xs">
                  <span className="truncate text-muted-foreground">{asset.name}</span>
                  <span className="font-medium">{asset.workOrderCount}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />
          
          {/* Maintenance Cost Panel */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-dashboard-high" />
              <h4 className="font-medium">Maintenance Cost</h4>
            </div>
            <div className="h-32">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
                  value: Math.round(asset.maintenanceCost / 100) // Scale for chart
                }))}
                color="hsl(var(--dashboard-high))"
              />
            </div>
            <div className="space-y-1">
              {assetMetrics.slice(0, 3).map((asset, index) => (
                <div key={`cost-${asset.id}`} className="flex items-center justify-between text-xs">
                  <span className="truncate text-muted-foreground">{asset.name}</span>
                  <span className="font-medium">${(asset.maintenanceCost / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}