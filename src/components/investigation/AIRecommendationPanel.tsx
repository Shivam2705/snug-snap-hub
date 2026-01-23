import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, CheckCircle2, XCircle, AlertTriangle, Phone } from "lucide-react";
import { CustomerCase } from "@/data/mockCases";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AIRecommendationPanelProps {
  caseData: CustomerCase;
}

const AIRecommendationPanel = ({ caseData }: AIRecommendationPanelProps) => {
  const confidenceLevel = caseData.confidenceScore && caseData.confidenceScore >= 85 
    ? 'high' 
    : caseData.confidenceScore && caseData.confidenceScore >= 60 
      ? 'medium' 
      : 'low';

  const confidenceColors = {
    high: 'text-emerald-600',
    medium: 'text-amber-600',
    low: 'text-rose-600'
  };

  const progressColors = {
    high: 'bg-emerald-500',
    medium: 'bg-amber-500',
    low: 'bg-rose-500'
  };

  const handleAction = (action: string) => {
    toast.success(`Action "${action}" executed for case ${caseData.caseId}`);
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-violet-100 rounded-lg">
            <Bot className="h-4 w-4 text-violet-600" />
          </div>
          AI Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Confidence Score</span>
            <span className={cn('text-lg font-bold', confidenceColors[confidenceLevel])}>
              {caseData.confidenceScore}%
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className={cn('h-full transition-all', progressColors[confidenceLevel])}
              style={{ width: `${caseData.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-sm font-medium text-slate-700">
            {caseData.aiRecommendation || 'Pending Analysis'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleAction('Approve AI Recommendation')}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve AI Action
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
            onClick={() => handleAction('Override')}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Override
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={() => handleAction('Escalate to AIT')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Escalate
            </Button>
            
            <Button 
              variant="outline"
              className="border-sky-200 text-sky-700 hover:bg-sky-50"
              onClick={() => handleAction('Await Customer')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Await
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationPanel;
