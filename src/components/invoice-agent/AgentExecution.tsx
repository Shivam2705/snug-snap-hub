import { useEffect, useRef } from "react";
import { Check, Loader2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentStatus, SSELog } from "./types";

interface AgentExecutionProps {
  agents: {
    tableExtraction: AgentStatus;
    metadataExtraction: AgentStatus;
  };
  sseLogs: SSELog[];
  executionStatus: 'idle' | 'running' | 'completed' | 'error';
}

const StatusIcon = ({ status }: { status: AgentStatus['status'] }) => {
  switch (status) {
    case 'completed':
      return <Check className="h-5 w-5 text-accent-foreground" style={{ color: 'hsl(142, 76%, 36%)' }} />;
    case 'running':
      return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};

const AgentCard = ({ 
  name, 
  status, 
  description 
}: { 
  name: string; 
  status: AgentStatus; 
  description: string;
}) => {
  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all",
      status.status === 'running' && "border-primary bg-primary/5",
      status.status === 'completed' && "border-accent bg-accent/20",
      status.status === 'error' && "border-destructive/50 bg-destructive/5",
      status.status === 'pending' && "border-border bg-muted/30"
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <StatusIcon status={status.status} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {status.message && (
            <p className={cn(
              "text-sm mt-2",
              status.status === 'error' ? "text-destructive" : "text-primary"
            )}>
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const AgentExecution = ({ agents, sseLogs, executionStatus }: AgentExecutionProps) => {
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [sseLogs]);

  return (
    <div className="flex flex-col h-full">
      {/* Agents Status */}
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">Agent Pipeline</h3>
        
        <div className="space-y-3">
          <AgentCard
            name="Agent 1: Table Extraction Agent"
            status={agents.tableExtraction}
            description="Detects and extracts tabular data from invoice documents"
          />
          
          <div className="flex justify-center">
            <div className={cn(
              "w-0.5 h-6 transition-colors",
              agents.tableExtraction.status === 'completed' 
                ? "bg-primary" 
                : "bg-muted-foreground/30"
            )} />
          </div>
          
          <AgentCard
            name="Agent 2: Metadata Extraction Agent"
            status={agents.metadataExtraction}
            description="Extracts invoice metadata using LLM processing"
          />
        </div>
      </div>

      {/* Execution Log */}
      <div className="flex-1 flex flex-col border-t border-border">
        <div className="p-3 bg-muted/30 border-b border-border">
          <h4 className="font-medium text-sm">Execution Log</h4>
        </div>
        <div 
          ref={logsContainerRef}
          className="flex-1 overflow-auto p-3 space-y-2 font-mono text-xs"
        >
          {executionStatus === 'idle' ? (
            <p className="text-muted-foreground">Upload a PDF and click "Run Agent" to start</p>
          ) : sseLogs.length === 0 ? (
            <p className="text-muted-foreground">Waiting for execution logs...</p>
          ) : (
            sseLogs.map((log, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-start gap-2 p-2 rounded bg-muted/50 animate-in fade-in slide-in-from-bottom-1",
                )}
              >
                <span className="text-muted-foreground whitespace-nowrap">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                <span className="text-primary font-semibold">Step {log.step}:</span>
                <span className="flex-1">{log.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentExecution;
