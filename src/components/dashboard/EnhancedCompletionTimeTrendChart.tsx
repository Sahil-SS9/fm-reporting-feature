import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedViewModal } from "@/components/ui/detailed-view-modal";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp } from "lucide-react";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";
import { mockWorkOrders, mockProperties } from "@/data/mockData";
import { LineChart } from '@mui/x-charts';

export function EnhancedCompletionTimeTrendChart() {
  // Generate trend data for the last 12 months
  const generateTrendData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate average completion time for each month (simulated)
      const avgTime = Math.floor(Math.random() * 10) + 3; // 3-13 days
      
      months.push({
        month: monthName,
        avgTime: avgTime,
        completedOrders: Math.floor(Math.random() * 20) + 10
      });
    }
    
    return months;
  };

  const trendData = generateTrendData();
  
  // Generate detailed breakdown by property
  const propertyBreakdown = mockProperties.map(property => {
    const propertyOrders = mockWorkOrders.filter(wo => wo.propertyId === property.id && wo.status === "Completed");
    const avgCompletionTime = propertyOrders.length > 0 
      ? Math.floor(Math.random() * 15) + 2 // Simulated 2-17 days
      : 0;
    
    return {
      property: property.name,
      avgCompletionTime: avgCompletionTime,
      completedOrders: propertyOrders.length,
      onTimePercentage: Math.floor(Math.random() * 40) + 60, // 60-100%
      category: property.type || "Mixed Use"
    };
  });

  const tableColumns = [
    { key: 'property', label: 'Property' },
    { key: 'avgCompletionTime', label: 'Avg Completion Time', format: (value: number) => `${value} days` },
    { key: 'completedOrders', label: 'Completed Orders' },
    { key: 'onTimePercentage', label: 'On-Time %', format: (value: number) => `${value}%` },
    { key: 'category', label: 'Category' }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Completion Time Trend</span>
        </CardTitle>
        <DetailedViewModal
          title="Completion Time Trend Analysis"
          chartComponent={
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">12-Month Trend</h4>
                 <div className="h-80">
                   <LineChart
                     series={[{
                       data: trendData.map(item => item.avgTime),
                       color: 'hsl(var(--primary))',
                       label: 'Avg Completion Time',
                     }]}
                     xAxis={[{
                       scaleType: 'point',
                       data: trendData.map(item => item.month),
                     }]}
                     width={undefined}
                     height={320}
                     margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                   />
                 </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Property Comparison</h4>
                <div className="h-80">
                  <VerticalBarChart 
                    data={propertyBreakdown.map(item => ({
                      name: item.property.substring(0, 15) + "...",
                      value: item.avgCompletionTime
                    }))}
                    color="hsl(var(--dashboard-medium))"
                    width={1000}
                    height={300}
                  />
                </div>
              </div>
            </div>
          }
          tableData={[
            // Monthly trend data
            ...trendData.map(item => ({
              type: "Monthly Trend",
              period: item.month,
              avgCompletionTime: item.avgTime,
              completedOrders: item.completedOrders,
              trend: "Monthly Average"
            })),
            // Property breakdown data  
            ...propertyBreakdown.map(item => ({
              type: "Property Breakdown",
              period: item.property,
              avgCompletionTime: item.avgCompletionTime,
              completedOrders: item.completedOrders,
              trend: `${item.onTimePercentage}% On-Time`
            }))
          ]}
          tableColumns={[
            { key: 'type', label: 'Type' },
            { key: 'period', label: 'Period/Property' },
            { key: 'avgCompletionTime', label: 'Avg Time', format: (value: number) => `${value} days` },
            { key: 'completedOrders', label: 'Completed' },
            { key: 'trend', label: 'Performance' }
          ]}
        >
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </DetailedViewModal>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <LineChart
            series={[{
              data: trendData.map(item => item.avgTime),
              color: 'hsl(var(--primary))',
              label: 'Avg Completion Time',
            }]}
            xAxis={[{
              scaleType: 'point',
              data: trendData.map(item => item.month),
            }]}
            width={undefined}
            height={256}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          />
        </div>
      </CardContent>
    </Card>
  );
}