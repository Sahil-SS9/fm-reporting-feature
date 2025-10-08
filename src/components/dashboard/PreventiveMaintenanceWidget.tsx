import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";
import { useState } from "react";

export function PreventiveMaintenanceWidget() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
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
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const getSelectedData = () => {
    switch (selectedStatus) {
      case 'due-today':
        return dueSoon;
      case 'overdue':
        return overdue;
      default:
        return [];
    }
  };

  const getStatusLabel = () => {
    switch (selectedStatus) {
      case 'due-today':
        return 'Due Today';
      case 'overdue':
        return 'Overdue';
      default:
        return '';
    }
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
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div 
            className="text-center p-2 rounded bg-dashboard-medium/10 hover:bg-dashboard-medium/20 transition-colors cursor-pointer"
            onClick={(e) => handleStatusClick('due-today', e)}
          >
            <div className="text-lg font-bold text-dashboard-medium">{dueSoon.length}</div>
            <div className="text-xs text-dashboard-medium font-medium">Due Today</div>
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

        {/* Data Table */}
        {selectedStatus && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">
                {getStatusLabel()} Assets ({getSelectedData().length})
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStatus(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Asset Name</TableHead>
                    <TableHead className="text-xs">Task Type</TableHead>
                    <TableHead className="text-xs">Assigned Team</TableHead>
                    <TableHead className="text-xs">Assigned User</TableHead>
                    <TableHead className="text-xs">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSelectedData().slice(0, 10).map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-xs">{asset.name}</TableCell>
                      <TableCell className="text-xs">Inspection</TableCell>
                      <TableCell className="text-xs">Maintenance Team</TableCell>
                      <TableCell className="text-xs">Unassigned</TableCell>
                      <TableCell className="text-xs">
                        {asset.nextInspection ? new Date(asset.nextInspection).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {getSelectedData().length > 10 && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                Showing 10 of {getSelectedData().length} items
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}