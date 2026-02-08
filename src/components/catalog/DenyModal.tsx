import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DENY_REASONS } from "@/data/mockCatalogData";

interface DenyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemCount: number;
  onConfirm: (reason: string, comment: string) => void;
}

const DenyModal = ({ open, onOpenChange, itemCount, onConfirm }: DenyModalProps) => {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(reason, comment);
    setReason("");
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Deny Selected Items ({itemCount})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select denial reason" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {DENY_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Comment (optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Additional notes for the supplier..."
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason}>
            Confirm Denial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DenyModal;
