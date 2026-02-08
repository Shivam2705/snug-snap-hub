import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CatalogItem, mockCatalogItems } from "@/data/mockCatalogData";
import CatalogUploadScreen from "./CatalogUploadScreen";
import CatalogReviewTable from "./CatalogReviewTable";
import ItemDetailPanel from "./ItemDetailPanel";
import BulkActionToolbar from "./BulkActionToolbar";
import DenyModal from "./DenyModal";
import SupplierNotificationPreview from "./SupplierNotificationPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet, Send } from "lucide-react";

interface CatalogVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Screen = "upload" | "review" | "notification";

const CatalogVerificationDialog = ({ open, onOpenChange }: CatalogVerificationDialogProps) => {
  const [screen, setScreen] = useState<Screen>("upload");
  const [items, setItems] = useState<CatalogItem[]>(mockCatalogItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<CatalogItem | null>(null);
  const [denyModalOpen, setDenyModalOpen] = useState(false);
  const [pendingDenyIds, setPendingDenyIds] = useState<string[]>([]);

  const supplierName = "FashionCo Ltd";

  const handleUpload = () => {
    setScreen("review");
  };

  const handleReset = () => {
    setScreen("upload");
    setItems(mockCatalogItems);
    setSelectedIds(new Set());
    setDetailItem(null);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleApprove = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, decision: "approved" as const } : item)));
    if (detailItem?.id === id) {
      setDetailItem((prev) => (prev ? { ...prev, decision: "approved" as const } : null));
    }
  };

  const handleDenyInit = (id: string) => {
    setPendingDenyIds([id]);
    setDenyModalOpen(true);
  };

  const handleBulkApprove = () => {
    setItems((prev) =>
      prev.map((item) => (selectedIds.has(item.id) ? { ...item, decision: "approved" as const } : item)),
    );
    setSelectedIds(new Set());
  };

  const handleBulkDenyInit = () => {
    setPendingDenyIds(Array.from(selectedIds));
    setDenyModalOpen(true);
  };

  const handleDenyConfirm = (reason: string, comment: string) => {
    setItems((prev) =>
      prev.map((item) =>
        pendingDenyIds.includes(item.id)
          ? { ...item, decision: "denied" as const, denyReason: reason, denyComment: comment }
          : item,
      ),
    );
    if (detailItem && pendingDenyIds.includes(detailItem.id)) {
      setDetailItem((prev) =>
        prev ? { ...prev, decision: "denied" as const, denyReason: reason, denyComment: comment } : null,
      );
    }
    setSelectedIds(new Set());
    setPendingDenyIds([]);
    setDenyModalOpen(false);
  };

  const deniedItems = useMemo(() => items.filter((i) => i.decision === "denied"), [items]);
  const approvedCount = useMemo(() => items.filter((i) => i.decision === "approved").length, [items]);
  const pendingCount = useMemo(() => items.filter((i) => !i.decision).length, [items]);

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(handleReset, 300);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className={`bg-card border-border p-0 gap-0 ${
            screen === "upload" ? "sm:max-w-lg" : "sm:max-w-[95vw] sm:max-h-[90vh] h-[90vh]"
          }`}
        >
          {screen === "upload" && (
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center gap-2 text-foreground">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Catalog Review and Publication
                </DialogTitle>
              </DialogHeader>
              <CatalogUploadScreen onUpload={handleUpload} />
            </div>
          )}

          {screen === "review" && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Review Header */}
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={handleReset}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Catalog Preview & Review</h2>
                    <p className="text-xs text-muted-foreground">
                      {supplierName} — {items.length} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                    {approvedCount} Approved
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-destructive/10 text-destructive border-destructive/20"
                  >
                    {deniedItems.length} Denied
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {pendingCount} Pending
                  </Badge>
                  {deniedItems.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setScreen("notification")}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Supplier Notification
                    </Button>
                  )}
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="px-4 pt-3 shrink-0">
                <BulkActionToolbar
                  selectedCount={selectedIds.size}
                  onApproveSelected={handleBulkApprove}
                  onDenySelected={handleBulkDenyInit}
                />
              </div>

              {/* Main Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Table */}
                <div className={`flex-1 overflow-auto p-4 ${detailItem ? "pr-0" : ""}`}>
                  <CatalogReviewTable
                    items={items}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={handleSelectAll}
                    onApprove={handleApprove}
                    onDeny={handleDenyInit}
                    onViewDetail={setDetailItem}
                  />
                </div>

                {/* Detail Panel */}
                {detailItem && (
                  <div className="w-80 shrink-0 border-l border-border overflow-hidden">
                    <ItemDetailPanel
                      item={detailItem}
                      onClose={() => setDetailItem(null)}
                      onApprove={handleApprove}
                      onDeny={handleDenyInit}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {screen === "notification" && (
            <div className="p-6 space-y-4 overflow-auto">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setScreen("review")}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <DialogTitle className="text-foreground">Supplier Notification</DialogTitle>
                </div>
              </DialogHeader>
              <SupplierNotificationPreview supplierName={supplierName} deniedItems={deniedItems} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DenyModal
        open={denyModalOpen}
        onOpenChange={setDenyModalOpen}
        itemCount={pendingDenyIds.length}
        onConfirm={handleDenyConfirm}
      />
    </>
  );
};

export default CatalogVerificationDialog;
