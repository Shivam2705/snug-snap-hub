import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { 
  FileInput, 
  Database,
  Shield, 
  MapPin, 
  CheckCircle2,
  Loader2,
  Clock,
  ArrowDown,
  ArrowRight,
  Unlock,
  LucideIcon,
  Brain,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AgentAction {
  text: string;
  completed: boolean;
}

interface AgentNode {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  status: 'completed' | 'in-progress' | 'pending';
  decision?: string;
  confidence?: number;
  actions: AgentAction[];
  findings: string[];
  linkage?: string;
}

const initialAgents: AgentNode[] = [
  {
    id: 'case-initiation',
    name: 'Case Initiation Agent',
    shortName: 'Initiation',
    icon: FileInput,
    status: 'pending',
    actions: [{ text: 'Categorized the case type: CAWAO Day 0', completed: false }],
    findings: ['Case Type: CAWAO Day 0'],
    linkage: 'Sending case to Data Extraction Agent'
  },
  {
    id: 'data-extraction',
    name: 'Data Extraction Agent',
    shortName: 'Extraction',
    icon: Database,
    status: 'pending',
    actions: [{ text: 'Fetched details from iGuide using Customer Number "Y123456"', completed: false }],
    findings: [
      'Email: c.martin@outlook.com',
      'Phone: +44 7700 900567',
      'Address: 67 Queens Road, Liverpool, L',
      'Last order details: Not Available',
      'Order Amount: Not Available',
      'Last Advisor comments: Not Available'
    ],
    linkage: 'Sending case to Fraud Detection Agent'
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Detection Agent',
    shortName: 'Fraud',
    icon: Shield,
    status: 'pending',
    decision: 'Pass',
    confidence: 95,
    actions: [
      { text: 'Verify Customer Information with iGuide Mainframe', completed: false },
      { text: 'Multiple credit account with same address', completed: false },
      { text: 'Invalid or suspicious email address', completed: false },
      { text: 'New credit account with high value order and delivery far from registered address', completed: false },
      { text: 'Conversion of Cash account to credit along with address change', completed: false },
      { text: 'Address, email, or phone changed before order', completed: false },
      { text: 'Bulk order for resale items (like Dyson, watches, designer, beauty)', completed: false }
    ],
    findings: ['All checks completed successfully', 'Agent decision: Pass', 'Confidence: 95%'],
    linkage: 'Sending case to Experian Agent for Retrieving Addresses'
  },
  {
    id: 'experian-agent',
    name: 'Experian Agent',
    shortName: 'Experian',
    icon: MapPin,
    status: 'pending',
    actions: [{ text: 'Retrieved past Addresses from Experian', completed: false }],
    findings: [
      '→ 22 Eluna Apartments, 47 Junction Road',
      '→ 25 London Street, London'
    ],
    linkage: 'Sending case to Transunion Agent for Retrieving Addresses'
  },
  {
    id: 'transunion-agent',
    name: 'Transunion Agent',
    shortName: 'Transunion',
    icon: MapPin,
    status: 'pending',
    actions: [{ text: 'Retrieved past Addresses from TransUnion', completed: false }],
    findings: [
      '→ 20 Eluna Apartments, 47 Junction Road',
      '→ 50 London Street, London'
    ],
    linkage: 'Sending case to CIFAS Agent to verify if there is any fraud with the addresses'
  },
  {
    id: 'cifas-agent',
    name: 'CIFAS Agent',
    shortName: 'CIFAS',
    icon: Shield,
    status: 'pending',
    actions: [{ text: 'Verified details in CIFAS for all addresses', completed: false }],
    findings: ['No flag detected!'],
    linkage: 'Sending case to Action Agent'
  },
  {
    id: 'action-agent',
    name: 'Action Agent',
    shortName: 'Action',
    icon: Unlock,
    status: 'pending',
    decision: 'Approved',
    confidence: 95,
    actions: [{ text: 'Unblocked credit account for Christopher Martin', completed: false }],
    findings: ['Completed with 95% confidence']
  }
];

const messages = [
  { from: 'case-initiation', to: 'data-extraction', message: 'Case categorized as CAWAO Day 0, initiating data extraction...' },
  { from: 'data-extraction', to: 'fraud-detection', message: 'Customer details retrieved from iGuide, proceeding to fraud checks...' },
  { from: 'fraud-detection', to: 'experian-agent', message: 'All fraud checks passed (95% confidence), retrieving address history...' },
  { from: 'experian-agent', to: 'transunion-agent', message: '2 addresses found in Experian, cross-checking with TransUnion...' },
  { from: 'transunion-agent', to: 'cifas-agent', message: '2 addresses found in TransUnion, verifying all addresses in CIFAS...' },
  { from: 'cifas-agent', to: 'action-agent', message: 'No fraud flags detected in CIFAS, proceeding to final action...' },
  { from: 'action-agent', to: '', message: 'Credit account unblocked successfully with 95% confidence!' }
];

const CAW009AgentFlowchart = () => {
  const [agents, setAgents] = useState<AgentNode[]>(initialAgents);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [fraudActionIndex, setFraudActionIndex] = useState(0);
  const [liveMessage, setLiveMessage] = useState<{from: string; to: string; message: string} | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAISummary, setShowAISummary] = useState(false);

  const TOTAL_DURATION = 15000; // 15 seconds total
  const AGENTS_COUNT = 7;
  const FRAUD_ACTIONS_COUNT = 7;
  
  // Time per regular agent (not fraud detection)
  const REGULAR_AGENT_TIME = 1200; // 1.2 seconds
  // Time for fraud detection with all its actions
  const FRAUD_AGENT_TOTAL_TIME = 4200; // 4.2 seconds for fraud agent (7 actions × 600ms)
  const FRAUD_ACTION_TIME = 600; // 600ms per fraud action

  // Start the workflow
  useEffect(() => {
    // Start first agent immediately
    setAgents(prev => {
      const updated = [...prev];
      updated[0] = { ...updated[0], status: 'in-progress' };
      return updated;
    });
    setLiveMessage(messages[0]);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (TOTAL_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isComplete]);

  // Main workflow progression
  useEffect(() => {
    if (isComplete) return;

    const runWorkflow = async () => {
      // Agent 0: Case Initiation
      await new Promise(resolve => setTimeout(resolve, REGULAR_AGENT_TIME));
      completeAgent(0);
      startAgent(1);
      setLiveMessage(messages[0]);

      // Agent 1: Data Extraction
      await new Promise(resolve => setTimeout(resolve, REGULAR_AGENT_TIME));
      completeAgent(1);
      startAgent(2);
      setLiveMessage(messages[1]);

      // Agent 2: Fraud Detection - tick actions one by one
      for (let i = 0; i < FRAUD_ACTIONS_COUNT; i++) {
        await new Promise(resolve => setTimeout(resolve, FRAUD_ACTION_TIME));
        tickFraudAction(i);
      }
      completeAgent(2);
      startAgent(3);
      setLiveMessage(messages[2]);

      // Agent 3: Experian
      await new Promise(resolve => setTimeout(resolve, REGULAR_AGENT_TIME));
      completeAgent(3);
      startAgent(4);
      setLiveMessage(messages[3]);

      // Agent 4: Transunion
      await new Promise(resolve => setTimeout(resolve, REGULAR_AGENT_TIME));
      completeAgent(4);
      startAgent(5);
      setLiveMessage(messages[4]);

      // Agent 5: CIFAS
      await new Promise(resolve => setTimeout(resolve, REGULAR_AGENT_TIME));
      completeAgent(5);
      startAgent(6);
      setLiveMessage(messages[5]);

      // Agent 6: Action Agent
      await new Promise(resolve => setTimeout(resolve, REGULAR_AGENT_TIME));
      completeAgent(6);
      setLiveMessage(messages[6]);
      
      // Complete workflow
      setIsComplete(true);
      setProgress(100);
      
      // Show AI Summary after a brief delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowAISummary(true);
    };

    runWorkflow();
  }, []);

  const completeAgent = (index: number) => {
    setAgents(prev => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        status: 'completed',
        actions: updated[index].actions.map(a => ({ ...a, completed: true }))
      };
      return updated;
    });
    setCurrentAgentIndex(index);
  };

  const startAgent = (index: number) => {
    setAgents(prev => {
      const updated = [...prev];
      if (index < updated.length) {
        updated[index] = { ...updated[index], status: 'in-progress' };
      }
      return updated;
    });
  };

  const tickFraudAction = (actionIndex: number) => {
    setAgents(prev => {
      const updated = [...prev];
      const fraudAgent = { ...updated[2] };
      const actions = [...fraudAgent.actions];
      actions[actionIndex] = { ...actions[actionIndex], completed: true };
      fraudAgent.actions = actions;
      updated[2] = fraudAgent;
      return updated;
    });
    setFraudActionIndex(actionIndex);
  };

  const getStatusColor = (status: AgentNode['status']) => {
    switch (status) {
      case 'completed': return 'border-[#2ED573] bg-[#2ED573]/10';
      case 'in-progress': return 'border-[#4DA3FF] bg-[#4DA3FF]/10 ring-2 ring-[#4DA3FF]/30';
      case 'pending': return 'border-slate-600 bg-slate-800/50';
    }
  };

  const getStatusIcon = (status: AgentNode['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-[#2ED573]" />;
      case 'in-progress': return <Loader2 className="h-4 w-4 text-[#4DA3FF] animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  const getIconColor = (status: AgentNode['status']) => {
    switch (status) {
      case 'completed': return 'text-[#2ED573]';
      case 'in-progress': return 'text-[#4DA3FF]';
      case 'pending': return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="bg-[#12151B] rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Workflow Progress</span>
          <span className={cn(
            "text-sm font-bold",
            isComplete ? "text-[#2ED573]" : "text-[#4DA3FF]"
          )}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        {isComplete && (
          <div className="flex items-center gap-2 mt-2 text-[#2ED573]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Workflow Completed in 15 seconds</span>
          </div>
        )}
      </div>

      {/* Live Message Display */}
      {liveMessage && (
        <div className="bg-gradient-to-r from-[#4DA3FF]/10 to-[#2ED573]/10 rounded-xl p-4 border border-[#4DA3FF]/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#4DA3FF]" />
              {!isComplete && (
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#4DA3FF] animate-ping" />
              )}
            </div>
            <span className="text-sm text-[#4DA3FF] font-semibold uppercase tracking-wider">
              {isComplete ? 'Workflow Complete' : 'Live Agent Communication'}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-[#4DA3FF]/20 text-[#4DA3FF] border-[#4DA3FF]/30">
              {agents.find(a => a.id === liveMessage.from)?.shortName || 'Agent'}
            </Badge>
            {liveMessage.to && (
              <>
                <ArrowRight className="h-4 w-4 text-[#4DA3FF] animate-pulse" />
                <Badge className="bg-[#2ED573]/20 text-[#2ED573] border-[#2ED573]/30">
                  {agents.find(a => a.id === liveMessage.to)?.shortName || 'Agent'}
                </Badge>
              </>
            )}
          </div>
          <p className="text-sm text-slate-300 italic pl-1">"{liveMessage.message}"</p>
        </div>
      )}


      {/* Flowchart */}
      <ScrollArea className="h-[500px]">
        <div className="relative bg-[#12151B] rounded-xl p-6">
          <div className="flex flex-col items-center gap-3">
            {agents.map((agent, index) => (
              <div key={agent.id} className="w-full max-w-2xl">
                {/* Agent Node */}
                <div 
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-500",
                    getStatusColor(agent.status)
                  )}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2.5 rounded-lg",
                        agent.status === 'completed' ? "bg-[#2ED573]/20" : 
                        agent.status === 'in-progress' ? "bg-[#4DA3FF]/20" : "bg-slate-700"
                      )}>
                        <agent.icon className={cn("h-5 w-5", getIconColor(agent.status))} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{agent.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {getStatusIcon(agent.status)}
                          <span className={cn(
                            "text-xs capitalize",
                            agent.status === 'completed' ? "text-[#2ED573]" : 
                            agent.status === 'in-progress' ? "text-[#4DA3FF]" : "text-slate-500"
                          )}>
                            {agent.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {agent.decision && agent.status === 'completed' && (
                      <Badge className={cn(
                        "text-sm px-3 py-1",
                        agent.decision === 'Pass' || agent.decision === 'Approved' 
                          ? "bg-[#2ED573]/20 text-[#2ED573] border-[#2ED573]/30" 
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      )}>
                        {agent.decision} {agent.confidence && `(${agent.confidence}%)`}
                      </Badge>
                    )}
                  </div>

                  {/* Actions - Show with dynamic ticking for Fraud Detection */}
                  {(agent.status === 'in-progress' || agent.status === 'completed') && (
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</p>
                      <div className="space-y-1">
                        {agent.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            {action.completed ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#2ED573] mt-0.5 flex-shrink-0" />
                            ) : agent.status === 'in-progress' ? (
                              <Loader2 className="h-3.5 w-3.5 text-[#4DA3FF] mt-0.5 flex-shrink-0 animate-spin" />
                            ) : (
                              <Clock className="h-3.5 w-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                            )}
                            <span className={cn(
                              "text-xs",
                              action.completed ? "text-slate-300" : "text-slate-500"
                            )}>
                              {action.text} {action.completed && <span className="text-[#2ED573]">- Checked</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Findings */}
                  {agent.status === 'completed' && agent.findings.length > 0 && (
                    <div className="bg-[#181C23] rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Findings</p>
                      <div className="space-y-1">
                        {agent.findings.map((finding, i) => (
                          <p key={i} className="text-xs text-slate-300">{finding}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linkage Message */}
                  {agent.linkage && agent.status === 'completed' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                      <ArrowRight className="h-4 w-4 text-[#4DA3FF]" />
                      <span className="text-xs text-[#4DA3FF] font-medium">{agent.linkage}</span>
                    </div>
                  )}
                </div>

                {/* Connection Arrow */}
                {index < agents.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <div className={cn(
                      "w-0.5 h-4 transition-colors duration-300",
                      agent.status === 'completed' ? "bg-[#2ED573]" : "bg-slate-600"
                    )} />
                    <ArrowDown className={cn(
                      "h-4 w-4 transition-colors duration-300",
                      agent.status === 'completed' ? "text-[#2ED573]" : "text-slate-600"
                    )} />
                    <div className={cn(
                      "w-0.5 h-4 transition-colors duration-300",
                      agent.status === 'completed' ? "bg-[#2ED573]" : "bg-slate-600"
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs pt-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#2ED573]" />
          <span className="text-slate-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 text-[#4DA3FF]" />
          <span className="text-slate-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-slate-400">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default CAW009AgentFlowchart;
