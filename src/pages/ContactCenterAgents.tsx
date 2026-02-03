import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Headphones, FileText, BookOpen, Mic, Shield } from "lucide-react";

const contactCenterAgentsList = [
  {
    id: "i-audit",
    name: "i-Audit",
    purpose: "Real-time call quality monitoring and compliance auditing through advanced speech analytics.",
    capabilities: [
      "Call transcription & analysis",
      "Compliance monitoring",
      "Quality scoring",
      "Agent performance insights"
    ],
    savings: ["40% reduction in manual QA effort"]
  },
  {
    id: "i-assist",
    name: "i-Assist",
    purpose: "AI-powered real-time agent assistance for improved customer interactions and faster resolution.",
    capabilities: [
      "Real-time suggestions",
      "Knowledge retrieval",
      "Sentiment detection",
      "Next-best-action guidance"
    ],
    savings: ["25% improvement in first-call resolution"]
  },
  {
    id: "email-assist",
    name: "Email Assist Agent",
    purpose: "Intelligent email processing and response generation for customer service efficiency.",
    capabilities: [
      "Email classification",
      "Auto-response drafting",
      "Sentiment analysis",
      "Priority routing"
    ],
    savings: ["60% faster email response times"]
  },
  {
    id: "knowledge-assist",
    name: "Knowledge Assist Agent",
    purpose: "Instant access to organizational knowledge for agents and customers.",
    capabilities: [
      "Semantic search",
      "Context-aware answers",
      "Document retrieval",
      "FAQ automation"
    ],
    savings: ["35% reduction in average handle time"]
  }
];

const agentIcons = {
  "i-audit": Shield,
  "i-assist": Mic,
  "email-assist": FileText,
  "knowledge-assist": BookOpen,
};

const ContactCenterAgents = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<typeof contactCenterAgentsList[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRunAgent = (agentId: string) => {
    if (agentId === "i-audit") {
      window.location.href = "https://next-iaudit-ui-1037311574972.us-central1.run.app";
      return;
    }
    
    if (agentId === "knowledge-assist") {
      navigate("/knowledge-assist");
      return;
    }
    
    const agent = contactCenterAgentsList.find(a => a.id === agentId);
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
              <Headphones className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Contact Center</h1>
              <p className="text-muted-foreground">AI Agents transforming customer interactions</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            EXL's Contact Center AI agents revolutionize customer service operations through intelligent 
            call monitoring, real-time agent assistance, and automated email processing. These agents 
            ensure compliance, enhance agent productivity, and deliver exceptional customer experiences 
            at scale.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCenterAgentsList.map((agent) => {
            const IconComponent = agentIcons[agent.id as keyof typeof agentIcons] || Headphones;
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

export default ContactCenterAgents;
