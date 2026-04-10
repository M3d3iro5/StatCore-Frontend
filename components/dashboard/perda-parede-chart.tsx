"use client";

import { usePerdaParede } from "@/hooks/use-api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PerdaParedeChart() {
  const { perdaParede, isLoading, error } = usePerdaParede();

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Perda de Parede ao Longo do Tempo</CardTitle>
          <CardDescription>Análise temporal de corrosão</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full border-red-500">
        <CardHeader>
          <CardTitle>Perda de Parede</CardTitle>
          <CardDescription className="text-red-600">Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Processar dados para o gráfico
  const chartData = (perdaParede?.dados?.timestamps || []).map((timestamp: string, idx: number) => ({
    timestamp: new Date(timestamp).toLocaleDateString("pt-BR"),
    perda: perdaParede?.dados?.perdas_mm?.[idx] || 0,
    posicao: perdaParede?.dados?.posicoes_m?.[idx] || 0,
  }));

  const analise = perdaParede?.analise || {};

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Perda de Parede ao Longo do Tempo</CardTitle>
            <CardDescription>
              Taxa de corrosão: {analise.taxa_corrosao_media?.toFixed(4)} mm/dia | Tendência:{" "}
              <span
                className={
                  analise.tendencia === "piorando" ? "text-red-600 font-bold" : "text-green-600 font-bold"
                }
              >
                {analise.tendencia}
              </span>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">R² = {analise.r_squared?.toFixed(3)}</p>
            <p className="text-sm font-semibold">{analise.dias_ate_limite} dias até limite</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip
              formatter={(value: any) => [
                typeof value === "number" ? value.toFixed(2) : value,
                "Perda (mm)",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="perda"
              stroke="#ef4444"
              name="Perda de Parede (mm)"
              dot={{ fill: "#ef4444", r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Avisos */}
        {perdaParede?.avisos && perdaParede.avisos.length > 0 && (
          <div className="mt-6 space-y-2 border-t pt-4">
            {perdaParede.avisos.map((aviso: any, idx: number) => (
              <div
                key={idx}
                className={`p-2 rounded text-sm ${
                  aviso.tipo === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : aviso.tipo === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {aviso.mensagem}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
