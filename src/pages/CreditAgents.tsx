import { useState } from "react";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { creditInvestigationAgents } from "@/data/agentWorkflow";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Home,
  UserCheck,
  MapPin,
  Mail,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  LayoutDashboard
} from "lucide-react";

const agentIcons: Record<string, any> = {
  "customer-verification": UserCheck,
  "address-verification": MapPin,
  "email-agent": Mail,
  "messaging-agent": MessageSquare,
  "fraud-detection": ShieldAlert
};

const CreditAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<typeof creditInvestigationAgents[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRunAgent = (agentId: string) => {
    const agent = creditInvestigationAgents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Credit Account Investigation</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                <Sparkles className="h-4 w-4" />
                {creditInvestigationAgents.length} Intelligent Agents
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Credit Account Investigation Agents</h1>
              <p className="text-muted-foreground max-w-2xl">
                Our CAWAO-Schedule (Credit Account Without Any Order) investigation suite uses specialized AI agents 
                to detect potential fraud through multi-step verification workflows.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/cawao">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Process
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditInvestigationAgents.map((agent, index) => {
            const Icon = agentIcons[agent.id] || ShieldAlert;
            
            return (
              <div 
                key={agent.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AgentTile
                  id={agent.id}
                  name={agent.name}
                  purpose={agent.purpose}
                  capabilities={agent.capabilities}
                  savings={agent.savings}
                  icon={Icon}
                  onRun={handleRunAgent}
                />
              </div>
            );
          })}
        </div>
      </main>

      <RunAgentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agent={selectedAgent}
      />
    </div>
  );
};

export default CreditAgents;
