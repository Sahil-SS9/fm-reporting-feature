import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SchedulingWidgetProps {
  filteredWorkOrders?: any[];
}

export function SchedulingWidget({ filteredWorkOrders = [] }: SchedulingWidgetProps) {
  const navigate = useNavigate();
  
  // Generate scheduled tasks from filtered work orders
  const today = new Date();
  const upcomingWorkOrders = filteredWorkOrders
    .filter(wo => wo.status === "In Progress" || wo.status === "Open")
    .map(wo => {
      const dueDate = new Date(wo.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let due = "";
      if (diffDays === 0) due = "Today";
      else if (diffDays === 1) due = "Tomorrow";
      else if (diffDays > 1) due = `${diffDays} days`;
      else due = "Overdue";
      
      return {
        id: wo.id,
        type: wo.category || "Work Order",
        title: wo.title,
        due,
        priority: wo.priority,
        status: diffDays < 0 ? "Overdue" : diffDays === 0 ? "Due" : "Scheduled"
      };
    })
    .sort((a, b) => {
      const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    })
    .slice(0, 4);
  
  const scheduledTasks = upcomingWorkOrders.length > 0 ? upcomingWorkOrders : [
    { id: 1, type: "Preventative Maintenance", title: "HVAC Quarterly Service", due: "Today", priority: "High", status: "Due" },
    { id: 2, type: "Compliance Audit", title: "Fire Safety Inspection", due: "Tomorrow", priority: "Critical", status: "Scheduled" },
    { id: 3, type: "Inspection", title: "Elevator Annual Check", due: "2 days", priority: "Medium", status: "Scheduled" },
    { id: 4, type: "Work Order", title: "Lighting Maintenance", due: "3 days", priority: "Low", status: "Scheduled" },
  ];

  const dueTodayCount = scheduledTasks.filter(task => task.due === "Today").length;
  const upcomingCount = scheduledTasks.filter(task => task.due !== "Today").length;

  const handleClick = () => {
    navigate('/scheduling', { 
      state: { 
        filter: { type: 'preventative_maintenance', dateRange: 'upcoming' }
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Due":
        return <AlertCircle className="h-3 w-3 text-dashboard-warning" />;
      case "Scheduled":
        return <Clock className="h-3 w-3 text-primary" />;
      case "Completed":
        return <CheckCircle className="h-3 w-3 text-dashboard-complete" />;
      default:
        return <Calendar className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive";
      case "High":
        return "secondary";
      case "Medium":
        return "outline";
      case "Low":
      default:
        return "secondary";
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">Scheduled Tasks</CardTitle>
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-dashboard-warning">{dueTodayCount}</div>
            <div className="text-xs text-muted-foreground">Due Today</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{upcomingCount}</div>
            <div className="text-xs text-muted-foreground">Upcoming</div>
          </div>
        </div>

        {/* Upcoming Tasks List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Next 4 Tasks</h4>
          <div className="space-y-1">
            {scheduledTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2 flex-1">
                  {getStatusIcon(task.status)}
                  <span className="truncate flex-1">{task.title}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge 
                    variant={getPriorityVariant(task.priority)} 
                    className="text-xs px-1 py-0"
                  >
                    {task.due}
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