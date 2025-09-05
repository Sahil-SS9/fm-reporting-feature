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
    
    // Calculate critical issues count (Critical and High priority work orders)
    const criticalIssues = workOrders.filter(wo => wo.priority === 'Critical' || wo.priority === 'High').length;
    
    // Calculate frequency score (work orders per year - assuming mock data spans 1 year)
    const frequencyScore = workOrderCount; // This represents annual frequency
    
    return {
      ...asset,
      workOrderCount,
      criticalIssues,
      frequencyScore
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
          
          {/* Critical Issues Panel */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-destructive" />
              <h4 className="font-medium">Critical Issues</h4>
            </div>
            <div className="h-32">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
                  value: asset.criticalIssues
                }))}
                color="hsl(var(--destructive))"
                width={280}
                height={128}
              />
            </div>
            <div className="space-y-1">
              {assetMetrics.slice(0, 3).map((asset, index) => (
                <div key={`critical-${asset.id}`} className="flex items-center justify-between text-xs">
                  <span className="truncate text-muted-foreground">{asset.name}</span>
                  <span className="font-medium text-destructive">{asset.criticalIssues}</span>
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
                width={280}
                height={128}
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
          
          {/* Frequency Score Panel */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-dashboard-high" />
              <h4 className="font-medium">Frequency Score</h4>
            </div>
            <div className="h-32">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
                  value: asset.frequencyScore
                }))}
                color="hsl(var(--dashboard-high))"
                width={280}
                height={128}
              />
            </div>
            <div className="space-y-1">
              {assetMetrics.slice(0, 3).map((asset, index) => (
                <div key={`freq-${asset.id}`} className="flex items-center justify-between text-xs">
                  <span className="truncate text-muted-foreground">{asset.name}</span>
                  <span className="font-medium">{asset.frequencyScore}/year</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}