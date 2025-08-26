import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { dataSourceConfig, mockProperties } from "@/data/mockData";

interface ReportPreviewProps {
  dataSource: string;
  columns: string[];
  filters: Record<string, any>;
  properties: string[];
}

export function ReportPreview({ dataSource, columns, filters, properties }: ReportPreviewProps) {
  const previewData = useMemo(() => {
    if (!dataSource || !dataSourceConfig[dataSource as keyof typeof dataSourceConfig]) {
      return [];
    }

    let data: any[] = [...dataSourceConfig[dataSource as keyof typeof dataSourceConfig].data];
    
    // Filter by properties if specified
    if (properties.length > 0 && data.some((item: any) => item.propertyId)) {
      data = data.filter((item: any) => properties.includes(item.propertyId));
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        data = data.filter((item: any) => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return item[key] === value;
        });
      }
    });

    // Return only first 5 rows for preview
    return data.slice(0, 5);
  }, [dataSource, filters, properties]);

  const columnsConfig = useMemo(() => {
    if (!dataSource || !dataSourceConfig[dataSource as keyof typeof dataSourceConfig]) {
      return [];
    }
    return dataSourceConfig[dataSource as keyof typeof dataSourceConfig].columns.filter(col => 
      columns.includes(col.key)
    );
  }, [dataSource, columns]);

  const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property?.name || propertyId;
  };

  const formatCellValue = (value: any, column: any) => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (column.key === "propertyId") {
      return getPropertyName(value);
    }

    if (column.type === "select") {
      const statusColors: Record<string, string> = {
        "Open": "bg-blue-100 text-blue-800",
        "In Progress": "bg-yellow-100 text-yellow-800", 
        "Completed": "bg-green-100 text-green-800",
        "Overdue": "bg-red-100 text-red-800",
        "Active": "bg-green-100 text-green-800",
        "Maintenance": "bg-orange-100 text-orange-800",
        "Decommissioned": "bg-gray-100 text-gray-800",
        "Critical": "bg-red-100 text-red-800",
        "High": "bg-orange-100 text-orange-800",
        "Medium": "bg-yellow-100 text-yellow-800",
        "Low": "bg-green-100 text-green-800"
      };
      
      const colorClass = statusColors[value] || "bg-gray-100 text-gray-800";
      return <Badge className={colorClass}>{value}</Badge>;
    }

    if (column.type === "date") {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === "number") {
      return typeof value === "number" ? value.toLocaleString() : value;
    }

    return value;
  };

  if (!previewData.length) {
    return (
      <div className="p-8 text-center bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No data available for preview with current filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Report Preview</h4>
        <div className="text-sm text-muted-foreground">
          Showing first 5 rows • {previewData.length} records match filters
        </div>
      </div>
      
      <div className="border rounded-lg overflow-auto max-h-80">
        <Table>
          <TableHeader>
            <TableRow>
              {columnsConfig.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row: any, index) => (
              <TableRow key={index}>
                {columnsConfig.map((column) => (
                  <TableCell key={column.key} className="whitespace-nowrap">
                    {formatCellValue(row[column.key], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}