import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, DollarSign, Wrench, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets, mockWorkOrders } from "@/data/mockData";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";
import { DetailedViewModal } from "@/components/ui/detailed-view-modal";
import { useState } from "react";

export function TopAssetsWidget() {
  const navigate = useNavigate();
  const [showMoreCritical, setShowMoreCritical] = useState(false);
  const [showMoreWorkOrders, setShowMoreWorkOrders] = useState(false);
  const [showMoreFrequency, setShowMoreFrequency] = useState(false);
  
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
  }).sort((a, b) => b.workOrderCount - a.workOrderCount).slice(0, 10);

  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { sortBy: 'workOrderCount', order: 'desc' }
      }
    });
  };

  // Prepare data for detailed view modal
  const criticalData = assetMetrics.sort((a, b) => b.criticalIssues - a.criticalIssues);
  const workOrderData = assetMetrics.sort((a, b) => b.workOrderCount - a.workOrderCount);
  const frequencyData = assetMetrics.sort((a, b) => b.frequencyScore - a.frequencyScore);

  const tableColumns = [
    { key: 'name', label: 'Asset Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'workOrderCount', label: 'Work Orders' },
    { key: 'criticalIssues', label: 'Critical Issues' },
    { key: 'frequencyScore', label: 'Frequency Score', format: (value: number) => `${value}/year` }
  ];

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
          <div className="flex items-center space-x-2">
            <DetailedViewModal
              title="High Maintenance Assets"
              chartComponent={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-center">Critical Issues</h4>
                    <div className="h-64">
                      <VerticalBarChart 
                        data={criticalData.map(asset => ({
                          name: asset.name,
                          value: asset.criticalIssues
                        }))}
                        color="hsl(var(--destructive))"
                        width={300}
                        height={240}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-center">Work Orders</h4>
                    <div className="h-64">
                      <VerticalBarChart 
                        data={workOrderData.map(asset => ({
                          name: asset.name,
                          value: asset.workOrderCount
                        }))}
                        color="hsl(var(--dashboard-medium))"
                        width={300}
                        height={240}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-center">Frequency Score</h4>
                    <div className="h-64">
                      <VerticalBarChart 
                        data={frequencyData.map(asset => ({
                          name: asset.name,
                          value: asset.frequencyScore
                        }))}
                        color="hsl(var(--dashboard-high))"
                        width={300}
                        height={240}
                      />
                    </div>
                  </div>
                </div>
              }
              tableData={assetMetrics}
              tableColumns={tableColumns}
            >
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <Eye className="h-4 w-4 mr-2" />
                View More
              </Button>
            </DetailedViewModal>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Critical Issues Panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <TrendingUp className="h-5 w-5 text-destructive" />
              <h4 className="font-semibold text-base">Critical Issues</h4>
            </div>
            <div className="h-48 bg-card border rounded-lg p-4">
              <VerticalBarChart 
                data={criticalData.slice(0, 10).map(asset => ({
                  name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                  value: asset.criticalIssues
                }))}
                color="hsl(var(--destructive))"
                width={380}
                height={180}
              />
            </div>
            <div className="mt-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Top Assets</h5>
                  <DetailedViewModal
                    title="Critical Issues - Top Assets"
                    chartComponent={
                      <div className="h-64">
                        <VerticalBarChart 
                          data={criticalData.slice(0, 10).map(asset => ({
                            name: asset.name,
                            value: asset.criticalIssues
                          }))}
                          color="hsl(var(--destructive))"
                          width={600}
                          height={240}
                        />
                      </div>
                    }
                    tableData={criticalData.slice(0, 10)}
                    tableColumns={tableColumns}
                  >
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Eye className="h-3 w-3 mr-1" />
                      View More
                    </Button>
                  </DetailedViewModal>
                </div>
                <div className="space-y-2">
                  {criticalData.slice(0, showMoreCritical ? 10 : 5).map((asset, index) => (
                    <div key={`critical-${asset.id}`} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground font-medium">{asset.name}</span>
                      <span className="font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">
                        {asset.criticalIssues}
                      </span>
                    </div>
                  ))}
                  {criticalData.length > 5 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); setShowMoreCritical(!showMoreCritical); }}
                      className="w-full text-xs"
                    >
                      {showMoreCritical ? "Show Less" : "Show More"}
                    </Button>
                  )}
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
                data={workOrderData.slice(0, 10).map(asset => ({
                  name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                  value: asset.workOrderCount
                }))}
                color="hsl(var(--dashboard-medium))"
                width={380}
                height={180}
              />
            </div>
            <div className="mt-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Top Assets</h5>
                  <DetailedViewModal
                    title="Work Orders - Top Assets"
                    chartComponent={
                      <div className="h-64">
                        <VerticalBarChart 
                          data={workOrderData.slice(0, 10).map(asset => ({
                            name: asset.name,
                            value: asset.workOrderCount
                          }))}
                          color="hsl(var(--dashboard-medium))"
                          width={600}
                          height={240}
                        />
                      </div>
                    }
                    tableData={workOrderData.slice(0, 10)}
                    tableColumns={tableColumns}
                  >
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Eye className="h-3 w-3 mr-1" />
                      View More
                    </Button>
                  </DetailedViewModal>
                </div>
                <div className="space-y-2">
                  {workOrderData.slice(0, showMoreWorkOrders ? 10 : 5).map((asset, index) => (
                    <div key={`wo-${asset.id}`} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground font-medium">{asset.name}</span>
                      <span className="font-semibold text-dashboard-medium bg-dashboard-medium/10 px-2 py-1 rounded">
                        {asset.workOrderCount}
                      </span>
                    </div>
                  ))}
                  {workOrderData.length > 5 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); setShowMoreWorkOrders(!showMoreWorkOrders); }}
                      className="w-full text-xs"
                    >
                      {showMoreWorkOrders ? "Show Less" : "Show More"}
                    </Button>
                  )}
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
                data={frequencyData.slice(0, 10).map(asset => ({
                  name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                  value: asset.frequencyScore
                }))}
                color="hsl(var(--dashboard-high))"
                width={380}
                height={180}
              />
            </div>
            <div className="mt-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Top Assets</h5>
                  <DetailedViewModal
                    title="Frequency Score - Top Assets"
                    chartComponent={
                      <div className="h-64">
                        <VerticalBarChart 
                          data={frequencyData.slice(0, 10).map(asset => ({
                            name: asset.name,
                            value: asset.frequencyScore
                          }))}
                          color="hsl(var(--dashboard-high))"
                          width={600}
                          height={240}
                        />
                      </div>
                    }
                    tableData={frequencyData.slice(0, 10)}
                    tableColumns={tableColumns}
                  >
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Eye className="h-3 w-3 mr-1" />
                      View More
                    </Button>
                  </DetailedViewModal>
                </div>
                <div className="space-y-2">
                  {frequencyData.slice(0, showMoreFrequency ? 10 : 5).map((asset, index) => (
                    <div key={`freq-${asset.id}`} className="flex items-center justify-between text-sm">
                      <span className="truncate text-foreground font-medium">{asset.name}</span>
                      <span className="font-semibold text-dashboard-high bg-dashboard-high/10 px-2 py-1 rounded">
                        {asset.frequencyScore}/year
                      </span>
                    </div>
                  ))}
                  {frequencyData.length > 5 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); setShowMoreFrequency(!showMoreFrequency); }}
                      className="w-full text-xs"
                    >
                      {showMoreFrequency ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}