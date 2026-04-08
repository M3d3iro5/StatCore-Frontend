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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, RefreshCw, Save } from "lucide-react";

interface Settings {
  theme: string;
  language: string;
  notificationsEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: string;
  alertThreshold: string;
  email: string;
}

export function ConfiguracoesPage() {
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    language: "pt-BR",
    notificationsEnabled: true,
    autoRefresh: true,
    refreshInterval: "5",
    alertThreshold: "0.6",
    email: "usuario@example.com",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Seção: Exibição */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Exibição</CardTitle>
          <CardDescription>Customize a aparência da aplicação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) =>
                setSettings({ ...settings, theme: value })
              }
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="auto">Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                setSettings({ ...settings, language: value })
              }
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (USA)</SelectItem>
                <SelectItem value="es-ES">Español (España)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Seção: Notificações */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Configure como deseja receber alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="notifications" className="cursor-pointer">
                Ativar Notificações
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receba alertas quando há anomalias
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={(value) =>
                setSettings({ ...settings, notificationsEnabled: value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email para Notificações</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Limiar de Alerta (ERF Value)</Label>
            <Input
              id="threshold"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={settings.alertThreshold}
              onChange={(e) =>
                setSettings({ ...settings, alertThreshold: e.target.value })
              }
              placeholder="0.60"
            />
            <p className="text-sm text-muted-foreground">
              Alertar quando ERF Value cair abaixo de{" "}
              {parseFloat(settings.alertThreshold).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seção: Atualização */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Atualização de Dados</CardTitle>
          <CardDescription>
            Configure a frequência de atualização dos dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="autoRefresh" className="cursor-pointer">
                Auto-Atualização
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Atualizar dados automaticamente
              </p>
            </div>
            <Switch
              id="autoRefresh"
              checked={settings.autoRefresh}
              onCheckedChange={(value) =>
                setSettings({ ...settings, autoRefresh: value })
              }
            />
          </div>

          {settings.autoRefresh && (
            <div className="space-y-2">
              <Label htmlFor="refreshInterval">
                Intervalo de Atualização (segundos)
              </Label>
              <Select
                value={settings.refreshInterval}
                onValueChange={(value) =>
                  setSettings({ ...settings, refreshInterval: value })
                }
              >
                <SelectTrigger id="refreshInterval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 segundos</SelectItem>
                  <SelectItem value="10">10 segundos</SelectItem>
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">1 minuto</SelectItem>
                  <SelectItem value="300">5 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção: Informações da API */}
      <Card className="border-border/50 border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Conexão com Backend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Backend URL</p>
            <code className="text-xs bg-muted p-2 rounded block break-all">
              {process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:8000"}
            </code>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <Badge variant="secondary">Conectado</Badge>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Testar Conexão
          </Button>
        </CardContent>
      </Card>

      {/* Botão de Salvamento */}
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Salvando..." : "Salvar Configurações"}
      </Button>
    </div>
  );
}
