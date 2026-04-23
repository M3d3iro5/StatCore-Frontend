"use client";

import { usePerdaParede } from "@/hooks/use-api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown } from "lucide-react";

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
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full border-red-500">
        <CardHeader>
          <CardTitle>Perda de Parede</CardTitle>
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

  // Processar dados para o gráfico - usar anos reais baseado no ano inicial da planilha
  // Extrai ano do nome do arquivo ou usa 2016 como padrão
  const extractYearFromFilename = (filename: string | undefined): number => {
    if (!filename) return 2016;
    const yearMatch = filename.match(/(\d{4})/);
    return yearMatch ? parseInt(yearMatch[1]) : 2016;
  };

  const startYear =
    extractYearFromFilename(perdaParede?.arquivo_origem) ||
    perdaParede?.ano_inicio ||
    2016;

  // Processar dados do gráfico - mapear anos consecutivos com dados reais do backend
  const chartData = (perdaParede?.dados?.timestamps || []).map(
    (timestamp: string, idx: number) => {
      const ano = startYear + idx;

      return {
        ano: ano.toString(),
        perda: perdaParede?.dados?.perdas_mm?.[idx] || 0,
        posicao: perdaParede?.dados?.posicoes_m?.[idx] || 0,
      };
    },
  );

  const analise = perdaParede?.analise || {};
  const isCritical = analise.tendencia === "piorando";

  // Converter taxa de corrosão para mm/ano
  // Backend retorna valor em percentual/dia, divide por 100 e converte para ano
  const taxaCorrosaoAnual = ((analise.taxa_corrosao_media || 0) / 100) * 365.25;

  return (
    <Card className="col-span-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Perda de Parede ao Longo do Tempo
            </CardTitle>
            <CardDescription className="mt-2">
              Taxa de corrosão:{" "}
              <span className="font-semibold text-foreground">
                {taxaCorrosaoAnual.toFixed(4)} mm/ano
              </span>{" "}
              | Tendência:{" "}
              <span
                className={`font-bold ml-1 ${
                  isCritical
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {analise.tendencia}
              </span>
            </CardDescription>
          </div>
          <div className="text-right space-y-1 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-muted-foreground">
              Qualidade da previsão
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              R² = {analise.r_squared?.toFixed(3)}
            </p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {analise.dias_ate_limite} dias até limite
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 30, left: 0, bottom: 15 }}
            >
              <defs>
                <linearGradient id="colorPerda" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
                className="dark:stroke-slate-700"
              />
              <XAxis
                dataKey="ano"
                label={{
                  value: "Ano",
                  position: "insideBottomRight",
                  offset: -10,
                  fontSize: 12,
                  fill: "#64748b",
                }}
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
                className="dark:stroke-slate-600"
              />
              <YAxis
                label={{
                  value: "Perda de Parede (mm)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
                className="dark:stroke-slate-600"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
                formatter={(value: any, name: string) => {
                  if (name === "perda") {
                    return [value.toFixed(2) + " mm", "Perda de Parede"];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Ano: ${label}`}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "13px",
                }}
                iconType="line"
                height={40}
              />
              <Line
                type="monotone"
                dataKey="perda"
                stroke="#ef4444"
                name="Perda de Parede (mm)"
                dot={{ fill: "#ef4444", r: 5 }}
                activeDot={{ r: 7, fill: "#dc2626" }}
                strokeWidth={2.5}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Avisos */}
        {perdaParede?.avisos && perdaParede.avisos.length > 0 && (
          <div className="space-y-2">
            {perdaParede.avisos.map((aviso: any, idx: number) => (
              <Alert
                key={idx}
                className={`border ${
                  aviso.tipo === "warning"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    : aviso.tipo === "error"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription
                  className={
                    aviso.tipo === "warning"
                      ? "text-yellow-800 dark:text-yellow-200"
                      : aviso.tipo === "error"
                        ? "text-red-800 dark:text-red-200"
                        : "text-blue-800 dark:text-blue-200"
                  }
                >
                  {aviso.mensagem}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
