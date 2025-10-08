import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { StatusRing, SemiCircularGauge } from "@/components/ui/enhanced-charts";

export function DueTodayWidget() {
  const navigate = useNavigate();
  
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  today.setHours(23, 59, 59, 999);
  yesterday.setHours(0, 0, 0, 0);
  
  // Work orders due today
  const dueToday = mockWorkOrders.filter(wo => {
    if (!wo.dueDate) return false;
    const dueDate = new Date(wo.dueDate);
    return dueDate.toDateString() === today.toDateString() && wo.status !== "Completed";
  });
  
  // Work orders completed yesterday
  const completedYesterday = mockWorkOrders.filter(wo => {
    if (!wo.completedDate) return false;
    const completedDate = new Date(wo.completedDate);
    return completedDate.toDateString() === yesterday.toDateString();
  });
  
  const overdueDueToday = dueToday.filter(wo => wo.priority === "Critical" || wo.priority === "High").length;
  const totalDueToday = dueToday.length;
  
  const handleClick = () => {
    navigate('/cases', { 
      state: { 
        filter: { 
          dueDate: 'today',
          status: ['Open', 'In Progress', 'On Hold']
        }
      }
    });
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5" />
          <span className="text-lg font-semibold">Due Today vs Yesterday</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Urgency Ring */}
        <div className="flex justify-center">
          <StatusRing 
            segments={[
              { value: totalDueToday, color: "hsl(var(--destructive))", label: "Due Today" },
              { value: completedYesterday.length, color: "hsl(var(--dashboard-complete))", label: "Completed Yesterday" }
            ]}
            size={100}
            centerContent={
              <div className="text-center">
                <div className="text-lg font-bold text-destructive">{totalDueToday}</div>
                <div className="text-xs text-muted-foreground">Due</div>
              </div>
            }
          />
        </div>

        {/* Performance Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-destructive/5 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Due Today</span>
            </div>
            <div className="text-2xl font-bold text-destructive">{totalDueToday}</div>
            {overdueDueToday > 0 && (
              <Badge variant="destructive" className="text-xs mt-1">
                {overdueDueToday} high priority
              </Badge>
            )}
          </div>
          
          <div className="text-center p-3 bg-dashboard-complete/5 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-dashboard-complete" />
              <span className="text-sm font-medium">Completed Yesterday</span>
            </div>
            <div className="text-2xl font-bold text-dashboard-complete">{completedYesterday.length}</div>
            <Badge 
              variant={completedYesterday.length > totalDueToday ? "default" : "secondary"} 
              className="text-xs mt-1"
            >
              {completedYesterday.length > totalDueToday ? 'Ahead' : 'Behind'} schedule
            </Badge>
          </div>
        </div>
        
        {/* Priority Items Preview */}
        {dueToday.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Today's Priority Items:</div>
            <div className="space-y-1">
              {dueToday.slice(0, 2).map((wo) => (
                <div key={wo.id} className="flex items-center justify-between p-2 bg-muted/10 rounded-lg">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{wo.title}</span>
                  </div>
                  <Badge 
                    variant={wo.priority === "Critical" ? "destructive" : wo.priority === "High" ? "secondary" : "outline"}
                    className="ml-2 text-xs"
                  >
                    {wo.priority}
                  </Badge>
                </div>
              ))}
              {dueToday.length > 2 && (
                <div className="text-xs text-muted-foreground text-center">
                  ...and {dueToday.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}