import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Clock, Mail, MoreHorizontal, Pause, Play, Edit, Trash2, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { mockScheduledReports, mockSavedReports, type ScheduledReport } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface EditScheduleModalProps {
  schedule: ScheduledReport;
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: ScheduledReport) => void;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ 
  schedule, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [editedSchedule, setEditedSchedule] = useState<ScheduledReport>(schedule);

  const handleSave = () => {
    onSave(editedSchedule);
    onClose();
  };

  const handleRecipientsChange = (value: string) => {
    const recipients = value.split(',').map(email => email.trim()).filter(Boolean);
    setEditedSchedule(prev => ({ ...prev, recipients }));
  };

  const handleCCRecipientsChange = (value: string) => {
    const ccRecipients = value.split(',').map(email => email.trim()).filter(Boolean);
    setEditedSchedule(prev => ({ ...prev, ccRecipients }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={editedSchedule.frequency}
              onValueChange={(value: any) => setEditedSchedule(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={editedSchedule.time}
              onChange={(e) => setEditedSchedule(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="recipients">Recipients (comma separated)</Label>
            <Input
              id="recipients"
              value={editedSchedule.recipients.join(', ')}
              onChange={(e) => handleRecipientsChange(e.target.value)}
              placeholder="email1@company.com, email2@company.com"
            />
          </div>

          <div>
            <Label htmlFor="cc-recipients">CC Recipients (comma separated)</Label>
            <Input
              id="cc-recipients"
              value={editedSchedule.ccRecipients?.join(', ') || ''}
              onChange={(e) => handleCCRecipientsChange(e.target.value)}
              placeholder="manager@company.com"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={editedSchedule.enabled}
              onCheckedChange={(checked) => 
                setEditedSchedule(prev => ({ ...prev, enabled: checked }))
              }
            />
            <Label htmlFor="enabled">Schedule enabled</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduledReport[]>(mockScheduledReports);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | null>(null);
  const { toast } = useToast();

  const handleToggleStatus = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => {
      if (schedule.id === scheduleId) {
        const newStatus = schedule.status === 'active' ? 'paused' : 'active';
        const newEnabled = newStatus === 'active';
        
        toast({
          title: `Schedule ${newStatus}`,
          description: `Report schedule has been ${newStatus}.`
        });
        
        return { ...schedule, status: newStatus, enabled: newEnabled };
      }
      return schedule;
    }));
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    toast({
      title: "Schedule deleted",
      description: "The report schedule has been permanently deleted."
    });
  };

  const handleEditSchedule = (schedule: ScheduledReport) => {
    setEditingSchedule(schedule);
  };

  const handleSaveSchedule = (updatedSchedule: ScheduledReport) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    ));
    
    toast({
      title: "Schedule updated",
      description: "The report schedule has been updated successfully."
    });
  };

  const getStatusBadge = (status: ScheduledReport['status']) => {
    const variants = {
      active: "default" as const,
      paused: "secondary" as const,
      expired: "destructive" as const
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getReportName = (reportId: string) => {
    const report = mockSavedReports.find(r => r.id === reportId);
    return report?.name || 'Unknown Report';
  };

  const formatNextRun = (nextRun: string) => {
    try {
      return format(parseISO(nextRun), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Not scheduled';
    }
  };

  const formatLastRun = (lastRun?: string) => {
    if (!lastRun) return 'Never';
    try {
      return format(parseISO(lastRun), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Never';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule Management
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <div className="font-medium">{getReportName(schedule.reportId)}</div>
                  <div className="text-sm text-muted-foreground">
                    {schedule.frequency} at {schedule.time}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {schedule.frequency}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {schedule.recipients.length}
                      {schedule.ccRecipients && schedule.ccRecipients.length > 0 && 
                        ` (+${schedule.ccRecipients.length} CC)`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatNextRun(schedule.nextRun)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatLastRun(schedule.lastRun)}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(schedule.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(schedule.id)}
                      className="h-8 w-8 p-0"
                    >
                      {schedule.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditSchedule(schedule)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Schedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {schedules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <div className="text-lg font-medium mb-2">No scheduled reports</div>
            <div className="text-sm">
              Create a report and set up email scheduling to see schedules here.
            </div>
          </div>
        )}

        {editingSchedule && (
          <EditScheduleModal
            schedule={editingSchedule}
            isOpen={!!editingSchedule}
            onClose={() => setEditingSchedule(null)}
            onSave={handleSaveSchedule}
          />
        )}
      </CardContent>
    </Card>
  );
};