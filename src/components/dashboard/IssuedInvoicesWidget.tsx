import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, CheckCircle, TrendingUp, ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockInvoices } from "@/data/mockData";
import { Button } from "@/components/ui/button";

export function IssuedInvoicesWidget() {
  const navigate = useNavigate();
  // Filter invoices by payment status
  const paidInvoices = mockInvoices.filter(inv => inv.paymentStatus === "Paid");
  const issuedInvoices = mockInvoices.filter(inv => 
    inv.paymentStatus === "Paid" || inv.paymentStatus === "Outstanding" || inv.paymentStatus === "Overdue"
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
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
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
            <Button
              variant="ghost" 
              size="sm"
              onClick={handleViewDetails}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Badge variant="secondary" className="text-xs">
              {issuedInvoices.length} Total
            </Badge>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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