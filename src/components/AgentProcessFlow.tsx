import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Search, 
  Cpu, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentProcessFlowProps {
  leftAgents: string[];
  rightAgents: string[];
  leftProcessing: boolean;
  rightProcessing: boolean;
}

interface AgentNode {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  status: 'completed' | 'in-progress' | 'pending';
}

const agentConfig: Record<string, { shortName: string; icon: React.ElementType }> = {
  "Content Extraction Agent": { shortName: "Extraction", icon: FileText },
  "RAG Agent": { shortName: "RAG", icon: Search },
  "Finetuned SLM returns Agent": { shortName: "SLM", icon: Cpu },
};

const AgentProcessFlow = ({ leftAgents, rightAgents, leftProcessing, rightProcessing }: AgentProcessFlowProps) => {
  const [leftActiveIndex, setLeftActiveIndex] = useState<number | null>(null);
  const [rightActiveIndex, setRightActiveIndex] = useState<number | null>(null);

  // Animate through agents when processing
  useEffect(() => {
    if (leftProcessing) {
      let index = 0;
      const interval = setInterval(() => {
        setLeftActiveIndex(index);
        index = (index + 1) % leftAgents.length;
      }, 800);
      return () => {
        clearInterval(interval);
        setLeftActiveIndex(null);
      };
    } else {
      setLeftActiveIndex(null);
    }
  }, [leftProcessing, leftAgents.length]);

  useEffect(() => {
    if (rightProcessing) {
      let index = 0;
      const interval = setInterval(() => {
        setRightActiveIndex(index);
        index = (index + 1) % rightAgents.length;
      }, 800);
      return () => {
        clearInterval(interval);
        setRightActiveIndex(null);
      };
    } else {
      setRightActiveIndex(null);
    }
  }, [rightProcessing, rightAgents.length]);

  const renderAgentFlow = (agents: string[], activeIndex: number | null, isProcessing: boolean) => {
    if (agents.length === 0) {
      return (
        <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
          No agents selected
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {agents.map((agent, index) => {
          const config = agentConfig[agent] || { shortName: agent.split(" ")[0], icon: Cpu };
          const Icon = config.icon;
          const isActive = activeIndex === index && isProcessing;
          const isPast = activeIndex !== null && index < activeIndex && isProcessing;
          
          return (
            <div key={agent} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-300 min-w-[80px]",
                  isActive && "border-primary bg-primary/10 scale-105 shadow-lg",
                  isPast && "border-success bg-success/10",
                  !isActive && !isPast && "border-border bg-muted/30"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive && "bg-primary/20",
                  isPast && "bg-success/20",
                  !isActive && !isPast && "bg-muted"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive && "text-primary",
                    isPast && "text-success",
                    !isActive && !isPast && "text-muted-foreground"
                  )} />
                </div>
                <span className="text-xs font-medium text-center">{config.shortName}</span>
                <div className="h-4">
                  {isActive && <Loader2 className="h-3 w-3 text-primary animate-spin" />}
                  {isPast && <CheckCircle2 className="h-3 w-3 text-success" />}
                  {!isActive && !isPast && !isProcessing && <Clock className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
              
              {index < agents.length - 1 && (
                <ArrowRight className={cn(
                  "h-4 w-4 transition-colors",
                  (isActive || isPast) && "text-primary",
                  !isActive && !isPast && "text-muted-foreground"
                )} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Live Agent Process Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Chatbot Flow */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Chatbot 1</span>
              {leftProcessing && (
                <span className="flex items-center gap-1 text-xs text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Processing
                </span>
              )}
            </div>
            {renderAgentFlow(leftAgents, leftActiveIndex, leftProcessing)}
          </div>

          {/* Right Chatbot Flow */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Chatbot 2</span>
              {rightProcessing && (
                <span className="flex items-center gap-1 text-xs text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Processing
                </span>
              )}
            </div>
            {renderAgentFlow(rightAgents, rightActiveIndex, rightProcessing)}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3 text-success" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentProcessFlow;
