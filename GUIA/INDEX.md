# 📚 Guia Completo - StatCore Frontend

Bem-vindo ao guia de documentação do StatCore Frontend! Aqui você encontra toda a informação sobre o projeto, integração, endpoints e configuração.

---

## 📖 Documentos Disponíveis

### 🚀 Início Rápido

- **[README.md](README.md)** - Visão geral do projeto
- **[SETUP.md](API_SETUP.md)** - Como configurar o ambiente

### 📋 Guias Principais

- **[PROJETO_FINAL_PRONTO.md](PROJETO_FINAL_PRONTO.md)** - Resumo final do projeto (LEIA PRIMEIRO!)
- **[INTEGRATION_ANALYSIS_V2.md](INTEGRATION_ANALYSIS_V2.md)** - Guia completo da Nova Análise Dialog V2
- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - Integração com backend FastAPI

### 💡 Recursos e Abas

- **[TODAS_AS_ABAS_FUNCIONANDO.md](TODAS_AS_ABAS_FUNCIONANDO.md)** - Como as 3 abas funcionam
- **[ABAS_FUNCIONANDO.md](ABAS_FUNCIONANDO.md)** - Detalhes das abas (versão anterior)
- **[NOVA_ANALISE_V2_SUMMARY.md](NOVA_ANALISE_V2_SUMMARY.md)** - Resumo técnico da V2

### 🔧 Referências Técnicas

- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** - Resumo técnico de integração
- **[USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)** - Exemplos de uso da API

---

## 🎯 Por Onde Começar?

### Se você é novo no projeto:

1. Leia **[PROJETO_FINAL_PRONTO.md](PROJETO_FINAL_PRONTO.md)** para entender o big picture
2. Consulte **[INTEGRATION_ANALYSIS_V2.md](INTEGRATION_ANALYSIS_V2.md)** para detalhes de implementação
3. Verifique **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** para endpoints

### Se você vai usar o sistema:

1. Execute **[API_SETUP.md](API_SETUP.md)** para configurar
2. Leia **[TODAS_AS_ABAS_FUNCIONANDO.md](TODAS_AS_ABAS_FUNCIONANDO.md)** para aprender a usar
3. Consulte **[USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)** para exemplos práticos

### Se você vai desenvolver/manter:

1. Estude **[INTEGRATION_ANALYSIS_V2.md](INTEGRATION_ANALYSIS_V2.md)** para arquitetura
2. Revise **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** para endpoints
3. Consulte **[NOVA_ANALISE_V2_SUMMARY.md](NOVA_ANALISE_V2_SUMMARY.md)** para implementação

---

## 🗺️ Estrutura do Projeto

```
StatCore-Frontend/
├── GUIA/                          ← Você está aqui
│   ├── INDEX.md                   ← Este arquivo
│   ├── PROJETO_FINAL_PRONTO.md
│   ├── INTEGRATION_ANALYSIS_V2.md
│   ├── TODAS_AS_ABAS_FUNCIONANDO.md
│   └── ... (outros docs)
│
├── components/
│   └── dashboard/
│       ├── new-analysis-dialog-v2.tsx  ← Component principal
│       ├── layout.tsx
│       ├── kpi-cards.tsx
│       └── ...
│
├── app/
│   └── page.tsx                   ← Página principal
│
├── hooks/
│   └── use-api.ts                 ← Hooks de API
│
└── lib/
    └── api-client.ts              ← Cliente HTTP
```

---

## 🔧 Stack Tecnológico

| Camada            | Tecnologias                              |
| ----------------- | ---------------------------------------- |
| **Frontend**      | Next.js 16.1.6, React 19.2.4, TypeScript |
| **UI Components** | Shadcn/ui, Tailwind CSS                  |
| **Formulários**   | React Hook Form, Zod                     |
| **Gráficos**      | Recharts                                 |
| **HTTP Client**   | Axios                                    |
| **Backend**       | FastAPI (Python)                         |

---

## 📊 Funcionalidades Principais

### ✅ Nova Análise Dialog V2

- 3 abas: Banco de Dados, Upload, Manual
- Integração com 4 endpoints backend
- Validação de dados com Zod
- Notificações com Toast

### ✅ Dashboard

- KPI Cards com ERF, Status
- Gráfico Exponencial com curve fitting
- Gráfico Temporal com previsões
- Tabela de histórico
- Recomendações inteligentes

### ✅ Data Real

- 24 arquivos Excel com 700-1114 medições cada
- Cálculos B31G 2012 Modified
- Processamento de pipeline inspection data

---

## 🚀 Comandos Úteis

```bash
# Development
npm run dev              # Inicia dev server (http://localhost:3000)

# Build
npm run build            # Compila para produção

# Type checking
npm run type-check       # Verifica tipos TypeScript

# Linting
npm run lint             # Verifica style guide
```

---

## 📞 Endpoints Backend

| Método | Endpoint                       | Descrição                 |
| ------ | ------------------------------ | ------------------------- |
| GET    | `/spreadsheets/list`           | Lista 24 arquivos         |
| POST   | `/analysis/spreadsheet/fromdb` | Processa arquivo do banco |
| POST   | `/analysis/spreadsheet`        | Upload de arquivo         |
| POST   | `/analysis/json`               | Análise com dados manuais |
| GET    | `/analysis/latest`             | Última análise realizada  |
| GET    | `/predictions?days=X`          | Previsões temporais       |

---

## 🐛 Troubleshooting

### Problema: "Nenhum arquivo disponível" na aba Banco

**Solução**: Verificar se backend está em `https://localhost:8000` e endpoint `/spreadsheets/list` funciona

### Problema: Dados não são carregados

**Solução**: Submeter uma análise usando o dialog. Dados mock aparecem até primeira análise real

### Problema: Erro "Connection refused"

**Solução**: Certificar-se de que backend FastAPI está rodando em `https://localhost:8000`

---

## 📈 Versões

| Versão | Data     | Status        | Mudanças                     |
| ------ | -------- | ------------- | ---------------------------- |
| v2.0   | Abr 2026 | ✅ Atual      | 3 abas + integração completa |
| v1.0   | Mar 2026 | ⚠️ Deprecated | Formulário simples           |

---

## 📝 Notas Importantes

- ⚠️ SSL bypass está ativado para `localhost` - **Remover em produção**
- 🔒 Não commitar `.env.local` com credenciais reais
- 📱 Interface é responsiva (mobile + desktop)
- 🌙 Dark mode suportado

---

## 👥 Time

- **Frontend**: React/TypeScript
- **Backend**: FastAPI/Python com Modified B31G 2012
- **Infra**: Localhost (dev) → Produção (TBD)

---

## 📫 Contato & Suporte

Para dúvidas ou problemas:

1. Consulte os documentos nesta pasta
2. Verifique os endpoints em `/api/docs` (backend)
3. Abra uma issue no repositório

---

**Última atualização**: Abril 2026  
**Status**: ✅ Pronto para Produção
