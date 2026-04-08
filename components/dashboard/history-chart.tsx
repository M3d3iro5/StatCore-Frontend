"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
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
import type { ERFHistoryEntry } from "@/lib/types";
import { getERFColor } from "@/lib/mock-data";

interface HistoryChartProps {
  data: ERFHistoryEntry[];
}

export function HistoryChart({ data }: HistoryChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  const formattedData = safeData.map((d) => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <Card
      className="overflow-hidden border-border/50 bg-card animate-fade-in-up"
      style={{ animationDelay: "700ms" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Evolucao Historica do ERF
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/70">
          Ultimas 10 analises com classificacao de risco
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            erf: {
              label: "ERF",
              color: "#3B82F6",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="displayDate"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8" }}
                angle={-25}
                textAnchor="end"
                height={45}
              />
              <YAxis
                domain={[0, 1]}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8" }}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span>
                        ERF:{" "}
                        <strong className="font-mono">
                          {Number(value).toFixed(2)}
                        </strong>
                      </span>
                    )}
                  />
                }
              />
              <ReferenceLine
                y={0.8}
                stroke="#10B981"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <ReferenceLine
                y={0.6}
                stroke="#EF4444"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <Bar dataKey="erf" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getERFColor(entry.erf)}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-3 flex items-center justify-center gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded-full bg-[#10B981]" />
            <span>Limite Seguro (0.8)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded-full bg-[#EF4444]" />
            <span>Limite Critico (0.6)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
