import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";
import { HealthCheckSchema } from "@/lib/api-schemas";

/**
 * GET /api/health
 * Verifica o status de saúde da API e conecta com o backend Python
 */
export async function GET(request: NextRequest) {
  try {
    // Requisição para o backend Python
    const backendHealth = await apiClient.get("/health");

    // Validar resposta
    const validated = HealthCheckSchema.parse(backendHealth);

    return NextResponse.json(
      {
        success: true,
        data: validated,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API HEALTH] Erro:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao verificar saúde da API",
        errors: {
          backend: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
