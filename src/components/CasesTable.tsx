import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerCase } from "@/data/mockCases";
import StatusBadge from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface CasesTableProps {
  cases: CustomerCase[];
}

const CasesTable = ({ cases }: CasesTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Case ID</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Birth Date</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Mobile</TableHead>
            <TableHead className="font-semibold">CIFAS</TableHead>
            <TableHead className="font-semibold">NOC</TableHead>
            <TableHead className="font-semibold">Auth Code</TableHead>
            <TableHead className="font-semibold">ZOWN</TableHead>
            <TableHead className="font-semibold">Received</TableHead>
            <TableHead className="font-semibold">Assigned To</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow 
              key={caseItem.caseId} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/case/${caseItem.caseId}`)}
            >
              <TableCell className="font-medium text-primary">{caseItem.caseId}</TableCell>
              <TableCell>{caseItem.firstName} {caseItem.lastName}</TableCell>
              <TableCell>{format(new Date(caseItem.birthDate), "dd/MM/yyyy")}</TableCell>
              <TableCell className="max-w-[150px] truncate">{caseItem.emailAddress}</TableCell>
              <TableCell>{caseItem.mobileNumber}</TableCell>
              <TableCell>
                <Badge variant={caseItem.cifas ? "destructive" : "secondary"} className="text-xs">
                  {caseItem.cifas ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={caseItem.noc ? "default" : "secondary"} className="text-xs">
                  {caseItem.noc ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs font-mono">
                  {caseItem.authenticateCode}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={caseItem.zown ? "default" : "secondary"} className="text-xs">
                  {caseItem.zown ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(caseItem.receivedDateTime), "dd/MM/yy HH:mm")}
              </TableCell>
              <TableCell>{caseItem.assignTo}</TableCell>
              <TableCell>
                <StatusBadge status={caseItem.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CasesTable;