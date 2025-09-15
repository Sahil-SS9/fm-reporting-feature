import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, FileText, TrendingUp, BarChart3, Star } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EnhancedCreateReportSheet } from "@/components/reports/EnhancedCreateReportSheet";
import { EnhancedReportCard } from "@/components/reports/EnhancedReportCard";
import { EmailHistory } from "@/components/reports/EmailHistory";
import { ScheduleManagement } from "@/components/reports/ScheduleManagement";
import { ReportResults } from "@/components/reports/ReportResults";
import { EmailReportSheet } from "@/components/reports/EmailReportSheet";
import { ScheduleReportSheet } from "@/components/reports/ScheduleReportSheet";
import { quickReportTemplates, mockSavedReports, SavedReport } from "@/data/mockData";

const reportTypes = quickReportTemplates;

export default function Reporting() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasReports, setHasReports] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'main' | 'results'>('main');
  const [savedReports, setSavedReports] = useState(mockSavedReports);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [reportResults, setReportResults] = useState<any>(null);
  const [showEmailSheet, setShowEmailSheet] = useState(false);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);
  const [emailReportConfig, setEmailReportConfig] = useState<any>(null);
  const [scheduleReportConfig, setScheduleReportConfig] = useState<any>(null);

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
    setEmailReportConfig(report);
    setShowEmailSheet(true);
  };

  const handleDownloadReport = (report: any) => {
    // Create CSV content
    const csvContent = `Report Name,Data Source,Columns,Created Date\n${report.name},${report.dataSource || 'N/A'},${report.columns?.length || 0},${report.createdDate}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleScheduleReport = (report: any) => {
    setScheduleReportConfig(report);
    setShowScheduleSheet(true);
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
          <Sheet open={showCreateModal} onOpenChange={setShowCreateModal}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create report
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-4xl">
              <SheetHeader>
                <SheetTitle>
                  {selectedTemplate ? `Create ${selectedTemplate.title}` : 'Create report'}
                </SheetTitle>
              </SheetHeader>
              <EnhancedCreateReportSheet 
                template={selectedTemplate}
                onClose={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                }} 
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {hasReports ? (
        <>
          {/* Report Templates */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="templates">
              <AccordionTrigger className="text-lg font-semibold flex-col items-start space-y-2 hover:no-underline">
                <span>Report Templates</span>
                <div className="text-sm text-muted-foreground font-normal">Click to expand templates</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
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
                            size="sm" 
                            className="w-full"
                            onClick={() => handleTemplateClick(report)}
                          >
                            Create Report
                          </Button>
                          <Button 
                            variant="outline" 
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Main Reports Section */}
          <Tabs defaultValue="saved-reports" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="saved-reports">Saved Reports</TabsTrigger>
              <TabsTrigger value="schedules">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="email-history">Email History</TabsTrigger>
            </TabsList>

            <TabsContent value="saved-reports" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={!showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(false)}
                  >
                    View All
                  </Button>
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(true)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Favorites Only
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedReports
                  .filter(report => !showFavoritesOnly || report.favorite)
                  .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
                  .map((report) => (
                    <EnhancedReportCard
                      key={report.id}
                      report={report}
                      onView={handleViewResults}
                      onEdit={handleEditReport}
                      onCopy={handleCopyReport}
                      onEmail={handleEmailReport}
                      onDownload={handleDownloadReport}
                      onSchedule={handleScheduleReport}
                      onDelete={handleDeleteReport}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="schedules">
              <ScheduleManagement />
            </TabsContent>

            <TabsContent value="email-history">
              <EmailHistory />
            </TabsContent>
          </Tabs>
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

      {/* Email Report Sheet */}
      <Sheet open={showEmailSheet} onOpenChange={setShowEmailSheet}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Email Report</SheetTitle>
          </SheetHeader>
          {emailReportConfig && (
            <EmailReportSheet 
              reportConfig={emailReportConfig}
              onClose={() => setShowEmailSheet(false)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Schedule Report Sheet */}
      <Sheet open={showScheduleSheet} onOpenChange={setShowScheduleSheet}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Schedule Report</SheetTitle>
          </SheetHeader>
          {scheduleReportConfig && (
            <ScheduleReportSheet 
              reportConfig={scheduleReportConfig}
              onClose={() => setShowScheduleSheet(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}