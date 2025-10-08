import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Calendar, AlertCircle, ArrowRight, Wrench, Clock, TrendingUp, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets, mockWorkOrders } from "@/data/mockData";
import { DonutChartWithCenter, RadialProgress, VerticalBarChart } from "@/components/ui/enhanced-charts";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EnhancedAssetMaintenanceWidget() {
  const navigate = useNavigate();
  const [warrantyFilter, setWarrantyFilter] = useState("3months");
  const today = new Date();
  
  // Enhanced asset status breakdown
  const assetStatusBreakdown = {
    operational: mockAssets.filter(asset => asset.status === "Operational").length,
    pendingRepair: mockAssets.filter(asset => asset.status === "Pending Repair").length,
    outOfService: mockAssets.filter(asset => asset.status === "Out of Service").length,
    missing: mockAssets.filter(asset => asset.status === "Missing").length
  };
  
  // Out of service duration analysis (mock enhanced data)
  const outOfServiceAssets = mockAssets.filter(asset => asset.status === "Out of Service").map(asset => ({
    ...asset,
    outOfServiceDays: Math.floor(Math.random() * 45) + 1 // Mock duration data
  }));
  
  const urgentOutOfService = outOfServiceAssets.filter(asset => asset.outOfServiceDays > 30);
  
  // Warranty expiry analysis
  const getWarrantyPeriod = (months: string) => {
    const monthsNum = months === "1month" ? 1 : months === "3months" ? 3 : months === "6months" ? 6 : 12;
    return new Date(today.getTime() + monthsNum * 30 * 24 * 60 * 60 * 1000);
  };
  
  const warrantyExpiringAssets = mockAssets.filter(asset => {
    if (!asset.warrantyExpirationDate) return false;
    const warrantyDate = new Date(asset.warrantyExpirationDate);
    return warrantyDate <= getWarrantyPeriod(warrantyFilter) && warrantyDate >= today;
  });
  
  // Top 5 assets by work order volume (mock enhanced data)
  const assetWorkOrderCounts = mockAssets.map(asset => {
    const workOrderCount = mockWorkOrders.filter(wo => wo.title.includes(asset.name) || wo.description.includes(asset.name)).length;
    return {
      name: asset.name.length > 15 ? asset.name.substring(0, 15) + "..." : asset.name,
      value: workOrderCount + Math.floor(Math.random() * 8) // Enhanced mock data
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);
  
  // Preventive maintenance tracking (separate from inspections)
  const preventiveMaintenanceDue = mockAssets.filter(asset => {
    // Mock preventive maintenance logic (separate from inspections)
    return asset.status === "Operational" && Math.random() > 0.7; // Mock 30% due for PM
  });
  
  const statusData = [
    { name: "Operational", value: assetStatusBreakdown.operational, color: "hsl(var(--success))" },
    { name: "Pending Repair", value: assetStatusBreakdown.pendingRepair, color: "hsl(var(--warning))" },
    { name: "Out of Service", value: assetStatusBreakdown.outOfService, color: "hsl(var(--destructive))" },
    { name: "Missing", value: assetStatusBreakdown.missing, color: "hsl(var(--muted-foreground))" }
  ].filter(status => status.value > 0);
  
  const totalAssets = mockAssets.length;
  const healthScore = Math.round((assetStatusBreakdown.operational / totalAssets) * 100);
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { 
          status: 'maintenance-dashboard',
          showOutOfService: urgentOutOfService.length > 0,
          warrantyExpiring: warrantyExpiringAssets.length > 0
        }
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
            <Settings className="h-5 w-5 text-primary" />
            <span>Asset Management</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {healthScore}% Health
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Asset Status Overview */}
        <div className="flex justify-center">
          <DonutChartWithCenter 
            data={statusData}
            size={120}
            strokeWidth={16}
            centerContent={
              <div className="text-center">
                <div className="text-2xl font-bold">{totalAssets}</div>
                <div className="text-xs text-muted-foreground">Total Assets</div>
              </div>
            }
          />
        </div>

        {/* Status Legend with Counts */}
        <div className="grid grid-cols-2 gap-2">
          {statusData.map((status) => (
            <div key={status.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/10">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm">{status.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {status.value}
              </Badge>
            </div>
          ))}
        </div>
        
        {/* Out of Service Alert */}
        {urgentOutOfService.length > 0 && (
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Urgent: {">"}30 Days Out of Service</span>
              </div>
              <Badge variant="destructive" className="text-xs">
                {urgentOutOfService.length}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Requires immediate attention to restore operations
            </div>
          </div>
        )}
        
        {/* Warranty Expiry Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Warranty Expiring</span>
            <Select value={warrantyFilter} onValueChange={setWarrantyFilter}>
              <SelectTrigger className="w-24 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1M</SelectItem>
                <SelectItem value="3months">3M</SelectItem>
                <SelectItem value="6months">6M</SelectItem>
                <SelectItem value="1year">1Y</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm">{warrantyExpiringAssets.length} assets</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {warrantyFilter.replace("months", "M").replace("month", "M").replace("year", "Y")}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Plan warranty renewals or replacements
            </div>
          </div>
        </div>

        {/* Preventive Maintenance */}
        <div className="p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Preventive Maintenance</span>
            </div>
            <RadialProgress 
              value={(preventiveMaintenanceDue.length / totalAssets) * 100} 
              size={40}
              color="hsl(var(--primary))"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {preventiveMaintenanceDue.length} assets due for scheduled maintenance
          </div>
        </div>
        
        {/* Top 5 Assets by Ticket Volume - Enhanced Display */}
        <div className="space-y-4 p-4 bg-warning/5 rounded-lg border border-warning/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Top Assets by Tickets</span>
            </div>
            <Badge variant="outline" className="text-xs">
              High Maintenance
            </Badge>
          </div>
          
          {/* Enhanced Bar Chart with More Space */}
          <VerticalBarChart 
            data={assetWorkOrderCounts}
            height={140}
            color="hsl(var(--warning))"
          />
          
          {/* Asset List with Details */}
          <div className="space-y-2">
            {assetWorkOrderCounts.slice(0, 3).map((asset, index) => (
              <div key={asset.name} className="flex items-center justify-between p-2 bg-background/50 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm">{asset.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {asset.value} tickets
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}