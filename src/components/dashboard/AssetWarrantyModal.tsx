import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  warrantyExpirationDate?: string;
  propertyId: string;
}

interface AssetWarrantyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  assets: Asset[];
  type: "expiring" | "expired";
}

export function AssetWarrantyModal({ open, onOpenChange, title, assets, type }: AssetWarrantyModalProps) {
  const handleExport = () => {
    // Create CSV content
    const headers = ["Asset ID", "Asset Name", "Type", "Location", "Warranty Date", "Status"];
    const rows = assets.map(asset => [
      asset.id,
      asset.name,
      asset.type,
      asset.location,
      asset.warrantyExpirationDate ? format(new Date(asset.warrantyExpirationDate), "MMM dd, yyyy") : "N/A",
      type === "expired" ? "Expired" : "Expiring"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `warranty_${type}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (warrantyDate: string | undefined) => {
    if (!warrantyDate) return <Badge variant="outline">No Warranty</Badge>;
    
    const date = new Date(warrantyDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="destructive">Expiring Soon</Badge>;
    } else if (daysUntilExpiry <= 90) {
      return <Badge variant="outline" className="border-warning text-warning">Expiring</Badge>;
    } else {
      return <Badge variant="outline">Active</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {assets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No assets found</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Warranty Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.id}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        {asset.warrantyExpirationDate 
                          ? format(new Date(asset.warrantyExpirationDate), "MMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.warrantyExpirationDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
