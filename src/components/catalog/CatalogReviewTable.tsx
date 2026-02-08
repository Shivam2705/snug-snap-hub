import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { CatalogItem } from "@/data/mockCatalogData";

interface CatalogReviewTableProps {
  items: CatalogItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  onViewDetail: (item: CatalogItem) => void;
}

const getMatchColor = (percent: number) => {
  if (percent >= 90) return "text-success";
  if (percent >= 80) return "text-warning";
  return "text-destructive";
};

const getMatchBg = (percent: number) => {
  if (percent >= 90) return "bg-success/10";
  if (percent >= 80) return "bg-warning/10";
  return "bg-destructive/10";
};

const getStatusVariant = (status: CatalogItem["status"]) => {
  switch (status) {
    case "Suggested: Approve": return "default";
    case "Needs Review": return "secondary";
    case "Suggested: Deny": return "destructive";
    default: return "secondary";
  }
};

const CatalogReviewTable = ({
  items,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onApprove,
  onDeny,
  onViewDetail,
}: CatalogReviewTableProps) => {
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <div className="relative w-full overflow-auto border border-border rounded-lg">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="text-xs">Item No</TableHead>
            <TableHead className="text-xs">Item Name</TableHead>
            <TableHead className="text-xs">Category</TableHead>
            <TableHead className="text-xs">Brand</TableHead>
            <TableHead className="text-xs">Colour</TableHead>
            <TableHead className="text-xs">Size</TableHead>
            <TableHead className="text-xs">Pattern</TableHead>
            <TableHead className="text-xs">Image</TableHead>
            <TableHead className="text-xs">Match %</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className={`border-border cursor-pointer transition-colors ${
                item.decision === "approved"
                  ? "bg-success/5"
                  : item.decision === "denied"
                  ? "bg-destructive/5"
                  : "hover:bg-muted/30"
              }`}
              onClick={() => onViewDetail(item)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={() => onToggleSelect(item.id)}
                />
              </TableCell>
              <TableCell className="text-xs font-mono text-foreground">{item.itemNo}</TableCell>
              <TableCell className="text-xs text-foreground font-medium max-w-[140px] truncate">{item.itemName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{item.brand}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{item.colour}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{item.size}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{item.pattern}</TableCell>
              <TableCell>
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="h-10 w-10 rounded object-cover border border-border"
                />
              </TableCell>
              <TableCell>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getMatchBg(item.matchPercent)} ${getMatchColor(item.matchPercent)}`}>
                  {item.matchPercent}%
                </span>
              </TableCell>
              <TableCell>
                {item.decision ? (
                  <Badge variant={item.decision === "approved" ? "default" : "destructive"} className="text-xs">
                    {item.decision === "approved" ? "Approved" : "Denied"}
                  </Badge>
                ) : (
                  <Badge variant={getStatusVariant(item.status) as any} className="text-xs whitespace-nowrap">
                    {item.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-success hover:text-success hover:bg-success/10"
                    onClick={() => onApprove(item.id)}
                    disabled={item.decision === "approved"}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeny(item.id)}
                    disabled={item.decision === "denied"}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => onViewDetail(item)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CatalogReviewTable;
