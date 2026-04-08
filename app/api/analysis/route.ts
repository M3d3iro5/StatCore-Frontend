import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";
import { AnalysisRequestSchema } from "@/lib/api-schemas";

/**
 * POST /api/analysis
 * Envia dados para análise no backend Python
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar requisição
    const validated = AnalysisRequestSchema.parse(body);

    // Enviar para backend Python
    const result = await apiClient.post("/analysis", validated);

    return NextResponse.json(
      {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API ANALYSIS POST] Erro:", error.message);

    // Diferenciar erros de validação de erros de backend
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Dados inválidos",
          errors: error.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar análise",
        errors: {
          backend: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/analysis
 * Lista análises disponíveis
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    const result = await apiClient.get("/analysis", {
      params: { limit, offset },
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API ANALYSIS GET] Erro:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao listar análises",
        errors: {
          backend: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
