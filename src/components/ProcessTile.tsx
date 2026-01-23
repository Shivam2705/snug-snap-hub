import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Agent {
  name: string;
}

interface ProcessTileProps {
  title: string;
  description: string;
  agents: Agent[];
  icon: LucideIcon;
  href: string;
  color?: string;
}

const ProcessTile = ({ title, description, agents, icon: Icon, href, color = "primary" }: ProcessTileProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-32 h-32 gradient-exl opacity-10 rounded-bl-full transition-all duration-300 group-hover:opacity-20" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-lg gradient-exl flex items-center justify-center mb-3">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {agents.length} Agents
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {agents.slice(0, 4).map((agent, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-muted/50">
              {agent.name}
            </Badge>
          ))}
          {agents.length > 4 && (
            <Badge variant="outline" className="text-xs bg-muted/50">
              +{agents.length - 4} more
            </Badge>
          )}
        </div>
        
        <Button asChild className="w-full group/btn">
          <Link to={href}>
            Go to Process
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcessTile;