import { EvidenceItem } from "@/data/mockCases";
import ActorIndicator from "./ActorIndicator";
import { format } from "date-fns";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvidenceTimelineProps {
  evidence: EvidenceItem[];
}

const EvidenceTimeline = ({ evidence }: EvidenceTimelineProps) => {
  const statusIcons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
    info: Info
  };

  const statusColors = {
    success: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    error: 'text-rose-600 bg-rose-50 border-rose-200',
    info: 'text-sky-600 bg-sky-50 border-sky-200'
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Evidence Timeline</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

        <div className="space-y-4">
          {evidence.map((item, index) => {
            const StatusIcon = statusIcons[item.status];
            
            return (
              <div key={item.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className={cn(
                  'absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  statusColors[item.status]
                )}>
                  <StatusIcon className="h-3 w-3" />
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <ActorIndicator actor={item.actor} size="sm" />
                      {item.agentName && (
                        <span className="text-sm font-medium text-violet-700">
                          {item.agentName}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(item.timestamp), "HH:mm")}
                    </span>
                  </div>

                  <p className="font-medium text-white mb-1">{item.action}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                      {item.system}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300">{item.result}</p>
                  
                  {item.details && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EvidenceTimeline;
