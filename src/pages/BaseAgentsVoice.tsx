import { useState } from "react";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { Headphones, ClipboardCheck } from "lucide-react";

const BaseAgentsVoice = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const agents = [
    {
      id: "i-assist",
      name: "i-Assist",
      purpose: "Upload audio recordings for transcription and post-call analysis. Identify customer vulnerability and expressions of dissatisfaction automatically.",
      capabilities: [
        "Audio transcription",
        "Sentiment analysis",
        "Vulnerability detection",
        "Dissatisfaction flagging",
        "Key moment identification"
      ],
      savings: ["100% call coverage", "Instant insights"],
      icon: Headphones,
      sampleInputs: [
        { label: "Call Type", type: "select", options: ["Customer Service", "Sales", "Returns", "Complaints", "General Inquiry"] },
        { label: "Call Duration", type: "text", placeholder: "15:30" },
        { label: "Agent ID", type: "text", placeholder: "AGT-001" },
        { label: "Priority", type: "select", options: ["Standard", "High", "Urgent"] }
      ]
    },
    {
      id: "i-audit",
      name: "i-Audit",
      purpose: "Upload customer call recordings for compliance auditing. Analyze if calls were handled within guidelines, required questions were asked, and relevant information was confirmed.",
      capabilities: [
        "Compliance checking",
        "Script adherence analysis",
        "Required questions verification",
        "Handle time assessment",
        "Quality scoring"
      ],
      savings: ["Automated QA", "100% audit coverage"],
      icon: ClipboardCheck,
      sampleInputs: [
        { label: "Call Category", type: "select", options: ["Returns", "Refunds", "Exchanges", "Complaints", "General"] },
        { label: "Product Type", type: "text", placeholder: "Jacket" },
        { label: "Call Reference", type: "text", placeholder: "CALL-2024-12345" },
        { label: "Audit Type", type: "select", options: ["Full Audit", "Compliance Only", "Quality Only"] }
      ]
    }
  ];

  const handleRunAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
            Base Agents
          </div>
          <h1 className="text-3xl font-bold mb-2">Voice Agents</h1>
          <p className="text-muted-foreground max-w-2xl">
            Transcribe and analyze voice interactions, perform post-call analysis, 
            and identify customer sentiment and compliance issues.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {agents.map((agent) => (
            <AgentTile
              key={agent.id}
              {...agent}
              onRun={handleRunAgent}
            />
          ))}
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

export default BaseAgentsVoice;
