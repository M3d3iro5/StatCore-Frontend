# Exemplo: Usando a API no Frontend

Este arquivo mostra exemplos práticos de como usar a API nos componentes.

## Exemplo 1: Componente com Hook de Análise

```typescript
'use client'

import { useAnalysis } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';

export function AnalysisComponent() {
  const { analysisData, isLoading, error, refetch } = useAnalysis();

  if (isLoading) return <div>Carregando análise...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!analysisData) return <div>Sem dados</div>;

  const { lastAnalysis, temporalPrediction, erfHistory, recommendations } = analysisData;

  return (
    <div className="space-y-6">
      {/* Última Análise */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-2">Última Análise</h3>
        <p>ERF Value: {lastAnalysis.erfValue}</p>
        <p>Status: {lastAnalysis.status}</p>
        <p>Confiança: {(lastAnalysis.confidence * 100).toFixed(2)}%</p>
      </div>

      {/* Recomendações */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-2">Recomendações</h3>
        {recommendations.map((rec, idx) => (
          <div key={idx} className="mb-2 p-2 bg-gray-50 rounded">
            <p className="font-sm">{rec.title}</p>
            <p className="text-sm text-gray-600">{rec.description}</p>
            <p className="text-xs text-gray-500">Prioridade: {rec.priority}</p>
          </div>
        ))}
      </div>

      {/* Botão para Atualizar */}
      <Button onClick={refetch}>Atualizar Dados</Button>
    </div>
  );
}
```

## Exemplo 2: Enviar Dados para Análise

```typescript
'use client'

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export function SendAnalysisComponent() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post('/analysis', {
        data: {
          measurements: [
            { timestamp: new Date().toISOString(), value: 85.5 },
            { timestamp: new Date().toISOString(), value: 86.2 },
          ],
        },
        parameters: {
          algorithm: 'erf',
          prediction_days: 30,
        },
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleSendAnalysis} disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Análise'}
      </Button>

      {result && (
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <p className="text-green-800 font-semibold">Sucesso!</p>
          <pre className="text-sm mt-2">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded border border-red-200">
          <p className="text-red-800 font-semibold">Erro</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
```

## Exemplo 3: Verificar Saúde da API

```typescript
'use client'

import { useHealthCheck } from '@/hooks/use-api';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export function HealthCheckComponent() {
  const { isHealthy, healthStatus, isChecking } = useHealthCheck();

  return (
    <div className="flex items-center gap-2">
      {isChecking ? (
        <AlertCircle className="h-5 w-5 text-yellow-500" />
      ) : isHealthy ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
      <span className="text-sm font-medium">
        {healthStatus?.message || 'Verificando...'}
      </span>
    </div>
  );
}
```

## Exemplo 4: Hook Customizado para um Endpoint Específico

```typescript
'use client'

import { useApi } from '@/hooks/use-api';

export function CustomEndpointComponent() {
  // Chamar um endpoint customizado do seu backend
  const { data, loading, error, execute, refetch } = useApi(
    '/api/custom-analysis',
    'GET',
    {
      immediate: true,
      onSuccess: (data) => {
        console.log('Dados recebidos:', data);
      },
      onError: (error) => {
        console.error('Erro:', error);
      },
    }
  );

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

## Exemplo 5: Integrar Múltiplos Endpoints

```typescript
'use client'

import { useAnalysis, usePredictions, useHealthCheck } from '@/hooks/use-api';

export function FullDashboardComponent() {
  const { analysisData, isLoading: analysisLoading } = useAnalysis();
  const { predictions, isLoading: predictionsLoading } = usePredictions(30);
  const { isHealthy } = useHealthCheck();

  const isLoading = analysisLoading || predictionsLoading;

  if (isLoading) return <div className="text-center p-4">Carregando dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Status da API */}
      <div className={`p-4 rounded ${isHealthy ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={isHealthy ? 'text-green-800' : 'text-red-800'}>
          {isHealthy ? '✓ API Online' : '✗ API Offline'}
        </p>
      </div>

      {/* Dados da Análise */}
      {analysisData && (
        <div className="bg-white p-4 rounded border">
          <h2 className="font-bold mb-3">Última Análise</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ERF Value</p>
              <p className="text-2xl font-bold">{analysisData.lastAnalysis.erfValue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Confiança</p>
              <p className="text-2xl font-bold">
                {(analysisData.lastAnalysis.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Previsões */}
      {predictions && predictions.length > 0 && (
        <div className="bg-white p-4 rounded border">
          <h2 className="font-bold mb-3">Próximos 30 Dias</h2>
          <div className="space-y-2">
            {predictions.slice(0, 5).map((pred, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{new Date(pred.date).toLocaleDateString('pt-BR')}</span>
                <span className="font-semibold">{pred.predicted.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Integração no Componente Existente

Para atualizar seu componente de página existente:

```typescript
'use client'

import { useAnalysis } from '@/hooks/use-api'
import { DashboardLayout } from '@/components/dashboard/layout'
import { KPICards } from '@/components/dashboard/kpi-cards'

export default function DashboardPage() {
  const { analysisData, isLoading, error } = useAnalysis()

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>

  // Se não houver dados da API, usar mock data
  const data = analysisData || getDefaultData()

  return (
    <DashboardLayout>
      <KPICards data={data.lastAnalysis} />
      {/* Resto do layout */}
    </DashboardLayout>
  )
}

function getDefaultData() {
  // Fallback para dados mock
  return {/* dados padrão */}
}
```

---

## 💡 Dicas

1. **Usar `immediate: false`** quando não quiser chamar a API automaticamente
2. **Usar `onSuccess` e `onError`** para callbacks customizados
3. **Chamar `refetch()`** para atualizar dados manualmente
4. **Validação Zod** é feita automaticamente
5. **Erros** são tratados e passados para o componente
