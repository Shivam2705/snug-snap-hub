import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, CheckCircle2, AlertTriangle, Phone, Ban } from "lucide-react";
import { CustomerCase, RecommendationAction } from "@/data/mockCases";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AIRecommendationPanelProps {
  caseData: CustomerCase;
}

const actionConfig: Record<RecommendationAction, { icon: React.ElementType; color: string; bgColor: string }> = {
  escalate: { icon: AlertTriangle, color: 'text-[#FFA502]', bgColor: 'bg-[#FFA502]/10 border-[#FFA502]/20' },
  await: { icon: Phone, color: 'text-[#4DA3FF]', bgColor: 'bg-[#4DA3FF]/10 border-[#4DA3FF]/20' },
  block: { icon: Ban, color: 'text-[#FF4757]', bgColor: 'bg-[#FF4757]/10 border-[#FF4757]/20' }
};

const AIRecommendationPanel = ({ caseData }: AIRecommendationPanelProps) => {
  const confidenceLevel = caseData.confidenceScore && caseData.confidenceScore >= 85 
    ? 'high' 
    : caseData.confidenceScore && caseData.confidenceScore >= 60 
      ? 'medium' 
      : 'low';

  const confidenceColors = {
    high: 'text-[#2ED573]',
    medium: 'text-[#FFA502]',
    low: 'text-[#FF4757]'
  };

  const progressColors = {
    high: 'bg-[#2ED573]',
    medium: 'bg-[#FFA502]',
    low: 'bg-[#FF4757]'
  };

  const handleAction = (action: string) => {
    toast.success(`Action "${action}" executed for case ${caseData.caseId}`);
  };

  const recommendation = caseData.aiRecommendation;
  const config = recommendation ? actionConfig[recommendation.action] : null;
  const ActionIcon = config?.icon || Bot;

  // For completed cases, don't show action buttons
  const isCompleted = caseData.status === 'Completed';

  return (
    <Card className="border-0 shadow-md bg-[#181C23] border-[#12151B]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <div className="p-1.5 bg-[#4DA3FF]/10 rounded-lg">
            <Bot className="h-4 w-4 text-[#4DA3FF]" />
          </div>
          AI Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Confidence Score</span>
            <span className={cn('text-lg font-bold', confidenceColors[confidenceLevel])}>
              {caseData.confidenceScore}%
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#12151B]">
            <div 
              className={cn('h-full transition-all', progressColors[confidenceLevel])}
              style={{ width: `${caseData.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Recommendation Action */}
        {recommendation && config && (
          <div className={cn('p-4 rounded-lg border', config.bgColor)}>
            <div className="flex items-center gap-2 mb-2">
              <ActionIcon className={cn('h-5 w-5', config.color)} />
              <span className={cn('font-semibold', config.color)}>
                {recommendation.label}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {recommendation.reasoning}
            </p>
          </div>
        )}

        {/* Supporting Evidence */}
        {recommendation?.supportingEvidence && recommendation.supportingEvidence.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Supporting Evidence
            </span>
            <ul className="space-y-1.5">
              {recommendation.supportingEvidence.map((evidence, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
                  {evidence}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons - Only show for non-completed cases */}
        {!isCompleted && (
          <div className="space-y-2 pt-2 border-t border-[#12151B]">
            {/* Show the recommended action prominently */}
            {recommendation && (
              <div className="text-center text-xs text-slate-500 mb-2">
                Recommended: <span className="font-semibold text-slate-300">{recommendation.label}</span>
              </div>
            )}
            
            <Button 
              className="w-full bg-[#2ED573] hover:bg-[#2ED573]/90 text-black font-semibold"
              onClick={() => handleAction(recommendation?.label || 'Approve')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve: {recommendation?.label || 'AI Action'}
            </Button>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="border-[#FF4757]/30 text-[#FF4757] hover:bg-[#FF4757]/10 text-xs bg-transparent"
                onClick={() => handleAction('Block Account')}
              >
                <Ban className="h-3 w-3 mr-1" />
                Block
              </Button>
              
              <Button 
                variant="outline"
                className="border-[#FFA502]/30 text-[#FFA502] hover:bg-[#FFA502]/10 text-xs bg-transparent"
                onClick={() => handleAction('Escalate to AIT')}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Escalate
              </Button>
              
              <Button 
                variant="outline"
                className="border-[#4DA3FF]/30 text-[#4DA3FF] hover:bg-[#4DA3FF]/10 text-xs bg-transparent"
                onClick={() => handleAction('Awaiting Customer')}
              >
                <Phone className="h-3 w-3 mr-1" />
                Await
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationPanel;
