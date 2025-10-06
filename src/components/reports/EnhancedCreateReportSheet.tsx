import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Eye, AlertCircle } from "lucide-react";
import { mockProperties, dataSourceConfig, type ColumnConfig } from "@/data/mockData";
import { ReportPreview } from "./ReportPreview";
import { ConfirmationModal } from "./ConfirmationModal";
import { GenerateReportModal } from "./GenerateReportModal";
import { EnhancedFilters } from "./EnhancedFilters";
import { DraggableColumnItem } from "./DraggableColumnList";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useToast } from "@/hooks/use-toast";

interface CreateReportSheetProps {
  onClose: () => void;
  template?: any;
}

export function EnhancedCreateReportSheet({ onClose, template }: CreateReportSheetProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(false);
  const [step3Open, setStep3Open] = useState(false);
  const [step4Open, setStep4Open] = useState(false);
  
  // Form state
  const [reportName, setReportName] = useState(template?.title || "");
  const [description, setDescription] = useState(template?.description || "");
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedDataSource, setSelectedDataSource] = useState(template?.dataSource || "");
  const [reportType, setReportType] = useState<"Activity" | "Performance">("Activity");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(template?.defaultColumns || []);
  const [filters, setFilters] = useState<Record<string, any>>(template?.defaultFilters || {});
  const [showPreview, setShowPreview] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState("");
  const [descError, setDescError] = useState("");

  // Modal states
  const [showDataSourceConfirm, setShowDataSourceConfirm] = useState(false);
  const [showReportTypeConfirm, setShowReportTypeConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [pendingDataSource, setPendingDataSource] = useState("");
  const [pendingReportType, setPendingReportType] = useState<"Activity" | "Performance">("Activity");
  const [isDirty, setIsDirty] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get available columns based on selected data source and report type
  const getAvailableColumns = (): ColumnConfig[] => {
    if (!selectedDataSource) return [];
    
    const dataSource = dataSourceConfig[selectedDataSource as keyof typeof dataSourceConfig];
    if (!dataSource) return [];
    
    const columns = reportType === "Activity" 
      ? (dataSource as any).activityColumns 
      : (dataSource as any).performanceColumns;
    
    return columns || [];
  };

  const availableColumns = getAvailableColumns();
  const selectedColumnsCount = selectedColumns.length;

  // Track dirty state
  useEffect(() => {
    if (reportName || description || selectedProperty || selectedDataSource || selectedColumns.length > 0) {
      setIsDirty(true);
    }
  }, [reportName, description, selectedProperty, selectedDataSource, selectedColumns]);

  // Validation
  const validateStep1 = () => {
    let valid = true;
    if (!reportName.trim()) {
      setNameError("Report name is required");
      valid = false;
    } else if (reportName.length > 100) {
      setNameError("Report name must be less than 100 characters");
      valid = false;
    } else {
      setNameError("");
    }

    if (description.length > 500) {
      setDescError("Description must be less than 500 characters");
      valid = false;
    } else {
      setDescError("");
    }

    if (!selectedProperty) {
      valid = false;
    }

    return valid;
  };

  const isStep1Valid = reportName.trim() !== "" && reportName.length <= 100 && 
                       description.length <= 500 && selectedProperty !== "";
  const isStep2Valid = selectedDataSource !== "";
  const isStep3Valid = selectedColumns.length > 0;
  const isStep4Valid = true;
  
  // Check date range validity in filters
  const hasValidDateRanges = () => {
    const dateFilters = Object.keys(filters).filter(key => key.endsWith('_start'));
    for (const startKey of dateFilters) {
      const endKey = startKey.replace('_start', '_end');
      const start = filters[startKey];
      const end = filters[endKey];
      if (start && end && new Date(start) >= new Date(end)) {
        return false;
      }
    }
    return true;
  };

  const isAllStepsValid = isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid && hasValidDateRanges();

  const handleNextStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setStep1Open(false);
        setStep2Open(true);
      }
    } else if (currentStep === 2 && isStep2Valid) {
      setStep2Open(false);
      setStep3Open(true);
    } else if (currentStep === 3 && isStep3Valid) {
      setStep3Open(false);
      setStep4Open(true);
    }
  };

  const handleDataSourceChange = (value: string) => {
    if (selectedColumns.length > 0 && value !== selectedDataSource) {
      setPendingDataSource(value);
      setShowDataSourceConfirm(true);
    } else {
      setSelectedDataSource(value);
      setSelectedColumns([]);
    }
  };

  const confirmDataSourceChange = () => {
    setSelectedDataSource(pendingDataSource);
    setSelectedColumns([]);
    setShowDataSourceConfirm(false);
  };

  const handleReportTypeChange = (value: "Activity" | "Performance") => {
    if (selectedColumns.length > 0 && value !== reportType) {
      setPendingReportType(value);
      setShowReportTypeConfirm(true);
    } else {
      setReportType(value);
      setSelectedColumns([]);
    }
  };

  const confirmReportTypeChange = () => {
    setReportType(pendingReportType);
    setSelectedColumns([]);
    setShowReportTypeConfirm(false);
  };

  const handleColumnChange = (columnKey: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, columnKey]);
    } else {
      setSelectedColumns(prev => prev.filter(key => key !== columnKey));
    }
  };

  const handleSelectAllColumns = () => {
    const allColumnKeys = availableColumns.map(col => col.key);
    setSelectedColumns(allColumnKeys);
  };

  const handleClearAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedColumns((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleColumnToggle = (columnKey: string) => {
    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(prev => prev.filter(key => key !== columnKey));
    } else {
      setSelectedColumns(prev => [...prev, columnKey]);
    }
  };

  const handleSave = async () => {
    try {
      const reportConfig = {
        name: reportName,
        description,
        properties: [selectedProperty],
        dataSource: selectedDataSource,
        reportType,
        columns: selectedColumns,
        filters,
        status: 'draft',
        createdAt: new Date().toISOString(),
        id: `config-${Date.now()}`
      };
      
      // Simulate save (replace with actual API call)
      const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
      savedReports.push(reportConfig);
      localStorage.setItem('savedReports', JSON.stringify(savedReports));
      
      toast({
        title: "Report saved successfully",
        description: "Your report configuration has been saved.",
      });

      onClose();
      setShowGenerateModal(true);
    } catch (error) {
      toast({
        title: "Failed to save report",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = () => {
    setShowGenerateModal(false);
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    const configId = savedReports[savedReports.length - 1]?.id;
    if (configId) {
      navigate(`/reports/${configId}?tab=history&generate=true`);
    }
  };

  const handleLater = () => {
    setShowGenerateModal(false);
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    const configId = savedReports[savedReports.length - 1]?.id;
    if (configId) {
      navigate(`/reports/${configId}`);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  };

  // Check for no property access
  const hasPropertyAccess = mockProperties.length > 0;

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="space-y-6 pb-6">
        {!hasPropertyAccess && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">No Property Access</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have access to any properties. Please contact your administrator.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Basic Details & Property Selection */}
        <Collapsible open={step1Open} onOpenChange={setStep1Open} disabled={!hasPropertyAccess}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 1: Report Details & Property Selection</h3>
          {step1Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">
                  Report name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name (1-100 characters)"
                  maxLength={100}
                />
                <div className="flex justify-between text-xs">
                  {nameError && <span className="text-destructive">{nameError}</span>}
                  <span className="text-muted-foreground ml-auto">{reportName.length}/100</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this report (max 500 characters)"
                  rows={2}
                  maxLength={500}
                />
                <div className="flex justify-between text-xs">
                  {descError && <span className="text-destructive">{descError}</span>}
                  <span className="text-muted-foreground ml-auto">{description.length}/500</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property">
                  Property <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger id="property">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedProperty && (
                  <p className="text-xs text-muted-foreground">Please select a property to continue</p>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => handleNextStep(1)}
                  disabled={!isStep1Valid}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 2: Data Source Selection & Report Type */}
      <Collapsible open={step2Open} onOpenChange={setStep2Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 2: Select Data Source & Report Type</h3>
          {step2Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>
                  Data Source <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedDataSource} onValueChange={handleDataSourceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(dataSourceConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedDataSource && (
                <>
                  <div className="space-y-3 pt-2">
                    <Label>
                      Report Type <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex flex-col space-y-3">
                      <div 
                        className={`flex items-start space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          reportType === "Performance" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleReportTypeChange("Performance")}
                      >
                        <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          reportType === "Performance" ? "border-primary" : "border-muted-foreground"
                        }`}>
                          {reportType === "Performance" && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Performance Report</div>
                          <div className="text-sm text-muted-foreground">
                            Metrics and KPIs to evaluate efficiency and success over time
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`flex items-start space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          reportType === "Activity" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleReportTypeChange("Activity")}
                      >
                        <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          reportType === "Activity" ? "border-primary" : "border-muted-foreground"
                        }`}>
                          {reportType === "Activity" && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Activity Report</div>
                          <div className="text-sm text-muted-foreground">
                            Detailed raw data on specific records and operational details
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium">Available Data Points</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {availableColumns.length} columns available for reporting
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => handleNextStep(2)}
                  disabled={!isStep2Valid}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 3: Column Selection (View Only) */}
      <Collapsible open={step3Open} onOpenChange={setStep3Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 3: Available Columns ({selectedColumnsCount} selected)</h3>
          {step3Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label>Available Columns</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    These columns will be available in your report
                  </p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedColumns.map((columnKey, index) => {
                      const column = availableColumns.find(c => c.key === columnKey);
                      return column ? (
                        <div 
                          key={column.key}
                          className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{column.label}</div>
                            <div className="text-xs text-muted-foreground capitalize">{column.type}</div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {selectedColumns.length === 0 && (
                  <p className="text-sm text-muted-foreground">No columns selected</p>
                )}

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={() => handleNextStep(3)}
                    disabled={!isStep3Valid}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 4: Filters */}
      <Collapsible open={step4Open} onOpenChange={setStep4Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">
            Step 4: {reportType === "Performance" ? "Analysis Settings" : "Report Filters"}
          </h3>
          {step4Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6">
              {selectedDataSource && selectedColumns.length > 0 && (
                <EnhancedFilters
                  dataSource={selectedDataSource}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  reportType={reportType}
                  onSkip={handleSave}
                  onSave={handleSave}
                />
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Cancel Button */}
      <div className="flex items-center justify-start pt-4 border-t">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        open={showDataSourceConfirm}
        onOpenChange={setShowDataSourceConfirm}
        title="Change Data Source?"
        description="Changing data source will clear your column selections. Continue?"
        confirmLabel="Continue"
        cancelLabel="Cancel"
        onConfirm={confirmDataSourceChange}
        onCancel={() => setShowDataSourceConfirm(false)}
      />

      <ConfirmationModal
        open={showReportTypeConfirm}
        onOpenChange={setShowReportTypeConfirm}
        title="Change Report Type?"
        description="Changing report type will clear your column selections. Continue?"
        confirmLabel="Continue"
        cancelLabel="Cancel"
        onConfirm={confirmReportTypeChange}
        onCancel={() => setShowReportTypeConfirm(false)}
      />

      <ConfirmationModal
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Discard unsaved report?"
        description="You have unsaved changes. Are you sure you want to discard this report?"
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        onConfirm={onClose}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <GenerateReportModal
        open={showGenerateModal}
        onOpenChange={setShowGenerateModal}
        onGenerate={handleGenerate}
        onLater={handleLater}
      />
    </>
  );
}