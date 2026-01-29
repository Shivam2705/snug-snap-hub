import { Badge } from "@/components/ui/badge";
import { RiskLevel } from "@/data/mockCases";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge = ({ level, score, showScore = true, size = 'md' }: RiskBadgeProps) => {
  const colorMap = {
    low: 'bg-[#2ED573]/10 text-[#2ED573] border-[#2ED573]/20',
    medium: 'bg-[#FFA502]/10 text-[#FFA502] border-[#FFA502]/20',
    high: 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/20'
  };

  const iconMap = {
    low: CheckCircle,
    medium: AlertCircle,
    high: AlertTriangle
  };

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const Icon = iconMap[level];

  return (
    <Badge 
      variant="outline" 
      className={cn(
        colorMap[level],
        sizeMap[size],
        'font-medium capitalize border gap-1'
      )}
    >
      <Icon className="h-3 w-3" />
      {showScore && score !== undefined ? `${level} (${score})` : level}
    </Badge>
  );
};

export default RiskBadge;