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
    cifas: 'bg-rose-50 text-rose-700 border-rose-200',
    noc: 'bg-amber-50 text-amber-700 border-amber-200',
    zown: 'bg-blue-50 text-blue-700 border-blue-200',
    auth: 'bg-slate-100 text-slate-700 border-slate-200'
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
