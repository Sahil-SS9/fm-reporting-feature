import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CalendarIcon, X, ChevronDown, ChevronUp, Calendar as CalendarIconAlt, Target, Hash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ColumnConfig } from "@/data/mockData";

interface EnhancedFiltersProps {
  columns: ColumnConfig[];
  filters: Record<string, any>;
  onFilterChange: (filterKey: string, value: any) => void;
  reportType: "Activity" | "Performance";
  onClearAll: () => void;
  onSkip?: () => void;
  onSave?: () => void;
}

export function EnhancedFilters({ 
  columns, 
  filters, 
  onFilterChange, 
  reportType,
  onClearAll,
  onSkip,
  onSave 
}: EnhancedFiltersProps) {
  const [dateFiltersOpen, setDateFiltersOpen] = useState(true);
  const [recordFiltersOpen, setRecordFiltersOpen] = useState(true);
  const [numberFiltersOpen, setNumberFiltersOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Count applied filters
  const appliedFilterCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key.includes('_preset') || key.includes('_operator')) return;
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (!Array.isArray(value)) count++;
      }
    });
    return count;
  }, [filters]);

  const handleMultiSelectChange = (key: string, option: string, checked: boolean) => {
    const currentValues = filters[key] || [];
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v: string) => v !== option);
    onFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  // Get columns by type
  const dateColumns = columns.filter(c => c.type === "date");
  const selectColumns = columns.filter(c => c.type === "select" && c.options);
  const textColumns = columns.filter(c => c.type === "text");
  const numberColumns = columns.filter(c => c.type === "number");

  // Status options for Performance mode
  const statusOptions = ["Open", "In Progress", "Completed", "Cancelled"];

  const renderDatePicker = (label: string, columnKey: string, minDate?: Date) => {
    const dateValue = filters[columnKey];
    const isInvalid = minDate && dateValue && new Date(dateValue) < minDate;

    return (
      <div className="space-y-2">
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
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue ? new Date(dateValue) : undefined}
              onSelect={(date) => onFilterChange(columnKey, date?.toISOString())}
              disabled={(date) => minDate ? date < minDate : false}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {isInvalid && (
          <p className="text-xs text-destructive">Start date must be before end date</p>
        )}
      </div>
    );
  };

  const renderCheckboxGroup = (column: ColumnConfig) => {
    const selectedValues = filters[column.key] || [];
    const options = column.options || [];
    const visibleCount = 4;
    const isExpanded = expandedCategories[column.key];
    const displayOptions = isExpanded ? options : options.slice(0, visibleCount);
    const hasMore = options.length > visibleCount;

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {column.label} {selectedValues.length > 0 && `(${selectedValues.length} selected)`}
        </Label>
        <div className="space-y-2">
          {displayOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${column.key}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) =>
                  handleMultiSelectChange(column.key, option, !!checked)
                }
              />
              <label
                htmlFor={`${column.key}-${option}`}
                className="text-sm cursor-pointer flex-1"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedCategories(prev => ({ ...prev, [column.key]: !isExpanded }))}
            className="text-xs"
          >
            {isExpanded ? '− Show less' : `+ Show ${options.length - visibleCount} more`}
          </Button>
        )}
      </div>
    );
  };

  const renderNumberFilter = (column: ColumnConfig) => {
    const operator = filters[`${column.key}_operator`] || "equals";
    const value = filters[column.key];
    const value2 = filters[`${column.key}_value2`];

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">{column.label}</Label>
        <Select
          value={operator}
          onValueChange={(value) => onFilterChange(`${column.key}_operator`, value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="greater_than">Greater Than</SelectItem>
            <SelectItem value="less_than">Less Than</SelectItem>
            <SelectItem value="between">Between</SelectItem>
          </SelectContent>
        </Select>

        <div className={cn("grid gap-2", operator === "between" ? "grid-cols-2" : "grid-cols-1")}>
          <Input
            type="number"
            placeholder={operator === "between" ? "Min" : "Value"}
            value={value || ""}
            onChange={(e) => onFilterChange(column.key, e.target.value || undefined)}
          />
          {operator === "between" && (
            <Input
              type="number"
              placeholder="Max"
              value={value2 || ""}
              onChange={(e) => onFilterChange(`${column.key}_value2`, e.target.value || undefined)}
            />
          )}
        </div>
      </div>
    );
  };

  // PERFORMANCE REPORT MODE - Simplified UI
  if (reportType === "Performance") {
    const fromDate = filters['analysis_period_start'];
    const toDate = filters['analysis_period_end'];
    const selectedStatuses = filters['status_inclusion'] || ["Open", "In Progress", "Completed"];
    const excludedStatuses = statusOptions.filter(s => !selectedStatuses.includes(s));
    
    // Calculate period days
    const periodDays = fromDate && toDate 
      ? Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Step 4: Analysis Settings</h3>
          <p className="text-sm text-muted-foreground">
            Set the time period for calculating performance metrics.
          </p>
        </div>

        {/* Required Analysis Period */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <CalendarIconAlt className="h-4 w-4 text-primary" />
            <Label className="text-base font-semibold">Analysis Period <span className="text-destructive">*</span></Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderDatePicker("From", 'analysis_period_start')}
            {renderDatePicker("To", 'analysis_period_end', fromDate ? new Date(fromDate) : undefined)}
          </div>
          <p className="text-xs text-muted-foreground italic">
            Note: Metrics will be calculated for all records within this period.
          </p>
        </div>

        <div className="border-t" />

        {/* Optional Status Inclusion */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Include in Calculations (Optional)</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Tip: Uncheck statuses to exclude them from metric calculations.
            </p>
          </div>
          
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    const newStatuses = checked
                      ? [...selectedStatuses, status]
                      : selectedStatuses.filter(s => s !== status);
                    onFilterChange('status_inclusion', newStatuses);
                  }}
                />
                <label htmlFor={`status-${status}`} className="text-sm cursor-pointer flex-1">
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t" />

        {/* Summary */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-1">
          {fromDate && toDate && (
            <p className="text-sm font-medium">
              Analysis Period: {format(new Date(fromDate), "MMM d")} - {format(new Date(toDate), "MMM d, yyyy")} ({periodDays} days)
            </p>
          )}
          {!fromDate && !toDate && (
            <p className="text-sm text-muted-foreground">Please select an analysis period to continue</p>
          )}
          {excludedStatuses.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Excluding: {excludedStatuses.join(', ')}
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={onSave}
            disabled={!fromDate || !toDate}
            size="lg"
          >
            Save Report
          </Button>
        </div>
      </div>
    );
  }

  // DETAILED REPORT MODE - Complex Filter UI
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Step 4: Report Filters (Optional)</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Applied Filters: {appliedFilterCount}
            </span>
            {appliedFilterCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearAll}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Add filters to refine your report data. Multiple filters use AND logic across fields, OR logic within field values.
        </p>
      </div>

      {/* Date Filters Section */}
      {dateColumns.length > 0 && (
        <Collapsible open={dateFiltersOpen} onOpenChange={setDateFiltersOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <CalendarIconAlt className="h-4 w-4 text-primary" />
              <span className="font-semibold">Date Filters</span>
            </div>
            {dateFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            {dateColumns.map((column) => {
              const fromKey = `${column.key}_start`;
              const toKey = `${column.key}_end`;
              const fromDate = filters[fromKey];

              return (
                <div key={column.key} className="space-y-3 pb-4 border-b last:border-0">
                  <Label className="text-sm font-semibold">{column.label}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {renderDatePicker("From", fromKey)}
                    {renderDatePicker("To", toKey, fromDate ? new Date(fromDate) : undefined)}
                  </div>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Record Filters Section */}
      {selectColumns.length > 0 && (
        <Collapsible open={recordFiltersOpen} onOpenChange={setRecordFiltersOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-semibold">Record Filters</span>
            </div>
            {recordFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectColumns.map((column) => (
                <div key={column.key}>
                  {renderCheckboxGroup(column)}
                </div>
              ))}
            </div>
            {textColumns.map((column) => (
              <div key={column.key} className="space-y-2">
                <Label className="text-sm font-medium">{column.label}</Label>
                <Input
                  type="text"
                  placeholder={`Search by ${column.label.toLowerCase()}...`}
                  value={filters[column.key] || ""}
                  onChange={(e) => onFilterChange(column.key, e.target.value || undefined)}
                />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Number Filters Section */}
      {numberColumns.length > 0 && (
        <Collapsible open={numberFiltersOpen} onOpenChange={setNumberFiltersOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              <span className="font-semibold">Number Filters</span>
            </div>
            {numberFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {numberColumns.map((column) => (
                <div key={column.key}>
                  {renderNumberFilter(column)}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Bottom Summary and Actions */}
      <div className="border-t pt-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          {appliedFilterCount === 0 ? "No filters applied" : `${appliedFilterCount} filter${appliedFilterCount > 1 ? 's' : ''} applied`}
        </p>
        
        <div className="flex items-center justify-end gap-3">
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
    </div>
  );
}
