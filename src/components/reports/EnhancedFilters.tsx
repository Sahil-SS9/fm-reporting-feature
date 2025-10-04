import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  const renderDatePicker = (label: string, filterKey: string, minDate?: Date) => {
    const dateValue = filters[filterKey];
    const isInvalid = minDate && dateValue && new Date(dateValue) < minDate;

    return (
      <div className="space-y-2 flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateValue && "text-muted-foreground",
                isInvalid && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateValue ? format(new Date(dateValue), "MMM dd, yyyy") : "Select date..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background" align="start">
            <Calendar
              mode="single"
              selected={dateValue ? new Date(dateValue) : undefined}
              onSelect={(date) => onFilterChange(filterKey, date?.toISOString())}
              disabled={(date) => minDate ? date < minDate : false}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {isInvalid && (
          <p className="text-xs text-destructive">From date must be before To date</p>
        )}
      </div>
    );
  };

  // PERFORMANCE REPORT MODE
  if (reportType === "Performance") {
    const fromDate = filters['analysis_period_start'];
    const toDate = filters['analysis_period_end'];
    const performanceStatuses = PERFORMANCE_STATUS_MAP[dataSource];
    const includedStatuses = filters['status_inclusion'] || performanceStatuses || [];
    const requiresDate = PERFORMANCE_REQUIRED_DATE_SOURCES.includes(dataSource);
    const isSaveDisabled = requiresDate && (!fromDate || !toDate);

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
            Analysis Period {requiresDate && <span className="text-destructive">*</span>}
            {!requiresDate && <span className="text-xs text-muted-foreground ml-1">(Optional)</span>}
          </Label>
          <div className="flex gap-4">
            {renderDatePicker("From", 'analysis_period_start')}
            {renderDatePicker("To", 'analysis_period_end', fromDate ? new Date(fromDate) : undefined)}
          </div>
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
  const fromDate = filters['date_range_start'];
  const toDate = filters['date_range_end'];
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
          <Label className="text-base font-medium">{dateField.label} Range (Optional)</Label>
          <div className="flex gap-4">
            {renderDatePicker("From", 'date_range_start')}
            {renderDatePicker("To", 'date_range_end', fromDate ? new Date(fromDate) : undefined)}
          </div>
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
