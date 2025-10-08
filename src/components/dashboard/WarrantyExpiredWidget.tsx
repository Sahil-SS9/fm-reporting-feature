import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { useState } from "react";
import { format } from "date-fns";

export function WarrantyExpiredWidget() {
  const navigate = useNavigate();
  const today = new Date();
  const [showTable, setShowTable] = useState(false);
  
  // Find assets with expired warranties
  const expiredWarrantyAssets = mockAssets.filter(asset => {
    if (!asset.warrantyExpirationDate) return false;
    const warrantyDate = new Date(asset.warrantyExpirationDate);
    return warrantyDate < today;
  });
  
  const handleClick = () => {
    navigate('/assets', { 
      state: { 
        filter: { warrantyExpired: true }
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
        
        <div 
          className="p-2 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer"
          onClick={handleCardClick}
        >
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

        {/* Data Table */}
        {showTable && expiredWarrantyAssets.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">
                Expired Assets ({expiredWarrantyAssets.length})
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
                  {expiredWarrantyAssets.slice(0, 10).map((asset) => (
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
            
            {expiredWarrantyAssets.length > 10 && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                Showing 10 of {expiredWarrantyAssets.length} items
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
