import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportTable } from "@/components/reports/ReportTable";
import { Plus, FileText, TrendingUp, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateReportModal } from "@/components/reports/CreateReportModal";

const reportTypes = [
  {
    title: "Cases report",
    description: "Report about performance",
    icon: FileText,
  },
  {
    title: "Inspections report", 
    description: "Report about inspections",
    icon: TrendingUp,
  },
  {
    title: "Maintenance report",
    description: "Report about maintenance",
    icon: BarChart3,
  },
];

export default function Reporting() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasReports, setHasReports] = useState(true);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reporting</h1>
          <p className="text-muted-foreground">
            Create and manage your facility reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create report</DialogTitle>
              </DialogHeader>
              <CreateReportModal onClose={() => setShowCreateModal(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {hasReports ? (
        <>
          {/* Quick Reports */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTypes.map((report, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable />
            </CardContent>
          </Card>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">No reports created</h2>
            <p className="text-muted-foreground max-w-md">
              Looks like a report has not been created yet. Get started today
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            Get started
          </Button>
        </div>
      )}
    </div>
  );
}