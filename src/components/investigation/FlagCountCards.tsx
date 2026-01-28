import { Card, CardContent } from "@/components/ui/card";
import { Shield, Key, Home, FileText } from "lucide-react";
import { getFlagCounts } from "@/data/mockCases";
const FlagCountCards = () => {
  const flags = getFlagCounts();
  const flagCards = [{
    label: 'CIFAS (Yes)',
    value: flags.cifasCount,
    icon: Shield,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-100'
  }, {
    label: 'NOC (Yes)',
    value: flags.nocCount,
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100'
  }, {
    label: 'Auth Code 2',
    value: flags.authCode2,
    icon: Key,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100'
  }, {
    label: 'Auth Code 3',
    value: flags.authCode3,
    icon: Key,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100'
  }, {
    label: 'Auth Code 4',
    value: flags.authCode4,
    icon: Key,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-100'
  }, {
    label: 'ZOWN (Yes)',
    value: flags.zownCount,
    icon: Home,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100'
  }];
  return <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {flagCards.map(flag => <Card key={flag.label} className={`border ${flag.borderColor} shadow-none transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-primary/40 cursor-pointer`}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${flag.bgColor}`}>
              
            </div>
            <div>
              <p className="text-lg font-bold">{flag.value}</p>
              <p className="text-xs text-muted-foreground">{flag.label}</p>
            </div>
          </CardContent>
        </Card>)}
    </div>;
};
export default FlagCountCards;