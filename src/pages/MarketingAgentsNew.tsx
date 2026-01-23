import { useState } from "react";
import Header from "@/components/Header";
import AgentTile from "@/components/AgentTile";
import RunAgentDialog from "@/components/RunAgentDialog";
import { marketingAgents } from "@/data/agentWorkflow";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Home,
  Target,
  Shirt,
  DollarSign,
  Globe,
  TrendingUp,
  Palette,
  Heart,
  Sparkles
} from "lucide-react";

const agentIcons: Record<string, any> = {
  "customer-360": Target,
  "apparel-recommendation": Shirt,
  "spend-affordability": DollarSign,
  "omnichannel-orchestration": Globe,
  "next-best-product": TrendingUp,
  "campaign-personalization": Palette,
  "loyalty-lifecycle": Heart
};

// Add sample inputs to marketing agents for the dialog
const marketingAgentsWithInputs = marketingAgents.map(agent => ({
  ...agent,
  sampleInputs: getAgentInputs(agent.id)
}));

function getAgentInputs(agentId: string) {
  const inputsMap: Record<string, any[]> = {
    "customer-360": [
      { label: "Customer ID", type: "text", placeholder: "CUST-12345" },
      { label: "Email Address", type: "email", placeholder: "customer@email.com" },
      { label: "Time Period", type: "select", options: ["Last 30 days", "Last 90 days", "Last 12 months"] }
    ],
    "apparel-recommendation": [
      { label: "Customer ID", type: "text", placeholder: "CUST-12345" },
      { label: "Preferred Style", type: "select", options: ["Casual", "Formal", "Sporty", "Business Casual"] },
      { label: "Size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL"] },
      { label: "Occasion", type: "select", options: ["Everyday", "Work", "Special Event", "Vacation"] }
    ],
    "spend-affordability": [
      { label: "Customer ID", type: "text", placeholder: "CUST-12345" },
      { label: "Monthly Budget Range", type: "select", options: ["£0-50", "£50-100", "£100-200", "£200+"] },
      { label: "Discount Preference", type: "select", options: ["Full Price Only", "Moderate Discounts", "Heavy Discounts"] }
    ],
    "omnichannel-orchestration": [
      { label: "Customer ID", type: "text", placeholder: "CUST-12345" },
      { label: "Preferred Channel", type: "select", options: ["Web", "Mobile App", "Email", "In-Store", "Push Notifications"] },
      { label: "Last Interaction", type: "date", placeholder: "2024-01-15" }
    ],
    "next-best-product": [
      { label: "Customer ID", type: "text", placeholder: "CUST-12345" },
      { label: "Product Category", type: "select", options: ["Tops", "Bottoms", "Outerwear", "Accessories", "Footwear"] },
      { label: "Season", type: "select", options: ["Spring", "Summer", "Autumn", "Winter"] }
    ],
    "campaign-personalization": [
      { label: "Campaign ID", type: "text", placeholder: "CAMP-2024-001" },
      { label: "Customer Segment", type: "select", options: ["New Customers", "Active Buyers", "At-Risk", "Dormant"] },
      { label: "Creative Type", type: "select", options: ["Email", "Banner", "Push", "Social"] }
    ],
    "loyalty-lifecycle": [
      { label: "Customer ID", type: "text", placeholder: "CUST-12345" },
      { label: "Loyalty Tier", type: "select", options: ["Bronze", "Silver", "Gold", "Platinum"] },
      { label: "Lifecycle Stage", type: "select", options: ["New", "Active", "At-Risk", "Dormant", "Win-Back"] }
    ]
  };
  
  return inputsMap[agentId] || [];
}

const MarketingAgentsNew = () => {
  const [selectedAgent, setSelectedAgent] = useState<typeof marketingAgentsWithInputs[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRunAgent = (agentId: string) => {
    const agent = marketingAgentsWithInputs.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Hyper Personalized Marketing</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                <Sparkles className="h-4 w-4" />
                {marketingAgents.length} Intelligent Agents
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Hyper Personalized Marketing Agents</h1>
              <p className="text-muted-foreground max-w-2xl">
                Transform customer engagement with AI-driven personalization. Our suite of specialized 
                agents work together to deliver highly tailored experiences across every touchpoint.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingAgentsWithInputs.map((agent, index) => {
            const Icon = agentIcons[agent.id] || Target;
            
            return (
              <div 
                key={agent.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AgentTile
                  id={agent.id}
                  name={agent.name}
                  purpose={agent.purpose}
                  capabilities={agent.capabilities}
                  savings={agent.savings}
                  icon={Icon}
                  onRun={handleRunAgent}
                />
              </div>
            );
          })}
        </div>
      </main>

      <RunAgentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agent={selectedAgent}
      />
    </div>
  );
};

export default MarketingAgentsNew;
