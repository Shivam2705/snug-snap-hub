import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { Headphones, ClipboardCheck, ArrowLeft, AudioLines, Speech } from "lucide-react";
import { Button } from "@/components/ui/button";

const BaseAgentsVoice = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const agents = [
    {
      id: "speech-to-text-agent",
      name: "Speech to Text Agent",
      purpose: "Convert audio recordings and live speech into accurate text transcriptions with speaker diarization.",
      capabilities: [
        "Real-time transcription",
        "Speaker identification",
        "Multi-language support",
        "Punctuation & formatting",
        "Custom vocabulary"
      ],
      savings: ["95% transcription accuracy", "Real-time processing"],
      icon: AudioLines,
      sampleInputs: []
    },
    {
      id: "text-to-speech-agent",
      name: "Text to Speech Agent",
      purpose: "Convert text content into natural-sounding speech with customizable voices and emotions.",
      capabilities: [
        "Natural voice synthesis",
        "Multiple voice options",
        "Emotion & tone control",
        "Multi-language support",
        "SSML support"
      ],
      savings: ["Instant audio generation", "Consistent quality"],
      icon: Speech,
      sampleInputs: []
    }
  ];

  const handleRunAgent = (agentId: string) => {
    if (agentId === "i-audit") {
      window.location.href = "https://next-iaudit-ui-1037311574972.us-central1.run.app";
      return;
    }
    
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
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          {/* <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
            Voice AI
          </div> */}
          <h1 className="text-3xl font-bold mb-4">Voice Agents</h1>
          {/* <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Voice AI is redefining customer experience in retail by turning every call into actionable intelligence. 
            Our agents transcribe and analyze 100% of customer interactions in real-time, automatically detecting 
            vulnerable customers, ensuring compliance, and surfacing insights that help agents deliver exceptional 
            service while protecting your brand reputation.
          </p> */}
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
