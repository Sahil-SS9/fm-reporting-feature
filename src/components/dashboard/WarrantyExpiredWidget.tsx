import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { mockAssets } from "@/data/mockData";

interface WarrantyExpiredWidgetProps {
  onClick: () => void;
}

export function WarrantyExpiredWidget({ onClick }: WarrantyExpiredWidgetProps) {
  const today = new Date();
  
  // Find assets with expired warranties
  const expiredWarrantyAssets = mockAssets.filter(asset => {
    if (!asset.warrantyExpirationDate) return false;
    const warrantyDate = new Date(asset.warrantyExpirationDate);
    return warrantyDate < today;
  });
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-base">Warranty Expired</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Expired Assets</span>
        </div>
        
        <div className="p-2 bg-destructive/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-destructive">{expiredWarrantyAssets.length}</div>
              <span className="text-sm">assets</span>
            </div>
            <Badge variant="destructive" className="text-xs">
              Expired
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Warranties that have already expired
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
