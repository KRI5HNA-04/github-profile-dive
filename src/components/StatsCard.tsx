
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  previousValue?: number | string;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

const StatsCard = ({
  title,
  value,
  previousValue,
  icon,
  className,
  trend = "neutral",
}: StatsCardProps) => {
  const percentChange = useMemo(() => {
    if (previousValue === undefined || typeof value !== "number" || typeof previousValue !== "number") {
      return null;
    }
    
    if (previousValue === 0) return value > 0 ? 100 : 0;
    
    const change = ((value - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  }, [value, previousValue]);

  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-muted-foreground",
  };

  const trendArrow = {
    up: "↑",
    down: "↓",
    neutral: "",
  };

  return (
    <div className={cn("glass-card animate-slide-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {percentChange !== null && (
            <div className={cn("text-xs mt-1 flex items-center", trendColors[trend])}>
              <span>{trendArrow[trend]}</span>
              <span className="ml-1">{percentChange}%</span>
              <span className="ml-1 text-muted-foreground">vs previous</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
