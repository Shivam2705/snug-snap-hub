import Header from "@/components/Header";
import SolutionTile from "@/components/SolutionTile";
import PartnerSlider from "@/components/PartnerSlider";
import { Brain, Shield, Sparkles, FileText, Image, Mic, ShoppingBag, Headphones, DollarSign, Cpu, Zap, Database } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  // Contact Center Agents
  const contactCenterAgents = [{
    name: "i-Audit"
  }, {
    name: "i-Assist"
  }, {
    name: "Email Assist Agent"
  }, {
    name: "Knowledge Assist Agent"
  }];

  // E-Commerce Agents
  const ecommerceAgents = [{
    name: "Hyper Personalized Marketing"
  }, {
    name: "NEXT Lens"
  }, {
    name: "Buyer Assist Agent"
  }];

  // Finance & Auditing Agents
  const financeAgents = [{
    name: "CAWAO-Schedule"
  }, {
    name: "Invoice Agent"
  }];

  // Multi-modal capabilities
  const capabilities = [{
    icon: FileText,
    title: "Text AI",
    description: "EXL's Text AI leverages advanced NLP to automate document processing, email triage, invoice extraction, and knowledge synthesis with enterprise-grade accuracy.",
    href: "/base-agents/text"
  }, {
    icon: Image,
    title: "Visual AI",
    description: "EXL's Visual AI powers intelligent image recognition, product attribute extraction, visual search, and fashion trend analysis for seamless retail experiences.",
    href: "/base-agents/image"
  }, {
    icon: Mic,
    title: "Voice AI",
    description: "EXL's Voice AI delivers real-time transcription, sentiment analysis, compliance monitoring, and conversational intelligence for enhanced customer interactions.",
    href: "/base-agents/voice"
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)]" />
        
        <div className="container py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-pulse-subtle">
              <Sparkles className="h-4 w-4" />
              Autonomous Intelligence Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="text-foreground font-display">NEXT</span>{" "}
              <span className="text-gradient-primary">Agentic AI</span>
              <br />
              <span className="text-gradient-primary">Platform</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Luxury retail meets autonomous intelligence. Empowering NEXT with AI agents 
              that automate complex workflows, enhance decision-making, and deliver 
              measurable business outcomes with precision and elegance.
            </p>
          </div>
          
          {/* Floating AI elements */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 w-16 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center animate-float glow-primary-hover" style={{
                animationDelay: '0s'
              }}>
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div className="h-16 w-16 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center animate-float glow-primary-hover" style={{
                animationDelay: '1s'
              }}>
                  <Cpu className="h-8 w-8 text-primary/80" />
                </div>
                <div className="h-16 w-16 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center animate-float glow-primary-hover" style={{
                animationDelay: '2s'
              }}>
                  <Database className="h-8 w-8 text-primary/60" />
                </div>
                <div className="h-16 w-16 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center animate-float glow-primary-hover" style={{
                animationDelay: '3s'
              }}>
                  <Zap className="h-8 w-8 text-primary/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Slider */}
      <PartnerSlider />

      {/* Multi-Modal Agentic Capabilities */}
      <section className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            Foundation Layer
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Multi-Modal Agentic Capabilities
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our autonomous agents perceive the world through text, vision, and voice—processing 
            information across modalities to deliver comprehensive, context-aware intelligence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {capabilities.map((cap, index) => (
            <Card 
              key={index} 
              className="card-glow bg-card/30 border-border/50 text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              onClick={() => navigate(cap.href)}
            >
              <CardHeader className="pb-4">
                <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
                  <cap.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{cap.title}</CardTitle>
                <CardDescription className="text-muted-foreground/80 leading-relaxed">
                  {cap.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Solutions */}
      <section className="border-y border-border/50 bg-card/20">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-4">
              Enterprise Solutions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Agentic Suite for NEXT</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">Purpose-built agentic solutions designed for NEXT's unique business challenges. 
Agentic Processes, Powered by the 3R Ideology - Repurposed Intelligence, Reusable Processes, Responsible Automation.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <SolutionTile title="Contact Center" description="AI-powered agents for call transcription, compliance auditing, email processing, and intelligent knowledge assistance—transforming every customer interaction." agents={contactCenterAgents} icon={Headphones} href="/contact-center" />
            
            <SolutionTile title="E-Commerce" description="Hyper-personalized marketing, visual product search, and trend analysis agents that drive engagement, conversions, and smarter merchandising decisions." agents={ecommerceAgents} icon={ShoppingBag} href="/ecommerce" />
            
            <SolutionTile title="Finance & Auditing" description="Automated credit investigation, fraud detection, and invoice processing agents ensuring compliance, accuracy, and financial control." agents={financeAgents} icon={DollarSign} href="/finance" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-foreground">NEXT Agentic AI</span>
                <span className="text-muted-foreground text-sm ml-2">Platform</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 EXL Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;