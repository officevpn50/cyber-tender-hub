import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  timeLeft: string;
}

export const StatusBadge = ({ status, timeLeft }: StatusBadgeProps) => {
  const getVariant = () => {
    if (status.toLowerCase() === "sealed") {
      return "destructive";
    }
    
    // Check if deadline is approaching (less than 3 days)
    const daysMatch = timeLeft.match(/(\d+)\s*days?/i);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      if (days <= 2) {
        return "warning";
      }
    }
    
    return "success";
  };

  return (
    <Badge variant={getVariant()} className="font-medium">
      {status}
    </Badge>
  );
};
