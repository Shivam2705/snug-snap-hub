import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import CasesTable from "@/components/CasesTable";
import { mockCases, getCaseStats } from "@/data/mockCases";
import { 
  LayoutGrid, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Pause, 
  Circle,
  Shield,
  FileCheck,
  Key,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CAWAODashboard = () => {
  const stats = getCaseStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">CAWAO Process</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Credit Account Investigation</h1>
              <p className="text-muted-foreground">
                CAWAO (Credit Account Without Any Order) - Fraud Investigation Dashboard
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard 
            title="Total Cases" 
            value={stats.total} 
            icon={LayoutGrid}
            variant="primary"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={Clock}
            variant="info"
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard 
            title="Review Required" 
            value={stats.reviewRequired} 
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={Pause}
            variant="default"
          />
          <StatCard 
            title="Not Started" 
            value={stats.notStarted} 
            icon={Circle}
            variant="default"
          />
        </div>

        {/* Verification Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Verification Flags</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-destructive" />
                  CIFAS Flagged
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">{stats.cifasYes}</p>
                <p className="text-xs text-muted-foreground mt-1">Cases with CIFAS = Yes</p>
              </CardContent>
            </Card>

            <Card className="border-warning/20 bg-warning/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-warning" />
                  NOC Flagged
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-warning">{stats.nocYes}</p>
                <p className="text-xs text-muted-foreground mt-1">Cases with NOC = Yes</p>
              </CardContent>
            </Card>

            <Card className="border-info/20 bg-info/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Key className="h-4 w-4 text-info" />
                  Auth Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xl font-bold text-info">{stats.authCode2}</p>
                    <p className="text-xs text-muted-foreground">Code 2</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-info">{stats.authCode3}</p>
                    <p className="text-xs text-muted-foreground">Code 3</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-info">{stats.authCode4}</p>
                    <p className="text-xs text-muted-foreground">Code 4</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Home className="h-4 w-4 text-accent" />
                  ZOWN Flagged
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">{stats.zownYes}</p>
                <p className="text-xs text-muted-foreground mt-1">Cases with ZOWN = Yes</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cases Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Customer Cases</h2>
          <CasesTable cases={mockCases} />
        </div>
      </main>
    </div>
  );
};

export default CAWAODashboard;