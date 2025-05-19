
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  title: string;
  icon: "gathering" | "delivery";
  value: number;
  unit: string;
  className?: string;
}

const ActivityCard = ({ title, icon, value, unit, className }: ActivityCardProps) => {
  const iconComponent = icon === "gathering" ? (
    <Database className="h-5 w-5 text-blue-400" />
  ) : (
    <Cloud className="h-5 w-5 text-blue-400" />
  );

  return (
    <Card className={cn("bg-honeygain-card border-[#2d3749]", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {iconComponent}
          <span className="text-honeygain-muted">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-xl font-bold mb-2">
          {value} {unit}
        </div>
        <Progress value={75} className="h-2 bg-[#2d3749]" indicatorClassName="bg-blue-400" />
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
