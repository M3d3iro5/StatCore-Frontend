import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/lib/api-schemas";

interface UseApiOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useApi<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  options: UseApiOptions = {},
) {
  const { immediate = true, onError, onSuccess } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (payload?: any): Promise<any> => {
      try {
        setLoading(true);
        setError(null);

        let result: any;

        switch (method) {
          case "POST":
            result = await apiClient.post(endpoint, payload);
            break;
          case "PUT":
            result = await apiClient.put(endpoint, payload);
            break;
          case "DELETE":
            result = await apiClient.delete(endpoint);
            break;
          case "PATCH":
            result = await apiClient.patch(endpoint, payload);
            break;
          case "GET":
          default:
            result = await apiClient.get(endpoint);
            break;
        }

        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, onError, onSuccess],
  );

  useEffect(() => {
    if (immediate && method === "GET") {
      execute();
    }
  }, [immediate, method, execute]);

  return { data, loading, error, execute, refetch: execute };
}

/**
 * Hook específico para análises
 */
export function useAnalysis() {
  const { data, loading, error, execute, refetch } = useApi("/analysis/latest");

  return {
    analysisData: data,
    isLoading: loading,
    error,
    refetch,
    sendAnalysis: (payload: any): Promise<any> => execute(payload),
  };
}

/**
 * Hook específico para previsões
 */
export function usePredictions(days: number = 30) {
  const { data, loading, error, refetch } = useApi(`/predictions?days=${days}`);

  return {
    predictions: data,
    isLoading: loading,
    error,
    refetch,
  };
}

/**
 * Hook para verificar saúde da API
 */
export function useHealthCheck() {
  const { data, loading, error, execute } = useApi("/health", "GET", {
    immediate: false,
  });

  useEffect(() => {
    // Verificar saúde a cada 30 segundos
    const interval = setInterval(execute, 30000);
    execute(); // Verificar imediatamente

    return () => clearInterval(interval);
  }, [execute]);

  return {
    isHealthy: data?.status === "healthy",
    healthStatus: data,
    isChecking: loading,
    error,
  };
}
