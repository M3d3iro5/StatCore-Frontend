# 📊 StatCore - Guia de Integração Backend Python

## Visão Geral

Este documento fornece as instruções completas para integrar o backend em Python com o frontend Next.js StatCore.

---

## 🚀 Configuração Inicial

### 1. Requisitos para o Backend Python

- **Python 3.9+**
- **FastAPI** ou **Flask** (recomendado: FastAPI)
- **HTTPS habilitado** (SSL/TLS)
- **CORS habilitado** para aceitar requisições do frontend

### 2. Instalação de Dependências (FastAPI)

```bash
pip install fastapi uvicorn python-multipart pydantic
pip install python-dotenv certifi  # Para HTTPS
```

### 3. Estrutura Base do Backend

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ssl

app = FastAPI(
    title="StatCore API",
    description="API para análise de integridade estrutural",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "message": "API está funcionando corretamente",
        "timestamp": datetime.now().isoformat()
    }

# Iniciar com HTTPS
if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        ssl_keyfile="key.pem",
        ssl_certfile="cert.pem",
        ssl_version=ssl.PROTOCOL_TLSv1_2
    )
```

---

## 🔌 Endpoints Esperados

O frontend enviará requisições para os seguintes endpoints:

### 1. **GET /health**

Verificação de status da API.

**Resposta (200):**

```json
{
  "status": "healthy",
  "message": "API está funcionando corretamente",
  "timestamp": "2024-04-08T10:30:00.000Z",
  "uptime": 3600
}
```

---

### 2. **GET /analysis/latest**

Obtém os dados da análise mais recente.

**Resposta (200):**

```json
{
  "lastAnalysis": {
    "date": "2024-04-08T10:00:00Z",
    "erfValue": 85.5,
    "status": "good",
    "confidence": 0.95
  },
  "temporalPrediction": [
    {
      "date": "2024-04-09T10:00:00Z",
      "predicted": 86.2,
      "confidence": 0.92
    },
    {
      "date": "2024-04-10T10:00:00Z",
      "predicted": 87.1,
      "confidence": 0.88
    }
  ],
  "exponentialFit": {
    "coefficient": 0.95,
    "exponent": -0.001,
    "r_squared": 0.98
  },
  "erfHistory": [
    {
      "date": "2024-04-01T00:00:00Z",
      "value": 80.5
    },
    {
      "date": "2024-04-08T00:00:00Z",
      "value": 85.5
    }
  ],
  "recommendations": [
    {
      "title": "Monitoramento Contínuo",
      "description": "Manter monitoramento normal",
      "priority": "low"
    }
  ]
}
```

---

### 3. **POST /analysis**

Envia dados para análise.

**Requisição:**

```json
{
  "data": {
    "measurements": [
      { "timestamp": "2024-04-08T10:00:00Z", "value": 85.5 },
      { "timestamp": "2024-04-08T11:00:00Z", "value": 86.2 }
    ]
  },
  "parameters": {
    "algorithm": "erf",
    "prediction_days": 30
  }
}
```

**Resposta (200):**

```json
{
  "analysisId": "uuid-1234-5678",
  "status": "completed",
  "results": {
    "erfValue": 85.5,
    "status": "good"
  },
  "processingTime": 2.5
}
```

---

### 4. **GET /analysis**

Lista análises disponíveis.

**Parâmetros:**

- `limit` (query, int): Número de resultados (padrão: 10)
- `offset` (query, int): Deslocamento dos resultados (padrão: 0)

**Resposta (200):**

```json
{
  "total": 100,
  "limit": 10,
  "offset": 0,
  "analyses": [
    {
      "id": "uuid-1234",
      "date": "2024-04-08T10:00:00Z",
      "erfValue": 85.5,
      "status": "good"
    }
  ]
}
```

---

### 5. **GET /predictions**

Obtém previsões para um período específico.

**Parâmetros:**

- `days` (query, int): Número de dias para prever (padrão: 30)

**Resposta (200):**

```json
{
  "predictions": [
    {
      "date": "2024-04-09T00:00:00Z",
      "predicted": 86.2,
      "confidence": 0.92,
      "lower_bound": 84.5,
      "upper_bound": 87.9
    }
  ],
  "model_info": {
    "type": "temporal",
    "accuracy": 0.95
  }
}
```

---

## 🔐 Configuração HTTPS

### 1. Gerar Certificados Auto-Assinados (Desenvolvimento)

```bash
# Gerar chave privada
openssl genrsa -out key.pem 2048

# Gerar certificado
openssl req -new -x509 -key key.pem -out cert.pem -days 365
```

### 2. Configurar FastAPI com HTTPS

```python
import ssl
import uvicorn

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
ssl_context.load_cert_chain("cert.pem", "key.pem")

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        ssl_context=ssl_context
    )
```

---

## 📋 Modelos de Dados (Pydantic)

```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LastAnalysis(BaseModel):
    date: datetime
    erfValue: float
    status: str  # 'good', 'warning', 'critical'
    confidence: float

class TemporalPrediction(BaseModel):
    date: datetime
    predicted: float
    confidence: float

class ExponentialFit(BaseModel):
    coefficient: float
    exponent: float
    r_squared: float

class ERFHistory(BaseModel):
    date: datetime
    value: float

class Recommendation(BaseModel):
    title: str
    description: str
    priority: str  # 'low', 'medium', 'high'

class AnalysisResponse(BaseModel):
    lastAnalysis: LastAnalysis
    temporalPrediction: List[TemporalPrediction]
    exponentialFit: ExponentialFit
    erfHistory: List[ERFHistory]
    recommendations: List[Recommendation]
```

---

## 🔗 Conectando ao Frontend

### 1. Variáveis de Ambiente

Configure no `.env.local` do frontend:

```bash
NEXT_PUBLIC_BACKEND_URL=https://localhost:8000
BACKEND_URL=https://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 2. Fazer Requisições

```typescript
import { apiClient } from '@/lib/api-client';

// GET
const data = await apiClient.get('/analysis/latest');

// POST
const result = await apiClient.post('/analysis', {
  data: { measurements: [...] },
  parameters: { algorithm: 'erf' }
});
```

---

## 📊 Exemplo Completo do Backend (FastAPI)

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import uvicorn
import ssl

app = FastAPI(title="StatCore API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class AnalysisData(BaseModel):
    measurements: list

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "API funcionando",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/analysis/latest")
async def get_latest_analysis():
    return {
        "lastAnalysis": {
            "date": datetime.now().isoformat(),
            "erfValue": 85.5,
            "status": "good",
            "confidence": 0.95
        },
        "temporalPrediction": [
            {
                "date": (datetime.now() + timedelta(days=1)).isoformat(),
                "predicted": 86.2,
                "confidence": 0.92
            }
        ],
        "exponentialFit": {
            "coefficient": 0.95,
            "exponent": -0.001,
            "r_squared": 0.98
        },
        "erfHistory": [
            {"date": datetime.now().isoformat(), "value": 85.5}
        ],
        "recommendations": [
            {
                "title": "Monitoramento",
                "description": "Continuar monitorando",
                "priority": "low"
            }
        ]
    }

@app.post("/analysis")
async def create_analysis(data: AnalysisData):
    # Processar dados
    return {
        "analysisId": "uuid-1234",
        "status": "completed",
        "results": {"erfValue": 85.5}
    }

if __name__ == "__main__":
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    ssl_context.load_cert_chain("cert.pem", "key.pem")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        ssl_context=ssl_context
    )
```

---

## 🧪 Testando a Integração

### 1. Iniciar o Backend

```bash
python main.py
```

### 2. Iniciar o Frontend

```bash
npm run dev
```

### 3. Acessar o Swagger

```
http://localhost:3000/swagger
```

### 4. Testar Endpoints

O Swagger UI permite testar todos os endpoints diretamente da interface.

---

## ⚠️ Notas Importantes

1. **HTTPS**: O frontend espera HTTPS em produção. Use certificados válidos.
2. **CORS**: Configure adequadamente para evitar erros de CORS.
3. **Validação**: Todos os dados são validados com Zod no frontend.
4. **Timeout**: Padrão de 30 segundos para requisições.
5. **Erros**: Siga o padrão de resposta definido nos esquemas.

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do Swagger em:

- Frontend: `http://localhost:3000/swagger`
- OpenAPI Spec: `http://localhost:3000/api/swagger`
