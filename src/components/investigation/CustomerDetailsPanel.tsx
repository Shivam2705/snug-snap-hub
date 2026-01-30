import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerCase } from "@/data/mockCases";
import { format } from "date-fns";
import { User, Mail, Phone, MapPin, Calendar, Plus, X } from "lucide-react";
import FlagBadge from "./FlagBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomerDetailsPanelProps {
  caseData: CustomerCase;
  onFlagsChange?: (flags: { cifas: boolean; noc: boolean; zown: boolean }) => void;
}

const CustomerDetailsPanel = ({ caseData, onFlagsChange }: CustomerDetailsPanelProps) => {
  const [flags, setFlags] = useState({
    cifas: caseData.cifas,
    noc: caseData.noc,
    zown: caseData.zown
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleFlagToggle = (flagType: 'cifas' | 'noc' | 'zown') => {
    const newFlags = { ...flags, [flagType]: !flags[flagType] };
    setFlags(newFlags);
    onFlagsChange?.(newFlags);
    
    const flagName = flagType.toUpperCase();
    const action = newFlags[flagType] ? 'added' : 'removed';
    toast.success(`${flagName} flag ${action} for case ${caseData.caseId}`);
  };

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

        {/* Triggered Flags with Edit Option */}
        <div className="pt-3 border-t border-[#12151B]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500">Triggered Flags</p>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-[#4DA3FF] hover:text-[#4DA3FF] hover:bg-[#4DA3FF]/10"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Edit Flags
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-56 bg-[#181C23] border-[#12151B]" 
                align="end"
              >
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white">Manage Flags</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="cifas" 
                        checked={flags.cifas}
                        onCheckedChange={() => handleFlagToggle('cifas')}
                        className="border-[#FF4757] data-[state=checked]:bg-[#FF4757] data-[state=checked]:border-[#FF4757]"
                      />
                      <Label 
                        htmlFor="cifas" 
                        className="text-sm text-slate-300 cursor-pointer flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#FF4757]" />
                        CIFAS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="noc" 
                        checked={flags.noc}
                        onCheckedChange={() => handleFlagToggle('noc')}
                        className="border-[#FFA502] data-[state=checked]:bg-[#FFA502] data-[state=checked]:border-[#FFA502]"
                      />
                      <Label 
                        htmlFor="noc" 
                        className="text-sm text-slate-300 cursor-pointer flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#FFA502]" />
                        NOC
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="zown" 
                        checked={flags.zown}
                        onCheckedChange={() => handleFlagToggle('zown')}
                        className="border-[#4DA3FF] data-[state=checked]:bg-[#4DA3FF] data-[state=checked]:border-[#4DA3FF]"
                      />
                      <Label 
                        htmlFor="zown" 
                        className="text-sm text-slate-300 cursor-pointer flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#4DA3FF]" />
                        ZOWN
                      </Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {flags.cifas && (
              <div className="flex items-center gap-1 bg-[#FF4757]/10 text-[#FF4757] border border-[#FF4757]/20 rounded-full px-2 py-0.5">
                <span className="text-sm font-medium">CIFAS</span>
                <button 
                  onClick={() => handleFlagToggle('cifas')}
                  className="hover:bg-[#FF4757]/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {flags.zown && (
              <div className="flex items-center gap-1 bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/20 rounded-full px-2 py-0.5">
                <span className="text-sm font-medium">ZOWN</span>
                <button 
                  onClick={() => handleFlagToggle('zown')}
                  className="hover:bg-[#4DA3FF]/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {flags.noc && (
              <div className="flex items-center gap-1 bg-[#FFA502]/10 text-[#FFA502] border border-[#FFA502]/20 rounded-full px-2 py-0.5">
                <span className="text-sm font-medium">NOC</span>
                <button 
                  onClick={() => handleFlagToggle('noc')}
                  className="hover:bg-[#FFA502]/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <FlagBadge type="auth" value={caseData.authenticateCode} size="md" />
            {!flags.cifas && !flags.zown && !flags.noc && (
              <span className="text-xs text-slate-500 italic">No flags triggered</span>
            )}
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