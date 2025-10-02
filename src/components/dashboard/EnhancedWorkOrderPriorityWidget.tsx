import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { DonutChartWithCenter } from "@/components/ui/enhanced-charts";
import { mockWorkOrders } from "@/data/mockData";

interface EnhancedWorkOrderPriorityWidgetProps {
  selectedProperty?: string;
  filteredWorkOrders?: typeof mockWorkOrders;
}

export function EnhancedWorkOrderPriorityWidget({ selectedProperty = "all", filteredWorkOrders = mockWorkOrders }: EnhancedWorkOrderPriorityWidgetProps) {
  // Calculate priority distribution
  const priorityDistribution = {
    Critical: filteredWorkOrders.filter(wo => wo.priority === "Critical").length,
    High: filteredWorkOrders.filter(wo => wo.priority === "High").length,
    Medium: filteredWorkOrders.filter(wo => wo.priority === "Medium").length,
    Low: filteredWorkOrders.filter(wo => wo.priority === "Low").length
  };

  const donutData = [
    { name: "Critical", value: priorityDistribution.Critical, color: "hsl(var(--destructive))" },
    { name: "High", value: priorityDistribution.High, color: "hsl(var(--warning))" },
    { name: "Medium", value: priorityDistribution.Medium, color: "hsl(var(--dashboard-medium))" },
    { name: "Low", value: priorityDistribution.Low, color: "hsl(var(--success))" }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>Work Order Priority</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <DonutChartWithCenter 
            data={donutData}
            size={280}
            centerContent={
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredWorkOrders.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-destructive rounded mr-2"></div>
              Critical
            </span>
            <span className="font-semibold">{priorityDistribution.Critical}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-warning rounded mr-2"></div>
              High
            </span>
            <span className="font-semibold">{priorityDistribution.High}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-dashboard-medium rounded mr-2"></div>
              Medium
            </span>
            <span className="font-semibold">{priorityDistribution.Medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-success rounded mr-2"></div>
              Low
            </span>
            <span className="font-semibold">{priorityDistribution.Low}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}