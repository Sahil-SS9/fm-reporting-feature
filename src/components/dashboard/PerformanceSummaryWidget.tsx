import { Target, TrendingUp } from "lucide-react";
import { calculateKPIMetrics } from "@/lib/kpi-calculations";
import { mockWorkOrders } from "@/data/mockData";

// Export individual metric values for use in separate cards
export function getPerformanceMetrics() {
  const kpiMetrics = calculateKPIMetrics(mockWorkOrders);
  const avgResponseTime = 2.4; // Mock average response time in hours
  
  return {
    avgResponseTime,
    avgCompletionTime: kpiMetrics.avgCompletionTime
  };
}