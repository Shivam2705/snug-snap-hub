import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerCase, QueueType } from "@/data/mockCases";
import StatusBadge from "@/components/StatusBadge";
import RiskBadge from "./RiskBadge";
import FlagBadge from "./FlagBadge";
import ActorIndicator from "./ActorIndicator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, Calendar } from "lucide-react";
import { toast } from "sonner";

interface InvestigationTableProps {
  cases: CustomerCase[];
  queue: QueueType;
  onMoveToDay7?: (caseId: string) => void;
}

const InvestigationTable = ({ cases, queue, onMoveToDay7 }: InvestigationTableProps) => {
  const navigate = useNavigate();

  const handleMoveToDay7 = (e: React.MouseEvent, caseId: string) => {
    e.stopPropagation();
    if (onMoveToDay7) {
      onMoveToDay7(caseId);
      toast.success(`Case ${caseId} moved to Day-7 queue`);
    }
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700">Reference</TableHead>
            <TableHead className="font-semibold text-slate-700">Customer</TableHead>
            <TableHead className="font-semibold text-slate-700">Flags</TableHead>
            <TableHead className="font-semibold text-slate-700">Risk Score</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700">Actor</TableHead>
            <TableHead className="font-semibold text-slate-700">Received</TableHead>
            <TableHead className="font-semibold text-slate-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow 
              key={caseItem.caseId} 
              className="cursor-pointer hover:bg-slate-50/50 transition-colors"
              onClick={() => navigate(`/case/${caseItem.caseId}`)}
            >
              <TableCell className="font-medium text-primary">{caseItem.caseId}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{caseItem.firstName} {caseItem.lastName}</p>
                  <p className="text-xs text-muted-foreground">{caseItem.emailAddress}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <FlagBadge type="cifas" value={caseItem.cifas} />
                  <FlagBadge type="zown" value={caseItem.zown} />
                  <FlagBadge type="auth" value={caseItem.authenticateCode} />
                </div>
              </TableCell>
              <TableCell>
                <RiskBadge level={caseItem.riskLevel} score={caseItem.riskScore} size="sm" />
              </TableCell>
              <TableCell>
                <StatusBadge status={caseItem.status} />
              </TableCell>
              <TableCell>
                <ActorIndicator 
                  actor={caseItem.confidenceScore && caseItem.confidenceScore >= 85 ? 'ai' : 'human'} 
                  size="sm" 
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(caseItem.receivedDateTime), "dd/MM/yy")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {queue === 'day-0' && caseItem.status !== 'Completed' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={(e) => handleMoveToDay7(e, caseItem.caseId)}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Day-7
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/case/${caseItem.caseId}`);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestigationTable;
