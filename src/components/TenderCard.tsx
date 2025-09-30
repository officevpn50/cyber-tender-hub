import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink, Clock, User, MessageSquare } from "lucide-react";
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
    <Card className="hover:shadow-lg transition-all duration-300 border-border group">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-muted-foreground">#{tender.number}</span>
              <StatusBadge status={tender.status} timeLeft={tender.time_left} />
            </div>
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
              {tender.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {tender.contact}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <div>
                <div className="font-medium text-foreground">Time Left</div>
                <div>{tender.time_left}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <div>
                <div className="font-medium text-foreground">Responses</div>
                <div>
                  All: {tender.all_responses} | Company: {tender.company_responses}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="text-sm text-muted-foreground mb-3">
              <span className="font-medium text-foreground">Closing Date:</span>{" "}
              {formatDate(tender.close_date)}
            </div>
            <Button
              variant="default"
              className="w-full"
              onClick={() => window.open(tender.url, "_blank")}
            >
              View Tender Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
