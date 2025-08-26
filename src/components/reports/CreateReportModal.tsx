import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, X } from "lucide-react";

interface CreateReportModalProps {
  onClose: () => void;
}

const reportTypes = [
  "Activity report",
  "Cases report", 
  "Asset report",
  "Maintenance report",
  "Inspection report",
];

const availableColumns = {
  "Open Tickets Count": true,
  "Overdue Tickets Count": false,
  "Total Tickets Created": false,
  "Tickets Resolved Count": false,
  "Average Resolution Time": false,
};

const filterOptions = {
  "Open Tickets Count": false,
  "Overdue Tickets Count": false, 
  "Total Tickets Created": false,
};

export function CreateReportModal({ onClose }: CreateReportModalProps) {
  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(false);
  const [step3Open, setStep3Open] = useState(false);
  
  const [reportType, setReportType] = useState("Activity report");
  const [reportName, setReportName] = useState("My Productivity report");
  const [description, setDescription] = useState("This is a report about productivity of centres");
  const [selectedColumns, setSelectedColumns] = useState(availableColumns);
  const [selectedFilters, setSelectedFilters] = useState(filterOptions);

  const handleColumnChange = (column: string, checked: boolean) => {
    setSelectedColumns(prev => ({ ...prev, [column]: checked }));
  };

  const handleFilterChange = (filter: string, checked: boolean) => {
    setSelectedFilters(prev => ({ ...prev, [filter]: checked }));
  };

  const handleSave = () => {
    // Handle save logic
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Choose your details */}
      <Collapsible open={step1Open} onOpenChange={setStep1Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 1: Choose your details</h3>
          {step1Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="options">Options</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportName">Report name</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="centre" defaultChecked />
                <Label htmlFor="centre">Centre</Label>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 2: Select your columns */}
      <Collapsible open={step2Open} onOpenChange={setStep2Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 2: Select your columns</h3>
          {step2Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label>Columns</Label>
                <div className="space-y-3">
                  {Object.entries(selectedColumns).map(([column, checked]) => (
                    <div key={column} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(checked) => handleColumnChange(column, !!checked)}
                        />
                        <Label className="cursor-pointer">{column}</Label>
                      </div>
                      {checked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleColumnChange(column, false)}
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

      {/* Step 3: Select filter options */}
      <Collapsible open={step3Open} onOpenChange={setStep3Open}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50">
          <h3 className="text-lg font-semibold">Step 3: Select filter options</h3>
          {step3Open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox id="status" defaultChecked />
                  <Label htmlFor="status">Status</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {Object.entries(selectedFilters).map(([filter, checked]) => (
                      <div key={filter} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(checked) => handleFilterChange(filter, !!checked)}
                          />
                          <Label className="cursor-pointer">{filter}</Label>
                        </div>
                        {checked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFilterChange(filter, false)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}