import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, ArrowRight } from "lucide-react";
import { mockAssets } from "@/data/mockData";
import { useState } from "react";

interface WarrantyExpiryWidgetProps {
  onClick: () => void;
}

export function WarrantyExpiryWidget({ onClick }: WarrantyExpiryWidgetProps) {
  const [warrantyFilter, setWarrantyFilter] = useState("3months");
  const today = new Date();
  
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
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-base">Warranty Expiry</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Expiring Assets</span>
          <Select value={warrantyFilter} onValueChange={setWarrantyFilter}>
            <SelectTrigger className="w-20 h-6 text-xs">
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
        
        <div className="p-2 bg-warning/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-warning">{warrantyExpiringAssets.length}</div>
              <span className="text-sm">assets</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {warrantyFilter.replace("months", "M").replace("month", "M").replace("year", "Y")}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Plan warranty renewals or replacements
          </div>
        </div>
      </CardContent>
    </Card>
  );
}