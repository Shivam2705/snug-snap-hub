import { useState } from "react";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { financeAgents } from "@/data/agentWorkflow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calculator, FileText, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const agentIcons = {
  "invoice-processing": FileText,
  "revenue-recognition": Calculator,
  "margin-leakage": TrendingDown,
};

const FinanceAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<typeof financeAgents[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRunAgent = (agentId: string) => {
    const agent = financeAgents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <Button asChild variant="outline">
            <Link to="/finance">
              Go to Process
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl gradient-exl flex items-center justify-center">
              <Calculator className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Finance, Accounting & Commercial Control</h1>
              <p className="text-muted-foreground">AI Agents for financial operations automation</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Automate invoice processing, revenue recognition, and margin analysis with intelligent AI agents.
            Each agent can be run with sample data to demonstrate its capabilities.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeAgents.map((agent) => {
            const IconComponent = agentIcons[agent.id as keyof typeof agentIcons] || Calculator;
            return (
              <AgentTile
                key={agent.id}
                id={agent.id}
                name={agent.name}
                purpose={agent.purpose}
                capabilities={agent.capabilities}
                savings={agent.savings}
                icon={IconComponent}
                onRun={handleRunAgent}
              />
            );
          })}
        </div>
      </div>

      <RunAgentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agent={selectedAgent}
      />
    </div>
  );
};

export default FinanceAgents;
