import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedFiltersProps {
  dataSource: string;
  filters: Record<string, any>;
  onFilterChange: (filterKey: string, value: any) => void;
  reportType: "Activity" | "Performance";
  onSkip?: () => void;
  onSave?: () => void;
}

// Mapping of data sources to their primary date field for Activity reports
const DATE_FIELD_MAP: Record<string, { key: string; label: string } | null> = {
  "Work Orders": { key: "createdDate", label: "Created Date" },
  "Assets": { key: "lastInspection", label: "Last Inspection Date" },
  "Invoices": { key: "dueDate", label: "Due Date" },
  "Contractors": null, // No date filter
  "Documents": { key: "createdDate", label: "Created Date" },
};

// Mapping of data sources to their status options for Activity reports
const STATUS_OPTIONS_MAP: Record<string, string[] | null> = {
  "Work Orders": ["Rejected", "On Hold", "In Progress", "In Review", "Completed", "Completed (Unconfirmed)", "Cancelled", "Sent", "Scheduled", "Open", "Approved"],
  "Assets": ["Pending Repair", "Out of Service", "Missing", "Operational"],
  "Invoices": ["Outstanding", "Overdue", "Paid"],
  "Contractors": ["Active", "Inactive", "On Hold", "Pending Approval"],
  "Documents": null, // No status filter
};

// Performance report status inclusion options
const PERFORMANCE_STATUS_MAP: Record<string, string[] | null> = {
  "Work Orders": ["On Hold", "In Progress", "In Review", "Completed", "Completed (Unconfirmed)", "Cancelled"],
  "Assets": ["Out of Service", "Missing", "Outstanding"],
  "Invoices": ["Outstanding", "Overdue", "Paid"],
  "Contractors": null,
  "Documents": null,
};

// Data sources that REQUIRE date filter for Performance reports
const PERFORMANCE_REQUIRED_DATE_SOURCES = ["Work Orders", "Assets", "Documents"];

// Pre-defined date range options
const DATE_RANGE_OPTIONS = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days (3 months)" },
  { value: "180", label: "Last 180 Days (6 months)" },
  { value: "365", label: "Last 365 Days (12 months)" },
];

export function EnhancedFilters({ 
  dataSource,
  filters, 
  onFilterChange, 
  reportType,
  onSkip,
  onSave 
}: EnhancedFiltersProps) {
  const dateField = DATE_FIELD_MAP[dataSource];
  const statusOptions = STATUS_OPTIONS_MAP[dataSource];

  const handleStatusToggle = (status: string, checked: boolean) => {
    const currentStatuses = filters['status'] || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter((s: string) => s !== status);
    onFilterChange('status', newStatuses.length > 0 ? newStatuses : undefined);
  };

  // PERFORMANCE REPORT MODE
  if (reportType === "Performance") {
    const dateRangePreset = filters['date_range_preset'];
    const performanceStatuses = PERFORMANCE_STATUS_MAP[dataSource];
    const includedStatuses = filters['status_inclusion'] || performanceStatuses || [];
    const requiresDate = PERFORMANCE_REQUIRED_DATE_SOURCES.includes(dataSource);
    const isSaveDisabled = requiresDate && !dateRangePreset;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Step 4: Analysis Settings</h3>
          <p className="text-sm text-muted-foreground">
            Set the time period for calculating metrics.
          </p>
        </div>

        {/* Analysis Period */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Date Range {requiresDate && <span className="text-destructive">*</span>}
            {!requiresDate && <span className="text-xs text-muted-foreground ml-1">(Optional)</span>}
          </Label>
          <Select value={dateRangePreset} onValueChange={(value) => onFilterChange('date_range_preset', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {performanceStatuses && performanceStatuses.length > 0 && (
          <>
            <div className="border-t" />

            {/* Optional Status Inclusion */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Include in Calculations (Optional)</Label>
              <div className="flex flex-wrap gap-4">
                {performanceStatuses.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-inclusion-${status}`}
                      checked={includedStatuses.includes(status)}
                      onCheckedChange={(checked) => {
                        const newStatuses = checked
                          ? [...includedStatuses, status]
                          : includedStatuses.filter((s: string) => s !== status);
                        onFilterChange('status_inclusion', newStatuses);
                      }}
                    />
                    <label 
                      htmlFor={`status-inclusion-${status}`} 
                      className="text-sm cursor-pointer"
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={onSave}
            disabled={isSaveDisabled}
            size="lg"
          >
            Save Report
          </Button>
        </div>
      </div>
    );
  }

  // DETAILED REPORT MODE - Simplified
  const dateRangePreset = filters['date_range_preset'];
  const selectedStatuses = filters['status'] || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step 4: Report Filters (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          Add filters to refine your report data.
        </p>
      </div>

      {/* Date Range Filter (if available) */}
      {dateField && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Date Range (Optional)</Label>
          <Select value={dateRangePreset} onValueChange={(value) => onFilterChange('date_range_preset', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Status Filter (if available) */}
      {statusOptions && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Status (Optional)</Label>
          <div className="flex flex-wrap gap-4">
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => handleStatusToggle(status, !!checked)}
                />
                <label 
                  htmlFor={`status-${status}`} 
                  className="text-sm cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button 
          variant="outline"
          onClick={onSkip}
        >
          Skip This Step
        </Button>
        <Button 
          onClick={onSave}
          size="lg"
        >
          Save Report
        </Button>
      </div>
    </div>
  );
}
