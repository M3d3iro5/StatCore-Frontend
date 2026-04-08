# 🏗️ StatCore Frontend - Documentação Completa

Versão: 1.0.0  
Última atualização: Abril 2024

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Instalação](#instalação)
3. [Arquitetura](#arquitetura)
4. [Endpoints da API](#endpoints-da-api)
5. [Uso nos Componentes](#uso-nos-componentes)
6. [Configuração HTTPS](#configuração-https)
7. [Swagger Documentation](#swagger-documentation)
8. [Integração Backend](#integração-backend)

---

## 👀 Visão Geral

StatCore é uma aplicação Next.js para análise de integridade estrutural com integração completa para backend em Python.

### Características Principais

✅ **Dashboard interativo** com gráficos em tempo real  
✅ **API client totalmente configurado** com Axios  
✅ **Validação de dados** com Zod  
✅ **Documentação Swagger/OpenAPI** completa  
✅ **HTTPS pronto para produção**  
✅ **Hooks customizados** para facilitar uso da API  
✅ **Tratamento de erros** robusto

---

## 🚀 Instalação

### 1. Dependências

```bash
npm install
```

### 2. Variáveis de Ambiente

Crie `.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=https://localhost:8000
BACKEND_URL=https://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 3. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                     │
│                                                          │
│  Components (React)                                      │
│       │                                                  │
│       └──▶ Hooks (/hooks/use-api.ts)                    │
│            └──▶ API Client (/lib/api-client.ts)         │
│                 └──▶ Axios Instance                      │
│                      └──▶ HTTPS ◀───┐                   │
│                                      │                   │
└──────────────────────────────────────┼───────────────────┘
                                       │
                         ┌─────────────┘
                         │
                    Next.js API Routes
                    (/app/api/*)
                         │
                    ┌────┴────────────────┐
                    │                     │
           Validation (Zod)         Forwarding to Backend
           Error Handling           Response Transformation
                    │                     │
                    └────────┬────────────┘
                             │
┌──────────────────────────────────────────────────────────┐
│              Backend (Python - FastAPI)                  │
│                                                          │
│  - /health          (Health Check)                       │
│  - /analysis        (Análise de Dados)                   │
│  - /predictions     (Previsões)                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🔌 Endpoints da API

### Health Check

```bash
GET /api/health
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "message": "API está funcionando",
    "timestamp": "2024-04-08T10:30:00Z"
  }
}
```

### Últimas Análises

```bash
GET /api/analysis/latest
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "lastAnalysis": {
      /* ... */
    },
    "temporalPrediction": [
      /* ... */
    ],
    "exponentialFit": {
      /* ... */
    },
    "erfHistory": [
      /* ... */
    ],
    "recommendations": [
      /* ... */
    ]
  }
}
```

### Enviar Análise

```bash
POST /api/analysis
Content-Type: application/json

{
  "data": { "measurements": [...] },
  "parameters": { "algorithm": "erf" }
}
```

### Listar Análises

```bash
GET /api/analysis?limit=10&offset=0
```

### Obter Previsões

```bash
GET /api/predictions?days=30
```

---

## 💻 Uso nos Componentes

### Hook `useAnalysis()`

```typescript
'use client'

import { useAnalysis } from '@/hooks/use-api'

export function MyComponent() {
  const { analysisData, isLoading, error, refetch } = useAnalysis()

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>

  return (
    <div>
      <p>ERF Value: {analysisData?.lastAnalysis.erfValue}</p>
      <button onClick={refetch}>Atualizar</button>
    </div>
  )
}
```

### Hook `usePredictions()`

```typescript
const { predictions, isLoading, error } = usePredictions(30);
```

### Hook `useHealthCheck()`

```typescript
const { isHealthy, healthStatus } = useHealthCheck();
```

### Hook Genérico `useApi()`

```typescript
const { data, loading, error, execute } = useApi(
  '/api/analysis',
  'POST',
  { immediate: false }
)

await execute({ data: {...} })
```

---

## 🔐 Configuração HTTPS

### Desenvolvimento

Para desenvolvimento local, use certificados auto-assinados:

```bash
# Gerar certificado
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365
```

### Produção

Use certificados válidos (Let's Encrypt, DigiCert, etc.)

O cliente está configurado para aceitar certificados auto-assinados em desenvolvimento.

---

## 📚 Swagger Documentation

Acesse a documentação interativa:

```
http://localhost:3000/swagger
```

Aqui você pode:

- 📖 Ver todos os endpoints
- 🧪 Testar requisições
- 📋 Ver exemplos de requisição/resposta
- 🔍 Explorar schemas

---

## 🔗 Integração Backend

### Pré-requisitos

- Python 3.9+
- FastAPI ou Flask
- HTTPS habilitado

### Passos

1. **Leia** `BACKEND_INTEGRATION.md` para instruções completas
2. **Implemente** os endpoints no seu backend
3. **Inicie** o backend em `https://localhost:8000`
4. **Teste** usando o Swagger UI

### Exemplo Mínimo (FastAPI)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/analysis/latest")
async def latest_analysis():
    return {
        "lastAnalysis": {...},
        "recommendations": [...]
    }
```

---

## 📁 Estrutura de Arquivos

```
StatCore-Frontend/
├── app/
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── analysis/
│   │   │   ├── route.ts
│   │   │   └── latest/route.ts
│   │   ├── predictions/route.ts
│   │   └── swagger/route.ts
│   ├── swagger/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── swagger-ui.tsx
│   ├── theme-provider.tsx
│   ├── dashboard/
│   └── ui/
│
├── hooks/
│   ├── use-api.ts          ← NEW
│   └── use-mobile.ts
│
├── lib/
│   ├── api-client.ts       ← NEW
│   ├── api-schemas.ts      ← NEW
│   ├── swagger-config.ts   ← NEW
│   └── utils.ts
│
├── .env.local              ← NEW
├── BACKEND_INTEGRATION.md  ← NEW
├── API_SETUP.md           ← NEW
├── USAGE_EXAMPLES.md      ← NEW
└── README.md              ← This File
```

---

## 🧪 Testando a Integração

### 1. Terminal 1: Backend

```bash
# Instalar dependências Python
pip install fastapi uvicorn

# Iniciar backend
python main.py
```

### 2. Terminal 2: Frontend

```bash
npm run dev
```

### 3. Verificar Conexão

Abra: `http://localhost:3000/swagger`

Clique em "Try it out" em qualquer endpoint para testar!

---

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev      # Iniciar desenvolvimento (hot-reload)
npm run build    # Build para produção
npm start        # Iniciar servidor de produção
npm run lint     # Executar linter
```

### Debug

Enable debug logs:

```bash
# Ver requisições HTTP
// Altere em lib/api-client.ts os console.log
```

---

## 🚨 Troubleshooting

### Erro: "ERR_HTTPS_ERR_INVALID_CERT"

**Solução**: Isso é esperado com certificados auto-assinados em desenvolvimento. O cliente já está configurado para permitir.

### Erro: "CORS blocked by browser"

**Solução**: Certifique-se de que o backend tem CORS configurado:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Erro: "Connection refused"

**Solução**: Verifique se o backend está rodando em `https://localhost:8000`

```bash
# Testar conexão
curl https://localhost:8000/health --insecure
```

---

## 📊 Exemplo: Dashboard Completo

Veja `USAGE_EXAMPLES.md` para exemplos práticos de como:

- Usar hooks nos componentes
- Enviar dados para análise
- Verificar saúde da API
- Integrar múltiplos endpoints

---

## 📝 Notas Importantes

1. **HTTPS**: Sempre use HTTPS em produção
2. **Validação**: Todos os dados são validados com Zod
3. **Tratamento de Erros**: Todos os erros são capturados e tratados
4. **Timeout**: Padrão de 30 segundos para requisições
5. **Mock Data**: Atualmente usa dados mock - configure o backend para dados reais

---

## 🤝 Próximas Etapas

1. ✅ **Fase 1**: Preparação Frontend (COMPLETA)
2. ⏭️ **Fase 2**: Implementar Backend Python
3. ⏭️ **Fase 3**: Testar Integração
4. ⏭️ **Fase 4**: Deploy para Produção

---

## 📞 Suporte

Para dúvidas sobre:

- **API**: Consulte `/api/swagger`
- **Backend**: Leia `BACKEND_INTEGRATION.md`
- **Exemplos**: Veja `USAGE_EXAMPLES.md`
- **Setup**: Consulte `API_SETUP.md`

---

## 📄 Licença

Projeto StatCore - Petrobras

---

**Última atualização**: 08 de Abril de 2024  
**Status**: ✅ Pronto para integração com Backend Python
