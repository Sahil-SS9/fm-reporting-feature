import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ColumnConfig } from "@/data/mockData";

interface DraggableColumnItemProps {
  column: ColumnConfig;
  index: number;
  onRemove: () => void;
}

export function DraggableColumnItem({ column, index, onRemove }: DraggableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full">
          {index + 1}
        </Badge>
        <div>
          <div className="font-medium text-sm">{column.label}</div>
          <div className="text-xs text-muted-foreground capitalize">{column.type}</div>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
