import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, DollarSign, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";
import { DetailedViewModal } from "@/components/ui/detailed-view-modal";
import { useState } from "react";

interface TopAssetsWidgetProps {
  filteredAssets?: any[];
  filteredWorkOrders?: any[];
}

export function TopAssetsWidget({ filteredAssets = [], filteredWorkOrders = [] }: TopAssetsWidgetProps) {
  const navigate = useNavigate();
  
  // Calculate comprehensive asset metrics
  const assetMetrics = filteredAssets.map(asset => {
    // Better filtering logic - match by asset type and work order category/title
    const workOrders = filteredWorkOrders.filter(wo => {
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
      className="hover:shadow-md transition-shadow cursor-pointer group col-span-full min-h-[600px]" 
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
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-3" style={{ minHeight: '480px' }}>
          
          {/* Critical Issues Panel */}
          <div className="space-y-2">
            <div className="h-96 bg-card border rounded-lg p-4" style={{ minHeight: '240px' }}>
              <div className="flex justify-center mt-4 mb-5">
                <VerticalBarChart 
                  data={criticalData.slice(0, 10).map(asset => ({
                    name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                    value: asset.criticalIssues
                  }))}
                  color="hsl(var(--destructive))"
                  width={600}
                  height={360}
                />
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-muted-foreground">Critical Issues</h5>
                <TrendingUp className="h-4 w-4 text-destructive" />
              </div>
              <div className="space-y-2">
                {criticalData.slice(0, 4).map((asset, index) => (
                  <div key={`critical-${asset.id}`} className="flex items-center justify-between h-8 px-2 rounded hover:bg-background/50 transition-colors">
                    <span className="truncate text-sm font-medium">{asset.name}</span>
                    <span className="text-xs font-normal text-destructive">
                      {asset.criticalIssues}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <DetailedViewModal
                  title="Critical Issues - High Maintenance Assets"
                  chartComponent={
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-center">Critical Issues</h4>
                      <div className="h-80">
                        <VerticalBarChart 
                          data={criticalData.map(asset => ({
                            name: asset.name,
                            value: asset.criticalIssues
                          }))}
                          color="hsl(var(--destructive))"
                          width={800}
                          height={400}
                        />
                      </div>
                    </div>
                  }
                  tableData={criticalData}
                  tableColumns={tableColumns}
                >
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                    View More
                  </Button>
                </DetailedViewModal>
              </div>
            </div>
          </div>
          
          {/* Work Order Count Panel */}
          <div className="space-y-2">
            <div className="h-96 bg-card border rounded-lg p-4" style={{ minHeight: '240px' }}>
              <div className="flex justify-center mt-4 mb-5">
                <VerticalBarChart 
                  data={workOrderData.slice(0, 10).map(asset => ({
                    name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                    value: asset.workOrderCount
                  }))}
                  color="hsl(var(--dashboard-medium))"
                  width={600}
                  height={360}
                />
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-muted-foreground">Work Orders</h5>
                <Wrench className="h-4 w-4 text-dashboard-medium" />
              </div>
              <div className="space-y-2">
                {workOrderData.slice(0, 4).map((asset, index) => (
                  <div key={`wo-${asset.id}`} className="flex items-center justify-between h-8 px-2 rounded hover:bg-background/50 transition-colors">
                    <span className="truncate text-sm font-medium">{asset.name}</span>
                    <span className="text-xs font-normal text-dashboard-medium">
                      {asset.workOrderCount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <DetailedViewModal
                  title="Work Orders - High Maintenance Assets"
                  chartComponent={
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-center">Work Orders</h4>
                      <div className="h-80">
                        <VerticalBarChart 
                          data={workOrderData.map(asset => ({
                            name: asset.name,
                            value: asset.workOrderCount
                          }))}
                          color="hsl(var(--dashboard-medium))"
                          width={800}
                          height={400}
                        />
                      </div>
                    </div>
                  }
                  tableData={workOrderData}
                  tableColumns={tableColumns}
                >
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                    View More
                  </Button>
                </DetailedViewModal>
              </div>
            </div>
          </div>
          
          {/* Frequency Score Panel */}
          <div className="space-y-2">
            <div className="h-96 bg-card border rounded-lg p-4" style={{ minHeight: '240px' }}>
              <div className="flex justify-center mt-4 mb-5">
                <VerticalBarChart 
                  data={frequencyData.slice(0, 10).map(asset => ({
                    name: asset.name.length > 8 ? asset.name.substring(0, 8) + '...' : asset.name,
                    value: asset.frequencyScore
                  }))}
                  color="hsl(var(--dashboard-high))"
                  width={600}
                  height={360}
                />
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-muted-foreground">Frequency Score</h5>
                <DollarSign className="h-4 w-4 text-dashboard-high" />
              </div>
              <div className="space-y-2">
                {frequencyData.slice(0, 4).map((asset, index) => (
                  <div key={`freq-${asset.id}`} className="flex items-center justify-between h-8 px-2 rounded hover:bg-background/50 transition-colors">
                    <span className="truncate text-sm font-medium">{asset.name}</span>
                    <span className="text-xs font-normal text-dashboard-high">
                      {asset.frequencyScore}/year
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <DetailedViewModal
                  title="Frequency Score - High Maintenance Assets"
                  chartComponent={
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-center">Frequency Score</h4>
                      <div className="h-80">
                        <VerticalBarChart 
                          data={frequencyData.map(asset => ({
                            name: asset.name,
                            value: asset.frequencyScore
                          }))}
                          color="hsl(var(--dashboard-high))"
                          width={800}
                          height={400}
                        />
                      </div>
                    </div>
                  }
                  tableData={frequencyData}
                  tableColumns={tableColumns}
                >
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                    View More
                  </Button>
                </DetailedViewModal>
              </div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}