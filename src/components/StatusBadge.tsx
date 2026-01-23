import { Badge } from "@/components/ui/badge";
import { CaseStatus } from "@/data/mockCases";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: CaseStatus;
}

const statusStyles: Record<CaseStatus, string> = {
  "Completed": "bg-success/20 text-success border-success/30 hover:bg-success/30",
  "In Progress": "bg-info/20 text-info border-info/30 hover:bg-info/30",
  "Review Required": "bg-warning/20 text-warning border-warning/30 hover:bg-warning/30",
  "Pending": "bg-muted text-muted-foreground border-muted-foreground/30 hover:bg-muted/80",
  "Not Started": "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>
      {status}
    </Badge>
  );
};

export default StatusBadge;