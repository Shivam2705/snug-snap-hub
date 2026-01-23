import { cn } from "@/lib/utils";
import { AgentStep } from "@/data/agentWorkflow";
import { Check, Clock, AlertCircle, Loader2, ChevronDown, ChevronRight, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AgentWorkflowSidebarProps {
  agents: AgentStep[];
}

const statusIcons = {
  completed: Check,
  "in-progress": Loader2,
  pending: Clock,
  failed: AlertCircle
};

const statusColors = {
  completed: "bg-success text-success-foreground border-success",
  "in-progress": "bg-info text-info-foreground border-info animate-pulse",
  pending: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive text-destructive-foreground border-destructive"
};

const AgentWorkflowSidebar = ({ agents }: AgentWorkflowSidebarProps) => {
  const [expandedAgents, setExpandedAgents] = useState<string[]>(
    agents.filter(a => a.status === 'in-progress' || a.status === 'completed').map(a => a.id)
  );

  const toggleAgent = (id: string) => {
    setExpandedAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-card rounded-xl border p-4 space-y-2">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Agent Workflow
      </h3>
      
      <div className="space-y-1">
        {agents.map((agent, index) => {
          const StatusIcon = statusIcons[agent.status];
          const isExpanded = expandedAgents.includes(agent.id);
          const isLast = index === agents.length - 1;
          
          return (
            <div key={agent.id} className="relative">
              {/* Connector line */}
              {!isLast && (
                <div className={cn(
                  "absolute left-[19px] top-[44px] w-0.5 h-[calc(100%-20px)]",
                  agent.status === 'completed' ? "bg-success" : "bg-border"
                )} />
              )}
              
              <Collapsible open={isExpanded} onOpenChange={() => toggleAgent(agent.id)}>
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50",
                    isExpanded && "bg-muted/30"
                  )}>
                    <div className={cn(
                      "flex-shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center",
                      statusColors[agent.status]
                    )}>
                      <StatusIcon className={cn(
                        "h-5 w-5",
                        agent.status === 'in-progress' && "animate-spin"
                      )} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{agent.name}</h4>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "mt-1 text-xs capitalize",
                          agent.status === 'completed' && "border-success/50 text-success",
                          agent.status === 'in-progress' && "border-info/50 text-info",
                          agent.status === 'failed' && "border-destructive/50 text-destructive"
                        )}
                      >
                        {agent.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="ml-[52px] pb-4 pr-3 space-y-3">
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                    
                    {agent.actions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</p>
                        <ul className="space-y-1">
                          {agent.actions.map((action, i) => (
                            <li key={i} className="text-xs flex items-start gap-2">
                              <span className={cn(
                                "mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0",
                                agent.status === 'completed' ? "bg-success" : "bg-muted-foreground"
                              )} />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {agent.findings && agent.findings.length > 0 && (
                      <div className="space-y-1 bg-muted/50 rounded-lg p-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Findings</p>
                        <ul className="space-y-1">
                          {agent.findings.map((finding, i) => (
                            <li key={i} className="text-xs text-foreground">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {agent.id === 'email-agent' && agent.status !== 'completed' && (
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        <Mail className="mr-2 h-3 w-3" />
                        Send Email to ACT Manually
                      </Button>
                    )}
                    
                    {agent.id === 'messaging-agent' && agent.status !== 'completed' && (
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        <Send className="mr-2 h-3 w-3" />
                        Send SMS Manually
                      </Button>
                    )}
                    
                    {agent.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(agent.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentWorkflowSidebar;