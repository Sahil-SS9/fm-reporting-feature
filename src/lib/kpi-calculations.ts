import { mockWorkOrders, mockAssets } from "@/data/mockData";

export interface PriorityItem {
  id: string;
  title: string;
  property: string;
  dueDate: string;
  priority: string;
  status: string;
  category: "CRITICAL" | "URGENT" | "DUE_SOON";
  isPropertyImpacting: boolean;
  type: "work_order" | "asset" | "inspection";
}

export interface KPIMetrics {
  dueToday: number;
  overdue: number;
  critical: number;
  avgCompletionTime: number;
  onTimeRate: number;
  weeklyTrend: number;
  closureRate: number;
}

// Simple priority categorization
export function categorizePriorityItem(item: any): "CRITICAL" | "URGENT" | "DUE_SOON" {
  const today = new Date();
  const dueDate = new Date(item.dueDate);
  const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // CRITICAL: Critical priority items, overdue items, or property-impacting emergencies
  if (item.priority === "Critical" || 
      daysDiff < 0 || 
      (item.category === "Emergency" && item.isPropertyImpacting)) {
    return "CRITICAL";
  }
  
  // URGENT: High priority items, due today/tomorrow, or on hold items
  if (item.priority === "High" || 
      daysDiff <= 1 || 
      item.status === "On Hold") {
    return "URGENT";
  }
  
  // DUE_SOON: Everything else that's due within a week
  return "DUE_SOON";
}

export function getPriorityInboxItems(workOrders: any[]): PriorityItem[] {
  const activeWorkOrders = workOrders.filter(wo => wo.status !== "Completed");
  
  const priorityItems: PriorityItem[] = activeWorkOrders.map(wo => ({
    id: wo.id,
    title: wo.title,
    property: wo.property || "Unknown Property",
    dueDate: formatDueDate(wo.dueDate),
    priority: wo.priority,
    status: wo.status,
    category: categorizePriorityItem(wo),
    isPropertyImpacting: wo.category === "Emergency" || wo.priority === "Critical",
    type: "work_order"
  }));

  // Sort by category priority, then by due date
  const categoryOrder = { "CRITICAL": 0, "URGENT": 1, "DUE_SOON": 2 };
  return priorityItems.sort((a, b) => {
    if (categoryOrder[a.category] !== categoryOrder[b.category]) {
      return categoryOrder[a.category] - categoryOrder[b.category];
    }
    // Within same category, sort by due date (overdue/today first)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function calculateKPIMetrics(workOrders: any[]): KPIMetrics {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Due today
  const dueToday = workOrders.filter(wo => {
    if (!wo.dueDate || wo.status === "Completed") return false;
    const dueDate = new Date(wo.dueDate);
    return dueDate.toDateString() === today.toDateString();
  }).length;

  // Overdue items
  const overdue = workOrders.filter(wo => {
    if (!wo.dueDate || wo.status === "Completed") return false;
    const dueDate = new Date(wo.dueDate);
    return dueDate < today;
  }).length;

  // Critical items
  const critical = workOrders.filter(wo => 
    wo.priority === "Critical" && wo.status !== "Completed"
  ).length;

  // Average completion time (in days)
  const completedOrders = workOrders.filter(wo => wo.status === "Completed" && wo.completedDate);
  const avgCompletionTime = completedOrders.length > 0 
    ? completedOrders.reduce((sum, wo) => {
        const created = new Date(wo.createdDate);
        const completed = new Date(wo.completedDate);
        const days = Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / completedOrders.length
    : 0;

  // On-time rate
  const onTimeCompletions = completedOrders.filter(wo => {
    if (!wo.dueDate) return true;
    const due = new Date(wo.dueDate);
    const completed = new Date(wo.completedDate);
    return completed <= due;
  }).length;
  const onTimeRate = completedOrders.length > 0 ? (onTimeCompletions / completedOrders.length) * 100 : 0;

  // Weekly trend (completion rate this week vs last week)
  const thisWeekCompleted = workOrders.filter(wo => {
    if (!wo.completedDate) return false;
    const completed = new Date(wo.completedDate);
    return completed >= oneWeekAgo;
  }).length;
  
  const lastWeekCompleted = workOrders.filter(wo => {
    if (!wo.completedDate) return false;
    const completed = new Date(wo.completedDate);
    const twoWeeksAgo = new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
    return completed >= twoWeeksAgo && completed < oneWeekAgo;
  }).length;

  const weeklyTrend = lastWeekCompleted > 0 
    ? ((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100
    : 0;

  // Closure rate (percentage of total work orders completed)
  const closureRate = workOrders.length > 0 
    ? (completedOrders.length / workOrders.length) * 100
    : 0;

  return {
    dueToday,
    overdue,
    critical,
    avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
    onTimeRate: Math.round(onTimeRate * 10) / 10,
    weeklyTrend: Math.round(weeklyTrend * 10) / 10,
    closureRate: Math.round(closureRate * 10) / 10
  };
}

function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  
  const daysDiff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 0) return `${Math.abs(daysDiff)} days overdue`;
  if (daysDiff <= 7) return `${daysDiff} days`;
  
  return date.toLocaleDateString();
}