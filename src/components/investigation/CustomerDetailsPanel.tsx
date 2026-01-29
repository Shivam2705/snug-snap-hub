import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerCase } from "@/data/mockCases";
import { format } from "date-fns";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import FlagBadge from "./FlagBadge";

interface CustomerDetailsPanelProps {
  caseData: CustomerCase;
}

const CustomerDetailsPanel = ({ caseData }: CustomerDetailsPanelProps) => {
  return (
    <Card className="border-0 shadow-md bg-[#181C23] border-[#12151B]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <div className="p-1.5 bg-[#4DA3FF]/10 rounded-lg">
            <User className="h-4 w-4 text-[#4DA3FF]" />
          </div>
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Full Name</p>
              <p className="font-medium text-white">{caseData.firstName} {caseData.lastName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Date of Birth</p>
              <p className="font-medium text-white">{format(new Date(caseData.birthDate), "dd MMMM yyyy")}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-sm break-all text-slate-300">{caseData.emailAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="font-medium text-white">{caseData.mobileNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Address</p>
              <p className="font-medium text-sm text-slate-300">{caseData.address}</p>
            </div>
          </div>
        </div>

        {/* Triggered Flags */}
        <div className="pt-3 border-t border-[#12151B]">
          <p className="text-xs text-slate-500 mb-2">Triggered Flags</p>
          <div className="flex flex-wrap gap-1.5">
            <FlagBadge type="cifas" value={caseData.cifas} size="md" />
            <FlagBadge type="zown" value={caseData.zown} size="md" />
            <FlagBadge type="auth" value={caseData.authenticateCode} size="md" />
            <FlagBadge type="noc" value={caseData.noc} size="md" />
          </div>
        </div>

        {/* Case Metadata */}
        <div className="pt-3 border-t border-[#12151B] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Received</span>
            <span className="font-medium text-white">
              {format(new Date(caseData.receivedDateTime), "dd/MM/yy HH:mm")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Assigned To</span>
            <span className="font-medium text-white">{caseData.assignTo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Days Open</span>
            <span className="font-medium text-white">{caseData.daysSinceReceived}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsPanel;