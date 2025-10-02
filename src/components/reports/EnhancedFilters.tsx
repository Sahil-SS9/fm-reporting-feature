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
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ColumnConfig } from "@/data/mockData";

interface EnhancedFiltersProps {
  columns: ColumnConfig[];
  filters: Record<string, any>;
  onFilterChange: (filterKey: string, value: any) => void;
}

const DATE_PRESETS = [
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "This Month", value: "this_month" },
  { label: "This Quarter", value: "this_quarter" },
  { label: "This Year", value: "this_year" },
  { label: "Custom Range", value: "custom" },
];

export function EnhancedFilters({ columns, filters, onFilterChange }: EnhancedFiltersProps) {
  const handleMultiSelectChange = (key: string, option: string, checked: boolean) => {
    const currentValues = filters[key] || [];
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v: string) => v !== option);
    onFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const renderDateFilter = (column: ColumnConfig) => {
    const datePreset = filters[`${column.key}_preset`] || "";
    const startDate = filters[`${column.key}_start`];
    const endDate = filters[`${column.key}_end`];

    return (
      <div className="space-y-3">
        <Label>{column.label}</Label>
        <Select
          value={datePreset}
          onValueChange={(value) => {
            onFilterChange(`${column.key}_preset`, value);
            if (value !== "custom") {
              onFilterChange(`${column.key}_start`, undefined);
              onFilterChange(`${column.key}_end`, undefined);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {DATE_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {datePreset === "custom" && (
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(new Date(startDate), "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => onFilterChange(`${column.key}_start`, date?.toISOString())}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(new Date(endDate), "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate ? new Date(endDate) : undefined}
                  onSelect={(date) => onFilterChange(`${column.key}_end`, date?.toISOString())}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => startDate ? date < new Date(startDate) : false}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {startDate && endDate && new Date(startDate) >= new Date(endDate) && (
          <p className="text-sm text-destructive">Start date must be before end date</p>
        )}
      </div>
    );
  };

  const renderMultiSelectFilter = (column: ColumnConfig) => {
    const selectedValues = filters[column.key] || [];

    return (
      <div className="space-y-3">
        <Label>{column.label}</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
          {column.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) =>
                  handleMultiSelectChange(column.key, option, !!checked)
                }
              />
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((value: string) => (
              <Badge key={value} variant="secondary" className="text-xs">
                {value}
                <button
                  onClick={() => handleMultiSelectChange(column.key, value, false)}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTextFilter = (column: ColumnConfig) => {
    return (
      <div className="space-y-2">
        <Label>{column.label}</Label>
        <Input
          type="text"
          placeholder={`Search by ${column.label.toLowerCase()}`}
          value={filters[column.key] || ""}
          onChange={(e) => onFilterChange(column.key, e.target.value || undefined)}
        />
      </div>
    );
  };

  const renderNumberFilter = (column: ColumnConfig) => {
    const operator = filters[`${column.key}_operator`] || "equals";
    const value = filters[column.key];
    const value2 = filters[`${column.key}_value2`];

    return (
      <div className="space-y-3">
        <Label>{column.label}</Label>
        <Select
          value={operator}
          onValueChange={(value) => onFilterChange(`${column.key}_operator`, value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="greater_than">Greater than</SelectItem>
            <SelectItem value="less_than">Less than</SelectItem>
            <SelectItem value="between">Between</SelectItem>
          </SelectContent>
        </Select>

        <div className={cn("grid gap-2", operator === "between" ? "grid-cols-2" : "grid-cols-1")}>
          <Input
            type="number"
            placeholder="Value"
            value={value || ""}
            onChange={(e) => onFilterChange(column.key, e.target.value || undefined)}
          />
          {operator === "between" && (
            <Input
              type="number"
              placeholder="Max value"
              value={value2 || ""}
              onChange={(e) => onFilterChange(`${column.key}_value2`, e.target.value || undefined)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {columns.map((column) => {
        if (column.type === "date") {
          return <div key={column.key}>{renderDateFilter(column)}</div>;
        }
        if (column.type === "select" && column.options) {
          return <div key={column.key}>{renderMultiSelectFilter(column)}</div>;
        }
        if (column.type === "text") {
          return <div key={column.key}>{renderTextFilter(column)}</div>;
        }
        if (column.type === "number") {
          return <div key={column.key}>{renderNumberFilter(column)}</div>;
        }
        return null;
      })}
    </div>
  );
}
