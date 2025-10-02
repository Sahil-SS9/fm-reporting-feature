import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Mail, Download, CheckCircle2, User } from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { EmailHistoryRecord, ReportInstance } from "@/data/mockData";

interface EmailHistoryTabProps {
  configId: string;
  emails: EmailHistoryRecord[];
  instances: ReportInstance[];
}

export const EmailHistoryTab: React.FC<EmailHistoryTabProps> = ({ 
  configId,
  emails, 
  instances 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmails = emails.filter(email => 
    email.recipientsTo.some(r => r.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (email.recipientsCc && email.recipientsCc.some(r => r.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy h:mm a');
    } catch {
      return 'N/A';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getInstanceDate = (instanceId: string) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return 'N/A';
    try {
      return format(parseISO(instance.generatedAt), 'MMM dd, yyyy h:mm a');
    } catch {
      return 'N/A';
    }
  };

  const formatRecipients = (recipients: string[], ccRecipients?: string[]) => {
    const total = recipients.length + (ccRecipients?.length || 0);
    const display = recipients.slice(0, 2);
    const remaining = total - display.length;
    
    return (
      <div className="space-y-1">
        {display.map((email, i) => (
          <div key={i} className="text-sm">{email}</div>
        ))}
        {remaining > 0 && (
          <div className="text-xs text-muted-foreground">
            +{remaining} more
          </div>
        )}
      </div>
    );
  };

  const getAllRecipients = (recipients: string[], ccRecipients?: string[]) => {
    const all = [...recipients];
    if (ccRecipients && ccRecipients.length > 0) {
      all.push(...ccRecipients.map(cc => `CC: ${cc}`));
    }
    return all.join('\n');
  };

  const handleDownload = (email: EmailHistoryRecord) => {
    console.log("Download CSV for email:", email.id);
    // Would trigger CSV download
  };

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <Mail className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">No emails sent yet</h2>
          <p className="text-muted-foreground max-w-md">
            Generate a report instance and click 'Email' to send it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Email History ({emails.length} emails sent)
        </h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sent</TableHead>
              <TableHead>Instance</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Sent By</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No emails found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            ) : (
              filteredEmails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{formatDateTime(email.sentAt)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(email.sentAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-sm"
                      onClick={() => navigate(`/reports/${configId}/instances/${email.instanceId}/results`)}
                    >
                      {getInstanceDate(email.instanceId)}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            {formatRecipients(email.recipientsTo, email.recipientsCc)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <pre className="text-xs whitespace-pre-wrap">
                            {getAllRecipients(email.recipientsTo, email.recipientsCc)}
                          </pre>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{email.sentBy.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Manual</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {email.status === 'sent' ? 'Sent' : 'Failed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {email.csvAttached && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(email)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
