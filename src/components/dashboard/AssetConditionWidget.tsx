import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";

interface AssetConditionWidgetProps {
  filteredAssets?: any[];
}

export function AssetConditionWidget({ filteredAssets = [] }: AssetConditionWidgetProps) {
  const navigate = useNavigate();
  
  // Calculate condition counts
  const excellentCount = filteredAssets.filter(asset => asset.condition === 'Excellent').length;
  const goodCount = filteredAssets.filter(asset => asset.condition === 'Good').length;
  const fairCount = filteredAssets.filter(asset => asset.condition === 'Fair').length;
  const poorCount = filteredAssets.filter(asset => asset.condition === 'Poor').length;
  const criticalCount = filteredAssets.filter(asset => asset.condition === 'Critical').length;
  
  // Prepare data for donut chart
  const conditionData = [
    { name: "Excellent", value: excellentCount, color: "hsl(var(--success))" },
    { name: "Good", value: goodCount, color: "hsl(var(--dashboard-low))" },
    { name: "Fair", value: fairCount, color: "hsl(var(--dashboard-medium))" },
    { name: "Poor", value: poorCount, color: "hsl(var(--warning))" },
    { name: "Critical", value: criticalCount, color: "hsl(var(--destructive))" }
  ].filter(item => item.value > 0);
  
  const totalAssets = filteredAssets.length;
  
  // Calculate overall condition score (0-100)
  const conditionScore = totalAssets > 0 
    ? Math.round(((excellentCount * 100 + goodCount * 75 + fairCount * 50 + poorCount * 25 + criticalCount * 0) / totalAssets))
    : 0;
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { sortBy: 'condition', order: 'asc' }
      }
    });
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-lg">Asset Condition</span>
          </div>
          <Badge variant="outline" className="text-sm">
            Score: {conditionScore}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <DonutChartWithCenter 
            data={conditionData}
            centerContent={
              <div className="text-center">
                <div className="text-2xl font-bold">{totalAssets}</div>
                <div className="text-xs text-muted-foreground">Total Assets</div>
              </div>
            }
          />
        </div>
        
        <div className="space-y-2">
          {excellentCount > 0 && (
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--success))" }} />
                <span className="text-sm font-medium">Excellent</span>
              </div>
              <span className="text-sm text-muted-foreground">{excellentCount}</span>
            </div>
          )}
          {goodCount > 0 && (
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--dashboard-low))" }} />
                <span className="text-sm font-medium">Good</span>
              </div>
              <span className="text-sm text-muted-foreground">{goodCount}</span>
            </div>
          )}
          {fairCount > 0 && (
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--dashboard-medium))" }} />
                <span className="text-sm font-medium">Fair</span>
              </div>
              <span className="text-sm text-muted-foreground">{fairCount}</span>
            </div>
          )}
          {poorCount > 0 && (
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--warning))" }} />
                <span className="text-sm font-medium">Poor</span>
              </div>
              <span className="text-sm text-muted-foreground">{poorCount}</span>
            </div>
          )}
          {criticalCount > 0 && (
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--destructive))" }} />
                <span className="text-sm font-medium">Critical</span>
              </div>
              <span className="text-sm text-muted-foreground">{criticalCount}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
