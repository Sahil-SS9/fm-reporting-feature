import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailedViewModal } from "@/components/ui/detailed-view-modal";
import { Button } from "@/components/ui/button";
import { Eye, LucideIcon } from "lucide-react";
import { VerticalBarChart } from "@/components/ui/enhanced-charts";
import { mockWorkOrders, mockProperties } from "@/data/mockData";

interface EnhancedEssentialMetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "critical";
  description: string;
  change?: {
    value: string;
    type: "positive" | "negative" | "neutral";
    label: string;
  };
  subValue?: string;
}

export function EnhancedEssentialMetricsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  description,
  change,
  subValue
}: EnhancedEssentialMetricsCardProps) {
  
  // Generate detailed breakdown data based on the metric type
  const getDetailedData = () => {
    if (title.includes("Due Today")) {
      const dueTodayOrders = mockWorkOrders.filter(wo => {
        const dueDate = new Date(wo.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString() && wo.status !== "Completed";
      });
      
      return {
        chartData: mockProperties.map(property => ({
          name: property.name.substring(0, 10) + "...",
          value: dueTodayOrders.filter(wo => wo.propertyId === property.id).length
        })),
        tableData: dueTodayOrders.map(wo => ({
          workOrder: wo.title,
          property: mockProperties.find(p => p.id === wo.propertyId)?.name || "Unknown",
          priority: wo.priority,
          assignee: wo.assigneeId,
          dueDate: new Date(wo.dueDate).toLocaleDateString(),
          category: wo.category
        })),
        tableColumns: [
          { key: 'workOrder', label: 'Work Order' },
          { key: 'property', label: 'Property' },
          { key: 'priority', label: 'Priority' },
          { key: 'assignee', label: 'Assignee' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'category', label: 'Category' }
        ]
      };
    }
    
    if (title.includes("Overdue")) {
      const overdueOrders = mockWorkOrders.filter(wo => {
        const dueDate = new Date(wo.dueDate);
        return dueDate < new Date() && wo.status !== "Completed";
      });
      
      return {
        chartData: mockProperties.map(property => ({
          name: property.name.substring(0, 10) + "...",
          value: overdueOrders.filter(wo => wo.propertyId === property.id).length
        })),
        tableData: overdueOrders.map(wo => ({
          workOrder: wo.title,
          property: mockProperties.find(p => p.id === wo.propertyId)?.name || "Unknown",
          priority: wo.priority,
          assignee: wo.assigneeId,
          dueDate: new Date(wo.dueDate).toLocaleDateString(),
          daysOverdue: Math.ceil((new Date().getTime() - new Date(wo.dueDate).getTime()) / (1000 * 3600 * 24)),
          category: wo.category
        })),
        tableColumns: [
          { key: 'workOrder', label: 'Work Order' },
          { key: 'property', label: 'Property' },
          { key: 'priority', label: 'Priority' },
          { key: 'assignee', label: 'Assignee' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'daysOverdue', label: 'Days Overdue', format: (value: number) => `${value} days` },
          { key: 'category', label: 'Category' }
        ]
      };
    }
    
    if (title.includes("Critical")) {
      const criticalOrders = mockWorkOrders.filter(wo => wo.priority === "Critical");
      
      return {
        chartData: mockProperties.map(property => ({
          name: property.name.substring(0, 10) + "...",
          value: criticalOrders.filter(wo => wo.propertyId === property.id).length
        })),
        tableData: criticalOrders.map(wo => ({
          workOrder: wo.title,
          property: mockProperties.find(p => p.id === wo.propertyId)?.name || "Unknown",
          status: wo.status,
          assignee: wo.assigneeId,
          createdDate: new Date(wo.createdDate).toLocaleDateString(),
          dueDate: new Date(wo.dueDate).toLocaleDateString(),
          category: wo.category
        })),
        tableColumns: [
          { key: 'workOrder', label: 'Work Order' },
          { key: 'property', label: 'Property' },
          { key: 'status', label: 'Status' },
          { key: 'assignee', label: 'Assignee' },
          { key: 'createdDate', label: 'Created Date' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'category', label: 'Category' }
        ]
      };
    }
    
    // Default data structure for other metrics
    return {
      chartData: mockProperties.map(property => ({
        name: property.name.substring(0, 10) + "...",
        value: Math.floor(Math.random() * 10) + 1
      })),
      tableData: mockProperties.map(property => ({
        property: property.name,
        value: Math.floor(Math.random() * 100),
        status: "Active",
        lastUpdated: new Date().toLocaleDateString()
      })),
      tableColumns: [
        { key: 'property', label: 'Property' },
        { key: 'value', label: 'Value' },
        { key: 'status', label: 'Status' },
        { key: 'lastUpdated', label: 'Last Updated' }
      ]
    };
  };

  const detailedData = getDetailedData();
  
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          border: "border-success/20",
          bg: "bg-success/5",
          icon: "text-success",
          badge: "bg-success/10 text-success border-success/20"
        };
      case "warning":
        return {
          border: "border-warning/20",
          bg: "bg-warning/5",
          icon: "text-warning",
          badge: "bg-warning/10 text-warning border-warning/20"
        };
      case "critical":
        return {
          border: "border-destructive/20",
          bg: "bg-destructive/5",
          icon: "text-destructive",
          badge: "bg-destructive/10 text-destructive border-destructive/20"
        };
      default:
        return {
          border: "border-border",
          bg: "bg-card",
          icon: "text-primary",
          badge: "bg-primary/10 text-primary border-primary/20"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={`${styles.border} ${styles.bg} hover:shadow-md transition-all duration-200 group cursor-pointer`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <DetailedViewModal
            title={title}
            chartComponent={
              <div className="h-full">
                <h4 className="text-lg font-semibold mb-4 text-center">Breakdown by Property</h4>
                <VerticalBarChart 
                  data={detailedData.chartData}
                  color={variant === "critical" ? "hsl(var(--destructive))" : 
                         variant === "warning" ? "hsl(var(--warning))" : 
                         variant === "success" ? "hsl(var(--success))" : "hsl(var(--primary))"}
                  width={800}
                  height={300}
                />
              </div>
            }
            tableData={detailedData.tableData}
            tableColumns={detailedData.tableColumns}
          >
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <Eye className="h-3 w-3" />
            </Button>
          </DetailedViewModal>
          <Icon className={`h-4 w-4 ${styles.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {value}
              {subValue && <span className="text-sm text-muted-foreground ml-1">{subValue}</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          {change && (
            <Badge 
              variant="outline" 
              className={`${styles.badge} text-xs font-medium`}
            >
              {change.value}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}