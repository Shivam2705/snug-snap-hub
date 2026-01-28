import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileJson, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { CustomerCase, QueueType, CaseStatus, RiskLevel, FinalOutcome } from "@/data/mockCases";

interface FileUploadButtonProps {
  onDataLoaded: (cases: CustomerCase[]) => void;
}

const FileUploadButton = ({ onDataLoaded }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptType, setAcceptType] = useState<string>("");

  const handleFileSelect = (type: "csv" | "excel" | "json") => {
    const accepts: Record<string, string> = {
      csv: ".csv",
      excel: ".xlsx,.xls",
      json: ".json",
    };
    setAcceptType(accepts[type]);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const parseRow = (row: Record<string, unknown>): CustomerCase | null => {
    try {
      const caseId = String(row.caseId || row.CaseId || row["Case ID"] || "");
      if (!caseId) return null;

      const receivedDateTime = String(row.receivedDateTime || row.ReceivedDateTime || new Date().toISOString());
      const completionDateTimeRaw = row.completionDateTime || row.CompletionDateTime;
      const completionDateTime = completionDateTimeRaw ? String(completionDateTimeRaw) : null;

      const calculateDaysSince = (dateString: string): number => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };

      const calculateRiskScore = (c: Partial<CustomerCase>): number => {
        let score = 20;
        if (c.cifas) score += 35;
        if (c.noc) score += 15;
        if (c.zown) score += 20;
        if (c.authenticateCode === 4) score += 10;
        if (c.authenticateCode === 3) score += 5;
        return Math.min(score, 100);
      };

      const getRiskLevel = (score: number): RiskLevel => {
        if (score >= 70) return "high";
        if (score >= 40) return "medium";
        return "low";
      };

      const cifas = Boolean(row.cifas === true || row.cifas === "true" || row.cifas === "Yes" || row.CIFAS === true);
      const noc = Boolean(row.noc === true || row.noc === "true" || row.noc === "Yes" || row.NOC === true);
      const zown = Boolean(row.zown === true || row.zown === "true" || row.zown === "Yes" || row.ZOWN === true);
      const authCode = Number(row.authenticateCode || row.AuthenticateCode || row["Auth Code"] || 2);

      const caseData: Partial<CustomerCase> = {
        caseId,
        firstName: String(row.firstName || row.FirstName || row["First Name"] || "Unknown"),
        lastName: String(row.lastName || row.LastName || row["Last Name"] || "Customer"),
        birthDate: String(row.birthDate || row.BirthDate || row["Birth Date"] || "1990-01-01"),
        emailAddress: String(row.emailAddress || row.EmailAddress || row.Email || "unknown@email.com"),
        mobileNumber: String(row.mobileNumber || row.MobileNumber || row.Mobile || row.Phone || "+44 7700 000000"),
        address: String(row.address || row.Address || "Unknown Address"),
        cifas,
        noc,
        authenticateCode: (authCode === 2 || authCode === 3 || authCode === 4 ? authCode : 2) as 2 | 3 | 4,
        zown,
        receivedDateTime,
        completionDateTime,
        assignTo: String(row.assignTo || row.AssignTo || row["Assigned To"] || "Unassigned"),
        status: (row.status || row.Status || "Not Started") as CaseStatus,
        queue: (row.queue || row.Queue || "day-0") as QueueType,
        finalOutcome: row.finalOutcome as FinalOutcome | undefined,
      };

      const riskScore = calculateRiskScore(caseData);
      const riskLevel = getRiskLevel(riskScore);
      const daysSinceReceived = calculateDaysSince(receivedDateTime);

      return {
        ...caseData,
        riskScore,
        riskLevel,
        daysSinceReceived,
      } as CustomerCase;
    } catch (error) {
      console.error("Error parsing row:", error);
      return null;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (extension === "json") {
        const text = await file.text();
        const data = JSON.parse(text);
        const rows = Array.isArray(data) ? data : [data];
        const cases = rows.map(parseRow).filter((c): c is CustomerCase => c !== null);
        
        if (cases.length > 0) {
          onDataLoaded(cases);
          toast.success(`Loaded ${cases.length} cases from JSON file`);
        } else {
          toast.error("No valid cases found in JSON file");
        }
      } else if (extension === "csv") {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const cases = results.data
              .map((row) => parseRow(row as Record<string, unknown>))
              .filter((c): c is CustomerCase => c !== null);
            
            if (cases.length > 0) {
              onDataLoaded(cases);
              toast.success(`Loaded ${cases.length} cases from CSV file`);
            } else {
              toast.error("No valid cases found in CSV file");
            }
          },
          error: (error) => {
            console.error("CSV parse error:", error);
            toast.error("Failed to parse CSV file");
          },
        });
      } else if (extension === "xlsx" || extension === "xls") {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        const cases = data
          .map((row) => parseRow(row as Record<string, unknown>))
          .filter((c): c is CustomerCase => c !== null);
        
        if (cases.length > 0) {
          onDataLoaded(cases);
          toast.success(`Loaded ${cases.length} cases from Excel file`);
        } else {
          toast.error("No valid cases found in Excel file");
        }
      }
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Failed to process file");
    }

    // Reset file input
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptType}
        className="hidden"
        onChange={handleFileChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-slate-900 text-white border-slate-700 hover:bg-slate-800">
            <Upload className="mr-2 h-4 w-4" />
            Upload Data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleFileSelect("csv")} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Upload CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("excel")} className="cursor-pointer">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Upload Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect("json")} className="cursor-pointer">
            <FileJson className="mr-2 h-4 w-4" />
            Upload JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileUploadButton;
