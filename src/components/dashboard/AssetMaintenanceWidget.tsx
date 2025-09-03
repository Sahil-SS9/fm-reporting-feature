import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Settings, Calendar, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
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
      <CardContent className="space-y-4">
        {totalUpcoming === 0 ? (
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-muted-foreground mb-2">0</div>
            <p className="text-sm text-muted-foreground">No maintenance due in next 90 days</p>
          </div>
        ) : (
          <>
            {/* Overdue Items */}
            {overdue.length > 0 && (
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Overdue</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {overdue.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {overdue.slice(0, 2).map(asset => (
                    <div key={asset.id} className="text-xs text-muted-foreground">
                      {asset.name} - {asset.type}
                    </div>
                  ))}
                  {overdue.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{overdue.length - 2} more overdue
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 30/60/90 Day Schedule */}
            <div className="space-y-3">
              {/* Next 30 Days */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Next 30 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={due30Days.length > 0 ? Math.min((due30Days.length / 5) * 100, 100) : 0} 
                    className="w-16 h-2" 
                  />
                  <Badge variant={due30Days.length > 3 ? "destructive" : "outline"} className="text-xs min-w-[2rem]">
                    {due30Days.length}
                  </Badge>
                </div>
              </div>
              
              {/* Next 60 Days */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">31-60 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={due60Days.length > 0 ? Math.min((due60Days.length / 5) * 100, 100) : 0} 
                    className="w-16 h-2" 
                  />
                  <Badge variant="outline" className="text-xs min-w-[2rem]">
                    {due60Days.length}
                  </Badge>
                </div>
              </div>
              
              {/* Next 90 Days */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">61-90 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={due90Days.length > 0 ? Math.min((due90Days.length / 5) * 100, 100) : 0} 
                    className="w-16 h-2" 
                  />
                  <Badge variant="secondary" className="text-xs min-w-[2rem]">
                    {due90Days.length}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Upcoming Items Preview */}
            {due30Days.length > 0 && (
              <div className="pt-2 border-t">
                <div className="text-xs font-medium text-muted-foreground mb-2">Next Due:</div>
                {due30Days.slice(0, 2).map(asset => (
                  <div key={asset.id} className="flex justify-between text-xs mb-1">
                    <span className="truncate">{asset.name}</span>
                    <span className="text-muted-foreground ml-2">
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