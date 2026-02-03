import Header from "@/components/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockCases, FinalOutcome, QueueType } from "@/data/mockCases";
import StatusBadge from "@/components/StatusBadge";
import RiskBadge from "@/components/investigation/RiskBadge";
import CollapsibleCustomerDetails from "@/components/investigation/CollapsibleCustomerDetails";
import AIRecommendationPanel from "@/components/investigation/AIRecommendationPanel";
import EvidenceTimeline from "@/components/investigation/EvidenceTimeline";
import ActivityLog from "@/components/investigation/ActivityLog";
import LiveAgentPlaybook from "@/components/investigation/LiveAgentPlaybook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Brain,
  CheckCircle2,
  Ban,
  AlertTriangle,
  Phone,
  FileText,
  Activity,
  Bot
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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
              {isCompleted && outcome && OutcomeIcon && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${outcome.bgColor}`}>
                  <OutcomeIcon className={`h-5 w-5 ${outcome.color}`} />
                  <span className={`font-semibold ${outcome.color}`}>{outcome.label}</span>
                </div>
              )}
              
              {!isCompleted && (
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

        {/* Collapsible Customer Details at Top */}
        <CollapsibleCustomerDetails caseData={caseData} />

        {/* Two Panel Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Panel - Tabs with Playbook Default */}
          <div className="lg:col-span-9">
            <Card className="border-0 shadow-md bg-[#181C23] border-[#12151B]">
              <CardContent className="p-6">
                <Tabs defaultValue="playbook">
                  <TabsList className="mb-4 bg-[#12151B]">
                    <TabsTrigger value="playbook" className="gap-2 text-slate-300 data-[state=active]:bg-[#4DA3FF] data-[state=active]:text-white">
                      <Bot className="h-4 w-4" />
                      Agent Playbook
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="gap-2 text-slate-300 data-[state=active]:bg-[#4DA3FF] data-[state=active]:text-white">
                      <FileText className="h-4 w-4" />
                      Evidence
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2 text-slate-300 data-[state=active]:bg-[#4DA3FF] data-[state=active]:text-white">
                      <Activity className="h-4 w-4" />
                      Activity Log
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="playbook">
                    <LiveAgentPlaybook caseData={caseData} />
                  </TabsContent>

                  <TabsContent value="timeline">
                    {caseData.evidenceTimeline && caseData.evidenceTimeline.length > 0 ? (
                      <EvidenceTimeline evidence={caseData.evidenceTimeline} />
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>No evidence collected yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="activity">
                    {caseData.activityLog && caseData.activityLog.length > 0 ? (
                      <ActivityLog activities={caseData.activityLog} />
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>No activity recorded yet</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* AI Summary */}
            {caseData.aiSummary && (
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
                  <p className="text-slate-300 leading-relaxed">{caseData.aiSummary}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - AI Recommendation & Actions */}
          <div className="lg:col-span-3">
            <AIRecommendationPanel caseData={caseData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;
