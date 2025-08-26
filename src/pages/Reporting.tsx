import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportTable } from "@/components/reports/ReportTable";
import { Plus, FileText, TrendingUp, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedCreateReportModal } from "@/components/reports/EnhancedCreateReportModal";
import { ReportResults } from "@/components/reports/ReportResults";
import { quickReportTemplates, mockSavedReports } from "@/data/mockData";

const reportTypes = quickReportTemplates;

export default function Reporting() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasReports, setHasReports] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'main' | 'results'>('main');
  const [savedReports, setSavedReports] = useState(mockSavedReports);
  const [reportResults, setReportResults] = useState<any>(null);

  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

  const handleViewResults = (reportConfig: any) => {
    setReportResults(reportConfig);
    setCurrentView('results');
  };

  const handleToggleFavorite = (reportId: string) => {
    setSavedReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, favorite: !report.favorite }
        : report
    ));
  };

  const handleEditReport = (report: any) => {
    setSelectedTemplate(report);
    setShowCreateModal(true);
  };

  const handleCopyReport = (report: any) => {
    const copiedReport = {
      ...report,
      id: `report-${Date.now()}`,
      name: `${report.name} (Copy)`,
      createdDate: new Date().toISOString(),
      favorite: false
    };
    setSavedReports(prev => [...prev, copiedReport]);
  };

  const handleDeleteReport = (report: any) => {
    setSavedReports(prev => prev.filter(r => r.id !== report.id));
  };

  const handleEmailReport = (report: any) => {
    console.log('Email report:', report);
  };

  const handleDownloadReport = (report: any) => {
    console.log('Download report:', report);
  };

  if (currentView === 'results' && reportResults) {
    return (
      <div className="p-6">
        <ReportResults 
          config={reportResults} 
          onBack={() => setCurrentView('main')}
        />
      </div>
    );
  }

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
                <DialogTitle>
                  {selectedTemplate ? `Create ${selectedTemplate.title}` : 'Create report'}
                </DialogTitle>
              </DialogHeader>
              <EnhancedCreateReportModal 
                template={selectedTemplate}
                onClose={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {hasReports ? (
        <>
          {/* Quick Reports */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTypes.map((report, index) => {
              const IconComponent = report.icon === "FileText" ? FileText : 
                                   report.icon === "TrendingUp" ? TrendingUp : BarChart3;
              
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{report.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleTemplateClick(report)}
                    >
                      Create Report
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleViewResults({
                        ...report,
                        name: report.title,
                        properties: ["1", "2"], // Mock selection
                        columns: report.defaultColumns,
                        filters: report.defaultFilters
                      })}
                    >
                      Quick View
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable onViewReport={handleViewResults} />
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