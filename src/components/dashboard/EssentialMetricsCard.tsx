import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EssentialMetricsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: {
    value: string;
    type: "positive" | "negative" | "neutral";
    label?: string;
  };
  icon: LucideIcon;
  description?: string;
  className?: string;
  variant?: "default" | "critical" | "warning" | "success";
}

export function EssentialMetricsCard({ 
  title, 
  value, 
  subValue,
  change, 
  icon: Icon, 
  description,
  className,
  variant = "default"
}: EssentialMetricsCardProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case "critical":
        return "border-dashboard-critical/20 bg-dashboard-critical/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "success":
        return "border-dashboard-complete/20 bg-dashboard-complete/5";
      default:
        return "";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "critical":
        return "text-dashboard-critical";
      case "warning":
        return "text-warning";
      case "success":
        return "text-dashboard-complete";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn(
      "hover:shadow-md transition-all duration-200", 
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", getIconColor())} />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {subValue && (
            <div className="text-sm text-muted-foreground">
              {subValue}
            </div>
          )}
        </div>
        
        {change && (
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                change.type === "positive" 
                  ? "default" 
                  : change.type === "negative" 
                    ? "destructive" 
                    : "secondary"
              }
              className="text-xs"
            >
              {change.value}
            </Badge>
            {change.label && (
              <span className="text-xs text-muted-foreground">
                {change.label}
              </span>
            )}
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}