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
  LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgentNode {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  status: 'completed' | 'in-progress' | 'pending';
  decision?: string;
  confidence?: number;
  actions: string[];
  findings: string[];
  linkage?: string;
}

const CAW009AgentFlowchart = () => {
  // Start with all agents completed for this case
  const [agents, setAgents] = useState<AgentNode[]>([
    {
      id: 'case-initiation',
      name: 'Case Initiation Agent',
      shortName: 'Initiation',
      icon: FileInput,
      status: 'completed',
      actions: ['Categorized the case type: CAWAO Day 0'],
      findings: ['Case Type: CAWAO Day 0'],
      linkage: 'Sending case to Data Extraction Agent'
    },
    {
      id: 'data-extraction',
      name: 'Data Extraction Agent',
      shortName: 'Extraction',
      icon: Database,
      status: 'completed',
      actions: ['Fetched details from iGuide using Customer Number "Y123456"'],
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
      status: 'completed',
      decision: 'Pass',
      confidence: 95,
      actions: [
        'Verify Customer Information with iGuide Mainframe - Checked',
        'Multiple credit account with same address - Checked',
        'Invalid or suspicious email address - Checked',
        'New credit account with high value order and delivery far from registered address - Checked',
        'Conversion of Cash account to credit along with address change - Checked',
        'Address, email, or phone changed before order - Checked',
        'Bulk order for resale items (like Dyson, watches, designer, beauty) - Checked'
      ],
      findings: ['All checks completed successfully', 'Agent decision: Pass', 'Confidence: 95%'],
      linkage: 'Sending case to Experian Agent for Retrieving Addresses'
    },
    {
      id: 'experian-agent',
      name: 'Experian Agent',
      shortName: 'Experian',
      icon: MapPin,
      status: 'completed',
      actions: ['Retrieved past Addresses from Experian'],
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
      status: 'completed',
      actions: ['Retrieved past Addresses from TransUnion'],
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
      status: 'completed',
      actions: ['Verified details in CIFAS for all addresses'],
      findings: ['No flag detected!'],
      linkage: 'Sending case to Action Agent'
    },
    {
      id: 'action-agent',
      name: 'Action Agent',
      shortName: 'Action',
      icon: Unlock,
      status: 'completed',
      decision: 'Approved',
      confidence: 95,
      actions: ['Unblocked credit account for Christopher Martin'],
      findings: ['Completed with 95% confidence']
    }
  ]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [liveMessage, setLiveMessage] = useState<{from: string; to: string; message: string} | null>({
    from: 'action-agent',
    to: '',
    message: 'Credit account unblocked successfully with 95% confidence!'
  });

  const messages = [
    { from: 'case-initiation', to: 'data-extraction', message: 'Case categorized as CAWAO Day 0, initiating data extraction...' },
    { from: 'data-extraction', to: 'fraud-detection', message: 'Customer details retrieved from iGuide, proceeding to fraud checks...' },
    { from: 'fraud-detection', to: 'experian-agent', message: 'All fraud checks passed (95% confidence), retrieving address history from Experian...' },
    { from: 'experian-agent', to: 'transunion-agent', message: '2 addresses found in Experian, cross-checking with TransUnion...' },
    { from: 'transunion-agent', to: 'cifas-agent', message: '2 addresses found in TransUnion, verifying all addresses in CIFAS...' },
    { from: 'cifas-agent', to: 'action-agent', message: 'No fraud flags detected in CIFAS, proceeding to final action...' },
    { from: 'action-agent', to: '', message: 'Credit account unblocked successfully with 95% confidence!' }
  ];

  // Cycle through messages to show history
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      setLiveMessage(messages[(currentMessageIndex + 1) % messages.length]);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentMessageIndex]);

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
      {/* Live Message Display */}
      {liveMessage && (
        <div className="bg-gradient-to-r from-[#4DA3FF]/10 to-[#2ED573]/10 rounded-xl p-4 border border-[#4DA3FF]/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#4DA3FF]" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#4DA3FF] animate-ping" />
            </div>
            <span className="text-sm text-[#4DA3FF] font-semibold uppercase tracking-wider">Live Agent Communication</span>
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
      <ScrollArea className="h-[600px]">
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

                  {/* Actions */}
                  {agent.status !== 'pending' && (
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</p>
                      <div className="space-y-1">
                        {agent.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#2ED573] mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Findings */}
                  {agent.status !== 'pending' && agent.findings.length > 0 && (
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
                      "w-0.5 h-4",
                      agent.status === 'completed' ? "bg-[#2ED573]" : "bg-slate-600"
                    )} />
                    <ArrowDown className={cn(
                      "h-4 w-4",
                      agent.status === 'completed' ? "text-[#2ED573]" : "text-slate-600"
                    )} />
                    <div className={cn(
                      "w-0.5 h-4",
                      agent.status === 'completed' ? "bg-[#2ED573]" : "bg-slate-600"
                    )} />
                    {agent.status === 'completed' && agents[index + 1]?.status === 'in-progress' && (
                      <div className="absolute">
                        <div className="w-2 h-2 rounded-full bg-[#4DA3FF] animate-ping" />
                      </div>
                    )}
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
