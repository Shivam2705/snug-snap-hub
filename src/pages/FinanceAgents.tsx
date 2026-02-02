import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, FileText, Shield, Calculator } from "lucide-react";

const financeAgentsList = [
  {
    id: "cawao-schedule",
    name: "CAWAO-Schedule",
    purpose: "Credit Account Investigation without orders. Multi-agent verification for fraud detection.",
    capabilities: [
      "CIFAS fraud detection",
      "Customer verification",
      "Authentication codes",
      "Address validation"
    ],
    savings: ["50% reduction in fraud losses"]
  },
  {
    id: "invoice-agent",
    name: "Invoice Agent",
    purpose: "Automated invoice processing with intelligent data extraction and validation.",
    capabilities: [
      "Invoice data extraction",
      "Vendor matching",
      "Approval workflows",
      "Exception handling"
    ],
    savings: ["70% faster invoice processing"]
  }
];

const agentIcons = {
  "cawao-schedule": Shield,
  "invoice-agent": FileText,
};

const FinanceAgents = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<typeof financeAgentsList[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRunAgent = (agentId: string) => {
    if (agentId === "cawao-schedule") {
      navigate("/cawao");
      return;
    }
    
    const agent = financeAgentsList.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Finance & Auditing</h1>
              <p className="text-muted-foreground">AI Agents for financial operations automation</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            EXL's Finance & Auditing AI agents streamline financial operations through automated 
            credit investigation, fraud detection, and invoice processing. These agents ensure 
            compliance, reduce manual effort, and provide real-time insights for better 
            financial control and decision-making.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
          {financeAgentsList.map((agent) => {
            const IconComponent = agentIcons[agent.id as keyof typeof agentIcons] || DollarSign;
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
