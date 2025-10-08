import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreHorizontal, Trash2, Play } from "lucide-react";
import { ReportDefinitionTab } from "@/components/reports/ReportDefinitionTab";
import { ReportHistoryTab } from "@/components/reports/ReportHistoryTab";
import { ConfirmationModal } from "@/components/reports/ConfirmationModal";
import { mockReportConfigs, mockReportInstances } from "@/data/mockData";

export default function ReportConfigDetail() {
  const { configId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("definition");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const config = mockReportConfigs.find(c => c.id === configId);
  const instances = mockReportInstances.filter(i => i.configId === configId);

  if (!config) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Report not found</h2>
          <Button onClick={() => navigate("/reporting")}>
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    console.log("Delete config:", configId);
    navigate("/reporting");
    setShowDeleteConfirm(false);
  };

  const handleGenerate = () => {
    // Navigate to Report History tab and trigger generation
    setActiveTab("history");
    // Would trigger generation logic here
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/reporting")}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>

        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{config.name}</h1>
              <Badge variant={config.reportType === 'Activity' ? 'default' : 'secondary'}>
                {config.reportType}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {config.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleGenerate}>
              <Play className="h-4 w-4 mr-2" />
              Generate New Version
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Report Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="definition">Definition</TabsTrigger>
          <TabsTrigger value="history">
            Report History ({instances.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="definition" className="space-y-6">
          <ReportDefinitionTab config={config} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ReportHistoryTab 
            configId={config.id} 
            instances={instances}
            onGenerate={handleGenerate}
          />
        </TabsContent>
      </Tabs>

      <ConfirmationModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Report Settings"
        description="Are you sure you want to delete this report configuration? This will also permanently delete all previously generated reports and they will no longer be accessible. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
