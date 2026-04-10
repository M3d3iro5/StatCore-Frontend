import type { DashboardData } from "./types";

function generateTemporalPrediction() {
  const data = [];
  for (let day = 0; day <= 365; day += 15) {
    const mean = 8.2 + (day / 365) * 4.8;
    const variance = 0.5 + (day / 365) * 1.5;
    data.push({
      day,
      mean: parseFloat(mean.toFixed(2)),
      max: parseFloat((mean + variance).toFixed(2)),
      min: parseFloat((mean - variance).toFixed(2)),
    });
  }
  return data;
}

export const mockData: DashboardData = {
  lastAnalysis: {
    date: "2026-02-27T14:30:00Z",
    erf: 0.75,
    depth: 8.2,
    length: 125.4,
    thickness: 18.1,
    status: "ATTENTION",
  },

  temporalPrediction: generateTemporalPrediction(),

  exponentialFit: [
    { depth: 2, length: 12.1 },
    { depth: 5, length: 8.5 },
    { depth: 8, length: 6.2 },
    { depth: 10, length: 4.9 },
    { depth: 12, length: 3.6 },
    { depth: 15, length: 2.1 },
    { depth: 18, length: 1.2 },
    { depth: 20, length: 0.8 },
  ],

  erfHistory: [
    { date: "2025-07-01", erf: 0.91 },
    { date: "2025-08-15", erf: 0.88 },
    { date: "2025-09-20", erf: 0.86 },
    { date: "2025-10-10", erf: 0.84 },
    { date: "2025-11-05", erf: 0.82 },
    { date: "2025-12-01", erf: 0.79 },
    { date: "2026-01-01", erf: 0.78 },
    { date: "2026-01-15", erf: 0.77 },
    { date: "2026-02-01", erf: 0.76 },
    { date: "2026-02-27", erf: 0.75 },
  ],

  recommendations: [
    {
      type: "warning",
      message: "Risco moderado detectado - Programar monitoramento em 30 dias",
    },
    {
      type: "success",
      message: "Margens de seguranca dentro dos limites aceitaveis",
    },
    { type: "info", message: "Inspecao visual recomendada ate 28/04/2026" },
    {
      type: "critical",
      message: "Tendencia de degradacao acelerada nos ultimos 90 dias",
    },
    {
      type: "info",
      message: "Proxima analise completa agendada para 15/03/2026",
    },
  ],
};

export function getERFColor(erf: number): string {
  if (erf < 0.6) return "#10B981";
  if (erf <= 0.8) return "#F59E0B";
  return "#EF4444";
}

export function getERFStatus(erf: number): string {
  if (erf < 0.6) return "OK";
  if (erf <= 0.8) return "ATENCAO";
  return "CRITICO";
}

export function getERFLabel(erf: number): string {
  if (erf < 0.6) return "Seguro";
  if (erf <= 0.8) return "Monitorar";
  return "Intervencao Necessaria";
}
