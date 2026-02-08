import { CatalogItem } from "@/data/mockCatalogData";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface SupplierNotificationPreviewProps {
  supplierName: string;
  deniedItems: CatalogItem[];
}

const SupplierNotificationPreview = ({ supplierName, deniedItems }: SupplierNotificationPreviewProps) => {
  if (deniedItems.length === 0) return null;

  return (
    <div className="border border-border rounded-lg bg-card/50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h4 className="text-sm font-semibold text-foreground">Supplier Notification Preview</h4>
      </div>

      <div className="text-xs text-muted-foreground space-y-2 bg-background rounded p-3 border border-border">
        <p><strong className="text-foreground">To:</strong> {supplierName}</p>
        <p><strong className="text-foreground">Subject:</strong> Catalog Submission — Items Requiring Attention</p>
        <hr className="border-border" />
        <p>Dear {supplierName},</p>
        <p>The following items from your recent catalog submission have been flagged and denied during our quality review:</p>

        <div className="space-y-2 mt-2">
          {deniedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-destructive/5 rounded px-2 py-1.5 border border-destructive/10">
              <div>
                <span className="font-mono text-foreground">{item.itemNo}</span>
                <span className="mx-2 text-muted-foreground">—</span>
                <span className="text-muted-foreground">{item.itemName}</span>
              </div>
              <Badge variant="destructive" className="text-xs">
                {item.denyReason || "Image mismatch"}
              </Badge>
            </div>
          ))}
        </div>

        <p className="mt-2">Please review and resubmit corrected data at your earliest convenience.</p>
        <p className="text-muted-foreground italic">This is an automated notification from the PSO Catalog Verification System.</p>
      </div>
    </div>
  );
};

export default SupplierNotificationPreview;
