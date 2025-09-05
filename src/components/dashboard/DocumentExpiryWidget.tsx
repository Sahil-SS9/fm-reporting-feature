import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDocuments } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function DocumentExpiryWidget() {
  const navigate = useNavigate();
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  // Filter documents with expiry dates
  const documentsWithExpiry = mockDocuments.filter(doc => doc.expires);
  
  // Categorize by expiry urgency
  const expiredDocuments = documentsWithExpiry.filter(doc => {
    const expiryDate = new Date(doc.expires!);
    return expiryDate < today;
  });
  
  const expiringIn7Days = documentsWithExpiry.filter(doc => {
    const expiryDate = new Date(doc.expires!);
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return expiryDate >= today && expiryDate <= sevenDaysFromNow;
  });
  
  const expiringIn30Days = documentsWithExpiry.filter(doc => {
    const expiryDate = new Date(doc.expires!);
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return expiryDate > sevenDaysFromNow && expiryDate <= thirtyDaysFromNow;
  });
  
  const totalExpiringDocuments = expiredDocuments.length + expiringIn7Days.length + expiringIn30Days.length;
  
  // Helper function to get days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const handleClick = () => {
    navigate('/documentation', { 
      state: { 
        filter: { expiry: 'upcoming', expired: true }
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
            <FileText className="h-5 w-5 text-primary" />
            <span>Document Expiry</span>
          </div>
          <div className="flex items-center space-x-2">
            {totalExpiringDocuments > 0 ? (
              <Badge 
                variant={expiredDocuments.length > 0 || expiringIn7Days.length > 0 ? "destructive" : "outline"} 
                className="text-xs"
              >
                {totalExpiringDocuments} Expiring
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                All Current
              </Badge>
            )}
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {totalExpiringDocuments === 0 ? (
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-green-600 mb-2">0</div>
            <p className="text-sm text-muted-foreground">No documents expiring in next 30 days</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-1 text-center">
              {expiredDocuments.length > 0 && (
                <div className="p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="text-lg font-bold text-destructive">{expiredDocuments.length}</div>
                  <div className="text-xs text-muted-foreground">Expired</div>
                </div>
              )}
              {expiringIn7Days.length > 0 && (
                <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-lg font-bold text-orange-600">{expiringIn7Days.length}</div>
                  <div className="text-xs text-muted-foreground">7 Days</div>
                </div>
              )}
              {expiringIn30Days.length > 0 && (
                <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-lg font-bold text-yellow-600">{expiringIn30Days.length}</div>
                  <div className="text-xs text-muted-foreground">30 Days</div>
                </div>
              )}
            </div>
            
            {/* Critical Expired Documents */}
            {expiredDocuments.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Expired Documents</span>
                </div>
                {expiredDocuments.slice(0, 2).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-destructive/5 rounded-lg border border-destructive/20">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.type}</div>
                    </div>
                    <Badge variant="destructive" className="text-xs ml-2">
                      {Math.abs(getDaysUntilExpiry(doc.expires!))}d overdue
                    </Badge>
                  </div>
                ))}
                {expiredDocuments.length > 2 && (
                  <div className="text-xs text-center text-muted-foreground">
                    +{expiredDocuments.length - 2} more expired
                  </div>
                )}
              </div>
            )}
            
            {/* Upcoming Expiries */}
            {(expiringIn7Days.length > 0 || expiringIn30Days.length > 0) && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm font-medium text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>Upcoming Expiries</span>
                </div>
                
                {/* Show most urgent first */}
                {[...expiringIn7Days, ...expiringIn30Days]
                  .sort((a, b) => getDaysUntilExpiry(a.expires!) - getDaysUntilExpiry(b.expires!))
                  .slice(0, 3)
                  .map(doc => {
                    const daysUntilExpiry = getDaysUntilExpiry(doc.expires!);
                    const isUrgent = daysUntilExpiry <= 7;
                    
                    return (
                      <div 
                        key={doc.id} 
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg border",
                          isUrgent 
                            ? "bg-orange-50 border-orange-200" 
                            : "bg-yellow-50 border-yellow-200"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doc.type} • Expires {new Date(doc.expires!).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge 
                          variant={isUrgent ? "destructive" : "outline"} 
                          className="text-xs ml-2"
                        >
                          {daysUntilExpiry}d
                        </Badge>
                      </div>
                    );
                  })}
                
                {(expiringIn7Days.length + expiringIn30Days.length) > 3 && (
                  <div className="text-xs text-center text-muted-foreground">
                    +{(expiringIn7Days.length + expiringIn30Days.length) - 3} more expiring
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}