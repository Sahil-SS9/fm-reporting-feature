import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { useState } from "react";
import { format } from "date-fns";

export function WarrantyExpiryWidget() {
  const navigate = useNavigate();
  const [warrantyFilter, setWarrantyFilter] = useState("3months");
  const [showTable, setShowTable] = useState(false);
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
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { warrantyExpiring: true }
      }
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTable(!showTable);
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group" 
      onClick={handleClick}
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
          <div onClick={(e) => e.stopPropagation()}>
            <Select 
              value={warrantyFilter} 
              onValueChange={(value) => {
                setWarrantyFilter(value);
                setShowTable(false);
              }}
            >
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
        </div>
        
        <div 
          className="p-2 bg-warning/10 rounded-lg hover:bg-warning/20 transition-colors cursor-pointer"
          onClick={handleCardClick}
        >
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

        {/* Data Table */}
        {showTable && warrantyExpiringAssets.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">
                Expiring Assets ({warrantyExpiringAssets.length})
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTable(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Asset Name</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Location</TableHead>
                    <TableHead className="text-xs">Warranty Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warrantyExpiringAssets.slice(0, 10).map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-xs">{asset.name}</TableCell>
                      <TableCell className="text-xs">{asset.type}</TableCell>
                      <TableCell className="text-xs">{asset.location}</TableCell>
                      <TableCell className="text-xs">
                        {asset.warrantyExpirationDate 
                          ? format(new Date(asset.warrantyExpirationDate), "MMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {warrantyExpiringAssets.length > 10 && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                Showing 10 of {warrantyExpiringAssets.length} items
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}