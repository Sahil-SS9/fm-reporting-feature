import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDocuments } from "@/data/mockData";
import { useState } from "react";
import { format } from "date-fns";

export function DocumentsExpiredWidget() {
  const navigate = useNavigate();
  const today = new Date();
  const [showTable, setShowTable] = useState(false);
  
  // Find documents with expired dates
  const expiredDocuments = mockDocuments.filter(doc => {
    if (!doc.expires) return false;
    const expiryDate = new Date(doc.expires);
    return expiryDate < today;
  });
  
  const handleClick = () => {
    navigate('/documentation', { 
      state: { 
        filter: { expired: true }
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
            <span className="text-base">Documents Expired</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Expired Documents</span>
        </div>
        
        <div 
          className="p-2 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-destructive">{expiredDocuments.length}</div>
              <span className="text-sm">documents</span>
            </div>
            <Badge variant="destructive" className="text-xs">
              Expired
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Documents that have already expired
          </div>
        </div>

        {/* Data Table */}
        {showTable && expiredDocuments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">
                Expired Documents ({expiredDocuments.length})
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
                  {expiredDocuments.slice(0, 10).map((doc) => (
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
            
            {expiredDocuments.length > 10 && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                Showing 10 of {expiredDocuments.length} items
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
