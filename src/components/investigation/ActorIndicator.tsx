import { Bot, User } from "lucide-react";
import { ActorType } from "@/data/mockCases";
import { cn } from "@/lib/utils";

interface ActorIndicatorProps {
  actor: ActorType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ActorIndicator = ({ actor, size = 'md', showLabel = false }: ActorIndicatorProps) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const containerSizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const isAI = actor === 'ai';

  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          'rounded-full flex items-center justify-center',
          containerSizeMap[size],
          isAI ? 'bg-violet-100' : 'bg-sky-100'
        )}
      >
        {isAI ? (
          <Bot className={cn(sizeMap[size], 'text-violet-600')} />
        ) : (
          <User className={cn(sizeMap[size], 'text-sky-600')} />
        )}
      </div>
      {showLabel && (
        <span className={cn(
          'font-medium',
          isAI ? 'text-violet-600' : 'text-sky-600'
        )}>
          {isAI ? 'AI Agent' : 'Human'}
        </span>
      )}
    </div>
  );
};

export default ActorIndicator;
