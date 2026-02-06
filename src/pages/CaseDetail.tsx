import Header from "@/components/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockCases, FinalOutcome, QueueType, CaseStatus, AIRecommendation, RecommendationAction } from "@/data/mockCases";
import StatusBadge from "@/components/StatusBadge";
import RiskBadge from "@/components/investigation/RiskBadge";
import CollapsibleCustomerDetails from "@/components/investigation/CollapsibleCustomerDetails";
import AIRecommendationPanel from "@/components/investigation/AIRecommendationPanel";
import DynamicAgentFlowchart from "@/components/investigation/DynamicAgentFlowchart";
import AgentFlowchart from "@/components/investigation/AgentFlowchart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Brain,
  CheckCircle2,
  Ban,
  AlertTriangle,
  Phone,
  Play,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { useState, useCallback } from "react";

const DYNAMIC_CASES = ['CAW-2024-009', 'CAW-2024-004', 'CAW-2024-003'];

const SCENARIO_OUTCOMES: Record<string, { status: CaseStatus; finalOutcome: FinalOutcome }> = {
  'CAW-2024-009': { status: 'Completed', finalOutcome: 'approved' },
  'CAW-2024-004': { status: 'Completed', finalOutcome: 'escalated' },
  'CAW-2024-003': { status: 'Completed', finalOutcome: 'awaiting-customer' },
};

const SCENARIO_RECOMMENDATIONS: Record<string, AIRecommendation> = {
  'CAW-2024-009': {
    action: 'await' as RecommendationAction,
    label: 'Account Unblocked',
    reasoning: 'All verification checks passed. Customer identity confirmed via Experian and TransUnion. No fraud markers found in CIFAS National Fraud Database. Account has been autonomously unblocked.',
    supportingEvidence: [
      'Identity verified against Experian records — full match on name, DOB, and address',
      'TransUnion credit history shows 8+ years of consistent activity',
      'CIFAS check returned no fraud markers or warnings',
      'Mainframe records confirm authentic contact details',
      'Risk score within acceptable threshold for auto-approval'
    ]
  },
  'CAW-2024-004': {
    action: 'escalate' as RecommendationAction,
    label: 'Escalate to AIT',
    reasoning: 'Multiple fraud indicators detected during investigation. CIFAS flag confirmed with active fraud marker. Authentication level elevated to Auth2. Case requires Advanced Investigation Team review for potential coordinated fraud activity.',
    supportingEvidence: [
      'CIFAS National Fraud Database returned active fraud marker',
      'Address discrepancy found between Experian and mainframe records',
      'Authentication level elevated to Auth2 due to suspicious activity',
      'Multiple recent applications detected across different institutions',
      'Contact details partially match known fraud ring patterns'
    ]
  },
  'CAW-2024-003': {
    action: 'await' as RecommendationAction,
    label: 'Awaiting Customer Information',
    reasoning: 'Investigation partially completed but requires additional customer verification. NOC flag raised during address verification. Customer needs to provide updated proof of address and identity documentation before case can proceed.',
    supportingEvidence: [
      'NOC (Notice of Correction) flag detected on credit file',
      'Address on application differs from TransUnion records',
      'Customer phone number verified but email bounced',
      'CIFAS check returned monitoring flag — not a confirmed fraud marker',
      'Insufficient documentation to make final determination'
    ]
  }
};

const outcomeConfig: Record<FinalOutcome, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  blocked: { icon: Ban, label: 'Account Blocked', color: 'text-[#FF4757]', bgColor: 'bg-[#FF4757]/10 border-[#FF4757]/20' },
  escalated: { icon: AlertTriangle, label: 'Escalated to AIT', color: 'text-[#FFA502]', bgColor: 'bg-[#FFA502]/10 border-[#FFA502]/20' },
  'awaiting-customer': { icon: Phone, label: 'Awaiting Customer', color: 'text-[#4DA3FF]', bgColor: 'bg-[#4DA3FF]/10 border-[#4DA3FF]/20' },
  approved: { icon: CheckCircle2, label: 'Approved', color: 'text-[#2ED573]', bgColor: 'bg-[#2ED573]/10 border-[#2ED573]/20' }
};

const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(() => mockCases.find(c => c.caseId === caseId));
  const [workflowSummary, setWorkflowSummary] = useState<string | null>(null);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [runKey, setRunKey] = useState(0);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#0B0D10]">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Case Not Found</h1>
          <Button asChild>
            <Link to="/cawao">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isDynamicCase = DYNAMIC_CASES.includes(caseData.caseId);

  const handleRunAgent = () => {
    setIsAgentRunning(true);
    // Update status to "In Progress" in mockCases for session persistence
    const caseIndex = mockCases.findIndex(c => c.caseId === caseId);
    if (caseIndex !== -1) {
      mockCases[caseIndex] = {
        ...mockCases[caseIndex],
        status: 'In Progress' as CaseStatus
      };
      setCaseData({ ...mockCases[caseIndex] });
    }
  };

  const handleRerunAgent = () => {
    setRunKey(prev => prev + 1);
    setIsAgentRunning(true);
    setHasCompleted(false);
    setWorkflowSummary(null);
    // Reset status to "In Progress"
    const caseIndex = mockCases.findIndex(c => c.caseId === caseId);
    if (caseIndex !== -1) {
      mockCases[caseIndex] = {
        ...mockCases[caseIndex],
        status: 'In Progress' as CaseStatus,
        finalOutcome: undefined,
        completionDateTime: null,
        aiRecommendation: undefined,
        confidenceScore: undefined
      };
      setCaseData({ ...mockCases[caseIndex] });
    }
  };

  const handleWorkflowComplete = useCallback((summary: string) => {
    setWorkflowSummary(summary);
    setHasCompleted(true);
    
    // Update mockCases array for session persistence with scenario outcome and recommendation
    const scenarioOutcome = SCENARIO_OUTCOMES[caseData.caseId];
    const scenarioRecommendation = SCENARIO_RECOMMENDATIONS[caseData.caseId];
    if (scenarioOutcome) {
      const caseIndex = mockCases.findIndex(c => c.caseId === caseId);
      if (caseIndex !== -1) {
        mockCases[caseIndex] = {
          ...mockCases[caseIndex],
          status: scenarioOutcome.status,
          finalOutcome: scenarioOutcome.finalOutcome,
          completionDateTime: new Date().toISOString(),
          confidenceScore: 95,
          aiRecommendation: scenarioRecommendation,
        };
        setCaseData({ ...mockCases[caseIndex] });
      }
    }
  }, [caseData.caseId, caseId]);

  const handleCompleteCase = () => {
    const caseIndex = mockCases.findIndex(c => c.caseId === caseId);
    if (caseIndex !== -1) {
      mockCases[caseIndex] = {
        ...mockCases[caseIndex],
        status: 'Completed',
        queue: 'day-7' as QueueType,
        completionDateTime: new Date().toISOString(),
        finalOutcome: 'approved' as FinalOutcome
      };
      
      setCaseData(mockCases[caseIndex]);
      toast.success(`Case ${caseId} marked as completed and moved to Day-7 queue`);
    }
  };

  const outcome = caseData.finalOutcome ? outcomeConfig[caseData.finalOutcome] : null;
  const OutcomeIcon = outcome?.icon;
  const isCompleted = caseData.status === 'Completed';
  const isNew = caseData.status === 'New';

  return (
    <div className="min-h-screen bg-[#0B0D10]">
      <Header />
      
      <main className="container py-6 md:py-8 max-w-7xl">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-[#181C23] hover:text-white">
            <Link to="/cawao">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Queue
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cawao" className="hover:text-white transition-colors">CAWAO-Schedule</Link>
            <span>/</span>
            <span className="text-white font-medium">{caseData.caseId}</span>
          </div>
        </div>

        {/* Case Header */}
        <div className="bg-[#181C23] rounded-xl border border-[#12151B] shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{caseData.caseId}</h1>
                <StatusBadge status={caseData.status} />
                <RiskBadge level={caseData.riskLevel} score={caseData.riskScore} />
              </div>
              <p className="text-slate-400">
                {caseData.firstName} {caseData.lastName} • {caseData.queue === 'day-0' ? 'Day-0 Queue' : caseData.queue === 'day-7' ? 'Day-7 Queue' : 'Day-28 Queue'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Run Agent / Re-run Agent button for dynamic cases */}
              {isDynamicCase && !isAgentRunning && !hasCompleted && (
                <Button 
                  onClick={handleRunAgent}
                  className="bg-[#4DA3FF] hover:bg-[#4DA3FF]/90 text-white font-semibold"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Run Agent
                </Button>
              )}

              {isDynamicCase && hasCompleted && (
                <Button 
                  onClick={handleRerunAgent}
                  variant="outline"
                  className="border-[#4DA3FF]/30 text-[#4DA3FF] hover:bg-[#4DA3FF]/10 bg-transparent font-semibold"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Re-run Agent
                </Button>
              )}

              {/* Show outcome badge: for dynamic cases only after workflow completes, for others when case is completed */}
              {((isDynamicCase && hasCompleted) || (!isDynamicCase && isCompleted)) && outcome && OutcomeIcon && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${outcome.bgColor}`}>
                  <OutcomeIcon className={`h-5 w-5 ${outcome.color}`} />
                  <span className={`font-semibold ${outcome.color}`}>{outcome.label}</span>
                </div>
              )}
              
              {!isCompleted && !isDynamicCase && (
                <Button 
                  onClick={handleCompleteCase}
                  className="bg-[#2ED573] hover:bg-[#2ED573]/90 text-black font-semibold"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Case
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Customer Details */}
        <CollapsibleCustomerDetails caseData={caseData} />

        {/* Two Panel Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Panel - Direct Flowchart */}
          <div className="lg:col-span-9">
            <Card className="border-0 shadow-md bg-[#181C23] border-[#12151B]">
              <CardContent className="p-6">
                {isDynamicCase ? (
                  <DynamicAgentFlowchart 
                    key={runKey}
                    caseId={caseData.caseId} 
                    isRunning={isAgentRunning}
                    onWorkflowComplete={handleWorkflowComplete} 
                  />
                ) : (
                  <AgentFlowchart caseData={caseData} />
                )}
              </CardContent>
            </Card>

            {/* AI Investigation Summary - appears after workflow completes or from mock data */}
            {(workflowSummary || (!isDynamicCase && caseData.aiSummary)) && (
              <Card className="border-0 shadow-md mt-6 bg-[#181C23] border-[#12151B]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-white">
                    <div className="p-1.5 bg-[#4DA3FF]/10 rounded-lg">
                      <Brain className="h-4 w-4 text-[#4DA3FF]" />
                    </div>
                    AI Investigation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">
                    {workflowSummary || caseData.aiSummary}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - AI Recommendation (hidden for dynamic cases until workflow completes) */}
          <div className="lg:col-span-3">
            {isDynamicCase ? (
              hasCompleted ? (
                <div className="animate-fade-in">
                  <AIRecommendationPanel caseData={caseData} />
                </div>
              ) : (
                <Card className="border-0 shadow-md bg-[#181C23] border-[#12151B]">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                    <div className="p-3 bg-[#4DA3FF]/10 rounded-full mb-3">
                      <Brain className="h-6 w-6 text-[#4DA3FF]" />
                    </div>
                    <p className="text-sm text-slate-400">
                      {isAgentRunning 
                        ? 'AI recommendation will appear once the agent workflow completes...' 
                        : 'Run the agent to generate AI recommendations'}
                    </p>
                  </CardContent>
                </Card>
              )
            ) : (
              <AIRecommendationPanel caseData={caseData} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;
