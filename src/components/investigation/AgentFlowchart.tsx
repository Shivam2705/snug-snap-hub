import { useState, useEffect } from "react";
import { CustomerCase } from "@/data/mockCases";
import { cn } from "@/lib/utils";
import { 
  FileInput, 
  UserCheck, 
  Shield, 
  MapPin, 
  Search, 
  MessageSquare,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock
} from "lucide-react";

interface AgentFlowchartProps {
  caseData: CustomerCase;
}

interface AgentNode {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  status: 'completed' | 'in-progress' | 'pending';
  connections: string[];
}

const AgentFlowchart = ({ caseData }: AgentFlowchartProps) => {
  const [activeConnection, setActiveConnection] = useState<string | null>(null);
  const [messageFlow, setMessageFlow] = useState<{from: string; to: string; message: string} | null>(null);

  const agents: AgentNode[] = [
    {
      id: 'case-intake',
      name: 'Case Intake Agent',
      shortName: 'Intake',
      icon: FileInput,
      status: 'completed',
      connections: ['customer-verification']
    },
    {
      id: 'customer-verification',
      name: 'Customer Verification Agent',
      shortName: 'Verification',
      icon: UserCheck,
      status: 'completed',
      connections: ['address-verification', 'fraud-detection']
    },
    {
      id: 'address-verification',
      name: 'Address Verification Agent',
      shortName: 'Address',
      icon: MapPin,
      status: 'completed',
      connections: ['fraud-detection']
    },
    {
      id: 'fraud-detection',
      name: 'Fraud Detection Agent',
      shortName: 'Fraud',
      icon: Shield,
      status: caseData.status === 'Awaiting Customer' ? 'in-progress' : 'completed',
      connections: ['investigation']
    },
    {
      id: 'investigation',
      name: 'Investigation Agent',
      shortName: 'Investigation',
      icon: Search,
      status: caseData.status === 'Awaiting Customer' ? 'in-progress' : 'completed',
      connections: ['communication']
    },
    {
      id: 'communication',
      name: 'Communication Agent',
      shortName: 'Comms',
      icon: MessageSquare,
      status: caseData.status === 'Completed' ? 'completed' : 'pending',
      connections: []
    }
  ];

  const messages = [
    { from: 'case-intake', to: 'customer-verification', message: 'Customer profile retrieved, proceeding to verification' },
    { from: 'customer-verification', to: 'address-verification', message: 'Identity verified, checking address history' },
    { from: 'customer-verification', to: 'fraud-detection', message: 'Running parallel fraud checks' },
    { from: 'address-verification', to: 'fraud-detection', message: '3 addresses found, checking CIFAS' },
    { from: 'fraud-detection', to: 'investigation', message: 'CIFAS match found on historical address' },
    { from: 'investigation', to: 'communication', message: 'Contact details verified, initiating outreach' }
  ];

  // Simulate live message flow
  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      const msg = messages[messageIndex % messages.length];
      setActiveConnection(`${msg.from}-${msg.to}`);
      setMessageFlow(msg);
      
      messageIndex++;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: AgentNode['status']) => {
    switch (status) {
      case 'completed': return 'border-[#2ED573] bg-[#2ED573]/10';
      case 'in-progress': return 'border-[#4DA3FF] bg-[#4DA3FF]/10';
      case 'pending': return 'border-slate-600 bg-slate-800/50';
    }
  };

  const getStatusIcon = (status: AgentNode['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-3 w-3 text-[#2ED573]" />;
      case 'in-progress': return <Loader2 className="h-3 w-3 text-[#4DA3FF] animate-spin" />;
      case 'pending': return <Clock className="h-3 w-3 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Message Display */}
      {messageFlow && (
        <div className="bg-[#12151B] rounded-lg p-4 border border-[#4DA3FF]/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#4DA3FF] animate-pulse" />
            <span className="text-xs text-[#4DA3FF] font-medium">Live Agent Communication</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">
              {agents.find(a => a.id === messageFlow.from)?.shortName}
            </span>
            <ArrowRight className="h-4 w-4 text-[#4DA3FF] animate-pulse" />
            <span className="text-sm font-medium text-white">
              {agents.find(a => a.id === messageFlow.to)?.shortName}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-2 italic">"{messageFlow.message}"</p>
        </div>
      )}

      {/* Flowchart */}
      <div className="relative bg-[#12151B] rounded-lg p-6 min-h-[400px]">
        {/* Agent Nodes - Arranged in a flow */}
        <div className="flex flex-col items-center gap-6">
          {/* Row 1: Intake */}
          <div className="flex justify-center">
            <AgentNodeComponent 
              agent={agents[0]} 
              isActive={activeConnection?.startsWith(agents[0].id)}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </div>

          {/* Connection Line */}
          <ConnectionLine isActive={activeConnection === 'case-intake-customer-verification'} />

          {/* Row 2: Customer Verification */}
          <div className="flex justify-center">
            <AgentNodeComponent 
              agent={agents[1]} 
              isActive={activeConnection?.includes(agents[1].id)}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </div>

          {/* Split Connection */}
          <div className="flex items-center gap-8">
            <ConnectionLine isActive={activeConnection === 'customer-verification-address-verification'} />
            <ConnectionLine isActive={activeConnection === 'customer-verification-fraud-detection'} />
          </div>

          {/* Row 3: Address Verification & Fraud Detection */}
          <div className="flex justify-center gap-16">
            <AgentNodeComponent 
              agent={agents[2]} 
              isActive={activeConnection?.includes(agents[2].id)}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
            <AgentNodeComponent 
              agent={agents[3]} 
              isActive={activeConnection?.includes(agents[3].id)}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </div>

          {/* Merge Connection */}
          <div className="flex items-center gap-8">
            <ConnectionLine isActive={activeConnection === 'address-verification-fraud-detection'} horizontal />
            <ConnectionLine isActive={activeConnection === 'fraud-detection-investigation'} />
          </div>

          {/* Row 4: Investigation */}
          <div className="flex justify-center">
            <AgentNodeComponent 
              agent={agents[4]} 
              isActive={activeConnection?.includes(agents[4].id)}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </div>

          {/* Connection Line */}
          <ConnectionLine isActive={activeConnection === 'investigation-communication'} />

          {/* Row 5: Communication */}
          <div className="flex justify-center">
            <AgentNodeComponent 
              agent={agents[5]} 
              isActive={activeConnection?.includes(agents[5].id)}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3 w-3 text-[#2ED573]" />
          <span className="text-slate-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-3 w-3 text-[#4DA3FF]" />
          <span className="text-slate-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-slate-500" />
          <span className="text-slate-400">Pending</span>
        </div>
      </div>
    </div>
  );
};

interface AgentNodeComponentProps {
  agent: AgentNode;
  isActive: boolean;
  getStatusColor: (status: AgentNode['status']) => string;
  getStatusIcon: (status: AgentNode['status']) => React.ReactNode;
}

const AgentNodeComponent = ({ agent, isActive, getStatusColor, getStatusIcon }: AgentNodeComponentProps) => {
  const Icon = agent.icon;
  
  return (
    <div 
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 min-w-[140px]",
        getStatusColor(agent.status),
        isActive && "ring-2 ring-[#4DA3FF] ring-offset-2 ring-offset-[#12151B] scale-105"
      )}
    >
      <div className={cn(
        "p-3 rounded-lg",
        agent.status === 'completed' ? "bg-[#2ED573]/20" : 
        agent.status === 'in-progress' ? "bg-[#4DA3FF]/20" : "bg-slate-700"
      )}>
        <Icon className={cn(
          "h-6 w-6",
          agent.status === 'completed' ? "text-[#2ED573]" : 
          agent.status === 'in-progress' ? "text-[#4DA3FF]" : "text-slate-400"
        )} />
      </div>
      <span className="text-sm font-medium text-white text-center">{agent.shortName}</span>
      <div className="absolute -top-1 -right-1">
        {getStatusIcon(agent.status)}
      </div>
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 rounded-full bg-[#4DA3FF] animate-ping" />
        </div>
      )}
    </div>
  );
};

interface ConnectionLineProps {
  isActive: boolean;
  horizontal?: boolean;
}

const ConnectionLine = ({ isActive, horizontal }: ConnectionLineProps) => {
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      horizontal ? "w-16 h-0.5" : "w-0.5 h-6"
    )}>
      <div className={cn(
        "absolute",
        horizontal ? "w-full h-0.5" : "w-0.5 h-full",
        isActive ? "bg-[#4DA3FF]" : "bg-slate-600"
      )} />
      {isActive && (
        <div className={cn(
          "absolute rounded-full bg-[#4DA3FF] animate-pulse",
          horizontal ? "w-2 h-2" : "w-2 h-2"
        )} />
      )}
    </div>
  );
};

export default AgentFlowchart;
