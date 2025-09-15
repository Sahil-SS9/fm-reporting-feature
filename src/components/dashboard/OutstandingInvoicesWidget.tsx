import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, AlertCircle, TrendingUp, Eye, Search } from "lucide-react";
import { mockInvoices } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

export function OutstandingInvoicesWidget() {
  const [dateFilter, setDateFilter] = useState("last30days");
  const [searchTerm, setSearchTerm] = useState("");
  // Date filtering function
  const filterByDate = (invoices: any[]) => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateFilter) {
      case "last7days":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "last30days":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "thismonth":
        filterDate.setDate(1);
        break;
      case "lastmonth":
        filterDate.setMonth(now.getMonth() - 1, 1);
        break;
      case "last3months":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "last6months":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      default:
        filterDate.setDate(now.getDate() - 30);
    }
    
    return invoices.filter(inv => new Date(inv.dateIssued) >= filterDate);
  };

  // Filter invoices by payment status and date
  const allInvoices = filterByDate(mockInvoices);
  const outstandingInvoices = allInvoices.filter(inv => inv.paymentStatus === "Outstanding");
  const overdueInvoices = allInvoices.filter(inv => inv.paymentStatus === "Overdue");
  
  // Calculate totals
  const outstandingAmount = outstandingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalAmount = outstandingAmount + overdueAmount;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Search and filter for modal
  const filteredInvoices = useMemo(() => {
    const allOutstanding = [...overdueInvoices, ...outstandingInvoices];
    if (!searchTerm) return allOutstanding;
    
    return allOutstanding.filter(invoice => 
      invoice.contractorTenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [overdueInvoices, outstandingInvoices, searchTerm]);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Outstanding Invoices</span>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="thismonth">This Month</SelectItem>
                <SelectItem value="lastmonth">Last Month</SelectItem>
                <SelectItem value="last3months">Last 3 months</SelectItem>
                <SelectItem value="last6months">Last 6 months</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Outstanding Invoices Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice Number</TableHead>
                          <TableHead>Contractor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.contractorTenant}</TableCell>
                            <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                            <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={invoice.paymentStatus === "Overdue" ? "destructive" : "outline"}>
                                {invoice.paymentStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {totalAmount > 0 ? (
              <Badge variant={overdueAmount > 0 ? "destructive" : "outline"} className="text-xs">
                {outstandingInvoices.length + overdueInvoices.length} Outstanding
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                All Settled
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalAmount === 0 ? (
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-green-600 mb-2">£0</div>
            <p className="text-sm text-muted-foreground">All invoices are up to date</p>
          </div>
        ) : (
          <>
            {/* Total Outstanding Amount */}
            <div className="text-center pb-4 border-b">
              <div className="text-3xl font-bold text-primary mb-1">
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-sm text-muted-foreground">Total Outstanding</div>
            </div>
            
            {/* Breakdown by Status */}
            <div className="space-y-3">
              {overdueAmount > 0 && (
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <div>
                      <div className="text-sm font-medium text-destructive">Overdue</div>
                      <div className="text-xs text-muted-foreground">
                        {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-destructive">
                      {formatCurrency(overdueAmount)}
                    </div>
                  </div>
                </div>
              )}
              
              {outstandingAmount > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-sm font-medium text-orange-700">Outstanding</div>
                      <div className="text-xs text-muted-foreground">
                        {outstandingInvoices.length} invoice{outstandingInvoices.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-700">
                      {formatCurrency(outstandingAmount)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recent Outstanding Invoices */}
            <div className="pt-2 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2">Recent Outstanding:</div>
              <div className="space-y-2">
                {[...overdueInvoices, ...outstandingInvoices].slice(0, 3).map(invoice => (
                  <div key={invoice.id} className="flex justify-between items-center text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{invoice.contractorTenant}</div>
                      <div className="text-muted-foreground">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                      <Badge 
                        variant={invoice.paymentStatus === "Overdue" ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {invoice.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}