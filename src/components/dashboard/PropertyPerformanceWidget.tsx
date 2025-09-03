import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, TrendingDown } from "lucide-react";
import { mockProperties, mockWorkOrders, mockAssets } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function PropertyPerformanceWidget() {
  // Calculate performance metrics per property
  const propertyMetrics = mockProperties.map(property => {
    const propertyWorkOrders = mockWorkOrders.filter(wo => wo.propertyId === property.id);
    const propertyAssets = mockAssets.filter(asset => asset.propertyId === property.id);
    
    const totalWorkOrders = propertyWorkOrders.length;
    const completedWorkOrders = propertyWorkOrders.filter(wo => wo.status === "Completed").length;
    const overdueWorkOrders = propertyWorkOrders.filter(wo => wo.status === "Overdue").length;
    const assetsNeedingMaintenance = propertyAssets.filter(asset => {
      if (!asset.nextInspection) return false;
      const nextInspection = new Date(asset.nextInspection);
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return nextInspection <= thirtyDaysFromNow;
    }).length;
    
    const completionRate = totalWorkOrders > 0 ? Math.round((completedWorkOrders / totalWorkOrders) * 100) : 100;
    const healthScore = Math.max(0, completionRate - (overdueWorkOrders * 10) - (assetsNeedingMaintenance * 5));
    
    return {
      ...property,
      totalWorkOrders,
      completedWorkOrders,
      overdueWorkOrders,
      assetsNeedingMaintenance,
      completionRate,
      healthScore: Math.min(100, healthScore)
    };
  });
  
  // Sort by health score (worst first for attention)
  const sortedProperties = propertyMetrics.sort((a, b) => a.healthScore - b.healthScore);
  const topProperty = sortedProperties[sortedProperties.length - 1];
  const needsAttentionProperties = sortedProperties.filter(p => p.healthScore < 80);
  
  const getHealthBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary"; 
    if (score >= 70) return "outline";
    return "destructive";
  };
  
  const getHealthIcon = (score: number) => {
    return score >= 80 ? TrendingUp : TrendingDown;
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Property Performance</span>
          </div>
          <Badge 
            variant={needsAttentionProperties.length > 0 ? "destructive" : "secondary"} 
            className="text-xs"
          >
            {needsAttentionProperties.length} Need Attention
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top Performer */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Top Performer</span>
            </div>
            <Badge variant="default" className="text-xs bg-green-600">
              {topProperty.healthScore}%
            </Badge>
          </div>
          <div className="text-sm font-medium text-green-800 mb-1">
            {topProperty.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {topProperty.completionRate}% completion • {topProperty.overdueWorkOrders} overdue
          </div>
        </div>
        
        {/* Properties List */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">All Properties:</div>
          {sortedProperties.map((property) => {
            const HealthIcon = getHealthIcon(property.healthScore);
            return (
              <div 
                key={property.id} 
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg border",
                  property.healthScore < 70 
                    ? "bg-destructive/5 border-destructive/20" 
                    : property.healthScore < 80
                    ? "bg-orange-50 border-orange-200"
                    : "bg-secondary/30 border-border"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <HealthIcon className={cn(
                      "h-3 w-3 flex-shrink-0",
                      property.healthScore >= 80 ? "text-green-600" : "text-orange-500"
                    )} />
                    <span className="text-sm font-medium truncate">
                      {property.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {property.totalWorkOrders} orders • {property.completionRate}% complete
                    {property.assetsNeedingMaintenance > 0 && (
                      <span className="text-orange-600">
                        • {property.assetsNeedingMaintenance} maintenance due
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <Badge 
                    variant={getHealthBadgeVariant(property.healthScore)}
                    className="text-xs"
                  >
                    {property.healthScore}%
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">
                {Math.round(propertyMetrics.reduce((sum, p) => sum + p.healthScore, 0) / propertyMetrics.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Health Score</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">
                {Math.round(propertyMetrics.reduce((sum, p) => sum + p.completionRate, 0) / propertyMetrics.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Completion</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}