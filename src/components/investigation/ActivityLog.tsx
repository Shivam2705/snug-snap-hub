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
    check: 'bg-sky-100 text-sky-700',
    decision: 'bg-violet-100 text-violet-700',
    escalation: 'bg-rose-100 text-rose-700',
    communication: 'bg-amber-100 text-amber-700',
    override: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Activity Log</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
          >
            <ActorIndicator actor={activity.actor} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{activity.actorName}</span>
                <Badge variant="secondary" className={categoryColors[activity.category]}>
                  {activity.category}
                </Badge>
              </div>
              <p className="text-sm text-slate-700">{activity.action}</p>
              {activity.beforeState && activity.afterState && (
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 bg-white rounded border">
                    {activity.beforeState}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="px-2 py-0.5 bg-white rounded border">
                    {activity.afterState}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(activity.timestamp), "dd/MM HH:mm")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
