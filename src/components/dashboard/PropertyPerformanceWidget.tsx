import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, TrendingDown, ArrowRight, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockProperties, mockWorkOrders, mockAssets } from "@/data/mockData";
import { RadialProgress, SemiCircularGauge } from "@/components/ui/enhanced-charts";
import { cn } from "@/lib/utils";

export function PropertyPerformanceWidget() {
  const navigate = useNavigate();
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
  
  const handleClick = () => {
    navigate('/reporting', { 
      state: { 
        reportType: 'property-performance',
        properties: sortedProperties
      }
    });
  };
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Property Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={needsAttentionProperties.length > 0 ? "destructive" : "secondary"} 
              className="text-xs"
            >
              {needsAttentionProperties.length} Need Attention
            </Badge>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Performer with Health Score Gauge */}
        <div className="p-4 bg-dashboard-complete/5 rounded-lg border border-dashboard-complete/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-dashboard-complete" />
              <span className="text-sm font-medium">Top Performer</span>
            </div>
            <SemiCircularGauge 
              value={topProperty.healthScore} 
              size={80}
              color="hsl(var(--dashboard-complete))"
            />
          </div>
          <div className="text-lg font-bold text-dashboard-complete mb-1">
            {topProperty.name}
          </div>
          <div className="text-sm text-muted-foreground">
            {topProperty.completionRate}% completion • {topProperty.overdueWorkOrders} overdue
          </div>
        </div>
        
        {/* Properties Performance Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sortedProperties.slice(0, 4).map((property) => {
            const HealthIcon = getHealthIcon(property.healthScore);
            return (
              <div 
                key={property.id} 
                className={cn(
                  "p-3 rounded-lg border",
                  property.healthScore < 70 
                    ? "bg-destructive/5 border-destructive/20" 
                    : property.healthScore < 80
                    ? "bg-warning/5 border-warning/20"
                    : "bg-dashboard-complete/5 border-dashboard-complete/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <HealthIcon className={cn(
                    "h-4 w-4",
                    property.healthScore >= 80 ? "text-dashboard-complete" : 
                    property.healthScore >= 70 ? "text-warning" : "text-destructive"
                  )} />
                  <RadialProgress 
                    value={property.healthScore} 
                    size={40}
                    color={
                      property.healthScore >= 80 ? "hsl(var(--dashboard-complete))" : 
                      property.healthScore >= 70 ? "hsl(var(--warning))" : "hsl(var(--destructive))"
                    }
                  />
                </div>
                <div className="text-sm font-medium mb-1 truncate">
                  {property.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {property.totalWorkOrders} orders
                </div>
                <div className="text-xs text-muted-foreground">
                  {property.completionRate}% complete
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats with Enhanced Visuals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {Math.round(propertyMetrics.reduce((sum, p) => sum + p.healthScore, 0) / propertyMetrics.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Health Score</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold">
              {Math.round(propertyMetrics.reduce((sum, p) => sum + p.completionRate, 0) / propertyMetrics.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Completion</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}