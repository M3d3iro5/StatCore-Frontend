"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, FileJson, FileText, Database, Loader2 } from "lucide-react";

interface ExportOptions {
  analyses: boolean;
  predictions: boolean;
  recommendations: boolean;
  charts: boolean;
  history: boolean;
}

export function ExportarPage() {
  const [exportFormat, setExportFormat] = useState<string>("pdf");
  const [includeOptions, setIncludeOptions] = useState<ExportOptions>({
    analyses: true,
    predictions: true,
    recommendations: true,
    charts: true,
    history: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (): Promise<void> => {
    setIsExporting(true);
    // Simular exportação
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    // Aqui você conectaria com a API para gerar o arquivo
  };

  return (
    <div className="space-y-6">
      {/* Formato de Exportação */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Formato de Exportação</CardTitle>
          <CardDescription>
            Escolha o formato desejado para o relatório
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              [
                {
                  id: "pdf",
                  name: "PDF",
                  description: "Relatório formatado com gráficos",
                  icon: FileText,
                },
                {
                  id: "json",
                  name: "JSON",
                  description: "Dados estruturados em JSON",
                  icon: FileJson,
                },
                {
                  id: "csv",
                  name: "CSV",
                  description: "Dados tabulares (Excel)",
                  icon: Database,
                },
                {
                  id: "xlsx",
                  name: "Excel",
                  description: "Planilha com múltiplas abas",
                  icon: Database,
                },
              ] as const
            ).map((format) => {
              const Icon = format.icon;
              return (
                <div
                  key={format.id}
                  onClick={() => setExportFormat(format.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    exportFormat === format.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{format.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Opções de Incluir */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>O Que Incluir</CardTitle>
          <CardDescription>
            Selecione quais dados deseja exported
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              {
                id: "analyses",
                label: "Análises",
                description: "Dados das análises realizadas",
              },
              {
                id: "predictions",
                label: "Previsões",
                description: "Previsões e projeções",
              },
              {
                id: "recommendations",
                label: "Recomendações",
                description: "Recomendações geradas",
              },
              {
                id: "charts",
                label: "Gráficos",
                description: "Incluir gráficos no relatório",
              },
              {
                id: "history",
                label: "Histórico",
                description: "Histórico completo de dados",
              },
            ] as const
          ).map((option) => (
            <div
              key={option.id}
              className="flex items-start gap-3 p-3 rounded hover:bg-muted/50"
            >
              <Checkbox
                id={option.id}
                checked={
                  includeOptions[option.id as keyof typeof includeOptions]
                }
                onCheckedChange={(checked) =>
                  setIncludeOptions({
                    ...includeOptions,
                    [option.id]: checked,
                  })
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor={option.id}
                  className="font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Período de Exportação */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Período</CardTitle>
          <CardDescription>
            Selecione o período de dados a exportar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period">Período</Label>
            <Select defaultValue="all">
              <SelectTrigger id="period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Últimos 7 dias</SelectItem>
                <SelectItem value="month">Últimos 30 dias</SelectItem>
                <SelectItem value="quarter">Últimos 90 dias</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
                <SelectItem value="all">Todo o período</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prévia */}
      <Card className="border-border/50 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Prévia da Exportação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Formato:</span>{" "}
              <Badge variant="secondary">{exportFormat.toUpperCase()}</Badge>
            </p>
            <p>
              <span className="font-medium">Itens inclusos:</span>
              <span className="ml-2 text-muted-foreground">
                {Object.entries(includeOptions)
                  .filter(([, checked]) => checked)
                  .map(([key]) => key)
                  .join(", ")}
              </span>
            </p>
            <p>
              <span className="font-medium">Tipo de arquivo:</span>
              <span className="ml-2 text-muted-foreground">
                .{exportFormat}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Exportação */}
      <Button
        onClick={handleExport}
        disabled={isExporting}
        size="lg"
        className="w-full"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </>
        )}
      </Button>

      {/* Histórico de Exportações */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Exports Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 hover:bg-muted/50 rounded"
              >
                <div className="flex-1">
                  <p className="font-medium">Relatório #{i}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Date.now() - i * 86400000).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
