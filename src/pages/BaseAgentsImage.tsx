import { useState } from "react";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { ShoppingBag, ScanSearch, TrendingUp } from "lucide-react";

const BaseAgentsImage = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const agents = [
    {
      id: "product-recommendation",
      name: "Product Recommendation Agent",
      purpose: "Upload an image to receive personalized product recommendations from NEXT.co.uk based on visual similarity and style matching.",
      capabilities: [
        "Visual style matching",
        "Color palette analysis",
        "Category identification",
        "Price range suggestions",
        "Trend alignment"
      ],
      savings: ["Instant matches", "Higher conversion"],
      icon: ShoppingBag,
      sampleInputs: [
        { label: "Product Category", type: "select", options: ["Dresses", "Tops", "Trousers", "Accessories", "Shoes"] },
        { label: "Budget Range", type: "select", options: ["Under £30", "£30-£60", "£60-£100", "Over £100"] },
        { label: "Occasion", type: "select", options: ["Casual", "Work", "Evening", "Sports", "Special Event"] }
      ]
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
          <h1 className="text-3xl font-bold mb-2">Image Agents</h1>
          <p className="text-muted-foreground max-w-2xl">
            Analyze images for product recommendations, extract visual information, 
            and identify fashion trends for buying decisions.
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
    </div>
  );
};

export default BaseAgentsImage;
