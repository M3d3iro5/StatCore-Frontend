"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ruler,
  ArrowDown,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AnalysisData } from "@/lib/types";
import { getERFColor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function AnimatedNumber({
  value,
  decimals = 2,
  duration = 1200,
}: {
  value: number;
  decimals?: number;
  duration?: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + (end - start) * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="font-mono tabular-nums">{current.toFixed(decimals)}</span>
  );
}

interface KPICardsProps {
  data: Partial<AnalysisData & { erfValue?: number; confidence?: number }>;
}

const statusConfig = {
  OK: {
    label: "SEGURO",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
  ATTENTION: {
    label: "ATENCAO",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  CRITICAL: {
    label: "CRITICO",
    color: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/20",
  },
  warning: {
    label: "ATENCAO",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  good: {
    label: "SEGURO",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
  critical: {
    label: "CRITICO",
    color: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/20",
  },
};

export function KPICards({ data }: KPICardsProps) {
  if (!data) {
    return null;
  }

  const erfValue = data.erf ?? data.erfValue ?? 0;
  const erfColor = getERFColor(erfValue);
  const statusKey = (data.status as keyof typeof statusConfig) || "warning";
  const status = statusConfig[statusKey] || statusConfig["warning"];

  const cards = [
    {
      title: "ERF Score",
      value: erfValue,
      decimals: 2,
      subtitle: "Equivalent Remaining Fraction",
      icon: Activity,
      color: erfColor,
      trend: "-0.01 vs anterior",
      trendIcon: TrendingDown,
    },
    {
      title: "Status de Risco",
      value: null,
      label: status?.label || "DESCONHECIDO",
      subtitle: "Classificacao atual",
      icon: AlertTriangle,
      color: erfColor,
      statusBg: status?.bg || "bg-gray-10",
      statusColor: status?.color || "text-gray-600",
      statusBorder: status?.border || "border-gray-20",
    },
    {
      title: "Comprimento",
      value: data.length ?? 0,
      decimals: 1,
      unit: "mm",
      subtitle: "Defeito detectado",
      icon: Ruler,
      color: "#3B82F6",
    },
    {
      title: "Profundidade",
      value: data.depth ?? 0,
      decimals: 1,
      unit: "mm",
      subtitle: `Espessura: ${data.thickness ?? 0} mm`,
      icon: ArrowDown,
      color: "#3B82F6",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card
          key={card.title}
          className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </p>
                {card.value !== null && card.value !== undefined ? (
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-foreground">
                      <AnimatedNumber
                        value={card.value}
                        decimals={card.decimals}
                      />
                    </span>
                    {card.unit && (
                      <span className="text-sm font-medium text-muted-foreground">
                        {card.unit}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-bold tracking-wide",
                        card.statusBg,
                        card.statusColor,
                        card.statusBorder,
                        "border",
                      )}
                    >
                      {card.label}
                    </span>
                  </div>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
                {card.trend && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    {card.trendIcon && <card.trendIcon className="h-3 w-3" />}
                    <span>{card.trend}</span>
                  </div>
                )}
              </div>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
            </div>
          </CardContent>
          <div
            className="absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300 group-hover:h-1"
            style={{ backgroundColor: card.color }}
          />
        </Card>
      ))}
    </div>
  );
}
