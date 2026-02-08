import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2, Clock, Scan, GitCompare, BrainCircuit } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AgentStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  actions: string[];
}

const agents: AgentStep[] = [
  {
    id: "extraction",
    name: "Attribute Extraction Agent",
    description: "Parsing catalog data and extracting product attributes",
    icon: <Scan className="h-5 w-5" />,
    actions: [
      "Reading Excel file structure...",
      "Extracting item attributes...",
      "Parsing image references...",
      "Validating data formats..."
    ]
  },
  {
    id: "matching",
    name: "Catalogue Matching Agent",
    description: "Matching items against existing catalog and standards",
    icon: <GitCompare className="h-5 w-5" />,
    actions: [
      "Loading reference catalog...",
      "Comparing color attributes...",
      "Matching category hierarchy...",
      "Calculating match scores..."
    ]
  },
  {
    id: "decision",
    name: "Decision Engine",
    description: "Generating approval recommendations based on analysis",
    icon: <BrainCircuit className="h-5 w-5" />,
    actions: [
      "Analyzing match percentages...",
      "Applying business rules...",
      "Generating recommendations...",
      "Preparing review queue..."
    ]
  }
];

interface CatalogAgentFlowProps {
  onComplete: () => void;
}

const CatalogAgentFlow = ({ onComplete }: CatalogAgentFlowProps) => {
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 10000; // 10 seconds
    const agentDuration = totalDuration / agents.length;
    const actionDuration = agentDuration / 4;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, totalDuration / 100);

    // Action cycling within each agent
    const actionInterval = setInterval(() => {
      setCurrentActionIndex((prev) => (prev + 1) % 4);
    }, actionDuration);

    // Agent progression
    const agentTimers = agents.map((agent, index) => {
      return setTimeout(() => {
        if (index > 0) {
          setCompletedAgents((prev) => [...prev, agents[index - 1].id]);
        }
        setCurrentAgentIndex(index);
        setCurrentActionIndex(0);
      }, index * agentDuration);
    });

    // Completion
    const completeTimer = setTimeout(() => {
      setCompletedAgents((prev) => [...prev, agents[agents.length - 1].id]);
      setTimeout(onComplete, 500);
    }, totalDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(actionInterval);
      agentTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const getAgentStatus = (agentId: string, index: number) => {
    if (completedAgents.includes(agentId)) return "completed";
    if (index === currentAgentIndex) return "in-progress";
    return "pending";
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Processing Catalog</h2>
        <p className="text-sm text-muted-foreground">
          AI agents are analyzing your supplier data...
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-center text-muted-foreground">{Math.round(progress)}% Complete</p>
      </div>

      {/* Agent flow */}
      <div className="w-full max-w-lg space-y-3">
        {agents.map((agent, index) => {
          const status = getAgentStatus(agent.id, index);
          const isActive = status === "in-progress";
          const isCompleted = status === "completed";

          return (
            <div key={agent.id} className="relative">
              {/* Connector line */}
              {index < agents.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[23px] top-[56px] w-0.5 h-6",
                    isCompleted ? "bg-success" : "bg-border"
                  )}
                />
              )}

              <div
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-all duration-300",
                  isActive && "bg-primary/5 border-primary/30 shadow-sm",
                  isCompleted && "bg-success/5 border-success/30",
                  status === "pending" && "bg-muted/30 border-border opacity-60"
                )}
              >
                {/* Status icon */}
                <div
                  className={cn(
                    "flex-shrink-0 h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all",
                    isActive && "bg-primary/10 border-primary text-primary",
                    isCompleted && "bg-success/10 border-success text-success",
                    status === "pending" && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "p-1 rounded",
                        isActive && "text-primary",
                        isCompleted && "text-success"
                      )}
                    >
                      {agent.icon}
                    </span>
                    <h4 className="font-medium text-sm">{agent.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{agent.description}</p>

                  {/* Current action */}
                  {isActive && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-primary animate-pulse">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {agent.actions[currentActionIndex]}
                    </div>
                  )}

                  {/* Completed checkmarks */}
                  {isCompleted && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {agent.actions.slice(0, 2).map((action, i) => (
                        <span key={i} className="text-xs text-success flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          {action.replace("...", "")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogAgentFlow;
