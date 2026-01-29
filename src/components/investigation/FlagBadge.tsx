import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FlagBadgeProps {
  type: 'cifas' | 'noc' | 'zown' | 'auth';
  value: boolean | number;
  size?: 'sm' | 'md';
}

const FlagBadge = ({ type, value, size = 'sm' }: FlagBadgeProps) => {
  const isActive = type === 'auth' ? true : value === true;
  
  const labelMap = {
    cifas: 'CIFAS',
    noc: 'NOC',
    zown: 'ZOWN',
    auth: `Auth ${value}`
  };

  const activeColorMap = {
    cifas: 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/20',
    noc: 'bg-[#FFA502]/10 text-[#FFA502] border-[#FFA502]/20',
    zown: 'bg-[#4DA3FF]/10 text-[#4DA3FF] border-[#4DA3FF]/20',
    auth: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const sizeMap = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5'
  };

  if (type !== 'auth' && !isActive) {
    return null;
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        activeColorMap[type],
        sizeMap[size],
        'font-medium border'
      )}
    >
      {labelMap[type]}
    </Badge>
  );
};

export default FlagBadge;