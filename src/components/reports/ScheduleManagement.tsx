import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar, Clock, Mail, MoreHorizontal, Pause, Play, Edit, Trash2, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { mockScheduledReports, mockSavedReports, type ScheduledReport } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ScheduleReportSheet } from "./ScheduleReportSheet";


export const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduledReport[]>(mockScheduledReports);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | null>(null);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);
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
    setShowScheduleSheet(true);
  };

  const handleSaveSchedule = (updatedSchedule: ScheduledReport) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    ));
    
    toast({
      title: "Schedule updated",
      description: "The report schedule has been updated successfully."
    });
    
    setEditingSchedule(null);
    setShowScheduleSheet(false);
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

        {showScheduleSheet && (
          <Sheet open={showScheduleSheet} onOpenChange={setShowScheduleSheet}>
            <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  {editingSchedule ? 'Edit Schedule' : 'Schedule Report'}
                </SheetTitle>
              </SheetHeader>
              <ScheduleReportSheet
                reportConfig={
                  editingSchedule 
                    ? mockSavedReports.find(r => r.id === editingSchedule.reportId)
                    : { name: "New Schedule", id: "temp" }
                }
                existingSchedule={editingSchedule}
                onClose={() => {
                  setShowScheduleSheet(false);
                  setEditingSchedule(null);
                }}
                onSave={handleSaveSchedule}
              />
            </SheetContent>
          </Sheet>
        )}
      </CardContent>
    </Card>
  );
};