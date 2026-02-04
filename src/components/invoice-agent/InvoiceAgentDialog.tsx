import { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import PDFUploader from "./PDFUploader";
import PDFViewer from "./PDFViewer";
import AgentExecution from "./AgentExecution";
import ResultsTab from "./ResultsTab";
import type { InvoiceAgentState, SSELog, InvoiceResult } from "./types";

interface InvoiceAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: InvoiceAgentState = {
  pdfFile: null,
  executionStatus: 'idle',
  sseLogs: [],
  agents: {
    tableExtraction: { status: 'pending' },
    metadataExtraction: { status: 'pending' },
  },
  result: null,
  isEditable: true,
  contractCreated: false,
};

// Map SSE steps to agent status updates
const stepToAgentUpdate = (step: number, status: string) => {
  // Steps 1-4: Table Extraction Agent
  // Steps 5+: Metadata Extraction Agent
  if (step <= 2) {
    return { agent: 'tableExtraction' as const, status: 'running' as const, message: status };
  } else if (step <= 4) {
    return { agent: 'tableExtraction' as const, status: step === 4 ? 'completed' as const : 'running' as const, message: status };
  } else if (step <= 6) {
    return { agent: 'metadataExtraction' as const, status: 'running' as const, message: status };
  } else {
    return { agent: 'metadataExtraction' as const, status: 'completed' as const, message: status };
  }
};

const InvoiceAgentDialog = ({ open, onOpenChange }: InvoiceAgentDialogProps) => {
  const [state, setState] = useState<InvoiceAgentState>(initialState);
  const [activeTab, setActiveTab] = useState("pdf-viewer");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileSelect = useCallback((file: File | null) => {
    setState(prev => ({
      ...initialState,
      pdfFile: file,
    }));
    if (file) {
      setActiveTab("pdf-viewer");
    }
  }, []);

  const handleRun = useCallback(async () => {
    if (!state.pdfFile) return;

    // Reset state and switch to execution tab
    setState(prev => ({
      ...prev,
      executionStatus: 'running',
      sseLogs: [],
      agents: {
        tableExtraction: { status: 'pending' },
        metadataExtraction: { status: 'pending' },
      },
      result: null,
      contractCreated: false,
    }));
    setActiveTab("execution");

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append('file', state.pdfFile);

      const response = await fetch(
        'https://next-invoice-agent-1037311574972.us-central1.run.app/process-pdf',
        {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              // Add to logs
              const newLog: SSELog = {
                step: data.step,
                status: data.status,
                timestamp: new Date(),
              };

              setState(prev => {
                const update = stepToAgentUpdate(data.step, data.status);
                return {
                  ...prev,
                  sseLogs: [...prev.sseLogs, newLog],
                  agents: {
                    ...prev.agents,
                    [update.agent]: { status: update.status, message: update.message },
                  },
                };
              });

              // Check for final result
              if (data.result) {
                const result: InvoiceResult = {
                  non_tabular: {
                    invoiceNumber: data.result.invoice_number || '',
                    invoiceDate: data.result.invoice_date || '',
                    clientName: data.result.client_name || '',
                    clientAddress: data.result.client_address || '',
                    shippingAddress: data.result.shipping_address || '',
                    billingAddress: data.result.billing_address || '',
                  },
                  tabular: {
                    line_items: (data.result.line_items || []).map((item: any, index: number) => ({
                      id: crypto.randomUUID(),
                      customerPO: item.customer_po || '',
                      sellerArticleNumber: item.seller_article_number || '',
                      description: item.description || '',
                      quantity: item.quantity || 0,
                      unitPrice: item.unit_price || 0,
                      discount: item.discount || 0,
                      total: item.total || 0,
                    })),
                    final_values: {
                      subtotal: data.result.subtotal || 0,
                      freight: data.result.freight || 0,
                      vat: data.result.vat || 0,
                      totalUnits: data.result.total_units || 0,
                      totalUSD: data.result.total_usd || 0,
                      advancePayment: data.result.advance_payment || 0,
                      netTotal: data.result.net_total || 0,
                    },
                  },
                };

                setState(prev => ({
                  ...prev,
                  result,
                  executionStatus: 'completed',
                  agents: {
                    tableExtraction: { status: 'completed' },
                    metadataExtraction: { status: 'completed' },
                  },
                }));

                // Auto-switch to results tab
                setActiveTab("results");
                
                toast({
                  title: "Processing Complete",
                  description: "Invoice data has been extracted successfully.",
                });
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }

      console.error('Error processing PDF:', error);
      
      setState(prev => ({
        ...prev,
        executionStatus: 'error',
        agents: {
          tableExtraction: prev.agents.tableExtraction.status === 'running' 
            ? { status: 'error', message: 'Processing failed' }
            : prev.agents.tableExtraction,
          metadataExtraction: prev.agents.metadataExtraction.status === 'running'
            ? { status: 'error', message: 'Processing failed' }
            : prev.agents.metadataExtraction,
        },
      }));

      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process the PDF. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.pdfFile]);

  const handleUpdateResult = useCallback((result: InvoiceResult) => {
    setState(prev => ({ ...prev, result }));
  }, []);

  const handleCreateContract = useCallback(() => {
    if (!state.result) return;

    // In a real implementation, this would call an API to create the contract
    setState(prev => ({ ...prev, contractCreated: true }));
    
    toast({
      title: "Contract Created Successfully",
      description: "The invoice data has been saved as a new contract.",
    });
  }, [state.result]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (!open) {
      setState(initialState);
      setActiveTab("pdf-viewer");
    }
    onOpenChange(open);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Invoice Agent - Document Processing</DialogTitle>
        </DialogHeader>

        {/* Row 1: PDF Upload + Run */}
        <PDFUploader
          file={state.pdfFile}
          onFileSelect={handleFileSelect}
          onRun={handleRun}
          isRunning={state.executionStatus === 'running'}
          isCompleted={state.executionStatus === 'completed'}
        />

        {/* Row 2: Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 border-b border-border">
            <TabsList className="h-10">
              <TabsTrigger value="pdf-viewer">PDF Viewer</TabsTrigger>
              <TabsTrigger value="execution">Agent Execution</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pdf-viewer" className="flex-1 m-0 overflow-hidden">
            <PDFViewer file={state.pdfFile} />
          </TabsContent>

          <TabsContent value="execution" className="flex-1 m-0 overflow-hidden">
            <AgentExecution
              agents={state.agents}
              sseLogs={state.sseLogs}
              executionStatus={state.executionStatus}
            />
          </TabsContent>

          <TabsContent value="results" className="flex-1 m-0 overflow-hidden">
            <ResultsTab
              result={state.result}
              onUpdateResult={handleUpdateResult}
              executionStatus={state.executionStatus}
              onCreateContract={handleCreateContract}
              contractCreated={state.contractCreated}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceAgentDialog;
