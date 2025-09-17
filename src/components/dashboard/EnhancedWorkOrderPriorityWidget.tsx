import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedViewModal } from "@/components/ui/detailed-view-modal";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle } from "lucide-react";
import { DonutChartWithCenter, VerticalBarChart } from "@/components/ui/enhanced-charts";
import { mockWorkOrders, mockProperties } from "@/data/mockData";

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

  // Generate detailed breakdown by property and priority
  const detailedBreakdown = mockProperties.flatMap(property => {
    const propertyOrders = filteredWorkOrders.filter(wo => wo.propertyId === property.id);
    
    return ["Critical", "High", "Medium", "Low"].map(priority => {
      const priorityOrders = propertyOrders.filter(wo => wo.priority === priority);
      return {
        property: property.name,
        priority: priority,
        count: priorityOrders.length,
        percentage: propertyOrders.length > 0 ? Math.round((priorityOrders.length / propertyOrders.length) * 100) : 0,
        avgResolutionTime: Math.floor(Math.random() * 20) + 1,
        openCount: priorityOrders.filter(wo => wo.status !== "Completed").length,
        completedCount: priorityOrders.filter(wo => wo.status === "Completed").length
      };
    });
  }).filter(item => item.count > 0);

  // Property-wise priority chart data
  const propertyPriorityData = mockProperties.map(property => {
    const criticalCount = filteredWorkOrders.filter(wo => wo.propertyId === property.id && wo.priority === "Critical").length;
    return {
      name: property.name.substring(0, 12) + "...",
      value: criticalCount
    };
  });

  const tableColumns = [
    { key: 'property', label: 'Property' },
    { key: 'priority', label: 'Priority' },
    { key: 'count', label: 'Total Count' },
    { key: 'openCount', label: 'Open' },
    { key: 'completedCount', label: 'Completed' },
    { key: 'percentage', label: 'Percentage', format: (value: number) => `${value}%` },
    { key: 'avgResolutionTime', label: 'Avg Resolution', format: (value: number) => `${value} days` }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>Work Order Priority</span>
        </CardTitle>
        <DetailedViewModal
          title="Work Order Priority Analysis"
          chartComponent={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center">Priority Distribution</h4>
                <div className="h-80 flex items-center justify-center">
                  <DonutChartWithCenter 
                    data={donutData}
                    size={350}
                    centerContent={
                      <div className="text-center">
                        <div className="text-2xl font-bold">{filteredWorkOrders.length}</div>
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center">Critical Issues by Property</h4>
                <div className="h-80">
                  <VerticalBarChart 
                    data={propertyPriorityData}
                    color="hsl(var(--destructive))"
                    width={400}
                    height={300}
                  />
                </div>
              </div>
            </div>
          }
          tableData={detailedBreakdown}
          tableColumns={tableColumns}
        >
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </DetailedViewModal>
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