import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2, CheckCircle2, AlertCircle, CircleDashed, UserCheck } from "lucide-react";
import { CaseStatus } from "@/data/mockCases";
import { cn } from "@/lib/utils";

interface InvestigationStatsCardsProps {
  onFilterChange?: (filter: CaseStatus | null) => void;
  activeFilter?: CaseStatus | null;
  stats: {
    total: number;
    inProgress: number;
    completed: number;
    reviewRequired: number;
    notStarted: number;
    awaitingCustomer: number;
  };
}

const InvestigationStatsCards = ({ onFilterChange, activeFilter, stats }: InvestigationStatsCardsProps) => {
  const statCards = [
    {
      label: 'Total Cases',
      value: stats.total,
      icon: FileText,
      color: 'text-slate-400',
      bgColor: 'bg-slate-800',
      filterValue: null as CaseStatus | null
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
      color: 'text-[#4DA3FF]',
      bgColor: 'bg-[#4DA3FF]/10',
      filterValue: 'In Progress' as CaseStatus
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-[#2ED573]',
      bgColor: 'bg-[#2ED573]/10',
      filterValue: 'Completed' as CaseStatus
    },
    {
      label: 'Review Required',
      value: stats.reviewRequired,
      icon: AlertCircle,
      color: 'text-[#FFA502]',
      bgColor: 'bg-[#FFA502]/10',
      filterValue: 'Review Required' as CaseStatus
    },
    {
      label: 'Not Started',
      value: stats.notStarted,
      icon: CircleDashed,
      color: 'text-slate-500',
      bgColor: 'bg-slate-800',
      filterValue: 'Not Started' as CaseStatus
    },
    {
      label: 'Awaiting Customer',
      value: stats.awaitingCustomer,
      icon: UserCheck,
      color: 'text-[#4DA3FF]',
      bgColor: 'bg-[#4DA3FF]/10',
      filterValue: 'Awaiting Customer' as CaseStatus
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const isActive = activeFilter === stat.filterValue;
        
        return (
          <Card
            key={stat.label}
            onClick={() => onFilterChange?.(stat.filterValue)}
            className={cn(
              "border-0 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer",
              "bg-[#181C23] border border-[#12151B]",
              isActive && "ring-2 ring-[#4DA3FF] ring-offset-2 ring-offset-[#0B0D10]"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InvestigationStatsCards;
