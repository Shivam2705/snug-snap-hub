import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  CircleDashed
} from "lucide-react";
import { getCaseStats } from "@/data/mockCases";

const InvestigationStatsCards = () => {
  const stats = getCaseStats();

  const statCards = [
    {
      label: 'Total Cases',
      value: stats.total,
      icon: FileText,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Review Required',
      value: stats.reviewRequired,
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      label: 'Not Started',
      value: stats.notStarted,
      icon: CircleDashed,
      color: 'text-slate-500',
      bgColor: 'bg-slate-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InvestigationStatsCards;
