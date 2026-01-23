import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Key, Home } from "lucide-react";
import { getCaseStats } from "@/data/mockCases";

const FlagCountCards = () => {
  const stats = getCaseStats();

  const flagCards = [
    {
      label: 'CIFAS Flagged',
      value: stats.cifasYes,
      icon: Shield,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100'
    },
    {
      label: 'Auth Code 2',
      value: stats.authCode2,
      icon: Key,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      label: 'Auth Code 3/4',
      value: stats.authCode3 + stats.authCode4,
      icon: Key,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-100'
    },
    {
      label: 'ZOWN Flagged',
      value: stats.zownYes,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {flagCards.map((flag) => (
        <Card key={flag.label} className={`border ${flag.borderColor} shadow-none`}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${flag.bgColor}`}>
              <flag.icon className={`h-4 w-4 ${flag.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold">{flag.value}</p>
              <p className="text-xs text-muted-foreground">{flag.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlagCountCards;
