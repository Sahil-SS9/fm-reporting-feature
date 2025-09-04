import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Calendar, AlertCircle, ArrowRight, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { SemiCircularGauge, RadialProgress, StatusRing } from "@/components/ui/enhanced-charts";
import { cn } from "@/lib/utils";

export function AssetMaintenanceWidget() {
  const navigate = useNavigate();
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  
  // Filter assets with upcoming maintenance
  const assetsWithMaintenance = mockAssets.filter(asset => 
    asset.nextInspection && asset.status === "Operational"
  );
  
  const due30Days = assetsWithMaintenance.filter(asset => {
    const nextInspection = new Date(asset.nextInspection!);
    return nextInspection <= thirtyDaysFromNow && nextInspection >= today;
  });
  
  const due60Days = assetsWithMaintenance.filter(asset => {
    const nextInspection = new Date(asset.nextInspection!);
    return nextInspection <= sixtyDaysFromNow && nextInspection > thirtyDaysFromNow;
  });
  
  const due90Days = assetsWithMaintenance.filter(asset => {
    const nextInspection = new Date(asset.nextInspection!);
    return nextInspection <= ninetyDaysFromNow && nextInspection > sixtyDaysFromNow;
  });
  
  const overdue = assetsWithMaintenance.filter(asset => {
    const nextInspection = new Date(asset.nextInspection!);
    return nextInspection < today;
  });
  
  const totalUpcoming = due30Days.length + due60Days.length + due90Days.length + overdue.length;
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { status: 'maintenance-due', upcoming: true }
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
            <span>Asset Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={totalUpcoming > 0 ? "outline" : "secondary"} className="text-xs">
              {totalUpcoming} Due
            </Badge>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalUpcoming === 0 ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <RadialProgress 
                value={100} 
                size={80}
                color="hsl(var(--dashboard-complete))"
                label="All Current"
              />
            </div>
            <p className="text-sm text-muted-foreground">No maintenance due in next 90 days</p>
          </div>
        ) : (
          <>
            {/* Main Maintenance Overview */}
            <div className="flex justify-center">
              <StatusRing 
                segments={[
                  ...(overdue.length > 0 ? [{ value: overdue.length, color: "hsl(var(--destructive))", label: "Overdue" }] : []),
                  { value: due30Days.length, color: "hsl(var(--warning))", label: "30 Days" },
                  { value: due60Days.length, color: "hsl(var(--dashboard-medium))", label: "60 Days" },
                  { value: due90Days.length, color: "hsl(var(--dashboard-low))", label: "90 Days" }
                ].filter(segment => segment.value > 0)}
                size={100}
                centerContent={
                  <div className="text-center">
                    <div className="text-lg font-bold">{totalUpcoming}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                }
              />
            </div>

            {/* Overdue Alert */}
            {overdue.length > 0 && (
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Overdue Maintenance</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {overdue.length}
                  </Badge>
                </div>
              </div>
            )}
            
            {/* Schedule Breakdown with Gauges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <RadialProgress 
                  value={Math.min((due30Days.length / 5) * 100, 100)} 
                  size={60}
                  color="hsl(var(--warning))"
                />
                <div className="text-sm font-semibold mt-1">{due30Days.length}</div>
                <div className="text-xs text-muted-foreground">30 Days</div>
              </div>
              
              <div className="text-center">
                <RadialProgress 
                  value={Math.min((due60Days.length / 5) * 100, 100)} 
                  size={60}
                  color="hsl(var(--dashboard-medium))"
                />
                <div className="text-sm font-semibold mt-1">{due60Days.length}</div>
                <div className="text-xs text-muted-foreground">60 Days</div>
              </div>
              
              <div className="text-center">
                <RadialProgress 
                  value={Math.min((due90Days.length / 5) * 100, 100)} 
                  size={60}
                  color="hsl(var(--dashboard-low))"
                />
                <div className="text-sm font-semibold mt-1">{due90Days.length}</div>
                <div className="text-xs text-muted-foreground">90 Days</div>
              </div>
            </div>
            
            {/* Next Due Preview */}
            {due30Days.length > 0 && (
              <div className="p-3 bg-muted/10 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">Next Due:</div>
                {due30Days.slice(0, 2).map(asset => (
                  <div key={asset.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm truncate">{asset.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(asset.nextInspection!).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}