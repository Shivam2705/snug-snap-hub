import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerCase, QueueType, CaseStatus } from "@/data/mockCases";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowUpDown, Search, X } from "lucide-react";
import { FlagFilter } from "./FlagCountCards";
import { cn } from "@/lib/utils";

interface InvestigationTableProps {
  cases: CustomerCase[];
  queue: QueueType;
  onMoveToDay7?: (caseId: string) => void;
  statusFilter?: CaseStatus | null;
  flagFilter?: FlagFilter;
}

type SortField = 'caseId' | 'firstName' | 'lastName' | 'receivedDateTime' | 'status' | 'assignTo';
type SortDirection = 'asc' | 'desc';

const InvestigationTable = ({ cases, queue, onMoveToDay7, statusFilter, flagFilter }: InvestigationTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('receivedDateTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [localStatusFilter, setLocalStatusFilter] = useState<string>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), "dd/MM/yy HH:mm");
  };

  const filteredAndSortedCases = useMemo(() => {
    let result = [...cases];

    // Apply external status filter from tiles
    if (statusFilter) {
      result = result.filter(c => c.status === statusFilter);
    }

    // Apply external flag filter from tiles
    if (flagFilter) {
      result = result.filter(c => {
        switch (flagFilter) {
          case 'cifas': return c.cifas;
          case 'noc': return c.noc;
          case 'auth2': return c.authenticateCode === 2;
          case 'auth3': return c.authenticateCode === 3;
          case 'auth4': return c.authenticateCode === 4;
          case 'zown': return c.zown;
          default: return true;
        }
      });
    }

    // Apply local status filter
    if (localStatusFilter !== 'all') {
      result = result.filter(c => c.status === localStatusFilter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.caseId.toLowerCase().includes(term) ||
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.emailAddress.toLowerCase().includes(term) ||
        c.mobileNumber.toLowerCase().includes(term) ||
        c.assignTo.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortField) {
        case 'caseId':
          aVal = a.caseId;
          bVal = b.caseId;
          break;
        case 'firstName':
          aVal = a.firstName;
          bVal = b.firstName;
          break;
        case 'lastName':
          aVal = a.lastName;
          bVal = b.lastName;
          break;
        case 'receivedDateTime':
          aVal = new Date(a.receivedDateTime).getTime();
          bVal = new Date(b.receivedDateTime).getTime();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'assignTo':
          aVal = a.assignTo;
          bVal = b.assignTo;
          break;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [cases, searchTerm, sortField, sortDirection, localStatusFilter, statusFilter, flagFilter]);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="font-semibold text-white whitespace-nowrap cursor-pointer hover:bg-slate-800 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn(
          "h-3 w-3 transition-opacity",
          sortField === field ? "opacity-100" : "opacity-40"
        )} />
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#181C23] border-[#12151B] text-white placeholder:text-slate-500"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-700"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Select value={localStatusFilter} onValueChange={setLocalStatusFilter}>
          <SelectTrigger className="w-[180px] bg-[#181C23] border-[#12151B] text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[#181C23] border-[#12151B]">
            <SelectItem value="all" className="text-white hover:bg-slate-700">All Statuses</SelectItem>
            <SelectItem value="Not Started" className="text-white hover:bg-slate-700">Not Started</SelectItem>
            <SelectItem value="In Progress" className="text-white hover:bg-slate-700">In Progress</SelectItem>
            <SelectItem value="Review Required" className="text-white hover:bg-slate-700">Review Required</SelectItem>
            <SelectItem value="Completed" className="text-white hover:bg-slate-700">Completed</SelectItem>
            <SelectItem value="Awaiting Customer" className="text-white hover:bg-slate-700">Awaiting Customer</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-slate-400">
          {filteredAndSortedCases.length} of {cases.length} cases
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#12151B] bg-[#181C23] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#0B0D10] hover:bg-[#0B0D10] border-b border-[#12151B]">
                <SortableHeader field="caseId">Case ID</SortableHeader>
                <SortableHeader field="firstName">First Name</SortableHeader>
                <SortableHeader field="lastName">Last Name</SortableHeader>
                <TableHead className="font-semibold text-white whitespace-nowrap">Email Address</TableHead>
                <TableHead className="font-semibold text-white whitespace-nowrap">Mobile Number</TableHead>
                <TableHead className="font-semibold text-white whitespace-nowrap">Flagged</TableHead>
                <SortableHeader field="receivedDateTime">Received Date & Time</SortableHeader>
                <TableHead className="font-semibold text-white whitespace-nowrap">Completion Date & Time</TableHead>
                <SortableHeader field="assignTo">Assign To</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCases.map((caseItem) => (
                <TableRow
                  key={caseItem.caseId}
                  className="cursor-pointer hover:bg-[#12151B] transition-colors border-b border-[#12151B]"
                  onClick={() => navigate(`/case/${caseItem.caseId}`)}
                >
                  <TableCell className="font-medium text-[#4DA3FF] whitespace-nowrap">{caseItem.caseId}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-300">{caseItem.firstName}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-300">{caseItem.lastName}</TableCell>
                  <TableCell className="text-sm text-slate-300">{caseItem.emailAddress}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-300">{caseItem.mobileNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-nowrap">
                      {caseItem.cifas && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF4757]/20 text-[#FF4757]">
                          CIFAS
                        </span>
                      )}
                      {caseItem.noc && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFA502]/20 text-[#FFA502]">
                          NOC
                        </span>
                      )}
                      {caseItem.authenticateCode && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#4DA3FF]/20 text-[#4DA3FF]">
                          Auth {caseItem.authenticateCode}
                        </span>
                      )}
                      {caseItem.zown && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                          ZOWN
                        </span>
                      )}
                      {!caseItem.cifas && !caseItem.noc && !caseItem.authenticateCode && !caseItem.zown && (
                        <span className="text-slate-500 text-xs italic">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-slate-300">
                    {formatDateTime(caseItem.receivedDateTime)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-slate-300">
                    {formatDateTime(caseItem.completionDateTime)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={caseItem.assignTo === 'Unassigned' ? 'text-slate-500 italic' : 'text-slate-300'}>
                      {caseItem.assignTo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={caseItem.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedCases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                    No cases found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InvestigationTable;
