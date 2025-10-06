import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Star,
  Edit,
  Copy,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedCreateReportSheet } from "./EnhancedCreateReportSheet";
import { useToast } from "@/components/ui/use-toast";

interface Report {
  id: string;
  subject: string;
  from: string;
  status: "Active" | "Scheduled" | "Draft";
  lastRun?: string;
  nextRun?: string;
  favorite?: boolean;
}

interface ReportTableProps {
  onViewReport?: (report: Report) => void;
}

const mockReports: Report[] = [
  {
    id: "1",
    subject: "My Productivity report",
    from: "Mallcomm",
    status: "Active",
    lastRun: "2024-05-12 09:00",
    nextRun: "2024-05-19 09:00",
  },
  {
    id: "2",
    subject: "Summer report",
    from: "jonathan.smith@go...",
    status: "Scheduled",
    nextRun: "2024-06-01 10:00",
  },
];

export function ReportTable({ onViewReport }: ReportTableProps) {
  const [reports, setReports] = useState<Report[]>(() => {
    // Load saved reports from localStorage
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    const convertedReports = savedReports.map((saved: any) => ({
      id: saved.id,
      subject: saved.name,
      from: "User Created",
      status: "Draft" as const,
      lastRun: undefined,
      nextRun: undefined,
      favorite: false
    }));
    return [...mockReports.map(r => ({ ...r, favorite: false })), ...convertedReports];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "favorites">("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.from.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || (filterType === "favorites" && report.favorite);
    return matchesSearch && matchesFilter;
  });

  const handleToggleFavorite = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, favorite: !report.favorite }
        : report
    ));
    toast({
      title: "Updated",
      description: "Report favorite status updated",
    });
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleCopyReport = (report: Report) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      subject: `${report.subject} (Copy)`,
      status: "Draft" as const,
      lastRun: undefined,
      nextRun: undefined
    };
    setReports(prev => [...prev, newReport]);
    toast({
      title: "Report Copied",
      description: `"${report.subject}" has been copied`,
    });
  };

  const handleDownloadReport = (report: Report) => {
    // Simulate CSV download
    const csvContent = `Report: ${report.subject}\nStatus: ${report.status}\nFrom: ${report.from}\nLast Run: ${report.lastRun || 'N/A'}\nNext Run: ${report.nextRun || 'N/A'}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.subject.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast({
      title: "Download Started",
      description: `"${report.subject}" is being downloaded`,
    });
  };

  const handleDeleteReport = (report: Report) => {
    setReports(prev => prev.filter(r => r.id !== report.id));
    // Also remove from localStorage if it's a saved report
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    const updatedSaved = savedReports.filter((saved: any) => saved.id !== report.id);
    localStorage.setItem('savedReports', JSON.stringify(updatedSaved));
    toast({
      title: "Report Deleted",
      description: `"${report.subject}" has been deleted`,
      variant: "destructive"
    });
  };

  const handleRowClick = (report: Report) => {
    if (onViewReport) {
      onViewReport(report);
    }
  };

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={filterType === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("all")}
          >
            <Filter className="h-4 w-4 mr-2" />
            All reports
          </Button>
          <Button 
            variant={filterType === "favorites" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("favorites")}
          >
            <Star className="h-4 w-4 mr-2" />
            Favourites
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow 
                key={report.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => handleRowClick(report)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => handleToggleFavorite(report.id)}
                  >
                    <Star className={cn("h-3 w-3", report.favorite && "fill-current text-yellow-500")} />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{report.subject}</TableCell>
                <TableCell className="text-muted-foreground">{report.from}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {report.lastRun || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {report.nextRun || "-"}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border shadow-md">
                      <DropdownMenuItem onClick={() => handleEditReport(report)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyReport(report)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadReport(report)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteReport(report)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Showing {filteredReports.length} of {reports.length}</div>
        <div className="flex items-center space-x-2">
          <span>Page 1 of 1</span>
        </div>
      </div>

      {/* Edit Sheet */}
      <Sheet open={showEditModal} onOpenChange={setShowEditModal}>
        <SheetContent side="right" className="sm:max-w-4xl">
          <SheetHeader>
            <SheetTitle>Edit Report</SheetTitle>
          </SheetHeader>
          {selectedReport && (
            <EnhancedCreateReportSheet 
              template={null}
              onClose={() => {
                setShowEditModal(false);
                setSelectedReport(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}