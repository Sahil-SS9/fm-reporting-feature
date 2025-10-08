import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDocuments } from "@/data/mockData";
import { useState } from "react";
import { format } from "date-fns";

export function DocumentsExpiringWidget() {
  const navigate = useNavigate();
  const [expiryFilter, setExpiryFilter] = useState("30days");
  const [showTable, setShowTable] = useState(false);
  const today = new Date();
  
  // Expiry filter period
  const getExpiryPeriod = (filter: string) => {
    const days = filter === "7days" ? 7 : filter === "30days" ? 30 : filter === "60days" ? 60 : 90;
    return new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  };
  
  const expiringDocuments = mockDocuments.filter(doc => {
    if (!doc.expires) return false;
    const expiryDate = new Date(doc.expires);
    return expiryDate <= getExpiryPeriod(expiryFilter) && expiryDate >= today;
  });
  
  const handleClick = () => {
    navigate('/documentation', { 
      state: { 
        filter: { expiry: 'upcoming' }
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
            <span className="text-base">Documents Expiring</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Expiring Documents</span>
          <div onClick={(e) => e.stopPropagation()}>
            <Select 
              value={expiryFilter} 
              onValueChange={(value) => {
                setExpiryFilter(value);
                setShowTable(false);
              }}
            >
              <SelectTrigger className="w-20 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7D</SelectItem>
                <SelectItem value="30days">30D</SelectItem>
                <SelectItem value="60days">60D</SelectItem>
                <SelectItem value="90days">90D</SelectItem>
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
              <div className="text-lg font-bold text-warning">{expiringDocuments.length}</div>
              <span className="text-sm">documents</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {expiryFilter.replace("days", "D")}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Review and renew expiring documents
          </div>
        </div>

        {/* Data Table */}
        {showTable && expiringDocuments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">
                Expiring Documents ({expiringDocuments.length})
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
                    <TableHead className="text-xs">Document Name</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringDocuments.slice(0, 10).map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="text-xs">{doc.name}</TableCell>
                      <TableCell className="text-xs">{doc.type}</TableCell>
                      <TableCell className="text-xs">
                        {doc.expires 
                          ? format(new Date(doc.expires), "MMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {expiringDocuments.length > 10 && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                Showing 10 of {expiringDocuments.length} items
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
