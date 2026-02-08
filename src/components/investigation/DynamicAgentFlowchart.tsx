import { useState, useEffect } from "react";
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
  Ban,
  AlertTriangle,
  Phone,
  Play,
  LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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

interface ScenarioConfig {
  customerName: string;
  customerNumber: string;
  email: string;
  phone: string;
  address: string;
  experianAddresses: string[];
  transunionAddresses: string[];
  cifasFindings: string[];
  cifasActions?: string[];
  actionIcon: LucideIcon;
  actionDecision: string;
  actionConfidence: number;
  actionText: string;
  actionFindings: string[];
  summary: string;
  messages: { from: string; to: string; message: string }[];
}

const scenarioConfigs: Record<string, ScenarioConfig> = {
  'CAW-2024-009': {
    customerName: 'Christopher Martin',
    customerNumber: 'Y123456',
    email: 'c.martin@outlook.com',
    phone: '+44 7700 900567',
    address: '67 Queens Road, Liverpool, L1 5QR',
    experianAddresses: ['→ 22 Eluna Apartments, 47 Junction Road', '→ 25 London Street, London'],
    transunionAddresses: ['→ 20 Eluna Apartments, 47 Junction Road', '→ 50 London Street, London'],
    cifasFindings: ['No flag detected!'],
    actionIcon: Unlock,
    actionDecision: 'Approved',
    actionConfidence: 95,
    actionText: 'Unblocked credit account for Christopher Martin',
    actionFindings: ['Credit account unblocked successfully', 'Completed with 95% confidence'],
    summary: 'All verification checks passed successfully. Customer identity verified via iGuide Mainframe. Address history retrieved from Experian and TransUnion. CIFAS check completed with no fraud flags detected. Credit account unblocked automatically by AI Agent with 95% confidence.',
    messages: [
      { from: 'case-initiation', to: 'data-extraction', message: 'Case categorized as CAWAO Day 0, initiating data extraction...' },
      { from: 'data-extraction', to: 'fraud-detection', message: 'Customer details retrieved from iGuide, proceeding to fraud checks...' },
      { from: 'fraud-detection', to: 'experian-agent', message: 'All fraud checks passed (95% confidence), retrieving address history...' },
      { from: 'experian-agent', to: 'transunion-agent', message: '2 addresses found in Experian, cross-checking with TransUnion...' },
      { from: 'transunion-agent', to: 'cifas-agent', message: '2 addresses found in TransUnion, verifying all addresses in CIFAS...' },
      { from: 'cifas-agent', to: 'action-agent', message: 'No fraud flags detected in CIFAS, proceeding to final action...' },
      { from: 'action-agent', to: '', message: 'Credit account unblocked successfully with 95% confidence!' }
    ]
  },
  'CAW-2024-004': {
    customerName: 'Sarah Davis',
    customerNumber: 'SD789012',
    email: 'sarahdavis1234@gmail.com',
    phone: '01406860876',
    address: '12 Garden View, Leeds, LS1 4EF',
    experianAddresses: ['→ 20 Eluna Apartments, 4 Wapping Lane, E1W 2RG', '→ 47, 45-47 Junction Road, N9 7JS'],
    transunionAddresses: ['→ 355 Montagu Road, N9 0EU', '→ 47 Junction Road, N9 7JS'],
    cifasFindings: ['CIFAS Match: Case 16218601', 'Type: False Identity (01)', 'Address: 355 Montagu Road, N9 0EU', '✓ Phone Number & Email matched with Mainframe', '✗ CIFAS address not matching with Mainframe'],
    cifasActions: ['Verified details in CIFAS for all addresses', 'Matching Account details with iGuide Mainframe'],
    actionIcon: Ban,
    actionDecision: 'Blocked',
    actionConfidence: 92,
    actionText: 'Blocked credit account using iGuide',
    actionFindings: ['CIFAS match confirmed - account blocked', 'Credit account blocked via iGuide Mainframe', 'Completed with 92% confidence'],
    summary: 'CIFAS match detected at historical address 355 Montagu Road - Case 16218601: False Identity (01). Phone and email matched with Mainframe records, but CIFAS address does not match Mainframe. Fraud Detection Agent flagged potential identity fraud. Credit account has been blocked using iGuide with 92% confidence.',
    messages: [
      { from: 'case-initiation', to: 'data-extraction', message: 'Case categorized as CAWAO Day 0, initiating data extraction...' },
      { from: 'data-extraction', to: 'fraud-detection', message: 'Customer details retrieved from iGuide, proceeding to fraud checks...' },
      { from: 'fraud-detection', to: 'experian-agent', message: 'Initial fraud checks passed, retrieving address history...' },
      { from: 'experian-agent', to: 'transunion-agent', message: '2 addresses found in Experian, cross-checking with TransUnion...' },
      { from: 'transunion-agent', to: 'cifas-agent', message: '2 addresses found in TransUnion, verifying all addresses in CIFAS...' },
      { from: 'cifas-agent', to: 'action-agent', message: 'CIFAS match found! Case 16218601 - False Identity detected. Blocking account...' },
      { from: 'action-agent', to: '', message: 'Credit account blocked via iGuide with 92% confidence.' }
    ]
  },
  'CAW-2024-003': {
    customerName: 'Robert Taylor',
    customerNumber: 'RT345678',
    email: 'r.taylor@outlook.com',
    phone: '+44 7700 900789',
    address: '78 River Road, Birmingham, B1 3CD',
    experianAddresses: ['→ 15 Baker Street, London, W1U 3BW', '→ 90 Victoria Road, Birmingham, B1 1QA'],
    transunionAddresses: ['→ 32 Crown Lane, London, N14 5EP', '→ 15 Baker Street, London, W1U 3BW'],
    cifasFindings: ['CIFAS Match: Protective Registration', 'Address: 32 Crown Lane, N14 5EP', 'Requires customer clarification'],
    actionIcon: Phone,
    actionDecision: 'Awaiting Customer',
    actionConfidence: 90,
    actionText: 'Customer contact initiated - awaiting documentation',
    actionFindings: ['SMS sent to customer', 'Email sent via Zendesk', 'Awaiting customer response', 'Completed with 90% confidence'],
    summary: 'Customer verification completed. CIFAS protective registration found at historical address 32 Crown Lane requiring clarification. NOC flag present indicating name discrepancy between application and credit file. Customer contacted via SMS and Zendesk email for additional identity documentation. Case pending customer response before final determination can be made.',
    messages: [
      { from: 'case-initiation', to: 'data-extraction', message: 'Case categorized as CAWAO Day 0, initiating data extraction...' },
      { from: 'data-extraction', to: 'fraud-detection', message: 'Customer details retrieved from iGuide, proceeding to fraud checks...' },
      { from: 'fraud-detection', to: 'experian-agent', message: 'Initial fraud checks passed, retrieving address history...' },
      { from: 'experian-agent', to: 'transunion-agent', message: '2 addresses found in Experian, cross-checking with TransUnion...' },
      { from: 'transunion-agent', to: 'cifas-agent', message: '2 addresses found in TransUnion, verifying all addresses in CIFAS...' },
      { from: 'cifas-agent', to: 'action-agent', message: 'CIFAS protective registration found. Customer contact required...' },
      { from: 'action-agent', to: '', message: 'Customer contacted via SMS and email. Awaiting response.' }
    ]
  },
  'CAW-2024-002': {
    customerName: 'James Mitchell',
    customerNumber: 'JM456789',
    email: 'james.mitchell92@hotmail.com',
    phone: '07845123987',
    address: '28 Riverside Court, Manchester, M3 4JT',
    experianAddresses: ['→ 20 Eluna Apartments, 4 Wapping Lane, E1W 2RG', '→ 47, 45-47 Junction Road, N9 7JS'],
    transunionAddresses: ['→ 355 Montagu Road, N9 0EU', '→ 47 Junction Road, N9 7JS'],
    cifasFindings: ['CIFAS Match: Case 16218601', 'Type: False Identity (01)', 'Address: 355 Montagu Road, N9 0EU', '✓ Phone Number & Email matched with Mainframe', '✗ CIFAS address not matching with Mainframe'],
    cifasActions: ['Verified details in CIFAS for all addresses', 'Matching Account details with iGuide Mainframe'],
    actionIcon: Ban,
    actionDecision: 'Blocked',
    actionConfidence: 92,
    actionText: 'Blocked credit account using iGuide',
    actionFindings: ['CIFAS match confirmed - account blocked', 'Credit account blocked via iGuide Mainframe', 'Completed with 92% confidence'],
    summary: 'CIFAS match detected at historical address 355 Montagu Road - Case 16218601: False Identity (01). Phone and email matched with Mainframe records, but CIFAS address does not match Mainframe. Fraud Detection Agent flagged potential identity fraud. Credit account has been blocked using iGuide with 92% confidence.',
    messages: [
      { from: 'case-initiation', to: 'data-extraction', message: 'Case categorized as CAWAO Day 0, initiating data extraction...' },
      { from: 'data-extraction', to: 'fraud-detection', message: 'Customer details retrieved from iGuide, proceeding to fraud checks...' },
      { from: 'fraud-detection', to: 'experian-agent', message: 'Initial fraud checks passed, retrieving address history...' },
      { from: 'experian-agent', to: 'transunion-agent', message: '2 addresses found in Experian, cross-checking with TransUnion...' },
      { from: 'transunion-agent', to: 'cifas-agent', message: '2 addresses found in TransUnion, verifying all addresses in CIFAS...' },
      { from: 'cifas-agent', to: 'action-agent', message: 'CIFAS match found! Case 16218601 - False Identity detected. Blocking account...' },
      { from: 'action-agent', to: '', message: 'Credit account blocked via iGuide with 92% confidence.' }
    ]
  }
};

const getInitialAgents = (config: ScenarioConfig): AgentNode[] => [
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
    actions: [{ text: `Fetched details from iGuide using Customer Number "${config.customerNumber}"`, completed: false }],
    findings: [
      `Email: ${config.email}`,
      `Phone: ${config.phone}`,
      `Address: ${config.address}`
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
    findings: config.experianAddresses,
    linkage: 'Sending case to Transunion Agent for Retrieving Addresses'
  },
  {
    id: 'transunion-agent',
    name: 'Transunion Agent',
    shortName: 'Transunion',
    icon: MapPin,
    status: 'pending',
    actions: [{ text: 'Retrieved past Addresses from TransUnion', completed: false }],
    findings: config.transunionAddresses,
    linkage: 'Sending case to CIFAS Agent to verify fraud'
  },
  {
    id: 'cifas-agent',
    name: 'CIFAS Agent',
    shortName: 'CIFAS',
    icon: Shield,
    status: 'pending',
    actions: (config.cifasActions || ['Verified details in CIFAS for all addresses']).map(text => ({ text, completed: false })),
    findings: config.cifasFindings,
    linkage: 'Sending case to Action Agent'
  },
  {
    id: 'action-agent',
    name: 'Action Agent',
    shortName: 'Action',
    icon: config.actionIcon,
    status: 'pending',
    decision: config.actionDecision,
    confidence: config.actionConfidence,
    actions: [{ text: config.actionText, completed: false }],
    findings: config.actionFindings
  }
];

interface DynamicAgentFlowchartProps {
  caseId: string;
  isRunning: boolean;
  onWorkflowComplete?: (summary: string) => void;
}

const DynamicAgentFlowchart = ({ caseId, isRunning, onWorkflowComplete }: DynamicAgentFlowchartProps) => {
  const config = scenarioConfigs[caseId];
  const [agents, setAgents] = useState<AgentNode[]>(() => getInitialAgents(config));
  const [liveMessage, setLiveMessage] = useState<{ from: string; to: string; message: string } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const TOTAL_DURATION = 15000;
  const FRAUD_ACTIONS_COUNT = 7;
  const REGULAR_AGENT_TIME = 1200;
  const FRAUD_ACTION_TIME = 600;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Start the workflow only when isRunning becomes true
  useEffect(() => {
    if (!isRunning || hasStarted) return;
    setHasStarted(true);
    setAgents(prev => {
      const updated = [...prev];
      updated[0] = { ...updated[0], status: 'in-progress' };
      return updated;
    });
    setLiveMessage(config.messages[0]);
  }, [isRunning, hasStarted]);

  // Progress bar animation
  useEffect(() => {
    if (isComplete || !isRunning || !hasStarted) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + (100 / (TOTAL_DURATION / 100));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isComplete, isRunning, hasStarted]);

  // Main workflow progression - runs when hasStarted becomes true
  useEffect(() => {
    if (isComplete || !isRunning || !hasStarted) return;

    let cancelled = false;

    const runWorkflow = async () => {
      // Agent 0: Case Initiation
      await delay(REGULAR_AGENT_TIME);
      if (cancelled) return;
      completeAgent(0);
      startAgent(1);
      setLiveMessage(config.messages[0]);

      // Agent 1: Data Extraction
      await delay(REGULAR_AGENT_TIME);
      if (cancelled) return;
      completeAgent(1);
      startAgent(2);
      setLiveMessage(config.messages[1]);

      // Agent 2: Fraud Detection - tick actions one by one
      for (let i = 0; i < FRAUD_ACTIONS_COUNT; i++) {
        await delay(FRAUD_ACTION_TIME);
        if (cancelled) return;
        tickFraudAction(i);
      }
      completeAgent(2);
      startAgent(3);
      setLiveMessage(config.messages[2]);

      // Agent 3: Experian
      await delay(REGULAR_AGENT_TIME);
      if (cancelled) return;
      completeAgent(3);
      startAgent(4);
      setLiveMessage(config.messages[3]);

      // Agent 4: Transunion
      await delay(REGULAR_AGENT_TIME);
      if (cancelled) return;
      completeAgent(4);
      startAgent(5);
      setLiveMessage(config.messages[4]);

      // Agent 5: CIFAS
      await delay(REGULAR_AGENT_TIME);
      if (cancelled) return;
      completeAgent(5);
      startAgent(6);
      setLiveMessage(config.messages[5]);

      // Agent 6: Action Agent
      await delay(REGULAR_AGENT_TIME);
      if (cancelled) return;
      completeAgent(6);
      setLiveMessage(config.messages[6]);

      // Complete workflow
      setIsComplete(true);
      setProgress(100);

      // Trigger summary callback
      await delay(500);
      if (cancelled) return;
      onWorkflowComplete?.(config.summary);
    };

    runWorkflow();

    return () => { cancelled = true; };
  }, [hasStarted]);

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

  const getDecisionBadgeStyle = (decision: string) => {
    switch (decision) {
      case 'Pass': case 'Approved':
        return 'bg-[#2ED573]/20 text-[#2ED573] border-[#2ED573]/30';
      case 'Escalated':
        return 'bg-[#FFA502]/20 text-[#FFA502] border-[#FFA502]/30';
      case 'Awaiting Customer':
        return 'bg-[#4DA3FF]/20 text-[#4DA3FF] border-[#4DA3FF]/30';
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  // Show waiting state when agent hasn't been triggered
  if (!isRunning && !hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-[#12151B] rounded-full mb-4">
          <Play className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Agent Workflow Ready</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Click <span className="text-[#4DA3FF] font-medium">"Run Agent"</span> to start the automated investigation workflow. The AI agents will execute sequentially to analyze this case.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="bg-[#12151B] rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Workflow Progress</span>
          <span className={cn("text-sm font-bold", isComplete ? "text-[#2ED573]" : "text-[#4DA3FF]")}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        {isComplete && (
          <div className="flex items-center gap-2 mt-2 text-[#2ED573]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Workflow Completed</span>
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
                  <div className="flex items-center justify-between mb-1">
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
                      <Badge className={cn("text-sm px-3 py-1", getDecisionBadgeStyle(agent.decision))}>
                        {agent.decision} {agent.confidence && `(${agent.confidence}%)`}
                      </Badge>
                    )}
                  </div>

                  {/* Accordion for Actions & Findings - show all agents once workflow starts */}
                  {(hasStarted || agent.status === 'in-progress' || agent.status === 'completed') && (
                    <Accordion
                      type="multiple"
                      defaultValue={['actions']}
                      className="mt-2"
                    >
                      <AccordionItem value="actions" className="border-slate-700/50">
                        <AccordionTrigger className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-2 hover:no-underline">
                          Actions ({agent.actions.filter(a => a.completed).length}/{agent.actions.length})
                        </AccordionTrigger>
                        <AccordionContent>
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
                                  {action.text} {action.completed && <span className="text-[#2ED573]">✓</span>}
                                </span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {agent.status === 'completed' && agent.findings.length > 0 && (
                        <AccordionItem value="findings" className="border-slate-700/50">
                          <AccordionTrigger className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-2 hover:no-underline">
                            Findings ({agent.findings.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-[#181C23] rounded-lg p-3 space-y-1">
                              {agent.findings.map((finding, i) => (
                                <p key={i} className="text-xs text-slate-300">{finding}</p>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
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

export default DynamicAgentFlowchart;
