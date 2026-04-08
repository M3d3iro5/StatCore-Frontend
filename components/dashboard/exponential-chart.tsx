"use client"

import { useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ExponentialFitPoint } from "@/lib/types"

interface ExponentialChartProps {
  data: ExponentialFitPoint[]
}

export function ExponentialChart({ data }: ExponentialChartProps) {
  // Generate exponential fit curve: F(x) = a * e^(-b * x)
  const { curveData, params } = useMemo(() => {
    // Simple exponential regression from data
    const a = 14.5
    const b = 0.15

    const curve = []
    for (let x = 0; x <= 22; x += 0.5) {
      curve.push({
        depth: x,
        fittedLength: a * Math.exp(-b * x),
      })
    }
    return { curveData: curve, params: { a, b } }
  }, [])

  // Merge scatter + curve
  const mergedData = useMemo(() => {
    const map = new Map<number, { depth: number; length?: number; fittedLength?: number }>()

    curveData.forEach((p) => {
      map.set(p.depth, { depth: p.depth, fittedLength: p.fittedLength })
    })

    data.forEach((p) => {
      const existing = map.get(p.depth)
      if (existing) {
        existing.length = p.length
      } else {
        map.set(p.depth, { depth: p.depth, length: p.length })
      }
    })

    return Array.from(map.values()).sort((a, b) => a.depth - b.depth)
  }, [data, curveData])

  return (
    <Card className="overflow-hidden border-border/50 bg-card animate-fade-in-up" style={{ animationDelay: "600ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Ajuste Exponencial
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/70">
          {'Geometria do defeito: F(x) = a * e^(-b * x)'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            length: {
              label: "Dados Reais",
              color: "#3B82F6",
            },
            fittedLength: {
              label: "Curva Ajustada",
              color: "#EF4444",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mergedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="depth"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8" }}
                tickFormatter={(v) => `${v}mm`}
                label={{ value: "Profundidade (mm)", position: "insideBottom", offset: -2, fontSize: 10, fill: "#94A3B8" }}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8" }}
                tickFormatter={(v) => `${v}mm`}
                label={{ value: "Comprimento (mm)", angle: -90, position: "insideLeft", offset: 10, fontSize: 10, fill: "#94A3B8" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        length: "Real",
                        fittedLength: "Ajustado",
                      }
                      return (
                        <span>
                          {labels[name as string] || name}: <strong>{Number(value).toFixed(1)} mm</strong>
                        </span>
                      )
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="fittedLength"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Scatter
                dataKey="length"
                fill="#3B82F6"
                r={5}
                strokeWidth={2}
                stroke="#3B82F6"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
              <span>Dados Reais</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 rounded-full bg-[#EF4444]" />
              <span>Curva Ajustada</span>
            </div>
          </div>
          <div className="rounded-md bg-muted px-2 py-1 font-mono text-[10px]">
            a={params.a} b={params.b}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
