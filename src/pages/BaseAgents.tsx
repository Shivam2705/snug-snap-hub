import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import ProductRecommendationDialog from "@/components/ProductRecommendationDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, FileText, Brain, MessageSquare, 
  ShoppingBag, Image, Shirt,
  Mic, Headphones,
  FileType, ImageIcon, Volume2,
  Filter
} from "lucide-react";

type FilterType = "all" | "text" | "image" | "voice";

const BaseAgents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = (searchParams.get("filter") as FilterType) || "all";
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showProductRecommendation, setShowProductRecommendation] = useState(false);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter === "all") {
      searchParams.delete("filter");
    } else {
      searchParams.set("filter", filter);
    }
    setSearchParams(searchParams);
  };

  // Text Agents
  const textAgents = [
    {
      id: "email-assist",
      name: "Email Assist Agent",
      purpose: "Upload multiple emails, identify vulnerabilities, flag potential fraud or urgent items through intelligent analysis.",
      capabilities: [
        "Multi-email batch processing",
        "Vulnerability detection",
        "Fraud pattern identification",
        "Priority flagging (Urgent/Critical)",
        "Sentiment analysis"
      ],
      savings: ["80% faster triage", "95% accuracy"],
      icon: Mail,
      category: "text" as const
    },
    {
      id: "invoice-agent",
      name: "Invoice Agent",
      purpose: "Upload invoices for automated data extraction, validation, and reconciliation with step-by-step processing visibility.",
      capabilities: [
        "OCR data extraction",
        "Field validation & verification",
        "Automated reconciliation",
        "Discrepancy detection",
        "Audit trail generation"
      ],
      savings: ["90% time saved", "99% accuracy"],
      icon: FileText,
      category: "text" as const
    },
    {
      id: "text-extraction",
      name: "Text Extraction Agent",
      purpose: "Upload any document for intelligent text extraction, summarization, and key point identification.",
      capabilities: [
        "Universal document support",
        "Intelligent summarization",
        "Key point extraction",
        "Entity recognition",
        "Multi-language support"
      ],
      savings: ["70% faster review", "85% accuracy"],
      icon: Brain,
      category: "text" as const
    },
    {
      id: "knowledge-assist",
      name: "Knowledge Assist Agent",
      purpose: "Upload documents and chat with the agent to get answers based on document information.",
      capabilities: [
        "Document Q&A interface",
        "Context-aware responses",
        "Citation linking",
        "Multi-document search",
        "Knowledge synthesis"
      ],
      savings: ["60% faster research", "24/7 availability"],
      icon: MessageSquare,
      category: "text" as const
    }
  ];

  // Image Agents
  const imageAgents = [
    {
      id: "product-recommendation",
      name: "Product Recommendation Agent",
      purpose: "Upload an image to receive personalized product recommendations from NEXT.co.uk website.",
      capabilities: [
        "Visual similarity matching",
        "Style analysis",
        "Cross-category recommendations",
        "Price range filtering",
        "Availability checking"
      ],
      savings: ["3x conversion rate", "40% faster discovery"],
      icon: ShoppingBag,
      category: "image" as const
    },
    {
      id: "image-extraction",
      name: "Image Extraction Agent",
      purpose: "Upload images to identify information, extract text, and analyze visual content.",
      capabilities: [
        "OCR text extraction",
        "Object identification",
        "Color analysis",
        "Metadata extraction",
        "Quality assessment"
      ],
      savings: ["85% faster processing", "98% accuracy"],
      icon: Image,
      category: "image" as const
    },
    {
      id: "buyer-assist",
      name: "Buyer Assist Agent",
      purpose: "Analyze fashion trends from internet, social media, and celebrity styles. Upload dress images to identify patterns and predict sales probability.",
      capabilities: [
        "Trend analysis (Internet, Social Media, Celebrity)",
        "Pattern identification (Midi, Polka dots, etc.)",
        "Sales probability prediction",
        "Top 5 fashion trends report",
        "Seasonal forecasting"
      ],
      savings: ["50% better predictions", "25% higher margins"],
      icon: Shirt,
      category: "image" as const
    }
  ];

  // Voice Agents
  const voiceAgents = [
    {
      id: "i-assist",
      name: "i-Assist",
      purpose: "Upload audio recordings for transcription, post-call analysis, and identification of vulnerability & expression of dissatisfaction.",
      capabilities: [
        "Audio transcription",
        "Post-call analysis",
        "Vulnerability detection",
        "Dissatisfaction identification",
        "Sentiment tracking"
      ],
      savings: ["75% faster analysis", "90% accuracy"],
      icon: Mic,
      category: "voice" as const
    },
    {
      id: "i-audit",
      name: "i-Audit",
      purpose: "Upload customer call recordings for compliance auditing. Analyze call handling time, required questions asked, and information confirmation.",
      capabilities: [
        "Compliance checking",
        "Call duration analysis",
        "Required questions verification",
        "Information confirmation audit",
        "Quality scoring"
      ],
      savings: ["80% audit time saved", "100% coverage"],
      icon: Headphones,
      category: "voice" as const
    }
  ];

  const allAgents = [...textAgents, ...imageAgents, ...voiceAgents];
  
  const filteredAgents = activeFilter === "all" 
    ? allAgents 
    : allAgents.filter(agent => agent.category === activeFilter);

  const filterOptions: { label: string; value: FilterType; icon: React.ElementType; count: number }[] = [
    { label: "All Agents", value: "all", icon: Filter, count: allAgents.length },
    { label: "Text Agents", value: "text", icon: FileType, count: textAgents.length },
    { label: "Image Agents", value: "image", icon: ImageIcon, count: imageAgents.length },
    { label: "Voice Agents", value: "voice", icon: Volume2, count: voiceAgents.length },
  ];

  const handleRunAgent = (agentId: string) => {
    if (agentId === "product-recommendation") {
      setShowProductRecommendation(true);
    } else {
      setSelectedAgent(agentId);
    }
  };

  const getSelectedAgentData = () => {
    if (!selectedAgent) return null;
    const agent = allAgents.find(a => a.id === selectedAgent);
    if (!agent) return null;

    const sampleInputsMap: Record<string, { label: string; type: string; placeholder?: string; options?: string[] }[]> = {
      "email-assist": [
        { label: "Email Files", type: "file", placeholder: "Upload email files (.eml, .msg, .txt)" },
        { label: "Priority Level", type: "select", options: ["All", "High Priority Only", "Urgent Only"] }
      ],
      "invoice-agent": [
        { label: "Invoice File", type: "file", placeholder: "Upload invoice (.pdf, .jpg, .png)" },
        { label: "Vendor Name", type: "text", placeholder: "Enter vendor name (optional)" }
      ],
      "text-extraction": [
        { label: "Document", type: "file", placeholder: "Upload document (.pdf, .docx, .txt)" },
        { label: "Output Format", type: "select", options: ["Summary", "Key Points", "Full Text", "All"] }
      ],
      "knowledge-assist": [
        { label: "Documents", type: "file", placeholder: "Upload documents (.pdf, .docx, .txt)" },
        { label: "Your Question", type: "text", placeholder: "What would you like to know?" }
      ],
      "product-recommendation": [
        { label: "Product Image", type: "file", placeholder: "Upload image (.jpg, .png, .webp)" },
        { label: "Category", type: "select", options: ["All", "Women", "Men", "Kids", "Home"] }
      ],
      "image-extraction": [
        { label: "Image File", type: "file", placeholder: "Upload image (.jpg, .png, .webp, .gif)" },
        { label: "Extraction Type", type: "select", options: ["Text (OCR)", "Objects", "Colors", "All"] }
      ],
      "buyer-assist": [
        { label: "Dress Image", type: "file", placeholder: "Upload dress image (.jpg, .png, .webp)" },
        { label: "Target Season", type: "select", options: ["Spring 2025", "Summer 2025", "Autumn 2025", "Winter 2025"] }
      ],
      "i-assist": [
        { label: "Audio Recording", type: "file", placeholder: "Upload audio file (.mp3, .wav, .m4a)" },
        { label: "Analysis Type", type: "select", options: ["Full Analysis", "Transcription Only", "Sentiment Only"] }
      ],
      "i-audit": [
        { label: "Call Recording", type: "file", placeholder: "Upload call recording (.mp3, .wav, .m4a)" },
        { label: "Call Type", type: "select", options: ["Returns", "Complaints", "Inquiries", "Orders"] }
      ]
    };

    return {
      id: agent.id,
      name: agent.name,
      purpose: agent.purpose,
      sampleInputs: sampleInputsMap[agent.id] || []
    };
  };

  const selectedAgentData = getSelectedAgentData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Base Agents</h1>
          <p className="text-muted-foreground max-w-2xl">
            Core AI agents that provide fundamental capabilities for document processing, 
            image analysis, and voice interactions—building blocks for enterprise automation.
          </p>
        </div>

        {/* Filter Panes */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 bg-card rounded-xl border">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeFilter === option.value;
            return (
              <Button
                key={option.value}
                variant={isActive ? "default" : "outline"}
                className={`flex items-center gap-2 ${isActive ? "" : "bg-background hover:bg-muted"}`}
                onClick={() => handleFilterChange(option.value)}
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-1 ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : ""}`}
                >
                  {option.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Category Labels */}
        {activeFilter === "all" && (
          <div className="space-y-8">
            {/* Text Agents Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileType className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Text Agents</h2>
                <Badge variant="outline">{textAgents.length}</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {textAgents.map((agent) => (
                  <AgentTile
                    key={agent.id}
                    id={agent.id}
                    name={agent.name}
                    purpose={agent.purpose}
                    capabilities={agent.capabilities}
                    savings={agent.savings}
                    icon={agent.icon}
                    onRun={handleRunAgent}
                  />
                ))}
              </div>
            </div>

            {/* Image Agents Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Image Agents</h2>
                <Badge variant="outline">{imageAgents.length}</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imageAgents.map((agent) => (
                  <AgentTile
                    key={agent.id}
                    id={agent.id}
                    name={agent.name}
                    purpose={agent.purpose}
                    capabilities={agent.capabilities}
                    savings={agent.savings}
                    icon={agent.icon}
                    onRun={handleRunAgent}
                  />
                ))}
              </div>
            </div>

            {/* Voice Agents Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Voice Agents</h2>
                <Badge variant="outline">{voiceAgents.length}</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                {voiceAgents.map((agent) => (
                  <AgentTile
                    key={agent.id}
                    id={agent.id}
                    name={agent.name}
                    purpose={agent.purpose}
                    capabilities={agent.capabilities}
                    savings={agent.savings}
                    icon={agent.icon}
                    onRun={handleRunAgent}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtered View */}
        {activeFilter !== "all" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent) => (
              <AgentTile
                key={agent.id}
                id={agent.id}
                name={agent.name}
                purpose={agent.purpose}
                capabilities={agent.capabilities}
                savings={agent.savings}
                icon={agent.icon}
                onRun={handleRunAgent}
              />
            ))}
          </div>
        )}
      </div>

      {/* Run Agent Dialog */}
      <RunAgentDialog
        open={!!selectedAgent}
        onOpenChange={(open) => !open && setSelectedAgent(null)}
        agent={selectedAgentData}
      />

      {/* Product Recommendation Dialog */}
      <ProductRecommendationDialog
        open={showProductRecommendation}
        onOpenChange={setShowProductRecommendation}
      />
    </div>
  );
};

export default BaseAgents;
