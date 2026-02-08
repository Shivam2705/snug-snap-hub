import { CatalogItem } from "@/data/mockCatalogData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, AlertTriangle } from "lucide-react";

interface ItemDetailPanelProps {
  item: CatalogItem;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

const getMatchColor = (percent: number) => {
  if (percent >= 90) return "text-success";
  if (percent >= 80) return "text-warning";
  return "text-destructive";
};

const MOCK_MISMATCHES: Record<string, string[]> = {
  "PSO-7203": ["Pattern description in catalog reads 'Floral' but image shows abstract mixed pattern", "Colour listed as 'Multi' — needs specific breakdown"],
  "PSO-7204": ["Image shows plain weave, catalog states 'Herringbone'", "Colour appears darker than 'Charcoal' specification"],
  "PSO-7206": ["Wash finish appears lighter than 'Indigo' specification", "Button style differs from catalog description"],
  "PSO-7208": ["Stripe width does not match catalog spec (5mm vs 10mm)", "Collar style mismatch — catalog says 'classic', image shows 'button-down'"],
  "PSO-7210": ["Embroidery density appears lower than catalog specification", "Neckline style differs from product description"],
  "PSO-7212": ["Print pattern does not match reference imagery", "Fabric drape suggests different material composition", "Colour appears closer to 'Forest Green' than 'Teal'"],
};

const ItemDetailPanel = ({ item, onClose, onApprove, onDeny }: ItemDetailPanelProps) => {
  const mismatches = MOCK_MISMATCHES[item.itemNo] || [];

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Item Details</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Image */}
        <div className="rounded-lg overflow-hidden border border-border">
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">{item.itemName}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ["Item No", item.itemNo],
              ["Category", item.category],
              ["Brand", item.brand],
              ["Colour", item.colour],
              ["Size", item.size],
              ["Pattern", item.pattern],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-muted-foreground">{label}</p>
                <p className="text-foreground font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Validation Summary</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Match Score:</span>
            <span className={`text-lg font-bold ${getMatchColor(item.matchPercent)}`}>
              {item.matchPercent}%
            </span>
          </div>

          {mismatches.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning" />
                Highlighted Mismatches
              </p>
              <div className="space-y-1.5">
                {mismatches.map((m, i) => (
                  <div key={i} className="text-xs text-muted-foreground bg-destructive/5 border border-destructive/10 rounded px-3 py-2">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mismatches.length === 0 && (
            <div className="text-xs text-success bg-success/5 border border-success/10 rounded px-3 py-2 flex items-center gap-2">
              <Check className="h-3 w-3" />
              All attributes match catalog specifications
            </div>
          )}
        </div>

        {/* Status */}
        {item.decision && (
          <Badge variant={item.decision === "approved" ? "default" : "destructive"}>
            {item.decision === "approved" ? "Approved" : "Denied"}
            {item.denyReason && ` — ${item.denyReason}`}
          </Badge>
        )}
      </div>

      {/* Footer Actions */}
      {!item.decision && (
        <div className="p-4 border-t border-border flex gap-2">
          <Button
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            size="sm"
            onClick={() => onApprove(item.id)}
          >
            <Check className="mr-1 h-3.5 w-3.5" />
            Approve
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            size="sm"
            onClick={() => onDeny(item.id)}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Deny
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPanel;
