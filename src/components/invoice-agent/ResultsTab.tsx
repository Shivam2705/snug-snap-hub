import { useState } from "react";
import { Edit2, Check, X, Plus, Trash2, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { InvoiceResult, LineItem, InvoiceMetadata, FinalValues } from "./types";

interface ResultsTabProps {
  result: InvoiceResult | null;
  onUpdateResult: (result: InvoiceResult) => void;
  executionStatus: 'idle' | 'running' | 'completed' | 'error';
  onCreateContract: () => void;
  contractCreated: boolean;
}

const MetadataCard = ({ 
  metadata, 
  isEditing, 
  onUpdate 
}: { 
  metadata: InvoiceMetadata; 
  isEditing: boolean;
  onUpdate: (data: InvoiceMetadata) => void;
}) => {
  const [editData, setEditData] = useState(metadata);

  const fields: { key: keyof InvoiceMetadata; label: string }[] = [
    { key: 'invoiceNumber', label: 'Invoice Number' },
    { key: 'invoiceDate', label: 'Invoice Date' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'clientAddress', label: 'Client Address' },
    { key: 'shippingAddress', label: 'Shipping Address' },
    { key: 'billingAddress', label: 'Billing Address' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map(({ key, label }) => (
        <div key={key} className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{label}</label>
          {isEditing ? (
            <Input
              value={editData[key]}
              onChange={(e) => {
                const updated = { ...editData, [key]: e.target.value };
                setEditData(updated);
                onUpdate(updated);
              }}
              className="h-8"
            />
          ) : (
            <p className="text-sm font-medium">{metadata[key] || '-'}</p>
          )}
        </div>
      ))}
    </div>
  );
};

const SummaryCard = ({ 
  finalValues, 
  isEditing, 
  onUpdate 
}: { 
  finalValues: FinalValues; 
  isEditing: boolean;
  onUpdate: (data: FinalValues) => void;
}) => {
  const [editData, setEditData] = useState(finalValues);

  const fields: { key: keyof FinalValues; label: string }[] = [
    { key: 'subtotal', label: 'Subtotal' },
    { key: 'freight', label: 'Freight' },
    { key: 'vat', label: 'VAT' },
    { key: 'totalUnits', label: 'Total Units' },
    { key: 'totalUSD', label: 'Total USD' },
    { key: 'advancePayment', label: 'Advance Payment' },
    { key: 'netTotal', label: 'Net Total' },
  ];

  const formatValue = (key: keyof FinalValues, value: number) => {
    if (key === 'totalUnits') return value.toString();
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {fields.map(({ key, label }) => (
        <div 
          key={key}
          className={cn(
            "p-3 rounded-lg",
            key === 'netTotal' ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
          )}
        >
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          {isEditing ? (
            <Input
              type="number"
              value={editData[key]}
              onChange={(e) => {
                const updated = { ...editData, [key]: parseFloat(e.target.value) || 0 };
                setEditData(updated);
                onUpdate(updated);
              }}
              className="h-7 text-sm"
            />
          ) : (
            <p className={cn(
              "text-sm font-semibold",
              key === 'netTotal' && "text-primary"
            )}>
              {formatValue(key, finalValues[key])}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const ResultsTab = ({ result, onUpdateResult, executionStatus, onCreateContract, contractCreated }: ResultsTabProps) => {
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  if (executionStatus !== 'completed' || !result) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Results will appear here after agent execution completes</p>
      </div>
    );
  }

  const handleAddRow = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      customerPO: '',
      sellerArticleNumber: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      total: 0,
    };
    onUpdateResult({
      ...result,
      tabular: {
        ...result.tabular,
        line_items: [...result.tabular.line_items, newItem],
      },
    });
  };

  const handleDeleteRow = (id: string) => {
    onUpdateResult({
      ...result,
      tabular: {
        ...result.tabular,
        line_items: result.tabular.line_items.filter(item => item.id !== id),
      },
    });
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    onUpdateResult({
      ...result,
      tabular: {
        ...result.tabular,
        line_items: result.tabular.line_items.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Create Contract */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-lg">Extracted Invoice Data</h3>
        <Button 
          onClick={onCreateContract}
          disabled={contractCreated}
          className="gap-2"
        >
          <FileSignature className="h-4 w-4" />
          {contractCreated ? "Contract Created" : "Create Contract"}
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Section 1: Metadata */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Invoice Metadata</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingMetadata(!isEditingMetadata)}
              >
                {isEditingMetadata ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MetadataCard
              metadata={result.non_tabular}
              isEditing={isEditingMetadata}
              onUpdate={(data) => onUpdateResult({ ...result, non_tabular: data })}
            />
          </CardContent>
        </Card>

        {/* Section 2: Line Items Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Line Items</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddRow}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Row
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTable(!isEditingTable)}
                >
                  {isEditingTable ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 bg-background">Customer PO</TableHead>
                    <TableHead className="sticky top-0 bg-background">Article #</TableHead>
                    <TableHead className="sticky top-0 bg-background">Description</TableHead>
                    <TableHead className="sticky top-0 bg-background text-right">Qty</TableHead>
                    <TableHead className="sticky top-0 bg-background text-right">Unit Price</TableHead>
                    <TableHead className="sticky top-0 bg-background text-right">Discount</TableHead>
                    <TableHead className="sticky top-0 bg-background text-right">Total</TableHead>
                    {isEditingTable && <TableHead className="sticky top-0 bg-background w-10"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.tabular.line_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {isEditingTable ? (
                          <Input
                            value={item.customerPO}
                            onChange={(e) => handleUpdateLineItem(item.id, 'customerPO', e.target.value)}
                            className="h-7 w-24"
                          />
                        ) : item.customerPO}
                      </TableCell>
                      <TableCell>
                        {isEditingTable ? (
                          <Input
                            value={item.sellerArticleNumber}
                            onChange={(e) => handleUpdateLineItem(item.id, 'sellerArticleNumber', e.target.value)}
                            className="h-7 w-24"
                          />
                        ) : item.sellerArticleNumber}
                      </TableCell>
                      <TableCell>
                        {isEditingTable ? (
                          <Input
                            value={item.description}
                            onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                            className="h-7"
                          />
                        ) : item.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditingTable ? (
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="h-7 w-16 text-right"
                          />
                        ) : item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditingTable ? (
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="h-7 w-20 text-right"
                          />
                        ) : `$${item.unitPrice.toFixed(2)}`}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditingTable ? (
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleUpdateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                            className="h-7 w-16 text-right"
                          />
                        ) : `${item.discount}%`}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {isEditingTable ? (
                          <Input
                            type="number"
                            value={item.total}
                            onChange={(e) => handleUpdateLineItem(item.id, 'total', parseFloat(e.target.value) || 0)}
                            className="h-7 w-24 text-right"
                          />
                        ) : `$${item.total.toFixed(2)}`}
                      </TableCell>
                      {isEditingTable && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRow(item.id)}
                            className="h-7 w-7 text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Final Values Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Final Values Summary</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingSummary(!isEditingSummary)}
              >
                {isEditingSummary ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SummaryCard
              finalValues={result.tabular.final_values}
              isEditing={isEditingSummary}
              onUpdate={(data) => onUpdateResult({
                ...result,
                tabular: { ...result.tabular, final_values: data }
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsTab;
