import { Badge } from "@/components/ui/badge";
import { CaseStatus } from "@/data/mockCases";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: CaseStatus;
}

const statusStyles: Record<CaseStatus, string> = {
  "Completed": "bg-[#2ED573]/10 text-[#2ED573] border-[#2ED573]/20 hover:bg-[#2ED573]/20",
  "In Progress": "bg-[#4DA3FF]/10 text-[#4DA3FF] border-[#4DA3FF]/20 hover:bg-[#4DA3FF]/20",
  "Review Required": "bg-[#FFA502]/10 text-[#FFA502] border-[#FFA502]/20 hover:bg-[#FFA502]/20",
  "Pending": "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20",
  "Not Started": "bg-slate-600/10 text-slate-500 border-slate-600/20 hover:bg-slate-600/20",
  "Awaiting Customer": "bg-[#4DA3FF]/10 text-[#4DA3FF] border-[#4DA3FF]/20 hover:bg-[#4DA3FF]/20"
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>
      {status}
    </Badge>
  );
};

export default StatusBadge;