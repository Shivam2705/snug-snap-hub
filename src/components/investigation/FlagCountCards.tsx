import { Card, CardContent } from "@/components/ui/card";
import { Shield, Key, Home, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlagFilter = 'cifas' | 'noc' | 'auth2' | 'auth3' | 'auth4' | 'zown' | null;

interface FlagCountCardsProps {
  onFilterChange?: (filter: FlagFilter) => void;
  activeFilter?: FlagFilter;
  flags: {
    cifasCount: number;
    nocCount: number;
    authCode2: number;
    authCode3: number;
    authCode4: number;
    zownCount: number;
  };
}

const FlagCountCards = ({ onFilterChange, activeFilter, flags }: FlagCountCardsProps) => {
  const flagCards = [
    {
      label: 'CIFAS (Yes)',
      value: flags.cifasCount,
      icon: Shield,
      color: 'text-[#FF4757]',
      bgColor: 'bg-[#FF4757]/10',
      borderColor: 'border-[#FF4757]/20',
      filterValue: 'cifas' as FlagFilter
    },
    {
      label: 'NOC (Yes)',
      value: flags.nocCount,
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      filterValue: 'noc' as FlagFilter
    },
    {
      label: 'Auth Code 2',
      value: flags.authCode2,
      icon: Key,
      color: 'text-[#FFA502]',
      bgColor: 'bg-[#FFA502]/10',
      borderColor: 'border-[#FFA502]/20',
      filterValue: 'auth2' as FlagFilter
    },
    {
      label: 'Auth Code 3',
      value: flags.authCode3,
      icon: Key,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      filterValue: 'auth3' as FlagFilter
    },
    {
      label: 'Auth Code 4',
      value: flags.authCode4,
      icon: Key,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/20',
      filterValue: 'auth4' as FlagFilter
    },
    {
      label: 'ZOWN (Yes)',
      value: flags.zownCount,
      icon: Home,
      color: 'text-[#4DA3FF]',
      bgColor: 'bg-[#4DA3FF]/10',
      borderColor: 'border-[#4DA3FF]/20',
      filterValue: 'zown' as FlagFilter
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {flagCards.map((flag) => {
        const isActive = activeFilter === flag.filterValue;
        
        return (
          <Card
            key={flag.label}
            onClick={() => onFilterChange?.(isActive ? null : flag.filterValue)}
            className={cn(
              "border bg-[#181C23] shadow-none transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer",
              flag.borderColor,
              isActive && "ring-2 ring-[#4DA3FF] ring-offset-2 ring-offset-[#0B0D10]"
            )}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${flag.bgColor}`}>
                <flag.icon className={cn("h-4 w-4", flag.color)} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{flag.value}</p>
                <p className="text-xs text-slate-400">{flag.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FlagCountCards;
