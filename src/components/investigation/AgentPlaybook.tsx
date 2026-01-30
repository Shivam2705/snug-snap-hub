import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileInput, 
  UserCheck, 
  Shield, 
  MapPin, 
  Search, 
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import { CustomerCase } from "@/data/mockCases";
import { cn } from "@/lib/utils";

interface AgentPlaybookProps {
  caseData: CustomerCase;
}

interface AgentAction {
  id: string;
  description: string;
  status: 'completed' | 'pending' | 'recommended';
  result?: string;
  timestamp?: string;
}

interface AgentData {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  actionsTaken: AgentAction[];
  recommendations: AgentAction[];
}

const generateAgentData = (caseData: CustomerCase): AgentData[] => {
  const isCAW004 = caseData.caseId === 'CAW-2024-004';
  
  return [
    {
      id: 'case-intake',
      name: 'Case Intake Agent',
      icon: FileInput,
      description: 'Reviews incoming cases and fetches initial customer details from systems.',
      actionsTaken: [
        { id: '1', description: 'Fetched Customer Details from iGuide', status: 'completed', result: 'Customer profile retrieved successfully' },
        { id: '2', description: 'Reviewed Notes in iGuide Mainframe', status: 'completed', result: 'No previous investigator activity found' },
        { id: '3', description: 'Routed case to Customer Verification Agent', status: 'completed' }
      ],
      recommendations: [
        { id: 'r1', description: 'Review case notes before proceeding', status: 'recommended' }
      ]
    },
    {
      id: 'customer-verification',
      name: 'Customer Verification Agent',
      icon: UserCheck,
      description: 'Validates customer identity using mainframe records and contact information.',
      actionsTaken: isCAW004 ? [
        { id: '1', description: 'Searched for Accounts in iGuide Mainframe using Address', status: 'completed', result: '1 Account Found - Sarah Davis' },
        { id: '2', description: 'Searched using Phone Number', status: 'completed', result: '1 Account Found - Sarah Davis' },
        { id: '3', description: 'Customer verified successfully on Mainframe', status: 'completed' },
        { id: '4', description: 'Routed case to Fraud Detection Agent', status: 'completed' }
      ] : [
        { id: '1', description: 'Searched for Accounts in iGuide Mainframe', status: 'completed', result: 'Account found' },
        { id: '2', description: 'Verified customer identity', status: 'completed' }
      ],
      recommendations: [
        { id: 'r1', description: 'Verify phone number matches mainframe records', status: 'recommended' },
        { id: 'r2', description: 'Cross-check email domain for legitimacy', status: 'recommended' }
      ]
    },
    {
      id: 'fraud-detection',
      name: 'Fraud Detection Agent',
      icon: Shield,
      description: 'Searches fraud databases (CIFAS) for matches against customer PII.',
      actionsTaken: isCAW004 ? [
        { id: '1', description: 'Searched using Address in CIFAS', status: 'completed', result: 'No Result Found' },
        { id: '2', description: 'Searched using Phone Number in CIFAS', status: 'completed', result: 'No Result Found' },
        { id: '3', description: 'Searched using combinations of Customer PII', status: 'completed', result: 'No Result Found' },
        { id: '4', description: 'Searched Address (20, Eluna Apartments) in CIFAS', status: 'completed', result: 'No Match' },
        { id: '5', description: 'Searched Address (47, Junction Road) in CIFAS', status: 'completed', result: 'No Match' },
        { id: '6', description: 'Searched Address (355 Montagu Road) in CIFAS', status: 'completed', result: '1 Result Found - Case 16218601, False Identity (01)' }
      ] : [
        { id: '1', description: 'Searched CIFAS database', status: 'completed', result: 'No fraud records found' }
      ],
      recommendations: isCAW004 ? [
        { id: 'r1', description: 'Flag account due to CIFAS match on historical address', status: 'recommended' },
        { id: 'r2', description: 'Request additional identity documentation', status: 'recommended' }
      ] : [
        { id: 'r1', description: 'Monitor account for suspicious activity', status: 'recommended' }
      ]
    },
    {
      id: 'address-verification',
      name: 'Address Verification Agent',
      icon: MapPin,
      description: 'Retrieves and verifies address history from credit bureaus (TransUnion, Experian).',
      actionsTaken: isCAW004 ? [
        { id: '1', description: 'Searched Credit Report in TransUnion Portal', status: 'completed', result: 'Name & DOB confirmed with Mainframe' },
        { id: '2', description: 'Retrieved 2 addresses from TransUnion', status: 'completed', result: '20 Eluna Apartments, 47 Junction Road' },
        { id: '3', description: 'Searched Mail order in Experian', status: 'completed', result: 'Name & DOB confirmed with Mainframe' },
        { id: '4', description: 'Retrieved 1 address from Experian', status: 'completed', result: '355 Montagu Road, N9 0EU' },
        { id: '5', description: 'Sent 3 addresses to Fraud Detection Agent', status: 'completed' }
      ] : [
        { id: '1', description: 'Retrieved address history from TransUnion', status: 'completed' },
        { id: '2', description: 'Verified current address', status: 'completed' }
      ],
      recommendations: [
        { id: 'r1', description: 'Verify address tenure meets minimum requirements', status: 'recommended' }
      ]
    },
    {
      id: 'investigation',
      name: 'Investigation Agent',
      icon: Search,
      description: 'Re-verifies contact details and performs deep data matching.',
      actionsTaken: isCAW004 ? [
        { id: '1', description: 'Searched using Name & Address for Sarah Davis', status: 'completed', result: '1 result found' },
        { id: '2', description: 'Retrieved contact details', status: 'completed', result: 'Phone: 01406860876, Email: sarahdavis1234@gmail.com' },
        { id: '3', description: 'Matched Phone & Email with iGuide Mainframe', status: 'completed', result: 'Verification Successful' },
        { id: '4', description: 'Routed case to Communication Agent', status: 'completed' }
      ] : [
        { id: '1', description: 'Verified contact information', status: 'completed' },
        { id: '2', description: 'Cross-referenced data sources', status: 'completed' }
      ],
      recommendations: [
        { id: 'r1', description: 'Request proof of address document', status: 'recommended' }
      ]
    },
    {
      id: 'communication',
      name: 'Communication Agent',
      icon: MessageSquare,
      description: 'Facilitates customer outreach via SMS, Email, and Zendesk ticketing.',
      actionsTaken: isCAW004 ? [
        { id: '1', description: 'Send SMS to customer (01406860876)', status: caseData.status === 'Awaiting Customer' ? 'pending' : 'completed' },
        { id: '2', description: 'Created Zendesk ticket', status: caseData.status === 'Awaiting Customer' ? 'pending' : 'completed' },
        { id: '3', description: 'Send Email via Zendesk (sarahdavis1234@gmail.com)', status: caseData.status === 'Awaiting Customer' ? 'pending' : 'completed' }
      ] : [
        { id: '1', description: 'Customer communication pending', status: 'pending' }
      ],
      recommendations: [
        { id: 'r1', description: 'Send follow-up SMS if no response within 48 hours', status: 'recommended' },
        { id: 'r2', description: 'Escalate to phone call if email bounces', status: 'recommended' }
      ]
    }
  ];
};

const AgentPlaybook = ({ caseData }: AgentPlaybookProps) => {
  const agents = generateAgentData(caseData);
  const [selectedAgent, setSelectedAgent] = useState<AgentData>(agents[0]);

  const getStatusIcon = (status: AgentAction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-[#2ED573]" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-[#FFA502]" />;
      case 'recommended':
        return <ArrowRight className="h-4 w-4 text-[#4DA3FF]" />;
    }
  };

  const getStatusBadge = (status: AgentAction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-[#2ED573]/10 text-[#2ED573] border-[#2ED573]/20">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-[#FFA502]/10 text-[#FFA502] border-[#FFA502]/20">Pending</Badge>;
      case 'recommended':
        return <Badge className="bg-[#4DA3FF]/10 text-[#4DA3FF] border-[#4DA3FF]/20">Recommended</Badge>;
    }
  };

  const completedCount = selectedAgent.actionsTaken.filter(a => a.status === 'completed').length;
  const totalActions = selectedAgent.actionsTaken.length;

  return (
    <div className="grid grid-cols-12 gap-4 h-[600px]">
      {/* Left Panel - Agent Tiles */}
      <div className="col-span-4">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-2">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isSelected = selectedAgent.id === agent.id;
              const agentCompleted = agent.actionsTaken.filter(a => a.status === 'completed').length;
              const agentTotal = agent.actionsTaken.length;
              
              return (
                <Card 
                  key={agent.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 border",
                    isSelected 
                      ? "bg-[#4DA3FF]/10 border-[#4DA3FF]/50 shadow-lg shadow-[#4DA3FF]/10" 
                      : "bg-[#181C23] border-[#12151B] hover:border-[#4DA3FF]/30 hover:bg-[#181C23]/80"
                  )}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        isSelected ? "bg-[#4DA3FF]/20" : "bg-[#12151B]"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          isSelected ? "text-[#4DA3FF]" : "text-slate-400"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-medium text-sm truncate",
                          isSelected ? "text-white" : "text-slate-300"
                        )}>
                          {agent.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {agentCompleted}/{agentTotal} actions
                          </span>
                          {agentCompleted === agentTotal && agentTotal > 0 && (
                            <CheckCircle2 className="h-3 w-3 text-[#2ED573]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Agent Details */}
      <div className="col-span-8">
        <Card className="h-full bg-[#181C23] border-[#12151B]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#4DA3FF]/10 rounded-lg">
                <selectedAgent.icon className="h-6 w-6 text-[#4DA3FF]" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">{selectedAgent.name}</CardTitle>
                <p className="text-sm text-slate-400 mt-0.5">{selectedAgent.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2ED573]" />
                <span className="text-sm text-slate-300">{completedCount} completed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#4DA3FF]" />
                <span className="text-sm text-slate-300">{selectedAgent.recommendations.length} recommendations</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[420px] pr-4">
              {/* Actions Taken Section */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2ED573]" />
                  Actions Taken
                </h5>
                <div className="space-y-3">
                  {selectedAgent.actionsTaken.map((action, index) => (
                    <div 
                      key={action.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#12151B] border border-[#12151B]"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(action.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-slate-200">{action.description}</p>
                          {getStatusBadge(action.status)}
                        </div>
                        {action.result && (
                          <p className="text-xs text-slate-400 mt-1.5 bg-[#0B0D10] p-2 rounded">
                            → {action.result}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Section */}
              <div>
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4DA3FF]" />
                  Recommended Actions
                </h5>
                <div className="space-y-3">
                  {selectedAgent.recommendations.map((action) => (
                    <div 
                      key={action.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#4DA3FF]/5 border border-[#4DA3FF]/20"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(action.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentPlaybook;
