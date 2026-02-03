import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerCase } from "@/data/mockCases";
import { format } from "date-fns";
import { User, Mail, Phone, MapPin, Calendar, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import FlagBadge from "./FlagBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CollapsibleCustomerDetailsProps {
  caseData: CustomerCase;
  onFlagsChange?: (flags: { cifas: boolean; noc: boolean; zown: boolean }) => void;
}

const CollapsibleCustomerDetails = ({ caseData, onFlagsChange }: CollapsibleCustomerDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true);
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-0 shadow-md bg-[#181C23] border-[#12151B] mb-6">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1a1f28] transition-colors rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#4DA3FF]/10 rounded-lg">
                <User className="h-5 w-5 text-[#4DA3FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Customer Details</h3>
                <p className="text-sm text-slate-400">
                  {caseData.firstName} {caseData.lastName} • {caseData.mobileNumber}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              {isOpen ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Minimize
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-t border-[#12151B] pt-4">
              {/* Full Name */}
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Full Name</p>
                  <p className="font-medium text-white text-sm">{caseData.firstName} {caseData.lastName}</p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Date of Birth</p>
                  <p className="font-medium text-white text-sm">{format(new Date(caseData.birthDate), "dd MMM yyyy")}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-sm text-slate-300 truncate max-w-[150px]" title={caseData.emailAddress}>
                    {caseData.emailAddress}
                  </p>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="font-medium text-white text-sm">{caseData.mobileNumber}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-medium text-sm text-slate-300 truncate max-w-[180px]" title={caseData.address}>
                    {caseData.address}
                  </p>
                </div>
              </div>

              {/* Flags */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-slate-500">Flags</p>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 px-1.5 text-xs text-[#4DA3FF] hover:text-[#4DA3FF] hover:bg-[#4DA3FF]/10"
                      >
                        <Plus className="h-3 w-3" />
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
                              id="cifas-top" 
                              checked={flags.cifas}
                              onCheckedChange={() => handleFlagToggle('cifas')}
                              className="border-[#FF4757] data-[state=checked]:bg-[#FF4757] data-[state=checked]:border-[#FF4757]"
                            />
                            <Label 
                              htmlFor="cifas-top" 
                              className="text-sm text-slate-300 cursor-pointer flex items-center gap-2"
                            >
                              <span className="w-2 h-2 rounded-full bg-[#FF4757]" />
                              CIFAS
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id="noc-top" 
                              checked={flags.noc}
                              onCheckedChange={() => handleFlagToggle('noc')}
                              className="border-[#FFA502] data-[state=checked]:bg-[#FFA502] data-[state=checked]:border-[#FFA502]"
                            />
                            <Label 
                              htmlFor="noc-top" 
                              className="text-sm text-slate-300 cursor-pointer flex items-center gap-2"
                            >
                              <span className="w-2 h-2 rounded-full bg-[#FFA502]" />
                              NOC
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id="zown-top" 
                              checked={flags.zown}
                              onCheckedChange={() => handleFlagToggle('zown')}
                              className="border-[#4DA3FF] data-[state=checked]:bg-[#4DA3FF] data-[state=checked]:border-[#4DA3FF]"
                            />
                            <Label 
                              htmlFor="zown-top" 
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
                <div className="flex flex-wrap gap-1">
                  {flags.cifas && (
                    <div className="flex items-center gap-0.5 bg-[#FF4757]/10 text-[#FF4757] border border-[#FF4757]/20 rounded-full px-1.5 py-0.5">
                      <span className="text-xs font-medium">CIFAS</span>
                      <button 
                        onClick={() => handleFlagToggle('cifas')}
                        className="hover:bg-[#FF4757]/20 rounded-full p-0.5"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  )}
                  {flags.zown && (
                    <div className="flex items-center gap-0.5 bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/20 rounded-full px-1.5 py-0.5">
                      <span className="text-xs font-medium">ZOWN</span>
                      <button 
                        onClick={() => handleFlagToggle('zown')}
                        className="hover:bg-[#4DA3FF]/20 rounded-full p-0.5"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  )}
                  {flags.noc && (
                    <div className="flex items-center gap-0.5 bg-[#FFA502]/10 text-[#FFA502] border border-[#FFA502]/20 rounded-full px-1.5 py-0.5">
                      <span className="text-xs font-medium">NOC</span>
                      <button 
                        onClick={() => handleFlagToggle('noc')}
                        className="hover:bg-[#FFA502]/20 rounded-full p-0.5"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  )}
                  <FlagBadge type="auth" value={caseData.authenticateCode} size="sm" />
                </div>
              </div>
            </div>

            {/* Case Metadata Row */}
            <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-[#12151B]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Received:</span>
                <span className="text-xs font-medium text-white">
                  {format(new Date(caseData.receivedDateTime), "dd/MM/yy HH:mm")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Assigned To:</span>
                <span className="text-xs font-medium text-white">{caseData.assignTo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Days Open:</span>
                <span className="text-xs font-medium text-white">{caseData.daysSinceReceived}</span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CollapsibleCustomerDetails;
