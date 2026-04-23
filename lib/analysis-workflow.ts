/**
 * ANALYSIS WORKFLOW UTILITY
 *
 * Coordena o fluxo completo de processamento de análises:
 * 1. POST para processar arquivo
 * 2. Aguarda persistência de dados no backend
 * 3. GET /api/analysis/latest para obter dados frescos
 * 4. Retorna dados para serem usados pela dashboard
 *
 * FLOW:
 * frontend POST /analysis/spreadsheet/fromdb
 *   ↓
 * backend processa e salva em memória
 *   ↓
 * WAIT 500ms (let backend persist)
 *   ↓
 * frontend GET /api/analysis/latest
 *   ↓
 * backend retorna:
 *   {
 *     timestamp: "...",
 *     lastAnalysis: { erfValue, status, confidence, ... },
 *     dashboardData: {
 *       indicators: { erfScore, erfStatus, erfColor, comprimento, profundidade },
 *       calculatedMetrics: { vidaRemanescente, integridade, corrosao, espessura },
 *       graphs: { historicoPerdaParede: [...] }
 *     },
 *     recommendations: [...]
 *   }
 *   ↓
 * frontend atualiza TODOS os componentes com dados frescos
 */

import { apiClient } from "./api-client";

export interface AnalysisDataFromBackend {
  timestamp: string;
  lastAnalysis: {
    date: string;
    erfValue: number;
    status: "good" | "warning" | "critical";
    confidence: number;
  };
  dashboardData: {
    indicators: {
      erfScore: number;
      erfStatus: string;
      erfColor: "green" | "yellow" | "orange" | "red";
      comprimento: number;
      profundidade: number;
    };
    calculatedMetrics: {
      vidaRemanescente: number;
      integridade: number;
      corrosao: number;
      espessura: number;
    };
    graphs: {
      historicoPerdaParede: Array<{
        date: string;
        value: number;
      }>;
    };
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>;
}

/**
 * Processa arquivo e carrega dados frescos da análise
 *
 * @param endpoint - Endpoint para processar (ex: /analysis/spreadsheet/fromdb)
 * @param payload - Dados a enviar no POST
 * @returns Dados frescos de /api/analysis/latest
 */
export async function processFileAndRefresh(
  endpoint: string,
  payload: any,
): Promise<AnalysisDataFromBackend> {
  try {
    // 1️⃣ Processar arquivo
    console.log(`[WORKFLOW] 📤 POST ${endpoint}`, { payload });
    const postResponse = await apiClient.post(endpoint, payload);
    console.log(`[WORKFLOW] ✅ POST concluído`, postResponse);

    // Salvar resultado do cálculo
    await apiClient.post("/api/analysis/compute-result", postResponse);

    // 2️⃣ Aguardar persistência
    console.log(
      "[WORKFLOW] ⏳ Aguardando 500ms para backend persistir dados...",
    );
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3️⃣ Buscar dados frescos
    console.log("[WORKFLOW] 📥 GET /api/analysis/latest");
    const latestData = (await apiClient.get(
      "/api/analysis/latest",
    )) as AnalysisDataFromBackend;

    console.log("[WORKFLOW] ✅ Dados frescos recebidos:", {
      timestamp: latestData.timestamp,
      erfScore: latestData.dashboardData?.indicators?.erfScore,
      erfStatus: latestData.dashboardData?.indicators?.erfStatus,
      recommendations: latestData.recommendations?.length || 0,
    });

    return latestData;
  } catch (error) {
    console.error("[WORKFLOW] ❌ Erro no workflow:", error);
    throw error;
  }
}

/**
 * Extrai dados dos indicadores principais para exibição rápida
 */
export function extractIndicators(data: AnalysisDataFromBackend) {
  return {
    erfScore: data.dashboardData?.indicators?.erfScore ?? 0,
    erfStatus: data.dashboardData?.indicators?.erfStatus ?? "DESCONHECIDO",
    erfColor: data.dashboardData?.indicators?.erfColor ?? "gray",
    comprimento: data.dashboardData?.indicators?.comprimento ?? 0,
    profundidade: data.dashboardData?.indicators?.profundidade ?? 0,
  };
}

/**
 * Extrai dados das métricas calculadas
 */
export function extractMetrics(data: AnalysisDataFromBackend) {
  return {
    vidaRemanescente:
      data.dashboardData?.calculatedMetrics?.vidaRemanescente ?? 0,
    integridade: data.dashboardData?.calculatedMetrics?.integridade ?? 0,
    corrosao: data.dashboardData?.calculatedMetrics?.corrosao ?? 0,
    espessura: data.dashboardData?.calculatedMetrics?.espessura ?? 0,
  };
}

/**
 * Extrai dados do gráfico de perda de parede
 */
export function extractHistoricoPerdaParede(data: AnalysisDataFromBackend) {
  return data.dashboardData?.graphs?.historicoPerdaParede ?? [];
}

/**
 * Extrai recomendações
 */
export function extractRecommendations(data: AnalysisDataFromBackend) {
  return data.recommendations ?? [];
}

/**
 * Log helper para debug durante desenvolvimento
 */
export function logAnalysisUpdate(
  label: string,
  data: AnalysisDataFromBackend,
) {
  const indicators = extractIndicators(data);
  const metrics = extractMetrics(data);
  const recommendations = extractRecommendations(data);

  console.group(`[ANALYSIS UPDATE] ${label}`);
  console.log("Indicadores:", indicators);
  console.log("Métricas:", metrics);
  console.log("Recomendações:", recommendations);
  console.groupEnd();
}
