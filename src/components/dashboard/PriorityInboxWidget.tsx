import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Wrench,
  DollarSign,
  Building,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockWorkOrders } from "@/data/mockData";
import { getPriorityInboxItems } from "@/lib/kpi-calculations";
import { useState } from "react";
import { PriorityInboxDetailSheet } from "./PriorityInboxDetailSheet";

interface PriorityInboxWidgetProps {
  selectedProperty?: string;
  filteredWorkOrders?: typeof mockWorkOrders;
}

export function PriorityInboxWidget({ selectedProperty = "all", filteredWorkOrders = mockWorkOrders }: PriorityInboxWidgetProps) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const priorityItems = getPriorityInboxItems(filteredWorkOrders);
  const displayItems = showAll ? priorityItems : priorityItems.slice(0, 5);
  
  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const getCategoryBadge = (category: "CRITICAL" | "URGENT" | "DUE_SOON") => {
    if (category === "CRITICAL") return { variant: "destructive" as const, label: "CRITICAL", icon: AlertTriangle };
    if (category === "URGENT") return { variant: "secondary" as const, label: "URGENT", icon: Clock };
    return { variant: "outline" as const, label: "DUE SOON", icon: Calendar };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "work_order": return Wrench;
      case "asset": return Building;
      case "invoice": return DollarSign;
      case "document": return FileText;
      case "inspection": return CheckCircle2;
      default: return FileText;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-dashboard-critical" />
          <span className="text-lg font-semibold">Priority Inbox</span>
        </CardTitle>
        <Badge variant="destructive" className="text-xs">
          {priorityItems.length} items
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Morning Briefing Summary */}
        <div className="p-6 bg-dashboard-critical/5 rounded-lg border border-dashboard-critical/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-dashboard-critical" />
              <span className="text-base font-semibold">Morning Briefing</span>
            </div>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          <div className="text-base text-foreground space-y-4">
            <p className="font-medium">
              You have {priorityItems.filter(item => item.category === "CRITICAL").length} critical items which needs immediate attention.
            </p>
            
            {/* Bullet point summary by module */}
            <div className="space-y-3 ml-4">
              {(() => {
                const criticalItems = priorityItems.filter(item => item.category === "CRITICAL");
                const moduleGroups = criticalItems.reduce((acc, item) => {
                  if (!acc[item.module]) {
                    acc[item.module] = {};
                  }
                  if (!acc[item.module][item.label]) {
                    acc[item.module][item.label] = 0;
                  }
                  acc[item.module][item.label]++;
                  return acc;
                }, {} as Record<string, Record<string, number>>);

                return Object.entries(moduleGroups).map(([module, statuses]) => (
                  <div key={module} className="flex items-center space-x-2 text-sm">
                    <span className="text-dashboard-critical font-bold">•</span>
                    <span>
                      {Object.entries(statuses).map(([status, count], index) => (
                        <span key={status}>
                          {index > 0 && ", "}
                          <span className="font-medium">{count} {status.toLowerCase()}</span>
                        </span>
                      ))} for {module}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Priority Items List */}
        <div className="space-y-3">
          {displayItems.map((item) => {
            const categoryBadge = getCategoryBadge(item.category);
            const TypeIcon = getTypeIcon(item.type);
            
            return (
              <div 
                key={item.id}
                className="p-3 border rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Title with type icon */}
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{item.title}</span>
                    </div>
                    
                    {/* Subtext with property, module, and label */}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.property}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>{item.module}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </div>

                    {/* Due date and single View action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Due {item.dueDate}</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                        onClick={() => handleViewItem(item)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="flex items-start">
                    <Badge variant={categoryBadge.variant} className="text-xs">
                      {categoryBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand/Collapse Button */}
        {priorityItems.length > 5 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={toggleShowAll}
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                View All Priority Items ({priorityItems.length - 5} more)
              </>
            )}
          </Button>
        )}
      </CardContent>

      <PriorityInboxDetailSheet 
        item={selectedItem}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </Card>
  );
}