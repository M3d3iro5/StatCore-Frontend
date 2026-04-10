"use client";

import { useProbabilidades } from "@/hooks/use-api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function ProbabilidadesChart() {
  const { probabilidades, isLoading, error } = useProbabilidades();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Probabilidades</CardTitle>
          <CardDescription>Matriz de risco</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle>Análise de Probabilidades</CardTitle>
          <CardDescription className="text-red-600">
            Erro ao carregar dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const probs = probabilidades?.probabilidades || {};
  const matriz = probabilidades?.matriz_risco || {};
  const cenarios = probabilidades?.cenarios || [];
  const fatores = probabilidades?.fatores_contribuintes || [];
  const erfAtual = probabilidades?.erf_atual || {};

  // Dados para gráfico de barras de probabilidades
  const probChartData = [
    {
      nome: "Crítico",
      valor: ((probs.risco_critico || 0) * 100).toFixed(1),
      color: "#dc2626",
    },
    {
      nome: "Alto",
      valor: ((probs.risco_alto || 0) * 100).toFixed(1),
      color: "#f97316",
    },
    {
      nome: "Médio",
      valor: ((probs.risco_medio || 0) * 100).toFixed(1),
      color: "#eab308",
    },
    {
      nome: "Baixo",
      valor: ((probs.risco_baixo || 0) * 100).toFixed(1),
      color: "#16a34a",
    },
  ];

  // Dados cenários
  const cenarioChartData = Array.isArray(cenarios)
    ? cenarios.map((cenario: any) => ({
        cenario: cenario.nome || "Cenário",
        dias: cenario.dias_until_critico || 0,
        prob: ((cenario.probabilidade || 0) * 100).toFixed(1),
      }))
    : [];

  return (
    <div className="space-y-4">
      {/* Alerta de Risco */}
      {matriz.nivel_risco && (
        <Alert
          className={`border-2 ${
            matriz.nivel_risco === "CRÍTICO"
              ? "border-red-500 bg-red-50"
              : matriz.nivel_risco === "ALTO"
                ? "border-orange-500 bg-orange-50"
                : "border-yellow-500 bg-yellow-50"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-bold">{matriz.nivel_risco}</span> -{" "}
            {matriz.recomendacao_acao?.acao || "Ação recomendada"}
          </AlertDescription>
        </Alert>
      )}

      {/* Gráfico de Probabilidades */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Distribuição de Probabilidades de Risco</CardTitle>
              <CardDescription>
                Score de risco: {matriz.score_total || 0}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                ERF Atual: {(erfAtual.valor || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={probChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis
                label={{
                  value: "Probabilidade (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Bar
                dataKey="valor"
                fill="#3b82f6"
                name="Probabilidade"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fatores Contribuintes */}
      {fatores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fatores Contribuintes</CardTitle>
            <CardDescription>Análise dos fatores de risco</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fatores.map((fator: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{fator.fator}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          fator.nivel === "alto" || fator.nivel === "piorando"
                            ? "bg-red-500"
                            : fator.nivel === "media" ||
                                fator.nivel === "mediana"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${(fator.peso || 0) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right min-w-fit">
                    <p className="text-xs font-semibold">{fator.nivel}</p>
                    <p className="text-xs text-muted-foreground">
                      {((fator.peso || 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
