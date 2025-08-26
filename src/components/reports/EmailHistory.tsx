import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Calendar as CalendarIcon, Filter, Mail, Clock } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval, parseISO } from "date-fns";
import { mockEmailHistory, type EmailHistory as EmailHistoryType } from "@/data/mockData";

import { useToast } from "@/hooks/use-toast";

export const EmailHistory: React.FC = () => {
  const [emailHistory] = useState<EmailHistoryType[]>(mockEmailHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredHistory = emailHistory.filter(email => {
    // Search filter
    const matchesSearch = email.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.recipients.some(recipient => 
                           recipient.toLowerCase().includes(searchTerm.toLowerCase())
                         );

    // Date range filter
    const emailDate = parseISO(email.sentDate);
    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
                           isWithinInterval(emailDate, { start: dateRange.from, end: dateRange.to });

    // Status filter
    const matchesStatus = statusFilter === "all" || email.status === statusFilter;

    // Type filter
    const matchesType = typeFilter === "all" || email.type === typeFilter;

    return matchesSearch && matchesDateRange && matchesStatus && matchesType;
  }).sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());

  const handleRedownload = (email: EmailHistoryType) => {
    toast({
      title: "Download started",
      description: `Re-downloading "${email.reportName}" report.`
    });
    // Simulate download
    setTimeout(() => {
      const blob = new Blob([`Report: ${email.reportName}\nSent: ${email.sentDate}`], 
                           { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${email.reportName.replace(/\s+/g, '_')}_${format(parseISO(email.sentDate), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }, 500);
  };

  const getStatusBadge = (status: EmailHistoryType['status']) => {
    const variants = {
      sent: "default" as const,
      failed: "destructive" as const,
      pending: "secondary" as const
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeBadge = (type: EmailHistoryType['type']) => {
    const variants = {
      scheduled: "outline" as const,
      manual: "secondary" as const
    };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email History
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports, recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from && dateRange?.to 
                  ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                  : "Date Range"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          {(dateRange?.from || dateRange?.to || statusFilter !== "all" || typeFilter !== "all") && (
            <Button
              variant="ghost"
            onClick={() => {
                setDateRange(undefined);
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Sent Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((email) => (
              <TableRow key={email.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div>
                    <div className="font-medium">{email.reportName}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {email.subject}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {email.recipients.slice(0, 2).join(", ")}
                      {email.recipients.length > 2 && ` +${email.recipients.length - 2} more`}
                    </div>
                    {email.ccRecipients && email.ccRecipients.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        CC: {email.ccRecipients.slice(0, 1).join(", ")}
                        {email.ccRecipients.length > 1 && ` +${email.ccRecipients.length - 1} more`}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm">{format(parseISO(email.sentDate), 'MMM dd, yyyy')}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(email.sentDate), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(email.type)}</TableCell>
                <TableCell>{getStatusBadge(email.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {email.attachmentSize}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRedownload(email)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <div className="text-lg font-medium mb-2">No email history found</div>
            <div className="text-sm">
              {searchTerm || dateRange?.from || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "No reports have been emailed yet."}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};