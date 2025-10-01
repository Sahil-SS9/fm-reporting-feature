import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, X, Eye } from "lucide-react";
import { mockProperties, dataSourceConfig, type Property, type ColumnConfig } from "@/data/mockData";
import { ReportPreview } from "./ReportPreview";

interface CreateReportSheetProps {
  onClose: () => void;
  template?: any;
}

export function EnhancedCreateReportSheet({ onClose, template }: CreateReportSheetProps) {
  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(false);
  const [step3Open, setStep3Open] = useState(false);
  const [step4Open, setStep4Open] = useState(false);
  
  // Form state
  const [reportName, setReportName] = useState(template?.title || "");
  const [description, setDescription] = useState(template?.description || "");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isMultiProperty, setIsMultiProperty] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState(template?.dataSource || "");
  const [reportType, setReportType] = useState<"Activity" | "Performance">("Activity");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(template?.defaultColumns || []);
  const [filters, setFilters] = useState<Record<string, any>>(template?.defaultFilters || {});
  const [showPreview, setShowPreview] = useState(false);

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

  // Validation logic for each step
  const isStep1Valid = reportName.trim() !== "" && selectedProperties.length > 0;
  const isStep2Valid = selectedDataSource !== "";
  const isStep3Valid = selectedColumns.length > 0;
  const isStep4Valid = true; // Filters are optional
  const isAllStepsValid = isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid;

  const handleNextStep = (currentStep: number) => {
    if (currentStep === 1 && isStep1Valid) {
      setStep1Open(false);
      setStep2Open(true);
    } else if (currentStep === 2 && isStep2Valid) {
      setStep2Open(false);
      setStep3Open(true);
    } else if (currentStep === 3 && isStep3Valid) {
      setStep3Open(false);
      setStep4Open(true);
    }
  };

  const handlePropertyChange = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties(prev => [...prev, propertyId]);
    } else {
      setSelectedProperties(prev => prev.filter(id => id !== propertyId));
    }
  };

  const handleColumnChange = (columnKey: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, columnKey]);
    } else {
      setSelectedColumns(prev => prev.filter(key => key !== columnKey));
    }
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleSave = () => {
    const reportConfig = {
      name: reportName,
      description,
      properties: selectedProperties,
      isMultiProperty,
      dataSource: selectedDataSource,
      reportType,
      columns: selectedColumns,
      filters,
      createdAt: new Date().toISOString(),
      id: `report_${Date.now()}`
    };
    
    // Save to localStorage for persistence
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    savedReports.push(reportConfig);
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
    
    console.log("Report saved:", reportConfig);
    onClose();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 pb-6">
      {/* Step 1: Basic Details & Property Selection */}
      <Collapsible open={step1Open} onOpenChange={setStep1Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 1: Report Details & Property Selection</h3>
          {step1Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report name</Label>
                  <Input
                    id="reportName"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Enter report name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Report Scope</Label>
                  <Select value={isMultiProperty ? "multi" : "single"} onValueChange={(value) => setIsMultiProperty(value === "multi")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Property</SelectItem>
                      <SelectItem value="multi">Multi-Property / Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this report"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Select Properties</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {mockProperties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={(checked) => handlePropertyChange(property.id, !!checked)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{property.name}</div>
                        <div className="text-sm text-muted-foreground">{property.location}</div>
                      </div>
                      <Badge variant="outline">{property.type}</Badge>
                    </div>
                  ))}
                </div>
                {selectedProperties.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedProperties.length} {selectedProperties.length === 1 ? 'property' : 'properties'} selected
                  </div>
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
                <Label>Data Source</Label>
                <Select value={selectedDataSource} onValueChange={(value) => {
                  setSelectedDataSource(value);
                  setSelectedColumns([]); // Reset selected columns when data source changes
                }}>
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
                    <Label>Report Type</Label>
                    <div className="flex flex-col space-y-3">
                      <div 
                        className={`flex items-start space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          reportType === "Performance" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => {
                          setReportType("Performance");
                          setSelectedColumns([]); // Reset selected columns when report type changes
                        }}
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
                        onClick={() => {
                          setReportType("Activity");
                          setSelectedColumns([]); // Reset selected columns when report type changes
                        }}
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

      {/* Step 3: Column Selection */}
      <Collapsible open={step3Open} onOpenChange={setStep3Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 3: Select Columns ({selectedColumnsCount} selected)</h3>
          {step3Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Available Columns</Label>
                  <div className="text-sm text-muted-foreground">
                    {selectedColumnsCount} of {availableColumns.length} selected
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {availableColumns.map((column) => (
                    <div key={column.key} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedColumns.includes(column.key)}
                          onCheckedChange={(checked) => handleColumnChange(column.key, !!checked)}
                        />
                        <div>
                          <div className="font-medium text-sm">{column.label}</div>
                          <div className="text-xs text-muted-foreground capitalize">{column.type}</div>
                        </div>
                      </div>
                      {selectedColumns.includes(column.key) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleColumnChange(column.key, false)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

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

      {/* Step 4: Filters & Preview */}
      <Collapsible open={step4Open} onOpenChange={setStep4Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 4: Filters & Preview</h3>
          {step4Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Report Filters</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>

              {selectedDataSource && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableColumns
                    .filter(col => col.type === "select" || col.type === "date")
                    .map((column) => (
                      <div key={column.key} className="space-y-2">
                        <Label>{column.label}</Label>
                        {column.type === "select" && column.options && (
                          <Select
                            value={filters[column.key] || undefined}
                            onValueChange={(value) => handleFilterChange(column.key, value === "all" ? "" : value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Filter by ${column.label} (All)`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {column.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {column.type === "date" && (
                          <Input
                            type="date"
                            value={filters[column.key] || ""}
                            onChange={(e) => handleFilterChange(column.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                </div>
              )}

              {showPreview && selectedDataSource && selectedColumns.length > 0 && (
                <div className="mt-6">
                  <ReportPreview
                    dataSource={selectedDataSource}
                    columns={selectedColumns}
                    filters={filters}
                    properties={selectedProperties}
                    reportType={reportType}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!isAllStepsValid}
        >
          Save Report
        </Button>
      </div>
    </div>
    </div>
  );
}