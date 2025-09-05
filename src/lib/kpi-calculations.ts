import { mockWorkOrders, mockAssets } from "@/data/mockData";

export interface PriorityItem {
  id: string;
  title: string;
  property: string;
  dueDate: string;
  priority: string;
  status: string;
  urgencyScore: number;
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

// Urgency scoring algorithm
export function calculateUrgencyScore(item: any): number {
  let score = 0;
  const today = new Date();
  const dueDate = new Date(item.dueDate);
  const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Priority scoring
  if (item.priority === "Critical") score += 4;
  else if (item.priority === "High") score += 3;
  else if (item.priority === "Medium") score += 2;
  else score += 1;

  // Due date urgency
  if (daysDiff < 0) score += 6; // Overdue
  else if (daysDiff === 0) score += 5; // Due today
  else if (daysDiff === 1) score += 3; // Due tomorrow
  else if (daysDiff <= 3) score += 2; // Due within 3 days

  // Property impact multiplier
  if (item.isPropertyImpacting) score += 2;

  // Status penalty for stalled items
  if (item.status === "On Hold") score += 1;

  return Math.min(score, 10);
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
    urgencyScore: calculateUrgencyScore(wo),
    isPropertyImpacting: wo.category === "Emergency" || wo.priority === "Critical",
    type: "work_order"
  }));

  // Sort by urgency score (highest first)
  return priorityItems.sort((a, b) => b.urgencyScore - a.urgencyScore);
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