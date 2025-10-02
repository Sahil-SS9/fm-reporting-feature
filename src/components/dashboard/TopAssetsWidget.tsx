import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Clock, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";
import { DetailedViewModal } from "@/components/ui/detailed-view-modal";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface TopAssetsWidgetProps {
  filteredAssets?: any[];
  filteredWorkOrders?: any[];
}

export function TopAssetsWidget({ filteredAssets = [], filteredWorkOrders = [] }: TopAssetsWidgetProps) {
  const navigate = useNavigate();
  
  // Calculate comprehensive asset metrics with priority breakdown
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
    
    // Calculate priority breakdown
    const criticalCount = workOrders.filter(wo => 
      wo.priority === 'Critical' || wo.priority === 'Urgent' || wo.priority === 'High'
    ).length;
    const mediumCount = workOrders.filter(wo => wo.priority === 'Medium').length;
    const lowCount = workOrders.filter(wo => wo.priority === 'Low').length;
    
    // Calculate frequency score (work orders per year)
    const frequencyScore = workOrderCount;
    
    return {
      ...asset,
      workOrderCount,
      criticalCount,
      mediumCount,
      lowCount,
      frequencyScore
    };
  });

  // Top 10 by work order count for stacked chart
  const topByWorkOrders = assetMetrics
    .sort((a, b) => b.workOrderCount - a.workOrderCount)
    .slice(0, 10);

  // Top 10 by frequency for frequency chart
  const topByFrequency = assetMetrics
    .sort((a, b) => b.frequencyScore - a.frequencyScore)
    .slice(0, 10);

  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { sortBy: 'workOrderCount', order: 'desc' }
      }
    });
  };

  // Prepare stacked chart data
  const stackedChartData = topByWorkOrders.map(asset => ({
    name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
    Critical: asset.criticalCount,
    Medium: asset.mediumCount,
    Low: asset.lowCount,
    fullName: asset.name
  }));

  // Prepare frequency chart data
  const frequencyChartData = topByFrequency.map(asset => ({
    name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
    value: asset.frequencyScore,
    fullName: asset.name
  }));

  const tableColumns = [
    { key: 'name', label: 'Asset Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'workOrderCount', label: 'Work Orders' },
    { key: 'criticalCount', label: 'Critical/Urgent/High' },
    { key: 'mediumCount', label: 'Medium' },
    { key: 'lowCount', label: 'Low' },
    { key: 'frequencyScore', label: 'Frequency', format: (value: number) => `${value} WOs` }
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
        <div className="grid grid-cols-2 gap-4" style={{ minHeight: '480px' }}>
          
          {/* Work Orders by Priority (Stacked) Panel */}
          <div className="space-y-2">
            <div className="h-96 bg-card border rounded-lg p-4" style={{ minHeight: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedChartData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="Critical" stackId="a" fill="hsl(var(--destructive))" />
                  <Bar dataKey="Medium" stackId="a" fill="hsl(var(--dashboard-medium))" />
                  <Bar dataKey="Low" stackId="a" fill="hsl(var(--dashboard-low))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-muted-foreground">Work Orders by Priority</h5>
                <Wrench className="h-4 w-4 text-dashboard-medium" />
              </div>
              <div className="space-y-2">
                {topByWorkOrders.slice(0, 4).map((asset, index) => (
                  <div key={`wo-${asset.id}`} className="flex items-center justify-between h-8 px-2 rounded hover:bg-background/50 transition-colors">
                    <span className="truncate text-sm font-medium">{asset.name}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-destructive font-medium">{asset.criticalCount}</span>
                      <span className="text-dashboard-medium font-medium">{asset.mediumCount}</span>
                      <span className="text-dashboard-low font-medium">{asset.lowCount}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <DetailedViewModal
                  title="Work Orders by Priority - High Maintenance Assets"
                  chartComponent={
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-center">Work Orders by Priority</h4>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stackedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={100}
                            />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="Critical" stackId="a" fill="hsl(var(--destructive))" />
                            <Bar dataKey="Medium" stackId="a" fill="hsl(var(--dashboard-medium))" />
                            <Bar dataKey="Low" stackId="a" fill="hsl(var(--dashboard-low))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  }
                  tableData={topByWorkOrders}
                  tableColumns={tableColumns}
                >
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                    View More
                  </Button>
                </DetailedViewModal>
              </div>
            </div>
          </div>
          
          {/* Frequency Panel */}
          <div className="space-y-2">
            <div className="h-96 bg-card border rounded-lg p-4" style={{ minHeight: '240px' }}>
              <div className="flex justify-center mt-4 mb-5">
                <VerticalBarChart 
                  data={frequencyChartData}
                  color="hsl(var(--dashboard-high))"
                  width={600}
                  height={360}
                />
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-muted-foreground">Work Order Frequency</h5>
                <Clock className="h-4 w-4 text-dashboard-high" />
              </div>
              <div className="space-y-2">
                {topByFrequency.slice(0, 4).map((asset, index) => (
                  <div key={`freq-${asset.id}`} className="flex items-center justify-between h-8 px-2 rounded hover:bg-background/50 transition-colors">
                    <span className="truncate text-sm font-medium">{asset.name}</span>
                    <span className="text-xs font-normal text-dashboard-high">
                      {asset.frequencyScore} WOs
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <DetailedViewModal
                  title="Work Order Frequency - High Maintenance Assets"
                  chartComponent={
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-center">Top 10 by Frequency</h4>
                      <div className="h-80">
                        <VerticalBarChart 
                          data={topByFrequency.map(asset => ({
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
                  tableData={topByFrequency}
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