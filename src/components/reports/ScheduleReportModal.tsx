import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Mail, Users } from "lucide-react";

interface ScheduleReportModalProps {
  reportConfig: any;
  onClose: () => void;
}

export function ScheduleReportModal({ reportConfig, onClose }: ScheduleReportModalProps) {
  const [frequency, setFrequency] = useState("weekly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [recipients, setRecipients] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState("monday");
  const [dayOfMonth, setDayOfMonth] = useState("1");

  const handleScheduleReport = () => {
    const scheduleConfig = {
      reportId: reportConfig.id,
      reportName: reportConfig.name,
      frequency,
      startDate,
      endDate: endDate || null,
      time,
      recipients: recipients.split(',').map(r => r.trim()).filter(Boolean),
      isEnabled,
      dayOfWeek: frequency === "weekly" ? dayOfWeek : null,
      dayOfMonth: frequency === "monthly" ? dayOfMonth : null,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage (in real app, this would be an API call)
    const scheduledReports = JSON.parse(localStorage.getItem('scheduledReports') || '[]');
    scheduledReports.push(scheduleConfig);
    localStorage.setItem('scheduledReports', JSON.stringify(scheduledReports));

    console.log("Schedule created:", scheduleConfig);
    alert("Report scheduled successfully!");
    onClose();
  };

  const getNextRunDate = () => {
    const start = new Date(startDate + 'T' + time);
    const today = new Date();
    
    if (start <= today) {
      // Calculate next occurrence
      if (frequency === "daily") {
        start.setDate(today.getDate() + 1);
      } else if (frequency === "weekly") {
        const dayMap = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
        const targetDay = dayMap[dayOfWeek as keyof typeof dayMap];
        const currentDay = today.getDay();
        const daysUntil = (targetDay - currentDay + 7) % 7;
        start.setDate(today.getDate() + (daysUntil || 7));
      } else if (frequency === "monthly") {
        const targetDate = parseInt(dayOfMonth);
        start.setMonth(today.getMonth() + 1);
        start.setDate(targetDate);
      }
    }
    
    return start;
  };

  const nextRun = getNextRunDate();

  return (
    <div className="space-y-6">
      {/* Schedule Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Schedule Settings</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
            <Label>Enabled</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">
              <Calendar className="h-4 w-4 inline mr-2" />
              Frequency
            </Label>
            <Select value={frequency} onValueChange={setFrequency}>
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

          <div className="space-y-2">
            <Label htmlFor="time">
              <Clock className="h-4 w-4 inline mr-2" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {frequency === "weekly" && (
          <div className="space-y-2">
            <Label>Day of Week</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {frequency === "monthly" && (
          <div className="space-y-2">
            <Label>Day of Month</Label>
            <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (optional)</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipients">
            <Users className="h-4 w-4 inline mr-2" />
            Email Recipients (comma-separated)
          </Label>
          <Input
            id="recipients"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
          />
        </div>
      </div>

      <Separator />

      {/* Schedule Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Report:</span>
              <span className="font-medium">{reportConfig.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frequency:</span>
              <Badge variant="outline" className="capitalize">{frequency}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{time}</span>
            </div>
            {frequency === "weekly" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Day:</span>
                <span className="capitalize">{dayOfWeek}</span>
              </div>
            )}
            {frequency === "monthly" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Day of Month:</span>
                <span>{dayOfMonth}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Run:</span>
              <span className="font-medium">{nextRun.toLocaleString()}</span>
            </div>
            {recipients && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipients:</span>
                <span>{recipients.split(',').length} emails</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleScheduleReport}
          disabled={!recipients.trim()}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Create Schedule
        </Button>
      </div>
    </div>
  );
}