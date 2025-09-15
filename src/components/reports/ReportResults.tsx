import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Download,
  Mail,
  Calendar,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { dataSourceConfig, mockProperties } from "@/data/mockData";
import { EmailReportSheet } from "./EmailReportSheet";
import { ScheduleReportSheet } from "./ScheduleReportSheet";

interface ReportResultsProps {
  config: any;
  onBack: () => void;
}

export function ReportResults({ config, onBack }: ReportResultsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const rowsPerPage = 10;

  // Get and process data
  const { processedData, columnsConfig } = useMemo(() => {
    if (!config.dataSource || !dataSourceConfig[config.dataSource as keyof typeof dataSourceConfig]) {
      return { processedData: [], columnsConfig: [] };
    }

    let data = [...dataSourceConfig[config.dataSource as keyof typeof dataSourceConfig].data];
    
    // Filter by properties
    if (config.properties?.length > 0) {
      data = data.filter((item: any) => 
        config.properties.includes(item.propertyId)
      );
    }

    // Apply filters
    Object.entries(config.filters || {}).forEach(([key, value]) => {
      if (value && value !== "") {
        data = data.filter((item: any) => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return item[key] === value;
        });
      }
    });

    // Apply search
    if (searchTerm) {
      data = data.filter((item: any) =>
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortColumn) {
      data.sort((a: any, b: any) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    const columns = dataSourceConfig[config.dataSource as keyof typeof dataSourceConfig].columns.filter(col => 
      config.columns.includes(col.key)
    );

    return { processedData: data, columnsConfig: columns };
  }, [config, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = columnsConfig.map(col => col.label);
    const csvContent = [
      headers.join(","),
      ...processedData.map(row => 
        columnsConfig.map(col => {
          let value = row[col.key];
          if (col.key === "propertyId") {
            const property = mockProperties.find(p => p.id === value);
            value = property?.name || value;
          }
          return `"${String(value || "").replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.name || 'report'}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{config.name}</h2>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Sheet open={showEmailModal} onOpenChange={setShowEmailModal}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Email Report</SheetTitle>
              </SheetHeader>
              <EmailReportSheet 
                reportConfig={config}
                onClose={() => setShowEmailModal(false)}
              />
            </SheetContent>
          </Sheet>

          <Sheet open={showScheduleModal} onOpenChange={setShowScheduleModal}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Schedule Report</SheetTitle>
              </SheetHeader>
              <ScheduleReportSheet 
                reportConfig={config}
                onClose={() => setShowScheduleModal(false)}
              />
            </SheetContent>
          </Sheet>

          <Button onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{processedData.length}</div>
            <div className="text-sm text-muted-foreground">Total Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{config.properties?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Properties</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{config.columns?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Columns</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{Object.keys(config.filters || {}).length}</div>
            <div className="text-sm text-muted-foreground">Active Filters</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Card */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
        
        {/* Active Filters Card */}
        <Card className="flex-1 max-w-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {config.filters && Object.keys(config.filters).length > 0 
                    ? Object.keys(config.filters).length 
                    : 0}
                </span>
                <span className="text-sm text-muted-foreground">Active Filters</span>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            {/* Filter Pills */}
            {config.filters && Object.keys(config.filters).length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t">
                {Object.entries(config.filters).map(([key, value]) => {
                  if (!value || value === "") return null;
                  const column = columnsConfig.find(col => col.key === key);
                  const displayValue = typeof value === 'string' ? value : String(value);
                  return (
                    <Badge key={key} variant="secondary" className="gap-1">
                      {column?.label}: {displayValue}
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => {
                          const newFilters = { ...config.filters };
                          delete newFilters[key];
                          config.filters = newFilters;
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  {columnsConfig.map((column) => (
                    <TableHead 
                      key={column.key}
                      className="cursor-pointer hover:bg-muted/50 font-semibold text-foreground border-b"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row: any, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 border-b border-muted">
                    {columnsConfig.map((column) => (
                      <TableCell key={column.key} className="py-3">
                        {formatCellValue(row[column.key], column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, processedData.length)} of {processedData.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground">
                {currentPage} of {totalPages}
              </span>
              <button 
                className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}