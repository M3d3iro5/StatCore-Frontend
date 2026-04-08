import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

/**
 * GET /api/predictions
 * Obtém as previsões do backend Python
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get("days") || "30";

    const predictions = await apiClient.get("/predictions", {
      params: { days },
    });

    return NextResponse.json(
      {
        success: true,
        data: predictions,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API PREDICTIONS] Erro:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao obter previsões",
        errors: {
          backend: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
