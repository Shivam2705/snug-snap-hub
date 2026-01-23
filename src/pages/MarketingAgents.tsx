import Header from "@/components/Header";
import { marketingAgents } from "@/data/agentWorkflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const agentIcons: Record<string, any> = {
  "customer-360": Target,
  "apparel-recommendation": Shirt,
  "spend-affordability": DollarSign,
  "omnichannel-orchestration": Globe,
  "next-best-product": TrendingUp,
  "campaign-personalization": Palette,
  "loyalty-lifecycle": Heart
};

const MarketingAgents = () => {
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
                7 Intelligent Agents
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Hyper Personalized Marketing</h1>
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
        <div className="grid gap-6">
          {marketingAgents.map((agent, index) => {
            const Icon = agentIcons[agent.id] || Target;
            
            return (
              <Card key={agent.id} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl gradient-exl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Agent {index + 1}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{agent.name}</CardTitle>
                      <CardDescription className="text-base">{agent.purpose}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="capabilities" className="border-none">
                      <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        Key Capabilities
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {agent.capabilities.map((capability, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="value" className="border-none">
                      <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        Business Value
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {agent.businessValue.map((value, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              {value}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="savings" className="border-none">
                      <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        Indicative Value & Savings
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {agent.savings.map((saving, i) => (
                            <Badge key={i} variant="secondary" className="text-sm font-medium bg-success/10 text-success border-success/20">
                              {saving}
                            </Badge>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MarketingAgents;