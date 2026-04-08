"use client";

import { useState } from "react";
import { useAnalysis, usePredictions, useHealthCheck } from "@/hooks/use-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

interface ERFHistory {
  date: string;
  value: number;
}

interface TemporalPrediction {
  date: string;
  predicted: number;
  confidence: number;
}

export function AnalysesPage() {
  const { analysisData, isLoading, error, refetch } = useAnalysis();
  const [selectedAnalysis, setSelectedAnalysis] = useState<null>(null);

  if (isLoading) {
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
                Erro ao carregar análises
              </p>
              <p className="text-sm text-destructive/80">{error.message}</p>
            </div>
          </CardContent>
        </Card>
        <Button onClick={refetch} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma análise disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Análise Atual */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Última Análise</CardTitle>
          <CardDescription>
            {new Date(analysisData.lastAnalysis.date).toLocaleDateString(
              "pt-BR",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                ERF Value
              </p>
              <p className="text-2xl font-bold">
                {analysisData.lastAnalysis.erfValue.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge className="w-fit">
                {analysisData.lastAnalysis.status.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Confiança
              </p>
              <p className="text-2xl font-bold">
                {(analysisData.lastAnalysis.confidence * 100).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                R² (Fit)
              </p>
              <p className="text-2xl font-bold">
                {analysisData.exponentialFit.r_squared.toFixed(3)}
              </p>
            </div>
          </div>

          {/* Recomendações */}
          <div className="mt-6 pt-6 border-t space-y-3">
            <h3 className="font-semibold">Recomendações</h3>
            {analysisData.recommendations.map(
              (rec: Recommendation, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="flex items-start gap-3">
                    {rec.priority === "high" && (
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    {rec.priority === "medium" && (
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    {rec.priority === "low" && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                      <Badge
                        className="mt-2"
                        variant={
                          rec.priority === "high" ? "destructive" : "secondary"
                        }
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Valores */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Histórico de ERF</CardTitle>
          <CardDescription>
            {analysisData.erfHistory.length} medições registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysisData.erfHistory
              .slice(0, 10)
              .map((item: ERFHistory, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 hover:bg-muted/50 rounded"
                >
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="font-semibold">{item.value.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Previsões */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Previsões Temporais</CardTitle>
          <CardDescription>Próximas 30 previsões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysisData.temporalPrediction
              .slice(0, 10)
              .map((pred: TemporalPrediction, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 hover:bg-muted/50 rounded"
                >
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">
                      {new Date(pred.date).toLocaleDateString("pt-BR")}
                    </span>
                    <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${pred.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="font-semibold">
                      {pred.predicted.toFixed(2)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {(pred.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
