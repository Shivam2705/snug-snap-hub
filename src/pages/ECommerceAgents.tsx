import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import ProductRecommendationDialog from "@/components/ProductRecommendationDialog";
import ImageExtractionDialog from "@/components/ImageExtractionDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Sparkles, Camera, ShoppingCart } from "lucide-react";

const ecommerceAgentsList = [
  {
    id: "hyper-personalized-marketing",
    name: "Hyper Personalized Marketing",
    purpose: "Deliver highly targeted marketing campaigns based on customer behavior and preferences.",
    capabilities: [
      "Customer segmentation",
      "Personalized recommendations",
      "Campaign optimization",
      "Behavioral analytics"
    ],
    savings: ["45% increase in campaign conversion rates"]
  },
  {
    id: "next-lens",
    name: "NEXT Lens",
    purpose: "Visual AI-powered product discovery enabling customers to search with images.",
    capabilities: [
      "Image-based search",
      "Visual similarity matching",
      "Style recommendations",
      "Trend identification"
    ],
    savings: ["30% increase in product discovery"]
  },
  {
    id: "buyer-assist",
    name: "Buyer Assist Agent",
    purpose: "Intelligent shopping assistant providing personalized product guidance.",
    capabilities: [
      "Size recommendations",
      "Style matching",
      "Inventory awareness",
      "Cross-sell suggestions"
    ],
    savings: ["20% reduction in returns"]
  }
];

const agentIcons = {
  "hyper-personalized-marketing": Sparkles,
  "next-lens": Camera,
  "buyer-assist": ShoppingCart,
};

const ECommerceAgents = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<typeof ecommerceAgentsList[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleRunAgent = (agentId: string) => {
    if (agentId === "hyper-personalized-marketing") {
      window.location.href = "https://lovable.dev/projects/6d51d6f1-0dd3-44dc-83d1-170dae47f8ec";
      return;
    }
    if (agentId === "next-lens") {
      setProductDialogOpen(true);
      return;
    }
    if (agentId === "buyer-assist") {
      setImageDialogOpen(true);
      return;
    }
    
    const agent = ecommerceAgentsList.find(a => a.id === agentId);
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
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">E-Commerce</h1>
              <p className="text-muted-foreground">AI Agents driving digital commerce excellence</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            EXL's E-Commerce AI agents transform the online shopping experience through hyper-personalized 
            marketing, visual product discovery, and intelligent buyer assistance. These agents analyze 
            customer behavior, predict preferences, and deliver tailored experiences that drive 
            conversions and customer loyalty.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecommerceAgentsList.map((agent) => {
            const IconComponent = agentIcons[agent.id as keyof typeof agentIcons] || ShoppingBag;
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

      <ProductRecommendationDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
      />

      <ImageExtractionDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
      />
    </div>
  );
};

export default ECommerceAgents;
