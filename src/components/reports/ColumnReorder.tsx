import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

interface ColumnReorderProps {
  selectedColumns: string[];
  availableColumns: Array<{ key: string; label: string; type: string }>;
  onReorder: (newOrder: string[]) => void;
  onRemove: (columnKey: string) => void;
}

export const ColumnReorder: React.FC<ColumnReorderProps> = ({
  selectedColumns,
  availableColumns,
  onReorder,
  onRemove
}) => {
  const moveColumn = (fromIndex: number, direction: 'up' | 'down') => {
    const newColumns = [...selectedColumns];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex >= 0 && toIndex < newColumns.length) {
      [newColumns[fromIndex], newColumns[toIndex]] = [newColumns[toIndex], newColumns[fromIndex]];
      onReorder(newColumns);
    }
  };

  const getColumnLabel = (columnKey: string) => {
    const column = availableColumns.find(col => col.key === columnKey);
    return column?.label || columnKey;
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground">Column Order</div>
      <div className="space-y-2">
        {selectedColumns.map((columnKey, index) => (
          <div
            key={columnKey}
            className="flex items-center gap-2 p-3 rounded-md border bg-card"
          >
            <div className="flex-1">
              <Badge variant="secondary" className="font-normal">
                {index + 1}. {getColumnLabel(columnKey)}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveColumn(index, 'up')}
                disabled={index === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveColumn(index, 'down')}
                disabled={index === selectedColumns.length - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(columnKey)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {selectedColumns.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No columns selected. Add columns from the selection above.
          </div>
        )}
      </div>
    </div>
  );
};