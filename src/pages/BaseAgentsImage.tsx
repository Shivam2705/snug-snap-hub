import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import ProductRecommendationDialog from "@/components/ProductRecommendationDialog";
import ImageExtractionDialog from "@/components/ImageExtractionDialog";
import { ShoppingBag, ScanSearch, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BaseAgentsImage = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showNextLens, setShowNextLens] = useState(false);
  const [showImageExtraction, setShowImageExtraction] = useState(false);

  const agents = [
    {
      id: "next-lens",
      name: "NEXT Lens",
      purpose: "Upload an image to find similar products from product inventory. Extract product attributes and match with inventory for personalized style recommendations.",
      capabilities: [
        "Attribute extraction",
        "Inventory lookup",
        "Visual similarity matching",
        "Style recommendations",
        "Match scoring"
      ],
      savings: ["Instant matches", "Higher conversion"],
      icon: ShoppingBag,
      sampleInputs: []
    },
    {
      id: "image-extraction",
      name: "Image Extraction Agent",
      purpose: "Upload images to identify and extract text, objects, patterns, and detailed visual information.",
      capabilities: [
        "OCR text extraction",
        "Object detection",
        "Pattern recognition",
        "Color analysis",
        "Brand identification"
      ],
      savings: ["95% accuracy", "Multi-language OCR"],
      icon: ScanSearch,
      sampleInputs: [
        { label: "Image Type", type: "select", options: ["Product Photo", "Document", "Label", "Receipt", "Other"] },
        { label: "Extraction Focus", type: "select", options: ["Text Only", "Objects Only", "Full Analysis"] },
        { label: "Output Format", type: "select", options: ["JSON", "Plain Text", "Structured Report"] }
      ]
    },
    {
      id: "buyer-assist",
      name: "Buyer Assist Agent",
      purpose: "Analyze fashion trends from internet, social media, and celebrity styles. Upload dress images to identify patterns and predict sales probability for upcoming seasons.",
      capabilities: [
        "Trend forecasting",
        "Pattern identification (Midi, Polka dots, etc.)",
        "Celebrity style tracking",
        "Social media analysis",
        "Sales probability prediction"
      ],
      savings: ["Data-driven buying", "Trend insights"],
      icon: TrendingUp,
      sampleInputs: [
        { label: "Season", type: "select", options: ["Spring/Summer 2025", "Autumn/Winter 2025", "Spring/Summer 2026"] },
        { label: "Product Type", type: "select", options: ["Dress", "Top", "Jacket", "Skirt", "Trousers"] },
        { label: "Target Market", type: "select", options: ["Women 18-25", "Women 25-35", "Women 35-50", "All Ages"] },
        { label: "Price Point", type: "select", options: ["Budget", "Mid-range", "Premium"] }
      ]
    }
  ];

  const handleRunAgent = (agentId: string) => {
    if (agentId === "next-lens") {
      setShowNextLens(true);
      return;
    }
    if (agentId === "image-extraction") {
      setShowImageExtraction(true);
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
            Visual AI
          </div>
          <h1 className="text-3xl font-bold mb-4">Image Agents</h1>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Visual AI is transforming retail and ecommerce through intelligent image understanding. From enabling 
            customers to search products by simply uploading a photo, to helping buyers identify emerging fashion 
            trends from social media—our agents drive higher conversion rates, smarter merchandising decisions, 
            and personalized shopping experiences that keep customers coming back.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <ProductRecommendationDialog
        open={showNextLens}
        onOpenChange={setShowNextLens}
      />

      <ImageExtractionDialog
        open={showImageExtraction}
        onOpenChange={setShowImageExtraction}
      />
    </div>
  );
};

export default BaseAgentsImage;
