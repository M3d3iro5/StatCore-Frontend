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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const analysisFormSchema = z.object({
  depth: z.coerce
    .number()
    .min(0, "Profundidade deve ser >= 0")
    .max(50, "Profundidade deve ser <= 50"),
  length: z.coerce
    .number()
    .min(0, "Comprimento deve ser >= 0")
    .max(500, "Comprimento deve ser <= 500"),
  thickness: z.coerce
    .number()
    .min(1, "Espessura deve ser >= 1")
    .max(100, "Espessura deve ser <= 100"),
});

type AnalysisFormValues = z.infer<typeof analysisFormSchema>;

interface NewAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: any) => void;
}

export function NewAnalysisDialog({
  open,
  onOpenChange,
  onSuccess,
}: NewAnalysisDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute: submitAnalysis } = useApi("/analysis", "POST", {
    immediate: false,
  });

  const form = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      depth: 8.2,
      length: 125.4,
      thickness: 18.1,
    },
  });

  async function onSubmit(values: AnalysisFormValues) {
    try {
      setIsSubmitting(true);

      // Enviar dados para o backend
      const response = await submitAnalysis(values);

      toast({
        title: "✅ Análise enviada com sucesso!",
        description: "Os dados foram processados pelo backend",
      });

      // Callback de sucesso
      onSuccess?.(response);

      // Resetar formulário e fechar dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Erro ao enviar análise";
      toast({
        title: "❌ Erro ao enviar análise",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("Erro:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Análise</DialogTitle>
          <DialogDescription>
            Insira os dados do defeito para realizar uma nova análise e cálculos
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profundidade */}
            <FormField
              control={form.control}
              name="depth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profundidade (mm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="50"
                      placeholder="Ex: 8.2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Profundidade da trinca em milímetros (0-50 mm)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comprimento */}
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comprimento (mm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="500"
                      placeholder="Ex: 125.4"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comprimento do defeito em milímetros (0-500 mm)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Espessura */}
            <FormField
              control={form.control}
              name="thickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espessura da Parede (mm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="1"
                      max="100"
                      placeholder="Ex: 18.1"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Espessura da parede do tubo (1-100 mm)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Enviando..." : "Realizar Análise"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
