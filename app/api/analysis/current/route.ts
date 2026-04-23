import { NextRequest, NextResponse } from "next/server";

// Armazenar análise atual em memória (em produção usar banco de dados)
declare global {
  var currentAnalysisData: any;
}

globalThis.currentAnalysisData = null;

/**
 * POST /api/analysis/current
 * Salva a análise atual procesada
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transformar dados do backend para o formato esperado
    const transformed = transformBackendData(body);

    globalThis.currentAnalysisData = transformed;
    console.log("[API CURRENT] Análise salva:", transformed);

    return NextResponse.json(
      {
        success: true,
        data: transformed,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API CURRENT ANALYSIS POST] Erro:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao salvar análise",
        errors: { detail: error.message },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/analysis/current
 * Obtém a análise atual armazenada
 */
export async function GET(request: NextRequest) {
  try {
    if (!globalThis.currentAnalysisData) {
      console.log("[API CURRENT] Nenhuma análise armazenada");
      return NextResponse.json(
        {
          success: false,
          message: "Nenhuma análise disponível",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      );
    }

    console.log("[API CURRENT] Retornando análise armazenada");
    return NextResponse.json(
      {
        success: true,
        data: globalThis.currentAnalysisData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API CURRENT ANALYSIS GET] Erro:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao obter análise",
        errors: { detail: error.message },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

/**
 * Transforma dados do backend Python para formato do frontend
 */
function transformBackendData(backendData: any) {
  const now = new Date().toISOString();

  // Extrair valores principais
  const profundidade = backendData.profundidade_corrosao ?? 0;
  const comprimento = backendData.comprimento_defeito ?? 0;
  const espessura = backendData.esp_nominal ?? 0;
  const erf = backendData.ERF ?? backendData.erf ?? 0.5;
  const status = mapStatus(backendData.status ?? "good");
  const confianca = backendData.confianca ?? 0.8;

  // Gerar recomendações baseadas no status e ERF
  const recommendations = generateRecommendations(erf, status);

  return {
    lastAnalysis: {
      date: backendData.data_analise || now,
      erfValue: Math.min(1, Math.max(0, erf)),
      status,
      confidence: confianca,
    },
    temporalPrediction: generateTemporalPrediction(erf),
    exponentialFit: generateExponentialFit(profundidade, comprimento),
    erfHistory: [
      {
        date: now,
        erfValue: Math.min(1, Math.max(0, erf)),
      },
    ],
    recommendations,
    summary: {
      total_medidas: backendData.total_medidas ?? 1,
      media_erf: backendData.media_erf ?? erf,
      status_geral: status,
    },
  };
}

/**
 * Mapeia status do backend para o formato do frontend
 */
function mapStatus(backendStatus: string): "good" | "warning" | "critical" {
  const statusMap: Record<string, "good" | "warning" | "critical"> = {
    good: "good",
    ok: "good",
    warning: "warning",
    critical: "critical",
    fail: "critical",
  };
  return statusMap[backendStatus?.toLowerCase()] || "warning";
}

/**
 * Gera previsão temporal de degradação
 */
function generateTemporalPrediction(currentErf: number) {
  const prediction = [];
  const degradationRate = (1 - currentErf) * 0.05; // 5% da deterioração por dia

  for (let day = 1; day <= 30; day++) {
    const projected = Math.max(0, currentErf - degradationRate * day);
    prediction.push({
      date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString(),
      predicted: projected,
      confidence: Math.max(0.5, 0.95 - day * 0.01),
    });
  }

  return prediction;
}

/**
 * Gera pontos de ajuste exponencial
 */
function generateExponentialFit(depth: number, length: number) {
  return [
    {
      depth: 0,
      length: length * 1.1,
    },
    {
      depth: depth * 0.5,
      length: length * 0.9,
    },
    {
      depth: depth,
      length: length,
    },
    {
      depth: depth * 1.5,
      length: length * 0.7,
    },
  ];
}

/**
 * Gera recomendações baseadas no status
 */
function generateRecommendations(erf: number, status: string) {
  const recommendations = [];

  if (status === "critical" || erf < 0.5) {
    recommendations.push({
      type: "critical",
      message: "⚠️ Risco crítico! Inspeção urgente recomendada.",
    });
  } else if (status === "warning" || erf < 0.75) {
    recommendations.push({
      type: "warning",
      message: "⚠️ Risco elevado. Agendar inspeção em breve não dispensável.",
    });
  }

  if (erf > 0.8) {
    recommendations.push({
      type: "success",
      message: "✅ Integridade estrutural adequada.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: "info",
      message: "📋 Monitorar situação conforme recomendado.",
    });
  }

  return recommendations;
}
