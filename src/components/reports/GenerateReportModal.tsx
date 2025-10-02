import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: () => void;
  onLater: () => void;
}

export function GenerateReportModal({
  open,
  onOpenChange,
  onGenerate,
  onLater,
}: GenerateReportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate your first version now?</DialogTitle>
          <DialogDescription>
            Would you like to generate this report immediately?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onLater}>
            Later
          </Button>
          <Button onClick={onGenerate}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
