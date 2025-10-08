import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockWorkOrders, type WorkOrder } from "@/data/mockData";
import { format } from "date-fns";

interface WorkOrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  workOrders: WorkOrder[];
}

export function WorkOrderDetailsModal({
  open,
  onOpenChange,
  title,
  workOrders,
}: WorkOrderDetailsModalProps) {
  
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive";
      case "High":
        return "secondary";
      case "Medium":
        return "outline";
      case "Low":
      default:
        return "outline";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Overdue":
        return "destructive";
      case "Open":
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="mt-1">
            {workOrders.length} work order{workOrders.length !== 1 ? "s" : ""} found
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {workOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No work orders found matching this criteria.
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-28">Priority</TableHead>
                    <TableHead className="w-40">Property</TableHead>
                    <TableHead className="w-32">Due Date</TableHead>
                    <TableHead className="w-36">Category</TableHead>
                    <TableHead className="w-28">Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((wo) => (
                    <TableRow key={wo.id}>
                      <TableCell className="font-mono text-xs">{wo.id}</TableCell>
                      <TableCell className="font-medium">{wo.title}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(wo.status)} className="text-xs">
                          {wo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(wo.priority)} className="text-xs">
                          {wo.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{wo.property || "N/A"}</TableCell>
                      <TableCell className="text-sm">
                        {wo.dueDate ? format(new Date(wo.dueDate), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">{wo.category}</TableCell>
                      <TableCell className="text-sm font-mono text-xs">{wo.assigneeId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
