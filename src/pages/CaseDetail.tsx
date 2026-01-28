import Header from "@/components/Header";
import { useParams, Link } from "react-router-dom";
import { mockCases, FinalOutcome } from "@/data/mockCases";
import StatusBadge from "@/components/StatusBadge";
import RiskBadge from "@/components/investigation/RiskBadge";
import CustomerDetailsPanel from "@/components/investigation/CustomerDetailsPanel";
import AIRecommendationPanel from "@/components/investigation/AIRecommendationPanel";
import EvidenceTimeline from "@/components/investigation/EvidenceTimeline";
import ActivityLog from "@/components/investigation/ActivityLog";
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
  Activity
} from "lucide-react";

const outcomeConfig: Record<FinalOutcome, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  blocked: { icon: Ban, label: 'Account Blocked', color: 'text-rose-700', bgColor: 'bg-rose-50 border-rose-200' },
  escalated: { icon: AlertTriangle, label: 'Escalated to AIT', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  'awaiting-customer': { icon: Phone, label: 'Awaiting Customer', color: 'text-sky-700', bgColor: 'bg-sky-50 border-sky-200' },
  approved: { icon: CheckCircle2, label: 'Approved', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' }
};

const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const caseData = mockCases.find(c => c.caseId === caseId);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Case Not Found</h1>
          <Button asChild>
            <Link to="/cawao">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const outcome = caseData.finalOutcome ? outcomeConfig[caseData.finalOutcome] : null;
  const OutcomeIcon = outcome?.icon;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container py-6 md:py-8 max-w-7xl">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild className="hover:bg-white">
            <Link to="/cawao">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Queue
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cawao" className="hover:text-foreground transition-colors">Investigation</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{caseData.caseId}</span>
          </div>
        </div>

        {/* Case Header */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{caseData.caseId}</h1>
                <StatusBadge status={caseData.status} />
                <RiskBadge level={caseData.riskLevel} score={caseData.riskScore} />
              </div>
              <p className="text-slate-300">
                {caseData.firstName} {caseData.lastName} • {caseData.queue === 'day-0' ? 'Day-0 Queue' : 'Day-7 Queue'}
              </p>
            </div>
            
            {/* Show final outcome for completed cases */}
            {caseData.status === 'Completed' && outcome && OutcomeIcon && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${outcome.bgColor}`}>
                <OutcomeIcon className={`h-5 w-5 ${outcome.color}`} />
                <span className={`font-semibold ${outcome.color}`}>{outcome.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Three Panel Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Customer Details */}
          <div className="lg:col-span-3 space-y-6">
            <CustomerDetailsPanel caseData={caseData} />
          </div>

          {/* Center Panel - Evidence Timeline */}
          <div className="lg:col-span-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <Tabs defaultValue="timeline">
                  <TabsList className="mb-4">
                    <TabsTrigger value="timeline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Evidence
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2">
                      <Activity className="h-4 w-4" />
                      Activity Log
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="timeline">
                    {caseData.evidenceTimeline && caseData.evidenceTimeline.length > 0 ? (
                      <EvidenceTimeline evidence={caseData.evidenceTimeline} />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>No evidence collected yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="activity">
                    {caseData.activityLog && caseData.activityLog.length > 0 ? (
                      <ActivityLog activities={caseData.activityLog} />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
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
              <Card className="border-0 shadow-md mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="p-1.5 bg-violet-100 rounded-lg">
                      <Brain className="h-4 w-4 text-violet-600" />
                    </div>
                    AI Investigation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{caseData.aiSummary}</p>
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
