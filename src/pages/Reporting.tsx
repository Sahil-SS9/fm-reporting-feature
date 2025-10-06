import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Plus, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EnhancedCreateReportSheet } from "@/components/reports/EnhancedCreateReportSheet";
import { EnhancedReportCard } from "@/components/reports/EnhancedReportCard";
import { ReportResults } from "@/components/reports/ReportResults";
import { quickReportTemplates, mockReportConfigs, SavedReport, ReportConfig } from "@/data/mockData";

// Convert ReportConfig to SavedReport for backwards compatibility
const convertConfigToSavedReport = (config: ReportConfig): SavedReport => ({
  id: config.id,
  name: config.name,
  description: config.description,
  reportType: config.reportType,
  properties: [config.property.id],
  dataSource: config.dataSource,
  columns: config.columns,
  filters: config.filters,
  createdDate: config.createdAt,
  lastRun: config.lastGeneratedAt,
  favorite: config.favorite,
  userId: "user1" // Mock user ID
});

export default function Reporting() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasReports, setHasReports] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'main' | 'results'>('main');
  const [savedReports, setSavedReports] = useState<SavedReport[]>(
    mockReportConfigs.map(convertConfigToSavedReport)
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [reportResults, setReportResults] = useState<any>(null);


  const handleToggleFavorite = (reportId: string) => {
    setSavedReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, favorite: !report.favorite }
        : report
    ));
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
          {/* Main Reports Section */}
          <div className="space-y-4">
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
                    onView={() => navigate(`/reports/${report.id}`)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
            </div>
          </div>
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