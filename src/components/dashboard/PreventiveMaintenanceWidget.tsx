import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";

export function PreventiveMaintenanceWidget() {
  const navigate = useNavigate();
  
  // Enhanced preventive maintenance tracking with smart categorization
  const totalAssets = mockAssets.length;
  
  // Categorize maintenance status (mock logic for realistic distribution)
  const notDue = mockAssets.filter((_, index) => index % 5 !== 0); // 80% not due
  const dueSoon = mockAssets.filter((_, index) => index % 5 === 0 && index % 10 !== 0); // 10% due soon
  const overdue = mockAssets.filter((_, index) => index % 10 === 0); // 10% overdue
  
  const handleClick = () => {
    navigate('/maintenance', { 
      state: { 
        filter: { type: 'preventive' }
      }
    });
  };
  
  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/maintenance', { 
      state: { 
        filter: { type: 'preventive', status }
      }
    });
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group" 
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-base">Preventive Maintenance</span>
          </div>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div 
            className="text-center p-2 rounded bg-dashboard-complete/10 hover:bg-dashboard-complete/20 transition-colors cursor-pointer"
            onClick={(e) => handleStatusClick('not-due', e)}
          >
            <div className="text-lg font-bold text-dashboard-complete">{notDue.length}</div>
            <div className="text-xs text-dashboard-complete font-medium">Not Due</div>
          </div>
          
          <div 
            className="text-center p-2 rounded bg-dashboard-medium/10 hover:bg-dashboard-medium/20 transition-colors cursor-pointer"
            onClick={(e) => handleStatusClick('due-soon', e)}
          >
            <div className="text-lg font-bold text-dashboard-medium">{dueSoon.length}</div>
            <div className="text-xs text-dashboard-medium font-medium">Due Soon</div>
          </div>
          
          <div 
            className="text-center p-2 rounded bg-dashboard-critical/10 hover:bg-dashboard-critical/20 transition-colors cursor-pointer"
            onClick={(e) => handleStatusClick('overdue', e)}
          >
            <div className="text-lg font-bold text-dashboard-critical">{overdue.length}</div>
            <div className="text-xs text-dashboard-critical font-medium">Overdue</div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="text-xs text-muted-foreground text-center pt-1 border-t">
          {totalAssets} total assets • {dueSoon.length + overdue.length} require attention
        </div>
      </CardContent>
    </Card>
  );
}