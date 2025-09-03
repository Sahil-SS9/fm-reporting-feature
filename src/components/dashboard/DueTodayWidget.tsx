import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";

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
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Due Today</span>
              {overdueDueToday > 0 && (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="text-3xl font-bold">{totalDueToday}</div>
            {overdueDueToday > 0 && (
              <Badge variant="destructive" className="text-xs">
                {overdueDueToday} high priority
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed Yesterday</span>
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">{completedYesterday.length}</div>
            <Badge variant="default" className="text-xs">
              {completedYesterday.length > totalDueToday ? 'Ahead' : 'Behind'} schedule
            </Badge>
          </div>
        </div>
        
        {dueToday.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">Today's Priority Items:</h4>
            <div className="space-y-1">
              {dueToday.slice(0, 2).map((wo) => (
                <div key={wo.id} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1">{wo.title}</span>
                  <Badge 
                    variant={wo.priority === "Critical" ? "destructive" : wo.priority === "High" ? "secondary" : "outline"}
                    className="ml-2 text-xs"
                  >
                    {wo.priority}
                  </Badge>
                </div>
              ))}
              {dueToday.length > 2 && (
                <div className="text-xs text-muted-foreground">
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