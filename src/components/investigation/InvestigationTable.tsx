import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerCase, QueueType } from "@/data/mockCases";
import StatusBadge from "@/components/StatusBadge";
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

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), "dd/MM/yy HH:mm");
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Case ID</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">First Name</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Last Name</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Birth Date</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Email Address</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Mobile Number</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Address</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Flagged</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Received Date & Time</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Completion Date & Time</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Assign To</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow 
                key={caseItem.caseId} 
                className="cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => navigate(`/case/${caseItem.caseId}`)}
              >
                <TableCell className="font-medium text-primary whitespace-nowrap">{caseItem.caseId}</TableCell>
                <TableCell className="whitespace-nowrap">{caseItem.firstName}</TableCell>
                <TableCell className="whitespace-nowrap">{caseItem.lastName}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(caseItem.birthDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-sm">{caseItem.emailAddress}</TableCell>
                <TableCell className="whitespace-nowrap">{caseItem.mobileNumber}</TableCell>
                <TableCell className="max-w-[200px] truncate text-sm" title={caseItem.address}>
                  {caseItem.address}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {caseItem.cifas && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                        CIFAS
                      </span>
                    )}
                    {caseItem.noc && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        NOC
                      </span>
                    )}
                    {caseItem.authenticateCode && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Auth {caseItem.authenticateCode}
                      </span>
                    )}
                    {caseItem.zown && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        ZOWN
                      </span>
                    )}
                    {!caseItem.cifas && !caseItem.noc && !caseItem.authenticateCode && !caseItem.zown && (
                      <span className="text-slate-400 text-xs italic">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {formatDateTime(caseItem.receivedDateTime)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {formatDateTime(caseItem.completionDateTime)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className={caseItem.assignTo === 'Unassigned' ? 'text-muted-foreground italic' : ''}>
                    {caseItem.assignTo}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={caseItem.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {queue === 'day-0' && caseItem.status !== 'Completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs whitespace-nowrap"
                        onClick={(e) => handleMoveToDay7(e, caseItem.caseId)}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Move to Day-7
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
    </div>
  );
};

export default InvestigationTable;
