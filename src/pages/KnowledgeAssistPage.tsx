import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Send, Bot, Clock, Zap, Shield, DollarSign, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  queryKnowledgeAssistant,
  uploadDocumentToKnowledgeAssistant,
  resetKnowledgeAssistantChat,
  generateUserToken,
} from "@/services/knowledgeAssistService";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UploadedDocument {
  file_id: string;
  filename: string;
}

interface ChatSection {
  messages: ChatMessage[];
  isProcessing: boolean;
  processingTime: number | null;
  uploadedDocuments: UploadedDocument[];
  isFileProcessing: boolean;
  fileProcessingProgress: number;
  userToken: string;
}

const SESSION_STORAGE_KEY_EXL = "knowledge_assist_user_token_exl";
const SESSION_STORAGE_KEY_TRADITIONAL = "knowledge_assist_user_token_traditional";

// Add delay for streaming effect
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ChatInputProps {
  onSendMessage: (question: string) => Promise<void>;
  isDisabled: boolean;
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const ChatInput = memo(({ onSendMessage, isDisabled, value, onChange, inputRef }: ChatInputProps) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = inputRef || internalRef;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSendMessage(value);
        onChange("");
        setTimeout(() => ref.current?.focus(), 0);
      }
    }
  }, [onSendMessage, value, onChange, ref]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (value.trim()) {
      onSendMessage(value);
      onChange("");
      setTimeout(() => ref.current?.focus(), 0);
    }
  }, [onSendMessage, value, onChange, ref]);

  return (
    <div className="flex gap-2">
      <Input
        ref={ref}
        placeholder="Ask a question about your document..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        autoComplete="off"
        value={value}
      />
      <Button
        size="icon"
        onClick={handleClick}
        disabled={isDisabled || !value.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

interface ChatInterfaceProps {
  title: string;
  description: string;
  chat: ChatSection;
  setChat: React.Dispatch<React.SetStateAction<ChatSection>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isExl: boolean;
  accentColor: string;
  onSend: (question: string) => Promise<void>;
  onReset: () => Promise<void>;
  inputValue: string;
  onInputChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, setChat: React.Dispatch<React.SetStateAction<ChatSection>>, chat: ChatSection, isExl: boolean) => Promise<void>;
}

const ChatInterface = memo(({
  title,
  description,
  chat,
  setChat,
  fileInputRef,
  isExl,
  accentColor,
  onSend,
  onReset,
  inputValue,
  onInputChange,
  inputRef,
  onFileUpload,
}: ChatInterfaceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
            size="sm"
            onClick={onReset}
            className="h-8 w-8 p-0"
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
            onChange={(e) => onFileUpload(e, setChat, chat, isExl)}
          />
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={chat.isFileProcessing}
          >
            <Upload className="h-4 w-4" />
            {chat.uploadedDocuments.length > 0 ? chat.uploadedDocuments[0].filename : "Upload Document (TXT, PDF, DOC)"}
          </Button>
          
          {chat.isFileProcessing && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading document...
                </span>
                <span>{chat.fileProcessingProgress}%</span>
              </div>
              <Progress value={chat.fileProcessingProgress} className="h-1" />
            </div>
          )}
          
          {chat.uploadedDocuments.length > 0 && !chat.isFileProcessing && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Document ready for queries</span>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div ref={containerRef} className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-lg flex flex-col-reverse">
          {chat.isProcessing && (
            <div className="flex justify-start">
              <div className="bg-background border rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Processing...</span>
              </div>
            </div>
          )}
          {chat.messages.length === 0 && !chat.isProcessing ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Upload a document and ask questions
            </div>
          ) : (
            [...chat.messages].reverse().map((msg, idx) => (
              <div
                key={chat.messages.length - 1 - idx}
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
        </div>

        {/* Processing Time Display */}
        {chat.processingTime !== null && (
          <div className={`flex items-center gap-2 text-xs ${isExl ? "text-green-600" : "text-orange-600"}`}>
            <Clock className="h-3 w-3" />
            <span>Response time: {(chat.processingTime / 1000).toFixed(2)}s</span>
            {/* {!isExl && <span className="text-muted-foreground">(~7x slower)</span>} */}
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSendMessage={onSend}
          isDisabled={chat.uploadedDocuments.length === 0 || chat.isProcessing || chat.isFileProcessing}
          value={inputValue}
          onChange={onInputChange}
          inputRef={inputRef}
        />
      </CardContent>
    </Card>
  );
});

ChatInterface.displayName = "ChatInterface";

const KnowledgeAssistPage = () => {
  const navigate = useNavigate();
  
  const [exlChat, setExlChat] = useState<ChatSection>({
    messages: [],
    isProcessing: false,
    processingTime: null,
    uploadedDocuments: [],
    isFileProcessing: false,
    fileProcessingProgress: 0,
    userToken: "",
  });
  
  const [traditionalChat, setTraditionalChat] = useState<ChatSection>({
    messages: [],
    isProcessing: false,
    processingTime: null,
    uploadedDocuments: [],
    isFileProcessing: false,
    fileProcessingProgress: 0,
    userToken: "",
  });

  // Separate input states for each chat
  const [exlInputValue, setExlInputValue] = useState("");
  const [traditionalInputValue, setTraditionalInputValue] = useState("");

  // Refs for input focus management
  const exlInputRef = useRef<HTMLInputElement>(null);
  const traditionalInputRef = useRef<HTMLInputElement>(null);

  // Maintain focus on inputs when messages update
  useEffect(() => {
    if (exlInputRef.current) {
      setTimeout(() => exlInputRef.current?.focus(), 0);
    }
  }, [exlChat.messages]);

  useEffect(() => {
    if (traditionalInputRef.current) {
      setTimeout(() => traditionalInputRef.current?.focus(), 0);
    }
  }, [traditionalChat.messages]);

  const exlFileInputRef = useRef<HTMLInputElement>(null);
  const traditionalFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize tokens from sessionStorage
  useEffect(() => {
    let exlToken = sessionStorage.getItem(SESSION_STORAGE_KEY_EXL);
    if (!exlToken) {
      exlToken = generateUserToken();
      sessionStorage.setItem(SESSION_STORAGE_KEY_EXL, exlToken);
    }
    setExlChat((prev) => ({ ...prev, userToken: exlToken }));

    let tradToken = sessionStorage.getItem(SESSION_STORAGE_KEY_TRADITIONAL);
    if (!tradToken) {
      tradToken = generateUserToken();
      sessionStorage.setItem(SESSION_STORAGE_KEY_TRADITIONAL, tradToken);
    }
    setTraditionalChat((prev) => ({ ...prev, userToken: tradToken }));
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setChat: React.Dispatch<React.SetStateAction<ChatSection>>,
    chat: ChatSection,
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

    setChat(prev => ({ ...prev, isFileProcessing: true, fileProcessingProgress: 0 }));

    try {
      const response = await uploadDocumentToKnowledgeAssistant(file, chat.userToken);
      
      setChat(prev => ({
        ...prev,
        uploadedDocuments: [
          ...prev.uploadedDocuments,
          {
            file_id: response.file_id,
            filename: response.filename || file.name,
          },
        ],
        isFileProcessing: false,
        fileProcessingProgress: 100,
      }));
      
      toast.success(`Document "${file.name}" uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      setChat(prev => ({ ...prev, isFileProcessing: false }));
      toast.error("Failed to upload document");
    }

    event.target.value = "";
  };

  const handleExlSend = useCallback(async (question: string) => {
    if (!question.trim()) return;

    if (exlChat.uploadedDocuments.length === 0) {
      toast.error("Please upload a document first");
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: question };
    
    setExlChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
      processingTime: null,
    }));

    const startTime = Date.now();
    let lastChunk: any = null;

    try {
      const response = await queryKnowledgeAssistant(question, exlChat.userToken, {
        stream: true,
        history: true,
        model: "groq",
        fileId: exlChat.uploadedDocuments[0]?.file_id,
        onChunk: (chunk: any) => {
          // Store the last chunk (most complete one)
          lastChunk = chunk;
        }
      });

      const endTime = Date.now();
      
      // Extract text from the last chunk
      let fullText = "";
      if (lastChunk && typeof lastChunk === 'object') {
        fullText = lastChunk.content || lastChunk.text || lastChunk.answer || JSON.stringify(lastChunk);
      } else if (lastChunk && typeof lastChunk === 'string') {
        fullText = lastChunk;
      } else if (response.answer) {
        fullText = response.answer;
      }
      
      // Apply gradual typing only when streaming
      let charIndex = 0;
      const typeCharacter = () => {
        if (charIndex < fullText.length) {
          charIndex++;
          const displayText = fullText.substring(0, charIndex);
          
          setExlChat(prev => {
            const updatedMessages = [...prev.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            
            if (lastMessage && lastMessage.role === "assistant") {
              lastMessage.content = displayText;
            } else {
              updatedMessages.push({
                role: "assistant",
                content: displayText,
              });
            }
            
            return {
              ...prev,
              messages: updatedMessages,
            };
          });
          
          setTimeout(typeCharacter, 15);
        } else {
          setExlChat(prev => ({
            ...prev,
            isProcessing: false,
            processingTime: endTime - startTime,
          }));
        }
      };
      
      typeCharacter();
    } catch (error) {
      console.error("Query error:", error);
      const endTime = Date.now();
      
      setExlChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: "Error processing query. Please try again.",
          },
        ],
        isProcessing: false,
        processingTime: endTime - startTime,
      }));
      
      toast.error("Failed to process query");
    }
  }, [exlChat.uploadedDocuments, exlChat.userToken]);

  const handleTraditionalSend = useCallback(async (question: string) => {
    if (!question.trim()) return;

    if (traditionalChat.uploadedDocuments.length === 0) {
      toast.error("Please upload a document first");
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: question };
    
    setTraditionalChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
      processingTime: null,
    }));

    const startTime = Date.now();
    let lastChunk: any = null;

    try {
      const response = await queryKnowledgeAssistant(question, traditionalChat.userToken, {
        stream: true,
        history: true,
        model: "openai",
        fileId: traditionalChat.uploadedDocuments[0]?.file_id,
        onChunk: (chunk: any) => {
          // Store the last chunk
          lastChunk = chunk;
        }
      });

      const endTime = Date.now();
      
      // Extract text from the last chunk or response
      let fullText = "";
      if (lastChunk && typeof lastChunk === 'object') {
        fullText = lastChunk.content || lastChunk.text || lastChunk.answer || JSON.stringify(lastChunk);
      } else if (lastChunk && typeof lastChunk === 'string') {
        fullText = lastChunk;
      } else if (response.answer) {
        fullText = response.answer;
      }
      
      // Apply gradual typing with streaming
      let charIndex = 0;
      const typeCharacter = () => {
        if (charIndex < fullText.length) {
          charIndex++;
          const displayText = fullText.substring(0, charIndex);
          
          setTraditionalChat(prev => {
            const updatedMessages = [...prev.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            
            if (lastMessage && lastMessage.role === "assistant") {
              lastMessage.content = displayText;
            } else {
              updatedMessages.push({
                role: "assistant",
                content: displayText,
              });
            }
            
            return {
              ...prev,
              messages: updatedMessages,
            };
          });
          
          setTimeout(typeCharacter, 50);
        } else {
          setTraditionalChat(prev => ({
            ...prev,
            isProcessing: false,
            processingTime: endTime - startTime,
          }));
        }
      };
      
      typeCharacter();
    } catch (error) {
      console.error("Query error:", error);
      const endTime = Date.now();
      
      setTraditionalChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: "Error processing query. Please try again.",
          },
        ],
        isProcessing: false,
        processingTime: endTime - startTime,
      }));
      
      toast.error("Failed to process query");
    }
  }, [traditionalChat.uploadedDocuments, traditionalChat.userToken]);

  const handleExlReset = useCallback(async () => {
    try {
      await resetKnowledgeAssistantChat(
        exlChat.userToken,
        exlChat.uploadedDocuments[0]?.file_id
      );

      sessionStorage.removeItem(SESSION_STORAGE_KEY_EXL);
      const newToken = generateUserToken();
      sessionStorage.setItem(SESSION_STORAGE_KEY_EXL, newToken);

      setExlChat({
        messages: [],
        isProcessing: false,
        processingTime: null,
        uploadedDocuments: [],
        isFileProcessing: false,
        fileProcessingProgress: 0,
        userToken: newToken,
      });

      toast.success("Chat reset successfully");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Failed to reset chat");
    }
  }, [exlChat.userToken, exlChat.uploadedDocuments]);

  const handleTraditionalReset = useCallback(async () => {
    try {
      await resetKnowledgeAssistantChat(
        traditionalChat.userToken,
        traditionalChat.uploadedDocuments[0]?.file_id
      );

      sessionStorage.removeItem(SESSION_STORAGE_KEY_TRADITIONAL);
      const newToken = generateUserToken();
      sessionStorage.setItem(SESSION_STORAGE_KEY_TRADITIONAL, newToken);

      setTraditionalChat({
        messages: [],
        isProcessing: false,
        processingTime: null,
        uploadedDocuments: [],
        isFileProcessing: false,
        fileProcessingProgress: 0,
        userToken: newToken,
      });

      toast.success("Chat reset successfully");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Failed to reset chat");
    }
  }, [traditionalChat.userToken, traditionalChat.uploadedDocuments]);

  const advantages = [
    { icon: Zap, label: "Faster Response", description: "Lightning-fast retrieval with optimized vector search" },
    { icon: DollarSign, label: "Low Cost", description: "Reduced infrastructure and operational costs" },
    { icon: Shield, label: "Highly Secure", description: "Enterprise-grade security and encryption" },
    { icon: CheckCircle2, label: "Data Compliance", description: "GDPR Compliant" },
  ];

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
            description="Advanced EXL Engine based RAG-Powered Chatbot"
            chat={exlChat}
            setChat={setExlChat}
            fileInputRef={exlFileInputRef}
            isExl={true}
            accentColor="primary"
            onSend={handleExlSend}
            onReset={handleExlReset}
            inputValue={exlInputValue}
            onInputChange={setExlInputValue}
            inputRef={exlInputRef}
            onFileUpload={handleFileUpload}
          />
          
          <ChatInterface
            title="Traditional Chatbot"
            description="Standard RAG based chatbot"
            chat={traditionalChat}
            setChat={setTraditionalChat}
            fileInputRef={traditionalFileInputRef}
            isExl={false}
            accentColor="muted"
            onSend={handleTraditionalSend}
            onReset={handleTraditionalReset}
            inputValue={traditionalInputValue}
            onInputChange={setTraditionalInputValue}
            inputRef={traditionalInputRef}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeAssistPage;
