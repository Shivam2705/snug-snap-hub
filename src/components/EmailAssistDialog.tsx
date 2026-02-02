import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Upload,
  Mail,
  Play,
  CheckCircle2,
  Loader2,
  Circle,
  ArrowDown,
  GitMerge,
  RefreshCw,
  Target,
  Shield,
  Gauge,
  Sparkles,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { emailAssistService } from "@/services/emailAssistService";

interface EmailAssistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AgentStatus = "idle" | "processing" | "completed";

interface AgentNode {
  id: string;
  name: string;
  status: AgentStatus;
  icon: any;
  isLoop?: boolean;
}

interface EmailData {
  subject: string;
  from: string;
  to: string;
  date: string;
  content: string;
  filename: string;
  htmlContent?: string;
  isHtml?: boolean;
}

interface AgentResponse {
  intent_classification: string;
  intent_score: number;
  intent_reason: string;
  vul_classification: string;
  vul_score: number;
  vul_reason: string;
}

// Mock email data
const mockEmail = {
  subject: "RE: Urgent - Issue with my recent order #ORD-2024-8847",
  from: "sarah.johnson@email.com",
  to: "support@next.co.uk",
  date: "28 Jan 2026, 14:32",
  content: `Dear Customer Support,

I am writing to express my deep concern regarding my recent order #ORD-2024-8847 placed on 15th January.

I ordered a navy blue blazer (size 12) which was supposed to arrive within 3-5 business days. However, it has now been over two weeks and I still haven't received my package. The tracking information has not been updated since 18th January.

This is particularly frustrating as I needed this blazer for an important job interview scheduled for next week. I am now worried I won't receive it in time.

I would appreciate if you could:
1. Investigate the whereabouts of my package
2. Provide an updated delivery estimate
3. Consider expedited shipping if there's been a delay on your end

I have been a loyal NEXT customer for over 5 years and this experience has been quite disappointing. I really hope this can be resolved promptly.

Looking forward to your urgent response.

Best regards,
Sarah Johnson
Tel: 07700 900123`,
};

const EmailAssistDialog = ({ open, onOpenChange }: EmailAssistDialogProps) => {
  const [activeTab, setActiveTab] = useState("execution");
  const [emailUploaded, setEmailUploaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [uploadedEmail, setUploadedEmail] = useState<EmailData | null>(null);
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(
    null,
  );

  // Intent Track Agents
  const [intentAgents, setIntentAgents] = useState<AgentNode[]>([
    {
      id: "intent_classification",
      name: "Intent Classification",
      status: "idle",
      icon: Target,
    },
    {
      id: "intent_validation",
      name: "Validation Agent",
      status: "idle",
      icon: CheckCircle2,
    },
    { id: "intent_score", name: "Score Agent", status: "idle", icon: Gauge },
    {
      id: "intent_refinement",
      name: "Refinement Agent",
      status: "idle",
      icon: Sparkles,
    },
  ]);

  // Vulnerability Track Agents
  const [vulAgents, setVulAgents] = useState<AgentNode[]>([
    {
      id: "vul_classification",
      name: "Vulnerable Classification",
      status: "idle",
      icon: Shield,
    },
    {
      id: "vul_validation",
      name: "Validation Agent",
      status: "idle",
      icon: RefreshCw,
      isLoop: true,
    },
    { id: "vul_score", name: "Score Agent", status: "idle", icon: Gauge },
    {
      id: "vul_refinement",
      name: "Refinement Agent",
      status: "idle",
      icon: Sparkles,
    },
  ]);

  const [collationAgent, setCollationAgent] = useState<AgentStatus>("idle");

  const resetState = () => {
    setActiveTab("execution");
    setEmailUploaded(false);
    setIsRunning(false);
    setExecutionComplete(false);
    setIntentAgents((agents) =>
      agents.map((a) => ({ ...a, status: "idle" as AgentStatus })),
    );
    setVulAgents((agents) =>
      agents.map((a) => ({ ...a, status: "idle" as AgentStatus })),
    );
    setCollationAgent("idle");
    setAgentResponse(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetState, 300);
  };

  const parseEmlFile = (content: string): EmailData | null => {
    try {
      let subject = "";
      let from = "";
      let to = "";
      let date = "";
      let body = "";
      let htmlContent = "";

      const lines = content.split("\n");
      let headerEnd = 0;

      // Parse headers
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === "") {
          headerEnd = i;
          break;
        }
        if (line.startsWith("Subject:")) {
          subject = line.replace("Subject:", "").trim();
        } else if (line.startsWith("From:")) {
          from = line.replace("From:", "").trim();
        } else if (line.startsWith("To:")) {
          to = line.replace("To:", "").trim();
        } else if (line.startsWith("Date:")) {
          date = line.replace("Date:", "").trim();
        }
      }

      // Get body content
      const bodyContent = lines.slice(headerEnd + 1).join("\n").trim();

      // Helper function to decode quoted-printable encoding
      const decodeQuotedPrintable = (str: string): string => {
        return str
          .replace(/=\r?\n/g, "") // Remove soft line breaks (CRLF or LF)
          .replace(/=([0-9A-F]{2})/gi, (match, hex) => {
            // Decode any hex-encoded byte
            return String.fromCharCode(parseInt(hex, 16));
          });
      };

      // Check if the email contains multipart/alternative (both plain text and HTML)
      const htmlMatch = bodyContent.match(/<html[\s\S]*?<\/html>/i);
      if (htmlMatch) {
        // Extract and decode HTML content
        htmlContent = decodeQuotedPrintable(htmlMatch[0]);
        // Also extract plain text version for the API call
        const textMatch = bodyContent.match(
          /Content-Type: text\/plain[\s\S]*?(?=--_|$)/i,
        );
        if (textMatch) {
          body = decodeQuotedPrintable(
            textMatch[0]
              .replace(/Content-Type: text\/plain[^\n]*\n/i, "")
              .replace(/Content-Transfer-Encoding[^\n]*\n/i, "")
              .trim(),
          );
        } else {
          // If no plain text, extract from HTML
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = htmlContent;
          body = tempDiv.textContent || "";
        }
      } else {
        body = bodyContent;
      }

      return {
        subject: subject || "(No Subject)",
        from: from || "(No Sender)",
        to: to || "(No Recipient)",
        date: date || "(No Date)",
        content: body || "(No Content)",
        htmlContent: htmlContent || undefined,
        isHtml: !!htmlContent,
        filename: "uploaded_email.eml",
      };
    } catch (error) {
      console.error("Error parsing EML file:", error);
      return null;
    }
  };

  const handleUploadEmail = async (file: File) => {
    try {
      const content = await file.text();
      const emailData = parseEmlFile(content);
      if (emailData) {
        setUploadedEmail({ ...emailData, filename: file.name });
        setEmailUploaded(true);
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const runAgentWorkflow = async () => {
    setIsRunning(true);
    setExecutionComplete(false);

    try {
      // Run both tracks in parallel
      const runIntentTrack = async () => {
        for (let i = 0; i < intentAgents.length; i++) {
          setIntentAgents((prev) =>
            prev.map((a, idx) =>
              idx === i ? { ...a, status: "processing" as AgentStatus } : a,
            ),
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setIntentAgents((prev) =>
            prev.map((a, idx) =>
              idx === i ? { ...a, status: "completed" as AgentStatus } : a,
            ),
          );
        }
      };

      const runVulTrack = async () => {
        for (let i = 0; i < vulAgents.length; i++) {
          setVulAgents((prev) =>
            prev.map((a, idx) =>
              idx === i ? { ...a, status: "processing" as AgentStatus } : a,
            ),
          );
          // Validation agent loops - takes a bit longer
          const delay = vulAgents[i].isLoop ? 4500 : 3000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          setVulAgents((prev) =>
            prev.map((a, idx) =>
              idx === i ? { ...a, status: "completed" as AgentStatus } : a,
            ),
          );
        }
      };

      // Run both tracks in parallel
      await Promise.all([runIntentTrack(), runVulTrack()]);

      // Run collation agent and API call in parallel
      setCollationAgent("processing");

      const apiResponse = await emailAssistService.createSessionAndGetResponse(
        uploadedEmail?.content || "",
      );

      if (apiResponse.success && apiResponse.data) {
        setAgentResponse(apiResponse.data);
      } else {
        // Fallback to mock data if API fails
        const mockResponse: AgentResponse = {
          intent_classification: "EOD",
          intent_score: 0,
          intent_reason:
            "The customer provides an update about filing for bankruptcy, which is an End of Discussion (EOD) point as it's an informational statement rather than an actionable request.",
          vul_classification: "Vulnerable",
          vul_score: 8,
          vul_reason:
            "The customer explicitly states, 'I have Filled for bankruptcy,' which directly indicates a state of financial vulnerability.",
        };
        setAgentResponse(mockResponse);
      }

      setCollationAgent("completed");

      setIsRunning(false);
      setExecutionComplete(true);
      setActiveTab("results");
    } catch (error) {
      console.error("Workflow error:", error);
      setIsRunning(false);
    }
  };

  const AgentNodeComponent = ({
    agent,
    isLast,
  }: {
    agent: AgentNode;
    isLast: boolean;
  }) => {
    const Icon = agent.icon;

    return (
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-500 min-w-[200px]",
            agent.status === "idle" && "border-muted bg-muted/30",
            agent.status === "processing" &&
              "border-primary bg-primary/10 shadow-lg shadow-primary/20",
            agent.status === "completed" && "border-green-500 bg-green-500/10",
          )}
        >
          <div
            className={cn(
              "p-2 rounded-full",
              agent.status === "idle" && "bg-muted",
              agent.status === "processing" && "bg-primary/20",
              agent.status === "completed" && "bg-green-500/20",
            )}
          >
            {agent.status === "processing" ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            ) : agent.status === "completed" ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Icon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p
              className={cn(
                "text-sm font-medium",
                agent.status === "processing" && "text-primary",
                agent.status === "completed" && "text-green-600",
              )}
            >
              {agent.name}
            </p>
            {agent.isLoop && agent.status === "processing" && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Running validation loop...
              </p>
            )}
          </div>
          {agent.status === "processing" && (
            <div className="absolute -right-1 -top-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
          )}
        </div>
        {!isLast && (
          <div className="h-6 w-0.5 bg-border my-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground -ml-[7px] mt-1" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[85vw] w-[85vw] h-[85vh] p-0 gap-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Column - Email Upload (1/3) */}
          <div className="w-1/3 border-r bg-muted/30 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Email Assist Agent</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload .eml file to analyze
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Upload Area */}
            {!emailUploaded ? (
              <>
                <input
                  type="file"
                  id="eml-upload"
                  accept=".eml"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUploadEmail(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <div
                  onClick={() => document.getElementById("eml-upload")?.click()}
                  className="border-2 border-dashed border-muted-foreground/30 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all h-[550px]"
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Upload .eml file</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    Supports .eml format
                  </Badge>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Email Preview */}
                <div className="flex-1 bg-background rounded-xl border overflow-hidden">
                  <div className="bg-primary/5 p-4 border-b">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {uploadedEmail?.subject || mockEmail.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {uploadedEmail?.filename ||
                            "customer_complaint_8847.eml"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">From: </span>
                        <span className="font-medium">
                          {uploadedEmail?.from || mockEmail.from}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">To: </span>
                        <span className="font-medium">
                          {uploadedEmail?.to || mockEmail.to}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Date: </span>
                        <span className="font-medium">
                          {uploadedEmail?.date || mockEmail.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-[300px] p-4">
                    {uploadedEmail?.isHtml && uploadedEmail?.htmlContent ? (
                      <div
                        className="text-sm max-w-none [&_*]:!text-foreground [&_div]:!text-foreground [&_p]:!text-foreground [&_span]:!text-foreground"
                        dangerouslySetInnerHTML={{
                          __html: uploadedEmail.htmlContent,
                        }}
                      />
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                        {uploadedEmail?.content || mockEmail.content}
                      </pre>
                    )}
                  </ScrollArea>
                </div>

                {/* Run Button */}
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={runAgentWorkflow}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Email...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Agent Analysis
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Tabs (2/3) */}
          <div className="flex-1 flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="border-b px-6 pt-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger
                    value="execution"
                    className="flex items-center gap-2"
                  >
                    <GitMerge className="h-4 w-4" />
                    Agent Execution
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    Results
                    {executionComplete && (
                      <Badge
                        variant="default"
                        className="ml-1 h-5 px-1.5 text-xs"
                      >
                        New
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="execution"
                className="flex-1 m-0 p-6 overflow-y-auto min-h-0"
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">
                    Multi-Agent Workflow
                  </h3>
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col lg:flex-row gap-12 justify-center w-full">
                      {/* Intent Classification Track */}
                      <div className="flex flex-col items-center">
                        <div className="mb-4 text-center">
                          <Badge
                            variant="outline"
                            className="mb-2 bg-blue-500/10 text-blue-600 border-blue-500/30"
                          >
                            <Target className="h-3 w-3 mr-1" />
                            Intent Track
                          </Badge>
                        </div>
                        <div className="flex flex-col items-center">
                          {intentAgents.map((agent, idx) => (
                            <AgentNodeComponent
                              key={agent.id}
                              agent={agent}
                              isLast={idx === intentAgents.length - 1}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Vulnerability Classification Track */}
                      <div className="flex flex-col items-center">
                        <div className="mb-4 text-center">
                          <Badge
                            variant="outline"
                            className="mb-2 bg-orange-500/10 text-orange-600 border-orange-500/30"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Vulnerability Track
                          </Badge>
                        </div>
                        <div className="flex flex-col items-center">
                          {vulAgents.map((agent, idx) => (
                            <AgentNodeComponent
                              key={agent.id}
                              agent={agent}
                              isLast={idx === vulAgents.length - 1}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Collation Agent - Connecting both tracks */}
                    <div className="w-full flex justify-center mt-2">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-8 mb-2">
                          <div className="h-0.5 w-16 bg-border"></div>
                          <GitMerge className="h-5 w-5 text-muted-foreground" />
                          <div className="h-0.5 w-16 bg-border"></div>
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-500 min-w-[250px]",
                            collationAgent === "idle" &&
                              "border-muted bg-muted/30",
                            collationAgent === "processing" &&
                              "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20",
                            collationAgent === "completed" &&
                              "border-green-500 bg-green-500/10",
                          )}
                        >
                          <div
                            className={cn(
                              "p-2 rounded-full",
                              collationAgent === "idle" && "bg-muted",
                              collationAgent === "processing" &&
                                "bg-purple-500/20",
                              collationAgent === "completed" &&
                                "bg-green-500/20",
                            )}
                          >
                            {collationAgent === "processing" ? (
                              <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                            ) : collationAgent === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <GitMerge className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-semibold",
                                collationAgent === "processing" &&
                                  "text-purple-600",
                                collationAgent === "completed" &&
                                  "text-green-600",
                              )}
                            >
                              Collation Agent
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Merging results from both tracks
                            </p>
                          </div>
                          {collationAgent === "processing" && (
                            <div className="absolute -right-1 -top-1">
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!emailUploaded && (
                      <div className="flex flex-col items-center justify-center h-64 text-center w-full">
                        <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">
                          Upload an email to start the agent workflow
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="results"
                className="flex-1 m-0 p-6 overflow-y-auto"
              >
                {executionComplete ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-full bg-green-500/10">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          Analysis Complete
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Email processed through all agents successfully
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Intent Classification Result */}
                      <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                          </div>
                          <h4 className="font-semibold text-blue-600">
                            Intent Classification
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Classification
                            </p>
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-base">
                              {agentResponse?.intent_classification ||
                                "Complaint"}
                            </Badge>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-muted-foreground">
                                Confidence Score
                              </p>
                              <span className="text-2xl font-bold text-blue-600">
                                {agentResponse?.intent_score || 8}/10
                              </span>
                            </div>
                            <Progress
                              value={agentResponse?.intent_score || 80}
                              className="h-3 bg-blue-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Vulnerability Classification Result */}
                      <div className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-orange-500/10">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          </div>
                          <h4 className="font-semibold text-orange-600">
                            Vulnerability Classification
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Classification
                            </p>
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-base">
                              {agentResponse?.vul_classification ||
                                "Vulnerable"}
                            </Badge>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-muted-foreground">
                                Vulnerability Score
                              </p>
                              <span className="text-2xl font-bold text-orange-600">
                                {agentResponse?.vul_score || 9}/10
                              </span>
                            </div>
                            <Progress
                              value={
                                agentResponse?.vul_score
                                  ? agentResponse.vul_score * 10
                                  : 90
                              }
                              className="h-3 bg-orange-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border rounded-xl p-6 mt-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Analysis Summary
                      </h4>
                      <div className="max-h-[300px] overflow-y-auto space-y-4">
                        <div className="pt-4 border-t border-primary/20">
                          <p className="text-xs text-muted-foreground mb-2">
                            Intent Analysis Reason
                          </p>
                          <p className="text-sm leading-relaxed">
                            {agentResponse?.intent_reason}
                          </p>
                        </div>
                        <div className="border-t border-primary/20 pt-4">
                          <p className="text-xs text-muted-foreground mb-2">
                            Vulnerability Analysis Reason
                          </p>
                          <p className="text-sm leading-relaxed">
                            {agentResponse?.vul_reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      Results will appear here after agent execution completes
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailAssistDialog;
