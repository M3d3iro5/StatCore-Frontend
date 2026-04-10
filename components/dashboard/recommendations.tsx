"use client";

import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RecommendationsProps {
  data: Recommendation[];
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-slate-600 border-l-4 border-amber-600",
    iconColor: "text-amber-500",
    label: "Atenção",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-slate-600 border-l-4 border-emerald-600",
    iconColor: "text-emerald-400",
    label: "OK",
  },
  critical: {
    icon: Zap,
    bg: "bg-slate-600 border-l-4 border-red-600",
    iconColor: "text-red-400",
    label: "Crítico",
  },
};

export function Recommendations({ data }: RecommendationsProps) {
  const safeData = Array.isArray(data) ? data.slice(0, 2) : []; // Limitar a 2 recomendações

  if (safeData.length === 0) return null;

  return (
    <Card className="border-0 bg-slate-700 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-100 text-sm font-semibold uppercase tracking-wider">
          Recomendações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {safeData.map((rec, i) => {
          if (!rec || !rec.type) return null;
          const config = typeConfig[rec.type as keyof typeof typeConfig];
          if (!config) return null;
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-all",
                config.bg,
              )}
            >
              <Icon
                className={cn("h-4 w-4 mt-0.5 shrink-0", config.iconColor)}
              />
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-semibold", config.iconColor)}>
                  {config.label}
                </p>
                <p className="text-xs text-slate-200 mt-0.5 line-clamp-2">
                  {rec.message}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
