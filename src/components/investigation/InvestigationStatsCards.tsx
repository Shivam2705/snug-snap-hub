import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  AlertTriangle, 
  Bot, 
  UserCheck,
  TrendingUp
} from "lucide-react";
import { getCaseStats } from "@/data/mockCases";

const InvestigationStatsCards = () => {
  const stats = getCaseStats();
  const automationRate = stats.total > 0 
    ? Math.round((stats.aiAutoCompleted / stats.completed) * 100) 
    : 0;

  const statCards = [
    {
      label: 'Pending Investigation',
      value: stats.inProgress + stats.notStarted + stats.reviewRequired,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      label: 'High Risk',
      value: stats.highRisk,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      label: 'AI Auto-Completed',
      value: stats.aiAutoCompleted,
      icon: Bot,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      label: 'Awaiting Customer',
      value: stats.awaitingCustomer,
      icon: UserCheck,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50'
    },
    {
      label: 'Automation Rate',
      value: `${automationRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
