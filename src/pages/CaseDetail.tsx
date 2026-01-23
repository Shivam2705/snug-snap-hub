import Header from "@/components/Header";
import { useParams, Link } from "react-router-dom";
import { mockCases } from "@/data/mockCases";
import { getAgentWorkflow } from "@/data/agentWorkflow";
import AgentWorkflowSidebar from "@/components/AgentWorkflowSidebar";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Brain
} from "lucide-react";

const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const caseData = mockCases.find(c => c.caseId === caseId);
  const workflow = caseId ? getAgentWorkflow(caseId) : null;

  if (!caseData) {
    return (
      <div className="min-h-screen bg-background">
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/cawao">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cawao" className="hover:text-foreground transition-colors">CAWAO</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{caseData.caseId}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Header */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      {caseData.caseId}
                      <StatusBadge status={caseData.status} />
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {caseData.firstName} {caseData.lastName}
                    </p>
                  </div>
                  
                  {caseData.fraud !== null && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      caseData.fraud 
                        ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                        : 'bg-success/10 text-success border border-success/20'
                    }`}>
                      {caseData.fraud ? (
                        <>
                          <XCircle className="h-5 w-5" />
                          <span className="font-semibold">Fraud Detected</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">No Fraud</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</p>
                        <p className="font-medium">{caseData.firstName} {caseData.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Date</p>
                        <p className="font-medium">{format(new Date(caseData.birthDate), "dd MMMM yyyy")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</p>
                        <p className="font-medium">{caseData.emailAddress}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Mobile Number</p>
                        <p className="font-medium">{caseData.mobileNumber}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Address</p>
                        <p className="font-medium">{caseData.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Assigned To</p>
                        <p className="font-medium">{caseData.assignTo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Received</p>
                        <p className="font-medium">{format(new Date(caseData.receivedDateTime), "dd/MM/yyyy HH:mm")}</p>
                      </div>
                    </div>
                    
                    {caseData.completionDateTime && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
                          <p className="font-medium">{format(new Date(caseData.completionDateTime), "dd/MM/yyyy HH:mm")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Flags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Verification Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg border ${caseData.cifas ? 'bg-destructive/10 border-destructive/30' : 'bg-muted'}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CIFAS</p>
                    <Badge variant={caseData.cifas ? "destructive" : "secondary"} className="text-sm">
                      {caseData.cifas ? "Yes" : "No"}
                    </Badge>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${caseData.noc ? 'bg-warning/10 border-warning/30' : 'bg-muted'}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">NOC</p>
                    <Badge variant={caseData.noc ? "default" : "secondary"} className="text-sm">
                      {caseData.noc ? "Yes" : "No"}
                    </Badge>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-muted">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Auth Code</p>
                    <Badge variant="outline" className="text-sm font-mono">
                      {caseData.authenticateCode}
                    </Badge>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${caseData.zown ? 'bg-accent/10 border-accent/30' : 'bg-muted'}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ZOWN</p>
                    <Badge variant={caseData.zown ? "default" : "secondary"} className="text-sm">
                      {caseData.zown ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Summary */}
            {caseData.aiSummary && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Investigation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{caseData.aiSummary}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Workflow Sidebar */}
          <div className="lg:col-span-1">
            {workflow && <AgentWorkflowSidebar agents={workflow.agents} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;