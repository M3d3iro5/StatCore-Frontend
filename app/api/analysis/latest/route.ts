import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/analysis/latest
 * Obtém a análise mais recente processada (resultado do computador em /api/analysis/compute-result)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se há resultado de cálculo armazenado globalmente
    const globalData = (globalThis as any).computedAnalysisResult;

    if (globalData) {
      console.log("[API LATEST] Retornando análise global armazenada");
      return NextResponse.json(
        {
          success: true,
          data: globalData,
          timestamp: new Date().toISOString(),
        },
        { status: 200 },
      );
    }

    // Se não houver análise em memória, retornar dados padrão
    const defaultData = {
      lastAnalysis: {
        date: new Date().toISOString(),
        erfValue: 0.75,
        status: "warning",
        confidence: 0.8,
      },
      temporalPrediction: [],
      exponentialFit: { coefficient: 0, exponent: 0, r_squared: 0 },
      erfHistory: [],
      recommendations: [
        {
          type: "info",
          message: "Conectando com backend e aguardando primeira análise...",
        },
      ],
    };

    console.log("[API LATEST] Retornando dados padrão");
    return NextResponse.json(
      {
        success: true,
        data: defaultData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API ANALYSIS LATEST] Erro:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao obter análise",
        errors: {
          backend: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
