"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Calendar, Download, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/hooks/use-api";

// Importar componentes dinamicamente sem SSR
const KPICards = dynamic(
  () =>
    import("@/components/dashboard/kpi-cards").then((m) => ({
      default: m.KPICards,
    })),
  { ssr: false },
);
const ERFGauge = dynamic(
  () =>
    import("@/components/dashboard/erf-gauge").then((m) => ({
      default: m.ERFGauge,
    })),
  { ssr: false },
);
const PerdaParedeChart = dynamic(
  () =>
    import("@/components/dashboard/perda-parede-chart").then((m) => ({
      default: m.PerdaParedeChart,
    })),
  { ssr: false },
);
const DadosSinteticosChart = dynamic(
  () =>
    import("@/components/dashboard/dados-sinteticos-chart").then((m) => ({
      default: m.DadosSinteticosChart,
    })),
  { ssr: false },
);
const VidaRemanascenteCards = dynamic(
  () =>
    import("@/components/dashboard/vida-remanescente-cards").then((m) => ({
      default: m.VidaRemanascenteCards,
    })),
  { ssr: false },
);
const ProbabilidadesChart = dynamic(
  () =>
    import("@/components/dashboard/probabilidades-chart").then((m) => ({
      default: m.ProbabilidadesChart,
    })),
  { ssr: false },
);
const DataTable = dynamic(
  () =>
    import("@/components/dashboard/data-table").then((m) => ({
      default: m.DataTable,
    })),
  { ssr: false },
);
const Recommendations = dynamic(
  () =>
    import("@/components/dashboard/recommendations").then((m) => ({
      default: m.Recommendations,
    })),
  { ssr: false },
);

const AnalysesPage = dynamic(
  () =>
    import("@/components/dashboard/analyses-page").then((m) => ({
      default: m.AnalysesPage,
    })),
  { ssr: false },
);
const HistoricoPage = dynamic(
  () =>
    import("@/components/dashboard/historico-page").then((m) => ({
      default: m.HistoricoPage,
    })),
  { ssr: false },
);
const ConfiguracoesPage = dynamic(
  () =>
    import("@/components/dashboard/configuracoes-page").then((m) => ({
      default: m.ConfiguracoesPage,
    })),
  { ssr: false },
);
const ExportarPage = dynamic(
  () =>
    import("@/components/dashboard/exportar-page").then((m) => ({
      default: m.ExportarPage,
    })),
  { ssr: false },
);

const NewAnalysisDialogV2 = dynamic(
  () =>
    import("@/components/dashboard/new-analysis-dialog-v2").then((m) => ({
      default: m.NewAnalysisDialogV2,
    })),
  { ssr: false },
);

interface DashboardContentProps {
  dialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function DashboardContent({ dialogOpen, onOpenChange }: DashboardContentProps) {
  const { analysisData, isLoading, error, refetch } = useAnalysis();

  // Usar dados da API ou fallback com formato correto
  const defaultData = {
    lastAnalysis: {
      date: new Date().toISOString(),
      erf: 0.75,
      depth: 4.2,
      length: 125.4,
      thickness: 12.7,
      status: "warning" as const,
    },
    temporalPrediction: [],
    exponentialFit: [],
    erfHistory: [],
    recommendations: [
      { type: "info" as const, message: "Conectando com backend..." },
    ],
  };

  // Formatar dados da API se disponíveis
  const data = analysisData
    ? {
        lastAnalysis: {
          date: analysisData.lastAnalysis?.date || new Date().toISOString(),
          erf: analysisData.lastAnalysis?.erfValue ?? 0.75,
          depth: 4.2, // placeholder
          length: 125.4, // placeholder
          thickness: 12.7, // placeholder
          status: (analysisData.lastAnalysis?.status || "warning") as any,
        },
        temporalPrediction: Array.isArray(analysisData.temporalPrediction)
          ? analysisData.temporalPrediction.map((p: any, idx: number) => ({
              day: idx + 1,
              mean: p.predicted || 0,
              max: (p.predicted || 0) + 0.05,
              min: (p.predicted || 0) - 0.05,
            }))
          : [],
        exponentialFit: Array.isArray(analysisData.exponentialFit)
          ? analysisData.exponentialFit
          : [],
        erfHistory: Array.isArray(analysisData.erfHistory)
          ? analysisData.erfHistory.map((h: any) => ({
              date: h.date,
              erf: h.erfValue || h.erf || 0,
            }))
          : [],
        recommendations: Array.isArray(analysisData.recommendations)
          ? analysisData.recommendations
          : [],
      }
    : defaultData;

  if (error) {
    return (
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">
            ⚠️ Erro ao conectar com o backend
          </p>
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // Garantir dados padrão sempre durante SSR ou carregamento
  const displayData = analysisData ? data : defaultData;

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Analise de Integridade Estrutural
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Ultima analise:{" "}
            {new Date(displayData.lastAnalysis.date).toLocaleDateString(
              "pt-BR",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => onOpenChange(true)}>
            <Plus className="h-4 w-4" />
            Nova Análise
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatorio
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <section aria-label="Indicadores principais">
        <KPICards data={displayData.lastAnalysis} />
      </section>

      {/* ERF Gauge */}
      <section
        className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4"
        aria-label="Status ERF"
      >
        <div className="lg:col-span-1">
          <ERFGauge value={displayData.lastAnalysis.erf} />
        </div>
        <div className="lg:col-span-3">
          <Recommendations data={displayData.recommendations} />
        </div>
      </section>

      {/* Perda de Parede - Gráfico Principal */}
      <section className="mt-6" aria-label="Perda de parede">
        <PerdaParedeChart />
      </section>

      {/* Vida Remanescente - Cards KPI */}
      <section className="mt-6" aria-label="Vida remanescente">
        <VidaRemanascenteCards />
      </section>

      {/* Dados Sintéticos + Probabilidades */}
      <section
        className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2"
        aria-label="Síntese de dados e probabilidades"
      >
        <DadosSinteticosChart />
        <ProbabilidadesChart />
      </section>

      {/* Data Table */}
      <section className="mt-6" aria-label="Dados históricos">
        <DataTable />
      </section>

      {/* Nova Análise Dialog */}
      <NewAnalysisDialogV2
        open={dialogOpen}
        onOpenChange={onOpenChange}
        onSuccess={() => {
          // Recarregar dados após sucessor
          refetch();
        }}
      />
    </>
  );
}

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onNewAnalysis={() => setDialogOpen(true)}
    >
      {currentPage === "dashboard" && (
        <DashboardContent
          dialogOpen={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
      {currentPage === "analises" && <AnalysesPage />}
      {currentPage === "historico" && <HistoricoPage />}
      {currentPage === "configuracoes" && <ConfiguracoesPage />}
      {currentPage === "exportar" && <ExportarPage />}
    </DashboardLayout>
  );
}
