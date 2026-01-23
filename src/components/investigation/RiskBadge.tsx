import { Badge } from "@/components/ui/badge";
import { RiskLevel } from "@/data/mockCases";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge = ({ level, score, showScore = true, size = 'md' }: RiskBadgeProps) => {
  const colorMap = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        colorMap[level],
        sizeMap[size],
        'font-medium capitalize border'
      )}
    >
      {showScore && score !== undefined ? `${score}% ${level}` : level}
    </Badge>
  );
};

export default RiskBadge;
