import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import ProductRecommendationDialog from "@/components/ProductRecommendationDialog";
import ImageExtractionDialog from "@/components/ImageExtractionDialog";
import { ShoppingBag, ScanSearch, TrendingUp, ArrowLeft, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const BaseAgentsImage = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showNextLens, setShowNextLens] = useState(false);
  const [showImageExtraction, setShowImageExtraction] = useState(false);

  const agents = [
    // {
    //   id: "next-lens",
    //   name: "NEXT Lens",
    //   purpose: "Upload an image to find similar products from product inventory. Extract product attributes and match with inventory for personalized style recommendations.",
    //   capabilities: [
    //     "Attribute extraction",
    //     "Inventory lookup",
    //     "Visual similarity matching",
    //     "Style recommendations",
    //     "Match scoring"
    //   ],
    //   savings: [],
    //   icon: ShoppingBag,
    //   sampleInputs: []
    // },
    {
      id: "image-extraction",
      name: "Image Extraction Agent",
      purpose: "Upload images to identify and extract text, objects, patterns, and detailed visual information.",
      capabilities: [
        "Object detection",
        "Pattern identification",
        "Color detection",
        "Brand identification"
      ],
      savings: [],
      icon: ScanSearch,
      sampleInputs: [
        { label: "Image Type", type: "select", options: ["Product Photo", "Document", "Label", "Receipt", "Other"] },
        { label: "Extraction Focus", type: "select", options: ["Text Only", "Objects Only", "Full Analysis"] },
        { label: "Output Format", type: "select", options: ["JSON", "Plain Text", "Structured Report"] }
      ]
    },
    {
      id: "data-curation-agent",
      name: "Data Curation Agent",
      purpose: "Automatically curate, clean, and organize image datasets for training and analysis purposes.",
      capabilities: [
        "Image quality assessment",
        "Duplicate detection",
        "Auto-tagging & labeling",
        "Dataset organization",
        "Metadata enrichment"
      ],
      savings: ["70% curation time saved", "Higher data quality"],
      icon: Layers,
      sampleInputs: []
    },
    {
      id: "image-generation-agent",
      name: "Image Generation Agent",
      purpose: "Generate high-quality images from text descriptions using advanced AI models.",
      capabilities: [
        "Text-to-image generation",
        "Style transfer",
        "Image editing & inpainting",
        "Batch generation",
        "Custom model fine-tuning"
      ],
      savings: ["90% faster asset creation", "Unlimited variations"],
      icon: Sparkles,
      sampleInputs: []
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
          {/* <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
            Visual AI
          </div> */}
          <h1 className="text-3xl font-bold mb-4">Image Agents</h1>
          {/* <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Visual AI is transforming retail and ecommerce through intelligent image understanding. From enabling 
            customers to search products by simply uploading a photo, to helping buyers identify emerging fashion 
            trends from social media—our agents drive higher conversion rates, smarter merchandising decisions, 
            and personalized shopping experiences that keep customers coming back.
          </p> */}
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
