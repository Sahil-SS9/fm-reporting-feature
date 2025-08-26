import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Mail, Send, X } from "lucide-react";

interface ScheduleReportSheetProps {
  reportConfig: any;
  onClose: () => void;
}

export function ScheduleReportSheet({ reportConfig, onClose }: ScheduleReportSheetProps) {
  const [frequency, setFrequency] = useState("Weekly");
  const [recipients, setRecipients] = useState("");
  const [ccRecipients, setCcRecipients] = useState("");
  const [bccRecipients, setBccRecipients] = useState("");
  const [subject, setSubject] = useState(`${reportConfig.name}`);
  const [message, setMessage] = useState(`This is a report about productivity of centres`);
  const [fromAddress] = useState("Default will appear as from 'Mallcomm'");
  const [time, setTime] = useState("09:00");
  const [timezone, setTimezone] = useState("Pacific Time (US and...");
  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });

  const recipientList = recipients.split(',').filter(r => r.trim());
  const ccList = ccRecipients.split(',').filter(r => r.trim());
  const bccList = bccRecipients.split(',').filter(r => r.trim());

  const removeRecipient = (email: string, type: 'to' | 'cc' | 'bcc') => {
    if (type === 'to') {
      const newRecipients = recipientList.filter(r => r.trim() !== email).join(', ');
      setRecipients(newRecipients);
    } else if (type === 'cc') {
      const newCc = ccList.filter(r => r.trim() !== email).join(', ');
      setCcRecipients(newCc);
    } else if (type === 'bcc') {
      const newBcc = bccList.filter(r => r.trim() !== email).join(', ');
      setBccRecipients(newBcc);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day as keyof typeof prev]
    }));
  };

  const handleScheduleReport = () => {
    const scheduleConfig = {
      reportId: reportConfig.id,
      reportName: reportConfig.name,
      frequency,
      time,
      timezone,
      selectedDays,
      recipients: recipients.split(',').map(r => r.trim()).filter(Boolean),
      ccRecipients: ccRecipients.split(',').map(r => r.trim()).filter(Boolean),
      bccRecipients: bccRecipients.split(',').map(r => r.trim()).filter(Boolean),
      subject,
      message,
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="send-now" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send-now">Send email now</TabsTrigger>
          <TabsTrigger value="schedule">Create a schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send-now" className="space-y-4 mt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Send email now functionality will be available soon</p>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-6">
          {/* From Field */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
              {fromAddress}
            </div>
          </div>

          {/* Email To */}
          <div className="space-y-2">
            <Label htmlFor="recipients">Email to</Label>
            <Input
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="Enter email addresses, separated by commas"
            />
            {recipientList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipientList.map((email, index) => (
                  <Badge key={index} variant="secondary" className="text-xs gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {email.trim()}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:bg-destructive/20 rounded-full" 
                      onClick={() => removeRecipient(email.trim(), 'to')}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Email CC */}
          <div className="space-y-2">
            <Label htmlFor="cc">Email CC</Label>
            <Input
              id="cc"
              value={ccRecipients}
              onChange={(e) => setCcRecipients(e.target.value)}
              placeholder="Enter CC email addresses, separated by commas"
            />
            {ccList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {ccList.map((email, index) => (
                  <Badge key={index} variant="outline" className="text-xs gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    {email.trim()}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:bg-destructive/20 rounded-full" 
                      onClick={() => removeRecipient(email.trim(), 'cc')}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Email BCC */}
          <div className="space-y-2">
            <Label htmlFor="bcc">Email BCC</Label>
            <Input
              id="bcc"
              value={bccRecipients}
              onChange={(e) => setBccRecipients(e.target.value)}
              placeholder="Enter BCC email addresses, separated by commas"
            />
            {bccList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {bccList.map((email, index) => (
                  <Badge key={index} variant="outline" className="text-xs gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    {email.trim()}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:bg-destructive/20 rounded-full" 
                      onClick={() => removeRecipient(email.trim(), 'bcc')}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Separator />

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Days of the week */}
          {frequency === "Weekly" && (
            <div className="space-y-3">
              {Object.entries(selectedDays).map(([day, isSelected]) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={isSelected}
                      onCheckedChange={() => toggleDay(day)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label className="font-normal">{day}</Label>
                  </div>
                  {isSelected && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Set time</span>
                      </div>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-muted-foreground">Timezone</span>
                      </div>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pacific Time (US and...)">Pacific Time (US and...)</SelectItem>
                          <SelectItem value="Eastern Time (US and...)">Eastern Time (US and...)</SelectItem>
                          <SelectItem value="Central Time (US and...)">Central Time (US and...)</SelectItem>
                          <SelectItem value="Mountain Time (US and...)">Mountain Time (US and...)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleScheduleReport}
          disabled={!recipients.trim() || !subject.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
}