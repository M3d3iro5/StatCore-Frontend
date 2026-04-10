"use client";

import { useVidaRemanescente } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function VidaRemanascenteCards() {
  const { vidaRemanescente, isLoading, error } = useVidaRemanescente();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-slate-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return null;
  }

  const vida = vidaRemanescente?.vida_remanescente || {};
  const dados = vidaRemanescente?.dados_atuais || {};
  const erfAtual = vidaRemanescente?.erf_atual || {};

  // Converter dias para anos
  const anosRemanescentes = ((vida.dias_remanescentes || 0) / 365).toFixed(1);

  // Função para getSatus do ERF (corrigido)
  const getERFInfo = (valor: number) => {
    if (valor < 0.6)
      return { status: "SEGURO", borderColor: "border-l-4 border-emerald-600" };
    if (valor <= 0.8)
      return { status: "ATENÇÃO", borderColor: "border-l-4 border-amber-600" };
    return { status: "CRÍTICO", borderColor: "border-l-4 border-red-600" };
  };

  const erfInfo = getERFInfo(erfAtual.valor || 0);

  return (
    <div className="space-y-4">
      {/* Main KPI Cards - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Vida Remanescente */}
        <Card className={`border-0 bg-slate-700 text-slate-100 shadow-md`}>
          <CardContent className="p-6">
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Vida Remanescente
            </p>
            <p className="text-4xl font-bold mt-3">{anosRemanescentes}</p>
            <p className="text-sm opacity-60 mt-1">anos</p>
          </CardContent>
        </Card>

        {/* ERF Atual */}
        <Card
          className={`border-0 bg-slate-700 text-slate-100 shadow-md ${erfInfo.borderColor}`}
        >
          <CardContent className="p-6">
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Integridade
            </p>
            <p className="text-4xl font-bold mt-3">
              {(erfAtual.valor || 0).toFixed(2)}
            </p>
            <p className="text-sm opacity-60 mt-1">{erfInfo.status}</p>
          </CardContent>
        </Card>

        {/* Taxa de Corrosão */}
        <Card className="border-0 bg-slate-700 text-slate-100 shadow-md">
          <CardContent className="p-6">
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Corrosão
            </p>
            <p className="text-4xl font-bold mt-3">
              {(vida.taxa_corrosao_mm_dia || 0).toFixed(3)}
            </p>
            <p className="text-sm opacity-60 mt-1">mm/ano</p>
          </CardContent>
        </Card>

        {/* Espessura */}
        <Card className="border-0 bg-slate-700 text-slate-100 shadow-md">
          <CardContent className="p-6">
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
              Espessura
            </p>
            <p className="text-4xl font-bold mt-3">
              {(dados.esp_remanescente_mm || 0).toFixed(1)}
            </p>
            <p className="text-sm opacity-60 mt-1">mm</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
