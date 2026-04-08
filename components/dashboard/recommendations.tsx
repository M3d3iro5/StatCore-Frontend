"use client"

import { AlertTriangle, CheckCircle2, Info, AlertOctagon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Recommendation } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RecommendationsProps {
  data: Recommendation[]
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-[#F59E0B]/10",
    border: "border-[#F59E0B]/20",
    iconColor: "text-[#F59E0B]",
    label: "Alerta",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-[#10B981]/10",
    border: "border-[#10B981]/20",
    iconColor: "text-[#10B981]",
    label: "OK",
  },
  info: {
    icon: Info,
    bg: "bg-[#3B82F6]/10",
    border: "border-[#3B82F6]/20",
    iconColor: "text-[#3B82F6]",
    label: "Info",
  },
  critical: {
    icon: AlertOctagon,
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/20",
    iconColor: "text-[#EF4444]",
    label: "Critico",
  },
}

export function Recommendations({ data }: RecommendationsProps) {
  return (
    <Card className="overflow-hidden border-border/50 bg-card animate-fade-in-up" style={{ animationDelay: "900ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Recomendacoes e Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {data.map((rec, i) => {
          const config = typeConfig[rec.type]
          const Icon = config.icon
          return (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3.5 transition-all duration-200 hover:shadow-sm",
                config.bg,
                config.border
              )}
            >
              <div className={cn("mt-0.5 shrink-0", config.iconColor)}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {config.label}
                </p>
                <p className="mt-0.5 text-sm text-foreground">
                  {rec.message}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
