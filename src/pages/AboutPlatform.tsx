import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Brain,
  Layers,
  Workflow,
  Shield,
  Zap,
  Repeat,
  GitBranch,
  Database,
  Cpu,
  LineChart,
  Users,
  Sparkles,
  Lock,
  Gauge,
  Boxes,
  PlugZap,
} from "lucide-react";

const offerings = [
  {
    icon: Layers,
    title: "Foundation Layer",
    description:
      "Reusable Text, Vision, and Voice AI capabilities that any agent can consume — consistent, governed, and upgrade-friendly.",
  },
  {
    icon: Boxes,
    title: "Custom Agent Library",
    description:
      "Pre-built agents for Contact Center, E-Commerce, and Finance & Accounting that can be deployed or composed as workflows.",
  },
  {
    icon: Workflow,
    title: "Agentic Workflows",
    description:
      "Multi-agent orchestration to automate end-to-end business processes — from investigation to decisioning to action.",
  },
  {
    icon: PlugZap,
    title: "Enterprise Integrations",
    description:
      "Connect to your data sources, business rules, and downstream systems without rewriting your stack.",
  },
  {
    icon: Shield,
    title: "Responsible AI & Governance",
    description:
      "GDPR Compliant by design with policy controls, audit trails, and human-in-the-loop oversight.",
  },
  {
    icon: LineChart,
    title: "Analytics & Insights",
    description:
      "Operational dashboards on agent performance, accuracy, and business impact to continuously optimize outcomes.",
  },
];

const productivityWins = [
  {
    icon: Gauge,
    title: "Faster Cycle Times",
    description:
      "Automate repetitive triage, review, and decisioning to reduce process turnaround from days to minutes.",
  },
  {
    icon: Repeat,
    title: "Reuse, Don't Rebuild",
    description:
      "Shared foundation models and agent components eliminate duplicated effort across teams and use cases.",
  },
  {
    icon: Users,
    title: "Augment Your Workforce",
    description:
      "Free skilled employees from low-value work and let them focus on judgment, exceptions, and customer experience.",
  },
  {
    icon: Sparkles,
    title: "Higher Accuracy & Consistency",
    description:
      "Multi-engine validation, confidence scoring, and adaptive retries reduce errors and rework.",
  },
];

const keyFeatures = [
  {
    icon: Brain,
    title: "Multi-Modal AI",
    description: "Text, Vision, and Voice agents working seamlessly across channels.",
  },
  {
    icon: GitBranch,
    title: "Multi-Agent Orchestration",
    description: "Coordinate specialized agents to solve complex, multi-step business problems.",
  },
  {
    icon: Database,
    title: "Enterprise Data Ready",
    description: "Native hooks for structured and unstructured enterprise data sources.",
  },
  {
    icon: Cpu,
    title: "Model-Agnostic",
    description: "Plug in best-of-breed LLMs and swap them as the technology evolves.",
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description: "Role-based access, encrypted data flows, and full compliance auditability.",
  },
  {
    icon: Zap,
    title: "Low-Latency Execution",
    description: "Real-time agent responses tuned for production-grade workloads.",
  },
];

const AboutPlatform = () => {
  const navigate = useNavigate();

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
          Home
        </Button>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-8 md:p-12 mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12)_0%,transparent_60%)]" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Enterprise-Grade Agentic AI Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              The{" "}
              <span className="text-gradient-primary">Autonomous Intelligence</span>
              {" "}Fabric for{" "}
              <span className="text-gradient-primary">Modern Enterprises</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Design, deploy, and govern multi-modal AI agents across Text, Vision, and Voice — orchestrating
              end-to-end workflows, accelerating decisions, and unlocking compounding productivity at every
              layer of your operations.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-10">
          <div className="max-w-3xl mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What the Platform Offers</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Everything you need to move from isolated AI experiments to production-grade agentic
              automation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((item, i) => (
              <Card key={i} className="card-glow bg-card/30 border-border/50 hover:-translate-y-1 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4 glow-primary">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Productivity */}
        <section className="mb-10 rounded-2xl border border-border/50 bg-card/20 p-8 md:p-10">
          <div className="max-w-3xl mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Optimize Today's Processes, Unlock Tomorrow's Productivity
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The platform is designed to slot into existing operations and deliver measurable
              improvements without rebuilding your stack.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {productivityWins.map((item, i) => (
              <Card key={i} className="bg-background/40 border-border/50">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-10">
          <div className="max-w-3xl mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Key Platform Features</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Built for the realities of enterprise AI — flexible, secure, and ready for change.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((item, i) => (
              <Card key={i} className="card-glow bg-card/30 border-border/50 hover:-translate-y-1 transition-all">
                <CardContent className="pt-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-card/20 p-8 md:p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore the Agent Library</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover ready-to-use agents across Contact Center, E-Commerce, and Finance —
            or build your own on top of the foundation layer.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/")} size="lg">Home</Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/base-agents")}>
              Foundation Agents
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPlatform;
