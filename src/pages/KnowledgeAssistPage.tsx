import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Send, Bot, Clock, Zap, Shield, DollarSign, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatSection {
  messages: ChatMessage[];
  isProcessing: boolean;
  processingTime: number | null;
  uploadedFile: File | null;
  isFileProcessing: boolean;
  fileProcessingProgress: number;
}

const KnowledgeAssistPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  
  const [exlChat, setExlChat] = useState<ChatSection>({
    messages: [],
    isProcessing: false,
    processingTime: null,
    uploadedFile: null,
    isFileProcessing: false,
    fileProcessingProgress: 0,
  });
  
  const [traditionalChat, setTraditionalChat] = useState<ChatSection>({
    messages: [],
    isProcessing: false,
    processingTime: null,
    uploadedFile: null,
    isFileProcessing: false,
    fileProcessingProgress: 0,
  });

  const exlFileInputRef = useRef<HTMLInputElement>(null);
  const traditionalFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setChat: React.Dispatch<React.SetStateAction<ChatSection>>,
    isExl: boolean
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [".txt", ".pdf", ".doc", ".docx"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      toast.error("Please upload a TXT, PDF, or DOC file");
      return;
    }

    setChat(prev => ({ ...prev, uploadedFile: file, isFileProcessing: true, fileProcessingProgress: 0 }));

    // Simulate file processing with different speeds
    const processingSpeed = isExl ? 50 : 200; // EXL is faster
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 10;
      setChat(prev => ({ ...prev, fileProcessingProgress: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setChat(prev => ({ ...prev, isFileProcessing: false }));
        toast.success(`Document "${file.name}" processed successfully`);
      }
    }, processingSpeed);

    event.target.value = "";
  };

  const handleSendMessage = (
    setChat: React.Dispatch<React.SetStateAction<ChatSection>>,
    isExl: boolean
  ) => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    
    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
      processingTime: null,
    }));

    const startTime = Date.now();
    const responseTime = isExl ? 800 : 5600; // EXL is 7x faster

    setTimeout(() => {
      const endTime = Date.now();
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: isExl 
          ? "Based on the uploaded document, I found the relevant information quickly using our advanced RAG architecture. The policy states that returns are accepted within 30 days with original receipt."
          : "After processing through traditional methods... I have analyzed the document. The return policy mentioned in the document indicates a 30-day window for returns with proof of purchase.",
      };

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        isProcessing: false,
        processingTime: endTime - startTime,
      }));
    }, responseTime);

    setQuestion("");
  };

  const advantages = [
    { icon: Zap, label: "7X Faster Response", description: "Lightning-fast retrieval with optimized vector search" },
    { icon: DollarSign, label: "Low Cost", description: "Reduced infrastructure and operational costs" },
    { icon: Shield, label: "Highly Secure", description: "Enterprise-grade security and encryption" },
    { icon: CheckCircle2, label: "Data Compliance", description: "GDPR Compliant" },
  ];

  const ChatInterface = ({
    title,
    description,
    chat,
    setChat,
    fileInputRef,
    isExl,
    accentColor,
  }: {
    title: string;
    description: string;
    chat: ChatSection;
    setChat: React.Dispatch<React.SetStateAction<ChatSection>>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    isExl: boolean;
    accentColor: string;
  }) => {
    const handleClearChat = () => {
      setChat(prev => ({
        ...prev,
        messages: [],
        processingTime: null,
      }));
      toast.success("Chat cleared");
    };

    return (
      <Card className={`h-full flex flex-col ${isExl ? "border-primary/30 bg-gradient-to-br from-primary/5 to-background" : "border-muted"}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isExl ? "gradient-primary" : "bg-muted"}`}>
                <Bot className={`h-5 w-5 ${isExl ? "text-white" : "text-muted-foreground"}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearChat}
              disabled={chat.messages.length === 0}
              title="Clear chat"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          {isExl && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">7X Faster</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">Low Cost</Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 text-xs">Compliant</Badge>
            </div>
          )}
        </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* File Upload */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFileUpload(e, setChat, isExl)}
          />
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={chat.isFileProcessing}
          >
            <Upload className="h-4 w-4" />
            {chat.uploadedFile ? chat.uploadedFile.name : "Upload Document (TXT, PDF, DOC)"}
          </Button>
          
          {chat.isFileProcessing && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Processing document...
                </span>
                <span>{chat.fileProcessingProgress}%</span>
              </div>
              <Progress value={chat.fileProcessingProgress} className="h-1" />
            </div>
          )}
          
          {chat.uploadedFile && !chat.isFileProcessing && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Document ready for queries</span>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-lg">
          {chat.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Upload a document and ask questions
            </div>
          ) : (
            chat.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {chat.isProcessing && (
            <div className="flex justify-start">
              <div className="bg-background border rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Processing Time Display */}
        {chat.processingTime !== null && (
          <div className={`flex items-center gap-2 text-xs ${isExl ? "text-green-600" : "text-orange-600"}`}>
            <Clock className="h-3 w-3" />
            <span>Response time: {(chat.processingTime / 1000).toFixed(2)}s</span>
            {!isExl && <span className="text-muted-foreground">(~7x slower)</span>}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about your document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(setChat, isExl)}
            disabled={!chat.uploadedFile || chat.isProcessing || chat.isFileProcessing}
          />
          <Button
            size="icon"
            onClick={() => handleSendMessage(setChat, isExl)}
            disabled={!chat.uploadedFile || chat.isProcessing || chat.isFileProcessing || !question.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Knowledge Assist Agent</h1>
              <p className="text-muted-foreground">Intelligent Document Q&A with Advanced RAG</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-4xl leading-relaxed mb-4">
            EXL's Knowledge Assist Agent leverages cutting-edge Retrieval-Augmented Generation (RAG) 
            technology to provide instant, accurate answers from your documents. Unlike traditional 
            chatbots that rely on basic keyword matching, our agent understands context, semantics, 
            and relationships within your documents for superior query resolution.
          </p>
          
          <Button 
            onClick={() => window.open("https://finance-exleratortest1.exlservice.com/s4/knowledge-assist/know-your-documents", "_blank")}
            className="mb-6"
          >
            Go to Knowledge Assist
          </Button>

          {/* Advantages */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {advantages.map((adv, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <adv.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">{adv.label}</span>
                  <span className="text-xs text-muted-foreground">{adv.description}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Comparison Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ChatInterface
            title="EXL Knowledge Assist"
            description="Advanced RAG-powered chatbot"
            chat={exlChat}
            setChat={setExlChat}
            fileInputRef={exlFileInputRef}
            isExl={true}
            accentColor="primary"
          />
          
          <ChatInterface
            title="Traditional Chatbot"
            description="Standard RAG based chatbot"
            chat={traditionalChat}
            setChat={setTraditionalChat}
            fileInputRef={traditionalFileInputRef}
            isExl={false}
            accentColor="muted"
          />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeAssistPage;
