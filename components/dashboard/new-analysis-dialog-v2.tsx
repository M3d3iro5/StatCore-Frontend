"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, Database, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";

// Schema para dados manuais
const manualFormSchema = z.object({
  depth: z.coerce.number().min(0).max(50),
  length: z.coerce.number().min(0).max(500),
  thickness: z.coerce.number().min(1).max(100),
});

type ManualFormValues = z.infer<typeof manualFormSchema>;

// Schema para upload
const uploadFormSchema = z.object({
  arquivo: z.instanceof(File).optional(),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

interface Spreadsheet {
  nome: string;
  ano: number;
  tamanho_kb: number;
}

interface NewAnalysisDialogV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: any) => void;
}

export function NewAnalysisDialogV2({
  open,
  onOpenChange,
  onSuccess,
}: NewAnalysisDialogV2Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const manualForm = useForm<ManualFormValues>({
    resolver: zodResolver(manualFormSchema),
    defaultValues: {
      depth: 8.2,
      length: 125.4,
      thickness: 18.1,
    },
  });

  const uploadForm = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
  });

  // Carregar lista de arquivos ao abrir
  useEffect(() => {
    if (open) {
      loadSpreadsheets();
    }
  }, [open]);

  async function loadSpreadsheets() {
    try {
      setIsLoading(true);
      const data = (await apiClient.get("/spreadsheets/list")) as any;
      setSpreadsheets(data.planilhas || data.spreadsheets || []);
    } catch (error) {
      console.error("Erro ao carregar planilhas:", error);
      toast({
        title: "⚠️ Aviso",
        description: "Não foi possível carregar lista de planilhas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // ABA 1: Usar arquivo do banco
  async function handleSelectFromBank(fileName: string) {
    try {
      setIsLoading(true);

      // 1️⃣ Processar arquivo
      console.log(
        `[ANÁLISE] Iniciando POST /analysis/spreadsheet/fromdb com arquivo: ${fileName}`,
      );
      const postResult = (await apiClient.post(`/analysis/spreadsheet/fromdb`, {
        arquivo_nome: fileName,
      })) as any;

      console.log(
        `[ANÁLISE] ✅ POST concluído. Total medidas: ${postResult.total_medidas}`,
      );

      toast({
        title: "✅ Arquivo processado!",
        description: `${postResult.total_medidas} medições processadas. Aguardando dados...`,
      });

      // Salvar resultado do cálculo
      await apiClient.post("/api/analysis/compute-result", postResult);

      // 2️⃣ ESPERAR um pouco para backend persistir dados
      console.log(
        "[ANÁLISE] Aguardando 500ms antes de buscar dados atualizados...",
      );
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3️⃣ Buscar IMEDIATAMENTE dados frescos da análise
      console.log(
        "[ANÁLISE] GET /api/analysis/latest para obter dados atualizados",
      );
      const latestAnalysis = (await apiClient.get(
        "/api/analysis/latest",
      )) as any;

      console.log("[ANÁLISE] ✅ Dados da análise recebidos:", {
        erfScore: latestAnalysis?.dashboardData?.indicators?.erfScore,
        erfStatus: latestAnalysis?.dashboardData?.indicators?.erfStatus,
        comprimento: latestAnalysis?.dashboardData?.indicators?.comprimento,
        profundidade: latestAnalysis?.dashboardData?.indicators?.profundidade,
        vidaRemanescente:
          latestAnalysis?.dashboardData?.calculatedMetrics?.vidaRemanescente,
        recommendationsCount: latestAnalysis?.recommendations?.length || 0,
      });

      // 4️⃣ Passar dados frescos para refetch no parent
      onSuccess?.(latestAnalysis);

      toast({
        title: "✅ Análise concluída!",
        description: `Dashboard atualizada com últimos dados`,
      });

      onOpenChange(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao processar";
      console.error("[ANÁLISE] ❌ Erro:", msg);
      toast({
        title: "❌ Erro",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // ABA 2: Upload de arquivo
  async function handleFileUpload() {
    if (!selectedFile) {
      toast({
        title: "⚠️ Aviso",
        description: "Selecione um arquivo antes de enviar",
      });
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("arquivo", selectedFile);
      formData.append("dext_mm", "323.85");

      // 1️⃣ Processar arquivo via upload
      console.log(
        `[ANÁLISE] Iniciando POST /analysis/spreadsheet com arquivo: ${selectedFile.name}`,
      );
      const postResult = (await apiClient.post(
        "/analysis/spreadsheet",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )) as any;

      console.log(
        `[ANÁLISE] ✅ POST concluído. Total medidas: ${postResult.total_medidas}`,
      );

      toast({
        title: "✅ Arquivo enviado!",
        description: `${postResult.total_medidas} medições analisadas. Aguardando dados...`,
      });

      // Salvar resultado do cálculo
      await apiClient.post("/api/analysis/compute-result", postResult);

      // 2️⃣ ESPERAR um pouco para backend persistir dados
      console.log(
        "[ANÁLISE] Aguardando 500ms antes de buscar dados atualizados...",
      );
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3️⃣ Buscar IMEDIATAMENTE dados frescos da análise
      console.log(
        "[ANÁLISE] GET /api/analysis/latest para obter dados atualizados",
      );
      const latestAnalysis = (await apiClient.get(
        "/api/analysis/latest",
      )) as any;

      console.log("[ANÁLISE] ✅ Dados da análise recebidos:", {
        erfScore: latestAnalysis?.dashboardData?.indicators?.erfScore,
        erfStatus: latestAnalysis?.dashboardData?.indicators?.erfStatus,
        comprimento: latestAnalysis?.dashboardData?.indicators?.comprimento,
        profundidade: latestAnalysis?.dashboardData?.indicators?.profundidade,
        vidaRemanescente:
          latestAnalysis?.dashboardData?.calculatedMetrics?.vidaRemanescente,
        recommendationsCount: latestAnalysis?.recommendations?.length || 0,
      });

      // 4️⃣ Passar dados frescos para refetch no parent
      onSuccess?.(latestAnalysis);

      toast({
        title: "✅ Análise concluída!",
        description: `Dashboard atualizada com últimos dados`,
      });

      onOpenChange(false);
      setSelectedFile(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao enviar";
      console.error("[ANÁLISE] ❌ Erro:", msg);
      toast({
        title: "❌ Erro",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // ABA 3: Dados manuais
  async function handleManualSubmit(values: ManualFormValues) {
    try {
      setIsLoading(true);

      // 1️⃣ Processar dados manuais
      console.log("[ANÁLISE] Iniciando POST /analysis/json com dados manuais");
      const postResult = (await apiClient.post("/analysis/json", {
        medidas: [
          {
            posicao_m: 1,
            esp_nominal: values.thickness,
            esp_remanescente: values.thickness - (values.depth || 0),
            profundidade_corrosao: values.depth,
            comprimento_defeito: values.length,
          },
        ],
      })) as any;

      console.log("[ANÁLISE] ✅ POST concluído");

      toast({
        title: "✅ Dados processados!",
        description: `Medição analisada. Aguardando dados...`,
      });

      // Salvar resultado do cálculo
      await apiClient.post("/api/analysis/compute-result", postResult);

      // 2️⃣ ESPERAR um pouco para backend persistir dados
      console.log(
        "[ANÁLISE] Aguardando 500ms antes de buscar dados atualizados...",
      );
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3️⃣ Buscar IMEDIATAMENTE dados frescos da análise
      console.log(
        "[ANÁLISE] GET /api/analysis/latest para obter dados atualizados",
      );
      const latestAnalysis = (await apiClient.get(
        "/api/analysis/latest",
      )) as any;

      console.log("[ANÁLISE] ✅ Dados da análise recebidos:", {
        erfScore: latestAnalysis?.dashboardData?.indicators?.erfScore,
        erfStatus: latestAnalysis?.dashboardData?.indicators?.erfStatus,
        comprimento: latestAnalysis?.dashboardData?.indicators?.comprimento,
        profundidade: latestAnalysis?.dashboardData?.indicators?.profundidade,
        vidaRemanescente:
          latestAnalysis?.dashboardData?.calculatedMetrics?.vidaRemanescente,
        recommendationsCount: latestAnalysis?.recommendations?.length || 0,
      });

      // 4️⃣ Passar dados frescos para refetch no parent
      onSuccess?.(latestAnalysis);

      toast({
        title: "✅ Análise concluída!",
        description: `Dashboard atualizada com últimos dados`,
      });

      onOpenChange(false);
      manualForm.reset();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao processar";
      console.error("[ANÁLISE] ❌ Erro:", msg);
      toast({
        title: "❌ Erro",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Análise de Integridade</DialogTitle>
          <DialogDescription>
            Escolha o método para realizar análise com cálculos reais (Modified
            B31G 2012)
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="banco" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="banco" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Banco</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Manual</span>
            </TabsTrigger>
          </TabsList>

          {/* ABA 1: BANCO DE DADOS */}
          <TabsContent value="banco" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Selecione um arquivo do banco de dados (6_km) com medições
                reais:
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : spreadsheets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum arquivo disponível
                </div>
              ) : (
                <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                  {spreadsheets.map((sheet) => (
                    <Button
                      key={sheet.nome}
                      variant={
                        selectedFileName === sheet.nome ? "default" : "outline"
                      }
                      className="justify-start text-left"
                      onClick={() => setSelectedFileName(sheet.nome)}
                      disabled={isLoading}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{sheet.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {sheet.ano} • {sheet.tamanho_kb} KB
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              <Button
                onClick={() =>
                  selectedFileName
                    ? handleSelectFromBank(selectedFileName)
                    : null
                }
                disabled={!selectedFileName || isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processando..." : "Processar Arquivo"}
              </Button>
            </div>
          </TabsContent>

          {/* ABA 2: UPLOAD DE ARQUIVO */}
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Envie um arquivo Excel (.xlsx) com medições:
              </p>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">
                    {selectedFile
                      ? selectedFile.name
                      : "Clique ou arraste arquivo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formato suportado: .xlsx, .xls, .csv
                  </p>
                </label>
              </div>

              <Button
                onClick={handleFileUpload}
                disabled={!selectedFile || isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processando..." : "Enviar Arquivo"}
              </Button>
            </div>
          </TabsContent>

          {/* ABA 3: ENTRADA MANUAL */}
          <TabsContent value="manual" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Insira dados de uma medição para análise:
            </p>

            <Form {...manualForm}>
              <form
                onSubmit={manualForm.handleSubmit(handleManualSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={manualForm.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profundidade de Corrosão (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="8.2"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>0-50 mm</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualForm.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprimento do Defeito (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="125.4"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>0-500 mm</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualForm.control}
                  name="thickness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Espessura Nominal (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="1"
                          placeholder="18.1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>1-100 mm</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Processando..." : "Calcular Análise"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
