import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, CheckCircle, TrendingUp, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockInvoices, mockProperties } from "@/data/mockData";
import { useState } from "react";

export function IssuedInvoicesWidget() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter invoices by payment status
  const paidInvoices = mockInvoices.filter(inv => inv.paymentStatus === "Paid");
  const issuedInvoices = mockInvoices.filter(inv => 
    inv.paymentStatus === "Paid" || inv.paymentStatus === "Outstanding" || inv.paymentStatus === "Overdue"
  );
  
  // Filter invoices based on search term
  const filteredInvoices = issuedInvoices.filter(invoice =>
    invoice.contractorTenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mockProperties.find(p => p.id === invoice.propertyId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate totals
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalIssuedAmount = issuedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const handleClick = () => {
    navigate('/reporting', { 
      state: { 
        reportType: 'invoices',
        filter: { paymentStatus: ['Paid', 'Outstanding', 'Overdue'] }
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
            <Receipt className="h-5 w-5 text-primary" />
            <span>Issued Invoices</span>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Issued Invoices Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search by property, invoice number, or contractor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Invoice Number</TableHead>
                          <TableHead>Contractor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => {
                          const property = mockProperties.find(p => p.id === invoice.propertyId);
                          return (
                            <TableRow key={invoice.id}>
                              <TableCell>{property?.name || "Unknown Property"}</TableCell>
                              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                              <TableCell>{invoice.contractorTenant}</TableCell>
                              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                              <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant={invoice.paymentStatus === "Paid" ? "secondary" : "outline"}>
                                  {invoice.paymentStatus}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {filteredInvoices.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No issued invoices found matching your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="secondary" className="text-xs">
              {issuedInvoices.length} Total
            </Badge>
            
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Issued Amount */}
        <div className="text-center pb-4 border-b">
          <div className="text-3xl font-bold text-primary mb-1">
            {formatCurrency(totalIssuedAmount)}
          </div>
          <div className="text-sm text-muted-foreground">Total Issued</div>
        </div>
        
        {/* Breakdown by Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-medium text-green-700">Paid</div>
                <div className="text-xs text-muted-foreground">
                  {paidInvoices.length} invoice{paidInvoices.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(paidAmount)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-blue-700">Outstanding</div>
                <div className="text-xs text-muted-foreground">
                  {issuedInvoices.length - paidInvoices.length} invoice{(issuedInvoices.length - paidInvoices.length) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(totalIssuedAmount - paidAmount)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Issued Invoices */}
        <div className="pt-2 border-t">
          <div className="text-xs font-medium text-muted-foreground mb-2">Recent Invoices:</div>
          <div className="space-y-2">
            {issuedInvoices.slice(0, 3).map(invoice => (
              <div key={invoice.id} className="flex justify-between items-center text-xs">
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{invoice.contractorTenant}</div>
                  <div className="text-muted-foreground">
                    Issued: {new Date(invoice.dateIssued).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                  <Badge 
                    variant={invoice.paymentStatus === "Paid" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {invoice.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}