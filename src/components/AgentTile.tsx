import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, LucideIcon, CheckCircle2 } from "lucide-react";

interface AgentTileProps {
  id: string;
  name: string;
  purpose: string;
  capabilities: string[];
  savings: string[];
  icon: LucideIcon;
  onRun: (agentId: string) => void;
  disabled?: boolean;
}

const AgentTile = ({ id, name, purpose, capabilities, savings, icon: Icon, onRun, disabled = false }: AgentTileProps) => {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 ${false ? 'opacity-60' : 'hover:shadow-lg hover:-translate-y-1'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 gradient-exl opacity-10 rounded-bl-full transition-all duration-300 group-hover:opacity-20" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-3 flex-shrink-0 ${false ? 'bg-muted' : 'gradient-exl'}`}>
            <Icon className={`h-7 w-7 ${false ? 'text-muted-foreground' : 'text-white'}`} />
          </div>
          <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
            AI Agent
          </Badge>
        </div>
        <CardTitle className={`text-lg leading-tight ${false ? 'text-muted-foreground' : ''}`}>{name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{purpose}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Capabilities</p>
          <ul className="space-y-1">
            {capabilities.slice(0, 3).map((capability, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{capability}</span>
              </li>
            ))}
            {capabilities.length > 3 && (
              <li className="text-xs text-muted-foreground pl-5">
                +{capabilities.length - 3} more capabilities
              </li>
            )}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {savings.slice(0, 2).map((saving, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-success/5 text-success border-success/20">
              {saving}
            </Badge>
          ))}
        </div>
        
        <Button 
          onClick={() => !disabled && onRun(id)} 
          className="w-full group/btn"
          variant="default"
          disabled={disabled}
        >
          <Play className="mr-2 h-4 w-4" />
          Try Agent
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentTile;
