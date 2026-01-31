import { ActivityLogItem } from "@/data/mockCases";
import ActorIndicator from "./ActorIndicator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ActivityLogProps {
  activities: ActivityLogItem[];
}

const ActivityLog = ({ activities }: ActivityLogProps) => {
  const categoryColors = {
    check: 'bg-[#4DA3FF]/20 text-[#4DA3FF]',
    decision: 'bg-purple-500/20 text-purple-400',
    escalation: 'bg-[#FF4757]/20 text-[#FF4757]',
    communication: 'bg-[#FFA502]/20 text-[#FFA502]',
    override: 'bg-slate-500/20 text-slate-400'
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-white">Activity Log</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 p-3 bg-[#12151B] rounded-lg"
          >
            <ActorIndicator actor={activity.actor} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-white">{activity.actorName}</span>
                <Badge variant="secondary" className={categoryColors[activity.category]}>
                  {activity.category}
                </Badge>
              </div>
              <p className="text-sm text-slate-300">{activity.action}</p>
              {activity.beforeState && activity.afterState && (
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 bg-[#181C23] rounded border border-[#12151B] text-slate-400">
                    {activity.beforeState}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="px-2 py-0.5 bg-[#181C23] rounded border border-[#12151B] text-slate-400">
                    {activity.afterState}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {format(new Date(activity.timestamp), "dd/MM HH:mm")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
