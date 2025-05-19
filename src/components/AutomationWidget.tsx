// src\components\AutomationWidget.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from '@/components/ui/button';

interface AutomationWidgetProps {
  title: string;
  description: string;
  status: "active" | "paused" | "completed";
  progress: number;
  onConfigure?: () => void; // optional configure action replacing switch
  hidePercentSign?: boolean; // new flag to hide percentage text
  className?: string;
}

const AutomationWidget = ({ title, description, status, progress, onConfigure, hidePercentSign = false, className }: AutomationWidgetProps) => {
  const [isEnabled, setIsEnabled] = useState(status === "active");
  
  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "paused":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Paused</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={cn("bg-honeygain-card border-[#2d3749]", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-honeygain" />
            <CardTitle className="text-md">{title}</CardTitle>
          </div>
          {/* If onConfigure provided, show button, else show switch */}
          {onConfigure ? (
            <Button size="sm" className="bg-honeygain text-white hover:bg-honeygain-dark" onClick={onConfigure}>
              Configure
            </Button>
          ) : (
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-honeygain"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-honeygain-muted mb-4">{description}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">{getStatusBadge()}</div>
          <div className="text-sm text-honeygain-muted">
            {progress}{!hidePercentSign && "%"}
          </div>
        </div>
        <Progress value={progress} className="h-1.5 bg-[#2d3749]" indicatorClassName="bg-honeygain" />
      </CardContent>
    </Card>
  );
};

export default AutomationWidget;
