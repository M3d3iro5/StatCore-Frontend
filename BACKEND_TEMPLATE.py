"""
StatCore API Backend Template
Este é um template completo para iniciar o backend Python com FastAPI

Instalar dependências:
    pip install fastapi uvicorn python-multipart pydantic python-dotenv

Executar:
    python main.py
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
import ssl
import uvicorn

# ==================== MODELOS ====================

class Measurement(BaseModel):
    """Uma medição individual"""
    timestamp: datetime
    value: float


class LastAnalysis(BaseModel):
    """Dados da última análise"""
    date: datetime
    erfValue: float
    status: str  # 'good', 'warning', 'critical'
    confidence: float


class TemporalPrediction(BaseModel):
    """Uma previsão temporal"""
    date: datetime
    predicted: float
    confidence: float


class ExponentialFit(BaseModel):
    """Ajuste exponencial"""
    coefficient: float
    exponent: float
    r_squared: float


class ERFHistory(BaseModel):
    """Histórico de valores ERF"""
    date: datetime
    value: float


class Recommendation(BaseModel):
    """Uma recomendação"""
    title: str
    description: str
    priority: str  # 'low', 'medium', 'high'


class AnalysisResponse(BaseModel):
    """Resposta completa de análise"""
    lastAnalysis: LastAnalysis
    temporalPrediction: List[TemporalPrediction]
    exponentialFit: ExponentialFit
    erfHistory: List[ERFHistory]
    recommendations: List[Recommendation]


class AnalysisRequest(BaseModel):
    """Requisição de análise"""
    data: dict
    parameters: Optional[dict] = None


class HealthResponse(BaseModel):
    """Resposta de health check"""
    status: str  # 'healthy', 'degraded', 'unhealthy'
    message: str
    timestamp: datetime
    uptime: Optional[float] = None


# ==================== APLICAÇÃO ====================

app = FastAPI(
    title="StatCore API",
    description="API para análise de integridade estrutural com Python",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "http://localhost:8000",
        "https://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ENDPOINTS ====================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Verificar status de saúde da API
    
    Returns:
        HealthResponse: Status da API
    """
    return HealthResponse(
        status="healthy",
        message="API StatCore está funcionando corretamente",
        timestamp=datetime.now(),
        uptime=None
    )


@app.get("/analysis/latest", response_model=AnalysisResponse, tags=["Analysis"])
async def get_latest_analysis():
    """
    Obter dados da análise mais recente
    
    Returns:
        AnalysisResponse: Dados completos da análise
    """
    # AQUI: Buscar dados do seu banco de dados ou processamento
    # Este é um exemplo com dados fake
    
    now = datetime.now()
    
    return AnalysisResponse(
        lastAnalysis=LastAnalysis(
            date=now,
            erfValue=85.5,
            status="good",
            confidence=0.95
        ),
        temporalPrediction=[
            TemporalPrediction(
                date=now + timedelta(days=i),
                predicted=85.5 + (i * 0.1),
                confidence=0.92 - (i * 0.02)
            )
            for i in range(1, 31)
        ],
        exponentialFit=ExponentialFit(
            coefficient=0.95,
            exponent=-0.001,
            r_squared=0.98
        ),
        erfHistory=[
            ERFHistory(
                date=now - timedelta(days=i),
                value=85.0 + (i * 0.05)
            )
            for i in range(30)
        ],
        recommendations=[
            Recommendation(
                title="Monitoramento Contínuo",
                description="Manter monitoramento normal da estrutura",
                priority="low"
            ),
            Recommendation(
                title="Avaliação Trimestral",
                description="Realizar avaliação completa a cada três meses",
                priority="medium"
            )
        ]
    )


@app.post("/analysis", tags=["Analysis"])
async def create_analysis(request: AnalysisRequest):
    """
    Processar uma nova análise
    
    Args:
        request: Dados e parâmetros da análise
        
    Returns:
        Dict com resultado da análise
    """
    # AQUI: Processar os dados com seus algoritmos Python
    # Usar libraries como NumPy, Pandas, Scikit-learn, etc.
    
    try:
        # Exemplo: processar dados
        measurements = request.data.get("measurements", [])
        
        if not measurements:
            raise HTTPException(status_code=400, detail="Nenhuma medição fornecida")
        
        # Seu processamento aqui...
        result_value = sum(m["value"] for m in measurements) / len(measurements)
        
        return {
            "analysisId": "uuid-1234-5678",
            "status": "completed",
            "results": {
                "erfValue": result_value,
                "status": "good"
            },
            "processingTime": 2.5
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analysis", tags=["Analysis"])
async def list_analyses(limit: int = 10, offset: int = 0):
    """
    Listar análises disponíveis
    
    Args:
        limit: Número máximo de resultados
        offset: Deslocamento nos resultados
        
    Returns:
        List de análises
    """
    # AQUI: Buscar análises do banco de dados
    
    return {
        "total": 100,
        "limit": limit,
        "offset": offset,
        "analyses": [
            {
                "id": f"uuid-{i}",
                "date": (datetime.now() - timedelta(days=i)).isoformat(),
                "erfValue": 85.0 + (i * 0.1),
                "status": "good"
            }
            for i in range(limit)
        ]
    }


@app.get("/predictions", tags=["Predictions"])
async def get_predictions(days: int = 30):
    """
    Obter previsões para dias futuros
    
    Args:
        days: Número de dias para prever
        
    Returns:
        Previsões com intervalos de confiança
    """
    # AQUI: Usar seus modelos de previsão
    
    now = datetime.now()
    
    return {
        "predictions": [
            {
                "date": (now + timedelta(days=i)).isoformat(),
                "predicted": 85.5 + (i * 0.05),
                "confidence": 0.95 - (i * 0.01),
                "lower_bound": 84.0 + (i * 0.05),
                "upper_bound": 87.0 + (i * 0.05)
            }
            for i in range(1, min(days + 1, 91))
        ],
        "model_info": {
            "type": "temporal",
            "accuracy": 0.95,
            "trained_date": datetime.now().isoformat()
        }
    }


# ==================== INICIALIZAÇÃO ====================

if __name__ == "__main__":
    # Para desenvolvimento: sem SSL
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    
    # Para desenvolvimento com SSL auto-assinado:
    # 1. Gere os certificados:
    #    openssl req -x509 -newkey rsa:4096 -nodes \
    #      -out cert.pem -keyout key.pem -days 365
    #
    # 2. Execute com SSL:
    
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    try:
        ssl_context.load_cert_chain("cert.pem", "key.pem")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            ssl_context=ssl_context,
            log_level="info"
        )
    except FileNotFoundError:
        print("⚠️  Certificados SSL não encontrados!")
        print("Gerando certificados auto-assinados...")
        import subprocess
        subprocess.run([
            "openssl", "req", "-x509", "-newkey", "rsa:4096",
            "-nodes", "-out", "cert.pem", "-keyout", "key.pem",
            "-days", "365", "-subj", "/CN=localhost"
        ])
        print("✅ Certificados gerados! Reinicie o servidor.")
