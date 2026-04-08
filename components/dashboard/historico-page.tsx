"use client";

import { useApi } from "@/hooks/use-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Calendar, Download } from "lucide-react";

interface Analysis {
  date: string;
  erfValue: number;
  status: string;
}

export function HistoricoPage() {
  const {
    data: analyses,
    loading,
    error,
    execute,
  } = useApi("/analysis?limit=50", "GET", {
    immediate: true,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">
                Erro ao carregar histórico
              </p>
              <p className="text-sm text-destructive/80">{error.message}</p>
            </div>
          </CardContent>
        </Card>
        <Button onClick={execute} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const analysesArray: Analysis[] = (analyses?.analyses as Analysis[]) || [];

  return (
    <div className="space-y-6">
      {/* Filtros e Exportação */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Últimos 30 dias
          </Button>
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
        </div>
        <Button size="sm" variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Tabela de Histórico */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Histórico de Análises</CardTitle>
          <CardDescription>
            {analysesArray.length} análises encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysesArray.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma análise encontrada
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/50">
                  <tr className="text-muted-foreground">
                    <th className="text-left py-3 px-4 font-medium">Data</th>
                    <th className="text-left py-3 px-4 font-medium">
                      ERF Value
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {analysesArray.map((analysis: Analysis, idx: number) => (
                    <tr
                      key={idx}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {new Date(analysis.date).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {analysis.erfValue.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            analysis.status === "good"
                              ? "default"
                              : analysis.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {analysis.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Análises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analysesArray.length}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ERF Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(
                analysesArray.reduce(
                  (sum: number, a: Analysis) => sum + a.erfValue,
                  0,
                ) / analysesArray.length
              ).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Últimas 7 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {
                analysesArray.filter((a: Analysis) => {
                  const date = new Date(a.date);
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                  return date >= sevenDaysAgo;
                }).length
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
