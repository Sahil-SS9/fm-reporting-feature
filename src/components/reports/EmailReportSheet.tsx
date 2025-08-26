import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, Users, Calendar } from "lucide-react";

interface EmailReportSheetProps {
  reportConfig: any;
  onClose: () => void;
}

export function EmailReportSheet({ reportConfig, onClose }: EmailReportSheetProps) {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState(`Report: ${reportConfig.name}`);
  const [message, setMessage] = useState(`Please find the attached report "${reportConfig.name}" generated on ${new Date().toLocaleDateString()}.`);
  const [ccRecipients, setCcRecipients] = useState("");
  const [includeAttachment, setIncludeAttachment] = useState(true);

  const handleSendEmail = () => {
    // Simulate email sending
    console.log("Sending email:", {
      to: recipients,
      cc: ccRecipients,
      subject,
      message,
      attachment: includeAttachment ? `${reportConfig.name}.csv` : null,
      reportConfig
    });
    
    // Show success message (in real implementation)
    alert("Email sent successfully!");
    onClose();
  };

  const recipientList = recipients.split(',').filter(r => r.trim());
  const ccList = ccRecipients.split(',').filter(r => r.trim());

  return (
    <div className="space-y-6">
      {/* Email Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipients">
            <Users className="h-4 w-4 inline mr-2" />
            To (comma-separated emails)
          </Label>
          <Input
            id="recipients"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
          />
          {recipientList.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipientList.map((email, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {email.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cc">CC (optional)</Label>
          <Input
            id="cc"
            value={ccRecipients}
            onChange={(e) => setCcRecipients(e.target.value)}
            placeholder="cc1@example.com, cc2@example.com"
          />
          {ccList.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ccList.map((email, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {email.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <Separator />

      {/* Report Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Report Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Report Name:</span>
              <span className="font-medium">{reportConfig.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Source:</span>
              <span>{reportConfig.dataSource}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Columns:</span>
              <span>{reportConfig.columns?.length || 0} selected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Properties:</span>
              <span>{reportConfig.properties?.length || 0} selected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Generated:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachment Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="attachment"
                checked={includeAttachment}
                onChange={(e) => setIncludeAttachment(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="attachment">Include CSV attachment</Label>
            </div>
            {includeAttachment && (
              <Badge variant="outline">
                {reportConfig.name}.csv
              </Badge>
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
          onClick={handleSendEmail}
          disabled={!recipients.trim() || !subject.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Send Email
        </Button>
      </div>
    </div>
  );
}