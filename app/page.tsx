"use client"

import { Calendar, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { ERFGauge } from "@/components/dashboard/erf-gauge"
import { TemporalChart } from "@/components/dashboard/temporal-chart"
import { ExponentialChart } from "@/components/dashboard/exponential-chart"
import { HistoryChart } from "@/components/dashboard/history-chart"
import { DataTable } from "@/components/dashboard/data-table"
import { Recommendations } from "@/components/dashboard/recommendations"
import { Button } from "@/components/ui/button"
import { mockData } from "@/lib/mock-data"

export default function DashboardPage() {
  const { lastAnalysis, temporalPrediction, exponentialFit, erfHistory, recommendations } = mockData

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Analise de Integridade Estrutural
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Ultima analise: {new Date(lastAnalysis.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatorio
        </Button>
      </div>

      {/* KPI Cards */}
      <section aria-label="Indicadores principais">
        <KPICards data={lastAnalysis} />
      </section>

      {/* ERF Gauge + Temporal Chart */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5" aria-label="Gauge ERF e previsoes">
        <div className="lg:col-span-2">
          <ERFGauge value={lastAnalysis.erf} />
        </div>
        <div className="lg:col-span-3">
          <TemporalChart data={temporalPrediction} />
        </div>
      </section>

      {/* Exponential + History Charts */}
      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Graficos de analise">
        <ExponentialChart data={exponentialFit} />
        <HistoryChart data={erfHistory} />
      </section>

      {/* Data Table + Recommendations */}
      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3" aria-label="Dados e recomendacoes">
        <div className="xl:col-span-2">
          <DataTable />
        </div>
        <div>
          <Recommendations data={recommendations} />
        </div>
      </section>
    </DashboardLayout>
  )
}
