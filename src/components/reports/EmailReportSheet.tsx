import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, X } from "lucide-react";

interface EmailReportSheetProps {
  reportConfig: any;
  onClose: () => void;
}

function EmailReportSheet({ reportConfig, onClose }: EmailReportSheetProps) {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState(`${reportConfig.name}`);
  const [message, setMessage] = useState(`This is a report about productivity of centres`);
  const [ccRecipients, setCcRecipients] = useState("");
  const [bccRecipients, setBccRecipients] = useState("");
  const [includeAttachment, setIncludeAttachment] = useState(true);
  const [fromAddress] = useState("Default will appear as from 'Mallcomm'");

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

  return (
    <div className="space-y-6">
      <div className="space-y-4 mt-6">
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
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSendEmail}
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

export { EmailReportSheet };
export default EmailReportSheet;