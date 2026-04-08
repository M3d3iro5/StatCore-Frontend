export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "StatCore API",
    description:
      "API para análise de integridade estrutural com integração Python",
    version: "1.0.0",
    contact: {
      name: "StatCore Team",
      email: "support@statcore.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:8000",
      description: "Backend Python Server",
    },
    {
      url: "http://localhost:3000",
      description: "Frontend Next.js Server",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verificar status da API",
        description: "Retorna o status de saúde da aplicação",
        responses: {
          200: {
            description: "API está saudável",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["healthy", "degraded", "unhealthy"],
                    },
                    message: { type: "string" },
                    timestamp: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/analysis/latest": {
      get: {
        tags: ["Analysis"],
        summary: "Obter análise mais recente",
        description:
          "Retorna os dados da análise mais recente do backend Python",
        responses: {
          200: {
            description: "Análise obtida com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        lastAnalysis: { type: "object" },
                        temporalPrediction: { type: "array" },
                        exponentialFit: { type: "object" },
                        erfHistory: { type: "array" },
                        recommendations: { type: "array" },
                      },
                    },
                    timestamp: { type: "string" },
                  },
                },
              },
            },
          },
          500: {
            description: "Erro ao conectar com o backend",
          },
        },
      },
    },
    "/analysis": {
      post: {
        tags: ["Analysis"],
        summary: "Enviar dados para análise",
        description: "Envia dados para o backend Python processar análise",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: { type: "object", description: "Dados para análise" },
                  parameters: {
                    type: "object",
                    description: "Parâmetros adicionais",
                  },
                },
                required: ["data"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Análise processada com sucesso",
          },
          400: {
            description: "Dados inválidos",
          },
          500: {
            description: "Erro ao processar análise",
          },
        },
      },
    },
    "/predictions": {
      get: {
        tags: ["Predictions"],
        summary: "Obter previsões",
        description: "Retorna as previsões calculadas pelo backend",
        parameters: [
          {
            name: "days",
            in: "query",
            schema: { type: "integer", default: 30 },
            description: "Número de dias para prever",
          },
        ],
        responses: {
          200: {
            description: "Previsões obtidas com sucesso",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      AnalysisData: {
        type: "object",
        properties: {
          lastAnalysis: { type: "object" },
          temporalPrediction: { type: "array" },
          exponentialFit: { type: "object" },
          erfHistory: { type: "array" },
          recommendations: { type: "array" },
        },
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          errors: { type: "object" },
          timestamp: { type: "string" },
        },
      },
    },
  },
  tags: [
    {
      name: "Health",
      description: "Verificação de saúde da API",
    },
    {
      name: "Analysis",
      description: "Endpoints de análise de dados",
    },
    {
      name: "Predictions",
      description: "Endpoints de previsões",
    },
  ],
};
