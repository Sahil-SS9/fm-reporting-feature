import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Layers, Filter, Calendar, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ReportConfig } from "@/data/mockData";

interface ReportDefinitionTabProps {
  config: ReportConfig;
}

export const ReportDefinitionTab: React.FC<ReportDefinitionTabProps> = ({ config }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>Property</span>
              </div>
              <p className="text-base font-medium">{config.property.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span>Data Source</span>
              </div>
              <Badge variant="outline">{config.dataSource}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Created By</span>
              </div>
              <p className="text-base">{config.createdBy.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <p className="text-base">{formatDate(config.createdAt)}</p>
            </div>

            {config.lastModified && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last Modified</span>
                </div>
                <p className="text-base">{formatDateTime(config.lastModified)}</p>
              </div>
            )}

            {config.lastGeneratedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last Generated</span>
                </div>
                <p className="text-base">{formatDateTime(config.lastGeneratedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Columns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Selected Columns ({config.columns.length} selected)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <ol className="list-decimal list-inside space-y-1">
              {config.columns.map((column, index) => (
                <li key={index} className="text-sm">
                  <span className="ml-2 font-medium">
                    {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
