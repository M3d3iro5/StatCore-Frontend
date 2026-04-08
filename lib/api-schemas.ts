import { z } from "zod";

// Response Wrapper Schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any(),
  errors: z.record(z.string()).optional(),
  timestamp: z.string().optional(),
});

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string>;
  timestamp?: string;
};

// Analysis Data Schemas
export const AnalysisDataSchema = z.object({
  lastAnalysis: z.object({
    date: z.string(),
    erfValue: z.number(),
    status: z.enum(["good", "warning", "critical"]),
    confidence: z.number(),
  }),
  temporalPrediction: z.array(
    z.object({
      date: z.string(),
      predicted: z.number(),
      confidence: z.number(),
    }),
  ),
  exponentialFit: z.object({
    coefficient: z.number(),
    exponent: z.number(),
    r_squared: z.number(),
  }),
  erfHistory: z.array(
    z.object({
      date: z.string(),
      value: z.number(),
    }),
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high"]),
    }),
  ),
});

export type AnalysisData = z.infer<typeof AnalysisDataSchema>;

// Health Check Schema
export const HealthCheckSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  message: z.string(),
  timestamp: z.string(),
  uptime: z.number().optional(),
});

export type HealthCheck = z.infer<typeof HealthCheckSchema>;

// Request Schemas
export const AnalysisRequestSchema = z.object({
  data: z.any(),
  parameters: z.record(z.any()).optional(),
});

export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;
