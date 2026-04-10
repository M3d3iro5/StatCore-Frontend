"use client";

import { useDadosSinteticos } from "@/hooks/use-api";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DadosSinteticosChart() {
  const { dadosSinteticos, isLoading, error } = useDadosSinteticos(50);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados Sintéticos de Medições</CardTitle>
          <CardDescription>Visualização de pontos de inspeção</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card border-red-500>
        <CardHeader>
          <CardTitle>Dados Sintéticos</CardTitle>
          <CardDescription className="text-red-600">Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Processar dados
  const chartData =
    dadosSinteticos?.dados?.map((d: any) => ({
      posicao: d.posicao_m || 0,
      perda: d.perda_parede_mm || 0,
      profundidade: d.profundidade_mm || 0,
    })) || [];

  const resumo = dadosSinteticos?.resumo || {};

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Dados Sintéticos de Medições</CardTitle>
            <CardDescription>
              {resumo.total_pontos} pontos | Perda média: {resumo.perda_media_mm?.toFixed(2)} mm
            </CardDescription>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Mín: {resumo.perda_minima_mm?.toFixed(2)} mm</p>
            <p className="text-muted-foreground">Máx: {resumo.perda_maxima_mm?.toFixed(2)} mm</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="posicao" type="number" name="Posição (m)" />
            <YAxis dataKey="perda" type="number" name="Perda (mm)" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value: any) => value?.toFixed(2)}
            />
            <Legend />
            <Scatter
              name="Perda de Parede (mm)"
              data={chartData}
              fill="#3b82f6"
              size={60}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
