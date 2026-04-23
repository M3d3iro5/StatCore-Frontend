"use client";

import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useVidaRemanescente } from "@/hooks/use-api";

interface RecommendationsProps {
  data?: (
    | Recommendation
    | {
        title: string;
        description: string;
        priority: "low" | "medium" | "high";
      }
  )[];
  vidaRemanescente?: number;
  erfStatus?: string;
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

const priorityToTypeMap = {
  high: "critical",
  medium: "warning",
  low: "success",
} as const;

export function Recommendations({
  data,
  vidaRemanescente: propVida,
  erfStatus = "warning",
}: RecommendationsProps) {
  const { vidaRemanescente: hookVida } = useVidaRemanescente();

  // Extrair vida remanescente em anos como número
  let anosRemanescentes: number = propVida || 0;
  if (!propVida && hookVida?.vida_remanescente?.dias_remanescentes) {
    anosRemanescentes = Number(
      (hookVida.vida_remanescente.dias_remanescentes / 365).toFixed(1),
    );
  }

  // Se não houver dados específicos, gerar recomendações baseadas em vida remanescente
  let recsToShow = data;

  if (!recsToShow || recsToShow.length === 0) {
    recsToShow = [];

    // Gerar recomendações baseadas na vida remanescente
    if (anosRemanescentes < 1) {
      recsToShow.push({
        title: "CRÍTICO",
        description: `Vida remanescente: ${anosRemanescentes.toFixed(2)} anos - Inspeção urgente necessária`,
        priority: "high",
      });
    } else if (anosRemanescentes < 2) {
      recsToShow.push({
        title: "ATENÇÃO",
        description: `Vida remanescente: ${anosRemanescentes.toFixed(2)} anos - Schedule inspeção em breve`,
        priority: "medium",
      });
    } else if (anosRemanescentes < 5) {
      recsToShow.push({
        title: "INFORMAÇÃO",
        description: `Vida remanescente: ${anosRemanescentes.toFixed(2)} anos - Monitorar regularmente`,
        priority: "low",
      });
    } else {
      recsToShow.push({
        title: "OK",
        description: `Vida remanescente: ${anosRemanescentes.toFixed(2)} anos - Operação normal`,
        priority: "low",
      });
    }
  }

  const safeData = Array.isArray(recsToShow) ? recsToShow.slice(0, 5) : [];

  if (safeData.length === 0)
    return (
      <Card className="border-0 bg-slate-700 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-100 text-sm font-semibold uppercase tracking-wider">
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-400">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <p className="text-sm">✅ Operação normal</p>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card className="border-0 bg-slate-700 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-100 text-sm font-semibold uppercase tracking-wider">
          Recomendações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {safeData.map((rec, i) => {
          if (!rec) return null;

          // Suportar dois formatos: antigo (type/message) e novo (priority/title/description)
          const isNewFormat = "priority" in rec && "title" in rec;
          const priority = isNewFormat
            ? (rec as any).priority || "medium"
            : undefined;
          const typeKey = isNewFormat
            ? priorityToTypeMap[priority as keyof typeof priorityToTypeMap] ||
              "warning"
            : (rec as any).type || "warning";

          const config = typeConfig[typeKey as keyof typeof typeConfig];
          if (!config) return null;

          const Icon = config.icon;
          const title = isNewFormat ? (rec as any).title : config.label;
          const message = isNewFormat
            ? (rec as any).description
            : (rec as any).message;

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
                  {title}
                </p>
                <p className="text-xs text-slate-200 mt-0.5 line-clamp-2">
                  {message}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
