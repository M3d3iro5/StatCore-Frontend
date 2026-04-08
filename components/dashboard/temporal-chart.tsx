"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TemporalPrediction } from "@/lib/types";

interface TemporalChartProps {
  data: TemporalPrediction[];
}

export function TemporalChart({ data }: TemporalChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Card
      className="overflow-hidden border-border/50 bg-card animate-fade-in-up"
      style={{ animationDelay: "500ms" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Previsao de Profundidade
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/70">
          Projecao para 365 dias com banda de confianca
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            mean: {
              label: "Media",
              color: "#3B82F6",
            },
            max: {
              label: "Maximo",
              color: "#93C5FD",
            },
            min: {
              label: "Minimo",
              color: "#93C5FD",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={safeData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradientMean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="day"
                tickFormatter={(v) => `${v}d`}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8" }}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8" }}
                tickFormatter={(v) => `${v}mm`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        mean: "Media",
                        max: "Maximo",
                        min: "Minimo",
                      };
                      return (
                        <span>
                          {labels[name as string] || name}:{" "}
                          <strong>{Number(value).toFixed(1)} mm</strong>
                        </span>
                      );
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="max"
                stroke="#93C5FD"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="url(#gradientBand)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="min"
                stroke="#93C5FD"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="mean"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fill="url(#gradientMean)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-3 flex items-center justify-center gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded-full bg-[#3B82F6]" />
            <span>Previsao Media</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded-full border border-dashed border-[#93C5FD]" />
            <span>Banda de Confianca</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
