import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Star, MoreHorizontal, Eye, Edit, Copy, Mail, Download, Trash2, Clock, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { SavedReport } from "@/data/mockData";

interface EnhancedReportCardProps {
  report: SavedReport;
  onView: (report: SavedReport) => void;
  onEdit: (report: SavedReport) => void;
  onCopy: (report: SavedReport) => void;
  onEmail: (report: SavedReport) => void;
  onDownload: (report: SavedReport) => void;
  onDelete: (report: SavedReport) => void;
  onToggleFavorite: (reportId: string) => void;
}

export const EnhancedReportCard: React.FC<EnhancedReportCardProps> = ({
  report,
  onView,
  onEdit,
  onCopy,
  onEmail,
  onDownload,
  onDelete,
  onToggleFavorite
}) => {
  const getReportTypeBadge = (type: SavedReport['reportType']) => {
    return (
      <Badge variant={type === 'Activity' ? 'default' : 'secondary'} className="text-xs">
        {type}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Never';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Never';
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold leading-tight">
                {report.name}
              </CardTitle>
              {getReportTypeBadge(report.reportType)}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {report.description}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(report.id)}
              className="h-8 w-8 p-0"
            >
              <Star
                className={`h-4 w-4 ${
                  report.favorite
                    ? "fill-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(report)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(report)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(report)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEmail(report)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(report)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(report)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created: {formatDate(report.createdDate)}</span>
            </div>
            {report.lastRun && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Last run: {formatDateTime(report.lastRun)}</span>
              </div>
            )}
          </div>
          
          {report.lastSent && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>Last sent: {formatDateTime(report.lastSent)}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {report.dataSource}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {report.columns.length} columns
            </Badge>
            {Object.keys(report.filters).length > 0 && (
              <Badge variant="outline" className="text-xs">
                {Object.keys(report.filters).length} filters
              </Badge>
            )}
          </div>

          <div className="pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onView(report)}
              className="w-full"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};