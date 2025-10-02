import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
        <div className="grid grid-cols-2 gap-4">
          
          {/* Work Orders by Priority (Stacked Chart) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-center pb-2 border-b">Work Orders by Priority</h4>
            
            {/* Stacked Bar Chart */}
            <div className="h-[300px] bg-card border rounded-lg p-4">
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

            {/* Data Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Asset Name</TableHead>
                    <TableHead className="text-xs">Asset Group</TableHead>
                    <TableHead className="text-xs">Property</TableHead>
                    <TableHead className="text-xs text-right">Work Order Total</TableHead>
                    <TableHead className="text-xs text-right">Critical (Urgent/High)</TableHead>
                    <TableHead className="text-xs text-right">Medium</TableHead>
                    <TableHead className="text-xs text-right">Low</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topByWorkOrders.slice(0, 10).map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-xs font-medium">{asset.name}</TableCell>
                      <TableCell className="text-xs">{asset.type}</TableCell>
                      <TableCell className="text-xs">{asset.location}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{asset.workOrderCount}</TableCell>
                      <TableCell className="text-xs text-right text-destructive font-medium">{asset.criticalCount}</TableCell>
                      <TableCell className="text-xs text-right text-dashboard-medium font-medium">{asset.mediumCount}</TableCell>
                      <TableCell className="text-xs text-right text-dashboard-low font-medium">{asset.lowCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Work Order Frequency (Bar Chart) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-center pb-2 border-b">Work Order Frequency</h4>
            
            {/* Vertical Bar Chart */}
            <div className="h-[300px] bg-card border rounded-lg p-4 flex items-center justify-center">
              <VerticalBarChart 
                data={frequencyChartData}
                color="hsl(var(--dashboard-high))"
                width={500}
                height={280}
              />
            </div>

            {/* Data Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Asset Name</TableHead>
                    <TableHead className="text-xs">Asset Group</TableHead>
                    <TableHead className="text-xs">Property</TableHead>
                    <TableHead className="text-xs text-right">Work Order Total</TableHead>
                    <TableHead className="text-xs text-right">Critical (Urgent/High)</TableHead>
                    <TableHead className="text-xs text-right">Medium</TableHead>
                    <TableHead className="text-xs text-right">Low</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topByFrequency.slice(0, 10).map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-xs font-medium">{asset.name}</TableCell>
                      <TableCell className="text-xs">{asset.type}</TableCell>
                      <TableCell className="text-xs">{asset.location}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{asset.workOrderCount}</TableCell>
                      <TableCell className="text-xs text-right text-destructive font-medium">{asset.criticalCount}</TableCell>
                      <TableCell className="text-xs text-right text-dashboard-medium font-medium">{asset.mediumCount}</TableCell>
                      <TableCell className="text-xs text-right text-dashboard-low font-medium">{asset.lowCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}