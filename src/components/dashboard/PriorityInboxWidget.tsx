import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Wrench
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { calculateUrgencyScore, getPriorityInboxItems } from "@/lib/kpi-calculations";

export function PriorityInboxWidget() {
  const navigate = useNavigate();
  
  const priorityItems = getPriorityInboxItems(mockWorkOrders);
  const topCritical = priorityItems.slice(0, 5);
  
  const handleItemClick = (itemId: string) => {
    navigate('/cases', { 
      state: { 
        filter: { workOrderId: itemId }
      }
    });
  };

  const handleViewAll = () => {
    navigate('/cases', { 
      state: { 
        filter: { 
          priority: ['Critical', 'High'],
          status: ['Open', 'In Progress', 'On Hold']
        }
      }
    });
  };

  const getUrgencyBadge = (score: number) => {
    if (score >= 9) return { variant: "destructive" as const, label: "CRITICAL", icon: AlertTriangle };
    if (score >= 7) return { variant: "secondary" as const, label: "HIGH", icon: Clock };
    return { variant: "outline" as const, label: "MEDIUM", icon: CheckCircle2 };
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-dashboard-critical" />
          <span className="text-lg font-semibold">Priority Inbox</span>
        </CardTitle>
        <Badge variant="destructive" className="text-xs">
          {priorityItems.length} items
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Morning Briefing Summary */}
        <div className="p-3 bg-dashboard-critical/5 rounded-lg border border-dashboard-critical/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-dashboard-critical" />
              <span className="text-sm font-medium">Morning Briefing</span>
            </div>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <p className="text-sm text-foreground">
            {topCritical.filter(item => item.urgencyScore >= 9).length} critical items need immediate attention.
            {topCritical.filter(item => item.isPropertyImpacting).length > 0 && 
              ` ${topCritical.filter(item => item.isPropertyImpacting).length} items affecting tenant operations.`
            }
          </p>
        </div>

        {/* Priority Items List */}
        <div className="space-y-3">
          {topCritical.map((item) => {
            const urgencyBadge = getUrgencyBadge(item.urgencyScore);
            const UrgencyIcon = urgencyBadge.icon;
            
            return (
              <div 
                key={item.id}
                className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <UrgencyIcon className="h-4 w-4 text-dashboard-critical flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{item.title}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.property}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Due {item.dueDate}</span>
                      </div>
                      {item.isPropertyImpacting && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>Tenant Impact</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={urgencyBadge.variant} className="text-xs">
                      {urgencyBadge.label}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Score: {item.urgencyScore}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="h-6 text-xs">
                    <Wrench className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Update
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleViewAll}
        >
          View All Priority Items ({priorityItems.length})
        </Button>
      </CardContent>
    </Card>
  );
}