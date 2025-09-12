import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  Wrench, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { mockProperties, mockWorkOrders } from "@/data/mockData";

interface PropertyCardProps {
  property: any;
  workOrderCount: number;
  healthScore: number;
  complianceScore: number;
  revenue: number;
}

function PropertyCard({ property, workOrderCount, healthScore, complianceScore, revenue }: PropertyCardProps) {
  const getHealthColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getHealthBadgeVariant = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{property.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{property.location}</p>
            </div>
          </div>
          <Badge variant={getHealthBadgeVariant(healthScore)} className="text-xs">
            {healthScore}% Health
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Health Score with Radial Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Overall Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <Progress value={healthScore} className="w-16 h-2" />
            <span className={`text-sm font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}%
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Wrench className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Work Orders</span>
            </div>
            <p className="text-lg font-bold">{workOrderCount}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Compliance</span>
            </div>
            <p className="text-lg font-bold">{complianceScore}%</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <p className="text-lg font-bold">${revenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Occupancy</span>
            </div>
            <p className="text-lg font-bold">{property.occupancyRate}%</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-1">
            {workOrderCount > 5 ? (
              <AlertTriangle className="h-4 w-4 text-warning" />
            ) : (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
            <span className="text-xs text-muted-foreground">
              {workOrderCount > 5 ? "High Maintenance" : "Good Condition"}
            </span>
          </div>
          
          <Button variant="ghost" size="sm">
            <Calendar className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PropertyOverviewTab() {
  // Calculate metrics for each property
  const propertyMetrics = mockProperties.map(property => {
    const propertyWorkOrders = mockWorkOrders.filter(wo => wo.propertyId === property.id);
    const workOrderCount = propertyWorkOrders.length;
    
    // Calculate health score based on various factors
    const completedWorkOrders = propertyWorkOrders.filter(wo => wo.status === 'Completed').length;
    const completionRate = workOrderCount > 0 ? (completedWorkOrders / workOrderCount) * 100 : 100;
    const maintenanceScore = Math.max(0, 100 - (workOrderCount - 3) * 10);
    const healthScore = Math.round((completionRate * 0.6 + maintenanceScore * 0.4));
    
    // Mock compliance and revenue data
    const complianceScore = Math.round(75 + Math.random() * 25);
    const revenue = Math.round(50000 + Math.random() * 150000);
    
    return {
      property,
      workOrderCount,
      healthScore: Math.min(100, Math.max(0, healthScore)),
      complianceScore,
      revenue
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Overview</h2>
          <p className="text-muted-foreground">
            Monitor the health and performance of all your properties
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {mockProperties.length} Properties
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyMetrics.map(({ property, workOrderCount, healthScore, complianceScore, revenue }) => (
          <PropertyCard
            key={property.id}
            property={property}
            workOrderCount={workOrderCount}
            healthScore={healthScore}
            complianceScore={complianceScore}
            revenue={revenue}
          />
        ))}
      </div>
    </div>
  );
}