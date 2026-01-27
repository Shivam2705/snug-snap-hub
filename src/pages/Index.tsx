import Header from "@/components/Header";
import ProcessTile from "@/components/ProcessTile";
import { Brain, Shield, Sparkles, TrendingUp, Users, Zap, FileText, Image, Mic, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  // Base Agents - Text
  const textAgents = [
    { name: "Email Assist Agent" },
    { name: "Invoice Agent" },
    { name: "Text Extraction Agent" },
    { name: "Knowledge Assist Agent" }
  ];

  // Base Agents - Image
  const imageAgents = [
    { name: "Product Recommendation Agent" },
    { name: "Image Extraction Agent" },
    { name: "Buyer Assist Agent" }
  ];

  // Base Agents - Voice
  const voiceAgents = [
    { name: "i-Assist" },
    { name: "i-Audit" }
  ];

  // NEXT Specific Processes
  const creditAgents = [
    { name: "Customer Verification" },
    { name: "Fraud Detection" },
    { name: "Address Verification" },
    { name: "Email Agent" },
    { name: "Messaging Agent" }
  ];

  const marketingAgents = [
    { name: "Customer 360° Intelligence" },
    { name: "Hyper-Personalized Apparel" },
    { name: "Spend Affordability" },
    { name: "Omnichannel Orchestration" },
    { name: "Predictive Next-Best-Product" },
    { name: "Campaign Personalization" },
    { name: "Loyalty & Lifecycle" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 gradient-exl opacity-5" />
        <div className="container py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              EXL Agentic AI Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gradient-exl">EXL Agentic Capabilities</span>
              <br />
              <span className="text-foreground">for NEXT</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Empowering NEXT with intelligent AI agents that automate complex workflows, 
              enhance decision-making, and deliver measurable business outcomes across 
              customer service, fraud detection, and personalized marketing operations.
            </p>
          </div>
          
          {/* Floating elements */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 gradient-exl opacity-20 blur-3xl rounded-full" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="h-20 w-20 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <div className="h-20 w-20 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <Shield className="h-10 w-10 text-accent" />
                </div>
                <div className="h-20 w-20 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <FileText className="h-10 w-10 text-warning" />
                </div>
                <div className="h-20 w-20 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <Zap className="h-10 w-10 text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section className="container py-12 md:py-16">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Platform Overview</h2>
          <p className="text-muted-foreground max-w-3xl">
            A comprehensive suite of AI-powered agents designed to transform NEXT's operations, 
            delivering automation, intelligence, and efficiency across every business function.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Intelligent Automation</CardTitle>
              <CardDescription>
                Autonomous agents that learn, adapt, and execute complex workflows without human intervention.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Human-AI Collaboration</CardTitle>
              <CardDescription>
                Seamless integration between AI agents and human experts for optimal decision-making.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-lg">Real-time Processing</CardTitle>
              <CardDescription>
                Process thousands of cases simultaneously with sub-second response times.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Base Agents Section */}
      <section className="bg-muted/30 border-y">
        <div className="container py-12 md:py-16">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
              Foundation Layer
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Base Agents</h2>
            <p className="text-muted-foreground max-w-3xl">
              Core AI agents that provide fundamental capabilities for document processing, 
              image analysis, and voice interactions—building blocks for enterprise automation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <ProcessTile
              title="Text Agents"
              description="Process emails, invoices, and documents with intelligent extraction, validation, and knowledge assistance capabilities."
              agents={textAgents}
              icon={FileText}
              href="/base-agents/text"
            />
            
            <ProcessTile
              title="Image Agents"
              description="Analyze images for product recommendations, extract visual information, and identify fashion trends for buying decisions."
              agents={imageAgents}
              icon={Image}
              href="/base-agents/image"
            />

            <ProcessTile
              title="Voice Agents"
              description="Transcribe and analyze voice interactions, perform post-call analysis, and identify customer sentiment and compliance issues."
              agents={voiceAgents}
              icon={Mic}
              href="/base-agents/voice"
            />
          </div>
        </div>
      </section>

      {/* NEXT Agents Section */}
      <section className="container py-12 md:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-3">
            NEXT Specific
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">NEXT Agents</h2>
          <p className="text-muted-foreground max-w-3xl">
            Purpose-built AI agent workflows tailored for NEXT's specific business processes, 
            delivering end-to-end automation for credit investigation and personalized marketing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <ProcessTile
            title="CAWAO (Credit Account Investigation)"
            description="Investigate credit accounts without orders through multi-agent verification workflows. Detect potential fraud with AI-powered analysis of CIFAS markers, authentication codes, and customer data validation."
            agents={creditAgents}
            icon={Shield}
            href="/cawao/agents"
            processHref="/cawao"
          />
          
          <ProcessTile
            title="Hyper Personalized Marketing"
            description="Analyze customer demographics and past buying trends from NEXT.co.uk to deliver highly personalized product recommendations, driving customer engagement and conversion rates."
            agents={marketingAgents}
            icon={ShoppingBag}
            href="/marketing/agents"
            processHref="/marketing"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold">EXL Agentic AI for NEXT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 EXL Service. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
