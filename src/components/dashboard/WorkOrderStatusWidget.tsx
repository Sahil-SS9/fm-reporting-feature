import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import { mockWorkOrders } from "@/data/mockData";

interface WorkOrderStatusWidgetProps {
  filteredWorkOrders?: any[];
}

export function WorkOrderStatusWidget({ filteredWorkOrders }: WorkOrderStatusWidgetProps) {
  const workOrders = filteredWorkOrders || mockWorkOrders;
  
  // Calculate status distribution
  const statusCounts = workOrders.reduce((acc, wo) => {
    acc[wo.status] = (acc[wo.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Map statuses to display data with colors
  const statusData = [
    { 
      name: "Draft", 
      value: statusCounts["Draft"] || 0, 
      color: "hsl(var(--muted))" 
    },
    { 
      name: "Sent", 
      value: statusCounts["Sent"] || 0, 
      color: "hsl(var(--chart-2))" 
    },
    { 
      name: "Approved", 
      value: statusCounts["Open"] || 0,  // Using "Open" as "Approved" 
      color: "hsl(var(--chart-3))" 
    },
    { 
      name: "Rejected", 
      value: statusCounts["Rejected"] || 0, 
      color: "hsl(var(--destructive))" 
    },
    { 
      name: "In Progress", 
      value: statusCounts["In Progress"] || 0, 
      color: "hsl(var(--warning))" 
    },
    { 
      name: "Completed", 
      value: statusCounts["Completed"] || 0, 
      color: "hsl(var(--dashboard-complete))" 
    },
    { 
      name: "Deleted", 
      value: statusCounts["Deleted"] || 0, 
      color: "hsl(var(--muted-foreground))" 
    },
    { 
      name: "Pre-approval", 
      value: statusCounts["Pre-approval"] || 0, 
      color: "hsl(var(--chart-4))" 
    },
    { 
      name: "Completed (unconfirmed)", 
      value: statusCounts["Completed (unconfirmed)"] || 0, 
      color: "hsl(var(--chart-5))" 
    },
    { 
      name: "On Hold", 
      value: statusCounts["On hold"] || 0, 
      color: "hsl(var(--chart-1))" 
    },
    { 
      name: "In Review", 
      value: statusCounts["In Review"] || 0, 
      color: "hsl(var(--primary))" 
    },
    { 
      name: "Scheduled", 
      value: statusCounts["Scheduled"] || 0, 
      color: "hsl(var(--accent))" 
    }
  ].filter(item => item.value > 0);

  const total = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Work Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <DonutChartWithCenter 
            data={statusData}
            size={140}
            strokeWidth={16}
            centerContent={
              <>
                <div className="text-2xl font-bold text-foreground">{total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </>
            }
          />
        </div>
        
        {/* Legend - 2 columns */}
        <div className="grid grid-cols-2 gap-2">
          {statusData.map((status) => (
            <div key={status.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: status.color }}
              />
              <span className="text-xs text-muted-foreground truncate">
                {status.name}: {status.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
