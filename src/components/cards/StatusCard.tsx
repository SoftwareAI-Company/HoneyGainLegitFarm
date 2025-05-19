// src/components/cards/StatusCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  status: "active" | "paused" | "queue";
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

const StatusCard = ({ status, enabled, onToggle, className }: StatusCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "paused":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Paused</Badge>;
      case "queue":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">In queue</Badge>;
      default:
        return null;
    }
  };

  // Disable switch while in queue state until final status is updated
  const isDisabled = status === 'queue';

  return (
    <Card className={cn("bg-honeygain-card border-[#2d3749]", className)}>
      <CardContent className="pt-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Status:</span>
          {getStatusBadge()}
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={onToggle}
          disabled={isDisabled}
          className="data-[state=checked]:bg-honeygain"
        />
      </CardContent>
    </Card>
  );
};

export default StatusCard;
