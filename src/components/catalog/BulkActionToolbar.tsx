import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface BulkActionToolbarProps {
  selectedCount: number;
  onApproveSelected: () => void;
  onDenySelected: () => void;
}

const BulkActionToolbar = ({ selectedCount, onApproveSelected, onDenySelected }: BulkActionToolbarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 animate-fade-in">
      <span className="text-xs font-medium text-foreground">
        {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
      </span>
      <div className="flex-1" />
      <Button
        size="sm"
        className="bg-success hover:bg-success/90 text-success-foreground h-8 text-xs"
        onClick={onApproveSelected}
      >
        <Check className="mr-1 h-3.5 w-3.5" />
        Approve Selected
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="h-8 text-xs"
        onClick={onDenySelected}
      >
        <X className="mr-1 h-3.5 w-3.5" />
        Deny Selected
      </Button>
    </div>
  );
};

export default BulkActionToolbar;
