import { NextRequest, NextResponse } from "next/server";
import { swaggerConfig } from "@/lib/swagger-config";

/**
 * GET /api/swagger
 * Retorna a configuração OpenAPI/Swagger
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(swaggerConfig, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao obter configuração Swagger",
      },
      { status: 500 },
    );
  }
}
