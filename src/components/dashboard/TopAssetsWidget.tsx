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
    // Better filtering logic - match by asset type and work order category/title
    const workOrders = mockWorkOrders.filter(wo => {
      const titleLower = wo.title.toLowerCase();
      const assetNameLower = asset.name.toLowerCase();
      const assetTypeLower = (asset.type || '').toLowerCase();
      const categoryLower = (wo.category || '').toLowerCase();
      
      // Try multiple matching strategies
      return (
        // Direct name match
        titleLower.includes(assetNameLower) ||
        assetNameLower.includes(titleLower) ||
        // Type-based matching
        (assetTypeLower.includes('hvac') && (titleLower.includes('hvac') || categoryLower.includes('hvac'))) ||
        (assetTypeLower.includes('elevator') && (titleLower.includes('elevator') || categoryLower.includes('elevator'))) ||
        (assetTypeLower.includes('power') && (titleLower.includes('generator') || titleLower.includes('power'))) ||
        (assetTypeLower.includes('electrical') && (categoryLower.includes('electrical') || titleLower.includes('electrical'))) ||
        (assetTypeLower.includes('plumbing') && (titleLower.includes('water') || titleLower.includes('plumbing') || categoryLower.includes('plumbing')))
      );
    });
    
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Critical Issues Panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <TrendingUp className="h-5 w-5 text-destructive" />
              <h4 className="font-semibold text-base">Critical Issues</h4>
            </div>
            <div className="h-48 bg-card border rounded-lg p-4">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                  value: asset.criticalIssues
                }))}
                color="hsl(var(--destructive))"
                width={280}
                height={180}
              />
            </div>
            <div className="mt-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <h5 className="text-sm font-medium mb-2 text-muted-foreground">Top Assets</h5>
                <div className="space-y-2">
                  {assetMetrics.slice(0, 3).map((asset, index) => (
                    <div key={`critical-${asset.id}`} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground font-medium">{asset.name}</span>
                      <span className="font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">
                        {asset.criticalIssues}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />
          
          {/* Work Order Count Panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <Wrench className="h-5 w-5 text-dashboard-medium" />
              <h4 className="font-semibold text-base">Work Orders</h4>
            </div>
            <div className="h-48 bg-card border rounded-lg p-4">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                  value: asset.workOrderCount
                }))}
                color="hsl(var(--dashboard-medium))"
                width={280}
                height={180}
              />
            </div>
            <div className="mt-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <h5 className="text-sm font-medium mb-2 text-muted-foreground">Top Assets</h5>
                <div className="space-y-2">
                  {assetMetrics.slice(0, 3).map((asset, index) => (
                    <div key={`wo-${asset.id}`} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground font-medium">{asset.name}</span>
                      <span className="font-semibold text-dashboard-medium bg-dashboard-medium/10 px-2 py-1 rounded">
                        {asset.workOrderCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />
          
          {/* Frequency Score Panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <DollarSign className="h-5 w-5 text-dashboard-high" />
              <h4 className="font-semibold text-base">Frequency Score</h4>
            </div>
            <div className="h-48 bg-card border rounded-lg p-4">
              <VerticalBarChart 
                data={assetMetrics.map(asset => ({
                  name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                  value: asset.frequencyScore
                }))}
                color="hsl(var(--dashboard-high))"
                width={280}
                height={180}
              />
            </div>
            <div className="mt-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <h5 className="text-sm font-medium mb-2 text-muted-foreground">Top Assets</h5>
                <div className="space-y-2">
                  {assetMetrics.slice(0, 3).map((asset, index) => (
                    <div key={`freq-${asset.id}`} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground font-medium">{asset.name}</span>
                      <span className="font-semibold text-dashboard-high bg-dashboard-high/10 px-2 py-1 rounded">
                        {asset.frequencyScore}/year
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}