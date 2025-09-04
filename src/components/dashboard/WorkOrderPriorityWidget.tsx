import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import { mockWorkOrders } from "@/data/mockData";

export function WorkOrderPriorityWidget() {
  // Calculate priority distribution
  const priorityCounts = mockWorkOrders.reduce((acc, wo) => {
    acc[wo.priority] = (acc[wo.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityData = [
    { 
      name: "High", 
      value: priorityCounts["High"] || 0, 
      color: "hsl(var(--destructive))" 
    },
    { 
      name: "Medium", 
      value: priorityCounts["Medium"] || 0, 
      color: "hsl(var(--warning))" 
    },
    { 
      name: "Low", 
      value: priorityCounts["Low"] || 0, 
      color: "hsl(var(--dashboard-complete))" 
    },
    { 
      name: "Critical", 
      value: priorityCounts["Critical"] || 0, 
      color: "hsl(var(--dashboard-critical))" 
    }
  ].filter(item => item.value > 0);

  const total = priorityData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Work Order Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <DonutChartWithCenter 
            data={priorityData}
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
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {priorityData.map((priority) => (
            <div key={priority.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: priority.color }}
              />
              <span className="text-xs text-muted-foreground">
                {priority.name}: {priority.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}