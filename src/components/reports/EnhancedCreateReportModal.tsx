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

interface CreateReportModalProps {
  onClose: () => void;
  template?: any;
}

export function EnhancedCreateReportModal({ onClose, template }: CreateReportModalProps) {
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
  const [selectedColumns, setSelectedColumns] = useState<string[]>(template?.defaultColumns || []);
  const [filters, setFilters] = useState<Record<string, any>>(template?.defaultFilters || {});
  const [showPreview, setShowPreview] = useState(false);

  // Get available columns based on selected data source
  const availableColumns = selectedDataSource ? (dataSourceConfig[selectedDataSource as keyof typeof dataSourceConfig]?.columns as ColumnConfig[]) || [] : [];
  const selectedColumnsCount = selectedColumns.length;

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
    <div className="space-y-6">
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
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 2: Data Source Selection */}
      <Collapsible open={step2Open} onOpenChange={setStep2Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 2: Select Data Source</h3>
          {step2Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Data Source</Label>
                <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
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
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium">Available Data Points</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {dataSourceConfig[selectedDataSource as keyof typeof dataSourceConfig]?.columns.length} columns available for reporting
                  </div>
                </div>
              )}
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
                            value={filters[column.key] || ""}
                            onValueChange={(value) => handleFilterChange(column.key, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Filter by ${column.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All</SelectItem>
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
          disabled={!reportName || !selectedDataSource || selectedColumns.length === 0 || selectedProperties.length === 0}
        >
          Save Report
        </Button>
      </div>
    </div>
  );
}