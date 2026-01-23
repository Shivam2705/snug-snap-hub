import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, CheckCircle2, Bot } from "lucide-react";
import { toast } from "sonner";

interface SampleInput {
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
}

interface Agent {
  id: string;
  name: string;
  purpose: string;
  sampleInputs?: SampleInput[];
}

interface RunAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
}

const RunAgentDialog = ({ open, onOpenChange, agent }: RunAgentDialogProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setIsCompleted(false);
    
    // Simulate agent execution
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsRunning(false);
    setIsCompleted(true);
    
    toast.success(`${agent?.name} completed successfully`, {
      description: "Sample data has been processed. View results in the case detail.",
    });
  };

  const handleClose = () => {
    setIsCompleted(false);
    setFormData({});
    onOpenChange(false);
  };

  const handleLoadSample = () => {
    if (!agent?.sampleInputs) return;
    
    const sampleData: Record<string, string> = {};
    agent.sampleInputs.forEach(input => {
      if (input.options) {
        sampleData[input.label] = input.options[0];
      } else if (input.placeholder) {
        sampleData[input.label] = input.placeholder;
      }
    });
    setFormData(sampleData);
    toast.info("Sample data loaded");
  };

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg gradient-exl flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <Badge variant="secondary" className="text-xs">
              AI Agent
            </Badge>
          </div>
          <DialogTitle className="text-xl">{agent.name}</DialogTitle>
          <DialogDescription>{agent.purpose}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Input Parameters</p>
            <Button variant="outline" size="sm" onClick={handleLoadSample}>
              Load Sample Data
            </Button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {agent.sampleInputs?.map((input, index) => (
              <div key={index} className="space-y-1.5">
                <Label htmlFor={input.label} className="text-sm">
                  {input.label}
                </Label>
                {input.type === "select" && input.options ? (
                  <Select 
                    value={formData[input.label] || ""} 
                    onValueChange={(value) => handleInputChange(input.label, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${input.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {input.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={input.label}
                    type={input.type === "date" ? "date" : input.type === "email" ? "email" : "text"}
                    placeholder={input.placeholder}
                    value={formData[input.label] || ""}
                    onChange={(e) => handleInputChange(input.label, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {isCompleted && (
            <div className="rounded-lg bg-success/10 border border-success/20 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-success">Agent Execution Complete</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The agent has successfully processed the sample data. Results are available for review.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {isCompleted ? "Close" : "Cancel"}
          </Button>
          {!isCompleted && (
            <Button onClick={handleRun} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Agent
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RunAgentDialog;
