import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink, Clock, User, MessageSquare, Calendar } from "lucide-react";
import { Tender } from "@/types/tender";

interface TenderCardProps {
  tender: Tender;
}

export const TenderCard = ({ tender }: TenderCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm group relative overflow-hidden">
      {/* Animated glow on hover */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                #{tender.number}
              </span>
              <StatusBadge status={tender.status} timeLeft={tender.time_left} />
            </div>
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors leading-snug">
              {tender.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {tender.contact}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
              <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">Time Remaining</div>
                <div className="text-muted-foreground">{tender.time_left}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
              <Calendar className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">Closing Date</div>
                <div className="text-muted-foreground">{formatDate(tender.close_date)}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
              <MessageSquare className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">Responses</div>
                <div className="text-muted-foreground">
                  All: {tender.all_responses} | Company: {tender.company_responses}
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="default"
            className="w-full bg-gradient-primary hover:opacity-90 transition-all shadow-lg hover:shadow-glow"
            onClick={() => window.open(tender.url, "_blank")}
          >
            View Tender Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
