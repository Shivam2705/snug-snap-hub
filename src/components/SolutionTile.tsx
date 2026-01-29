import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Agent {
  name: string;
}

interface SolutionTileProps {
  title: string;
  description: string;
  agents: Agent[];
  icon: LucideIcon;
  href: string;
  processHref?: string;
  accentColor?: "blue" | "teal" | "green";
}

const SolutionTile = ({ 
  title, 
  description, 
  agents, 
  icon: Icon, 
  href, 
  processHref,
  accentColor = "blue"
}: SolutionTileProps) => {
  return (
    <Card className="group card-glow relative overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <Badge 
            variant="outline" 
            className="text-xs bg-primary/10 text-primary border-primary/30 font-medium"
          >
            {agents.length} Agents
          </Badge>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-5 relative z-10">
        <div className="flex flex-wrap gap-2">
          {agents.slice(0, 4).map((agent, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-secondary/50 text-foreground/70 border-0"
            >
              {agent.name}
            </Badge>
          ))}
          {agents.length > 4 && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-secondary/50 text-foreground/70 border-0"
            >
              +{agents.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="flex-1 group/btn bg-primary hover:bg-primary/90">
            <Link to={href}>
              Explore
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          {processHref && (
            <Button asChild variant="outline" className="flex-1 group/btn border-border/50 hover:bg-secondary/50">
              <Link to={processHref}>
                View Process
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SolutionTile;
