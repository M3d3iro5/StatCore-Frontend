import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";
import { AnalysisDataSchema } from "@/lib/api-schemas";

/**
 * GET /api/analysis/latest
 * Obtém os dados da análise mais recente do backend Python
 */
export async function GET(request: NextRequest) {
  try {
    // Requisição para o backend Python
    const analysisData = await apiClient.get("/analysis/latest");

    // Validar resposta
    const validated = AnalysisDataSchema.parse(analysisData);

    return NextResponse.json(
      {
        success: true,
        data: validated,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API ANALYSIS] Erro:", error.message);

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
