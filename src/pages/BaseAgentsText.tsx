import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import EmailAssistDialog from "@/components/EmailAssistDialog";
import InvoiceAgentDialog from "@/components/invoice-agent/InvoiceAgentDialog";
import { Mail, FileSpreadsheet, FileText, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BaseAgentsText = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showEmailAssist, setShowEmailAssist] = useState(false);
  const [showInvoiceAgent, setShowInvoiceAgent] = useState(false);

  const agents = [
    {
      id: "email-assist",
      name: "Email Assist Agent",
      purpose: "Upload multiple emails to identify vulnerabilities, flag potential fraud, or mark urgent communications through intelligent agentic processing.",
      capabilities: [
        "Multi-email batch processing",
        "Fraud pattern detection",
        "Urgency classification",
        "Vulnerability identification",
        "Sentiment analysis"
      ],
      savings: ["80% faster review", "95% accuracy"],
      icon: Mail,
      sampleInputs: [
        { label: "Email Subject", type: "text", placeholder: "RE: Urgent Account Update Required" },
        { label: "Sender Email", type: "email", placeholder: "customer@email.com" },
        { label: "Email Body", type: "textarea", placeholder: "Email content..." },
        { label: "Priority Level", type: "select", options: ["Normal", "High", "Urgent"] }
      ]
    },
    {
      id: "invoice-agent",
      name: "Invoice Agent",
      purpose: "Upload invoices for automated data extraction, validation, and reconciliation with step-by-step processing visibility.",
      capabilities: [
        "OCR data extraction",
        "Field validation",
        "Auto-reconciliation",
        "Duplicate detection",
        "Compliance checking"
      ],
      savings: ["90% time saved", "99% accuracy"],
      icon: FileSpreadsheet,
      sampleInputs: [
        { label: "Invoice Number", type: "text", placeholder: "INV-2024-001234" },
        { label: "Vendor Name", type: "text", placeholder: "Supplier Ltd" },
        { label: "Invoice Amount", type: "text", placeholder: "£1,234.56" },
        { label: "Invoice Date", type: "date" }
      ]
    },
    {
      id: "text-extraction",
      name: "Text Extraction Agent",
      purpose: "Upload any document to extract text, generate summaries, and identify key points automatically.",
      capabilities: [
        "Multi-format support",
        "Smart summarization",
        "Key point extraction",
        "Entity recognition",
        "Language detection"
      ],
      savings: ["70% faster", "Batch processing"],
      icon: FileText,
      sampleInputs: [
        { label: "Document Type", type: "select", options: ["PDF", "Word Document", "Scanned Image", "Other"] },
        { label: "Document Title", type: "text", placeholder: "Q4 Financial Report" },
        { label: "Summary Length", type: "select", options: ["Brief", "Standard", "Detailed"] }
      ]
    },
    {
      id: "knowledge-assist",
      name: "Knowledge Assist Agent",
      purpose: "Upload documents and chat with the agent to get intelligent answers based on your document content.",
      capabilities: [
        "Document Q&A",
        "Context-aware responses",
        "Multi-document search",
        "Citation tracking",
        "Knowledge synthesis"
      ],
      savings: ["Instant answers", "24/7 available"],
      icon: MessageSquare,
      sampleInputs: [
        { label: "Document Name", type: "text", placeholder: "Policy Manual 2024" },
        { label: "Your Question", type: "textarea", placeholder: "What is the return policy for damaged items?" },
        { label: "Response Style", type: "select", options: ["Concise", "Detailed", "Step-by-step"] }
      ]
    }
  ];

  const handleRunAgent = (agentId: string) => {
    if (agentId === "email-assist") {
      setShowEmailAssist(true);
      return;
    }
    if (agentId === "invoice-agent") {
      setShowInvoiceAgent(true);
      return;
    }
    if (agentId === "knowledge-assist") {
      navigate("/knowledge-assist");
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
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
            Text AI
          </div>
          <h1 className="text-3xl font-bold mb-4">Text Agents</h1>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Text AI is revolutionizing retail and ecommerce by automating high-volume document workflows—from processing 
            thousands of customer emails daily to extracting invoice data in seconds. Our intelligent agents reduce manual 
            review time by up to 80%, enabling faster customer response, seamless order reconciliation, and instant access 
            to product knowledge across your entire catalog.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <EmailAssistDialog
        open={showEmailAssist}
        onOpenChange={setShowEmailAssist}
      />

      <InvoiceAgentDialog
        open={showInvoiceAgent}
        onOpenChange={setShowInvoiceAgent}
      />
    </div>
  );
};

export default BaseAgentsText;
