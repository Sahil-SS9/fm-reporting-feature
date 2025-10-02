import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
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
        <Icon className={`h-4 w-4 ${styles.icon}`} />
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