export interface InvoiceMetadata {
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  clientAddress: string;
  shippingAddress: string;
  billingAddress: string;
}

export interface LineItem {
  id: string;
  customerPO: string;
  sellerArticleNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface FinalValues {
  subtotal: number;
  freight: number;
  vat: number;
  totalUnits: number;
  totalUSD: number;
  advancePayment: number;
  netTotal: number;
}

export interface InvoiceResult {
  non_tabular: InvoiceMetadata;
  tabular: {
    line_items: LineItem[];
    final_values: FinalValues;
  };
}

export interface AgentStatus {
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
}

export interface SSELog {
  step: number;
  status: string;
  timestamp: Date;
}

export interface InvoiceAgentState {
  pdfFile: File | null;
  executionStatus: 'idle' | 'running' | 'completed' | 'error';
  sseLogs: SSELog[];
  agents: {
    tableExtraction: AgentStatus;
    metadataExtraction: AgentStatus;
  };
  result: InvoiceResult | null;
  isEditable: boolean;
  contractCreated: boolean;
}
