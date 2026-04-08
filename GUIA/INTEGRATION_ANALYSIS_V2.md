# 📊 Integração: Nova Análise Dialog V2

## Visão Geral

O sistema de análise foi expandido para suportar **3 métodos de entrada de dados** integrados ao backend Modified B31G 2012:

```
┌─────────────────────────────────────────────────────┐
│         Nova Análise de Integridade                 │
├─────────────────────────────────────────────────────┤
│  Aba 1: Banco    Aba 2: Upload    Aba 3: Manual     │
│  (24 arquivos)   (Seu arquivo)    (Dados diretos)   │
└─────────────────────────────────────────────────────┘
```

---

## 3 Abas Funcionais

### 🗄️ Aba 1: Banco de Dados

**Para que serve**: Selecionar e processar arquivos reais de inspeção

**Dados**: 24 arquivos Excel com 700-1114 medições cada

**Fluxo**:

```
1. Dialog abre → Aba "Banco" carrega lista
   GET /spreadsheets/list

2. Usuário seleciona arquivo (ex: "2024PGA_PH130_ate_256_esp18.xlsx")

3. Clica "Processar Arquivo"
   POST /analysis/spreadsheet/fromdb?arquivo_nome=...

4. Backend retorna:
   - total_medidas: 1114
   - medidas: [{ posicao_m, profundidade, erf, status }, ...]

5. Dashboard atualiza com dados reais
```

**Exemplo de arquivo**:

- Nome: `2024PGA_PH130_ate_256_esp18.xlsx`
- Tamanho: ~1.2 MB
- Medições: 1114 pontos
- Cálculos: b31g2012 para cada ponto

---

### 📁 Aba 2: Upload de Arquivo

**Para que serve**: Processar arquivos Excel customizados

**Entrada**: .xlsx, .xls, .csv com medições

**Fluxo**:

```
1. Usuário seleciona arquivo local

2. Drag & drop ou clique para selecionar

3. Clica "Enviar Arquivo"
   POST /analysis/spreadsheet (FormData)
   - arquivo: File
   - dext_mm: "323.85" (diâmetro externo padrão)

4. Backend processa e retorna análise
```

**Formato esperado**:

```
Coluna A         Coluna B           Coluna C
Posição (m)      Profundidade (mm)  Comprimento (mm)
0.1              3.5                45.2
0.2              2.1                38.5
...
```

---

### ✏️ Aba 3: Entrada Manual

**Para que serve**: Teste rápido com dados únicos

**Entrada**: 3 campos numéricos

```
Profundidade de Corrosão (mm): 8.2    [0-50]
Comprimento do Defeito (mm):   125.4  [0-500]
Espessura Nominal (mm):        18.1   [1-100]
```

**Fluxo**:

```
1. Usuário preenche campos

2. Clica "Calcular Análise"
   POST /analysis/json
   {
     "medidas": [{
       "posicao_m": 1,
       "esp_nominal": 18.1,
       "esp_remanescente": 9.9,
       "profundidade_corrosao": 8.2,
       "comprimento_defeito": 125.4
     }]
   }

3. Backend calcula ERF e retorna
```

---

## Arquitetura de Integração

### Componente Frontend

**Arquivo**: `components/dashboard/new-analysis-dialog-v2.tsx`

```typescript
NewAnalysisDialogV2({
  open: boolean,          // Controla visibilidade
  onOpenChange: function, // Fecha dialog
  onSuccess: function,    // Callback após sucesso (refetch)
})
```

### Estados

```typescript
[isLoading, setIsLoading][(spreadsheets, setSpreadsheets)][ // Enquanto processa // Lista de 24 arquivos
  (selectedFile, setSelectedFile)
][(selectedFileName, setSelectedFileName)]; // Arquivo do upload // Arquivo do banco selecionado
```

### Validação Zod

**Manual Tab**:

```typescript
depth: number(0 - 50);
length: number(0 - 500);
thickness: number(1 - 100);
```

---

## Integração com App

### Em `app/page.tsx`

```typescript
// Import dinâmico com ssr: false
const NewAnalysisDialogV2 = dynamic(
  () => import("@/components/dashboard/new-analysis-dialog-v2").then((m) => ({
      default: m.NewAnalysisDialogV2,
    })),
  { ssr: false },
);

// No JSX
<NewAnalysisDialogV2
  open={dialogOpen}
  onOpenChange={onOpenChange}
  onSuccess={() => refetch()}  // Recarrega dashboard
/>
```

### Fluxo de Estado

```
DashboardPage
├─ dialogOpen: boolean
├─ setDialogOpen: function
├─ refetch: function (atualiza dados)
│
└─ NewAnalysisDialogV2 props
   ├─ open={dialogOpen}
   ├─ onOpenChange={setDialogOpen}
   └─ onSuccess={() => refetch()}
```

---

## Endpoints Utilizados

| Método | Endpoint                       | Propósito                 |
| ------ | ------------------------------ | ------------------------- |
| GET    | `/spreadsheets/list`           | Lista 24 arquivos         |
| POST   | `/analysis/spreadsheet/fromdb` | Processa arquivo do banco |
| POST   | `/analysis/spreadsheet`        | Upload de arquivo         |
| POST   | `/analysis/json`               | Análise com dados manuais |

---

## Resposta do Backend

**Sucesso** (HTTP 200):

```json
{
  "total_medidas": 1114,
  "medidas": [
    {
      "posicao_m": 0.1,
      "profundidade_corrosao": 3.5,
      "erf": 0.9245,
      "status": "SAFE"
    }
  ]
}
```

**Erro** (HTTP 400+):

```json
{
  "detail": "Arquivo não encontrado"
}
```

---

## Toast Notifications

```typescript
// Sucesso
✅ Análise concluída!
   1114 medições processadas com cálculos reais

// Erro
❌ Erro
   Não foi possível carregar lista de planilhas
```

---

## FluxosCompletos de Teste

### Teste 1: Banco de Dados

```
1. Clique em "Nova Análise"
2. Dialog abre na aba "Banco"
3. Seleciona arquivo da lista
4. Clica "Processar Arquivo"
5. Aguarde processamento
6. Dashboard atualiza com 1114 medições
7. Gráficos mostram evolução de ERF
```

### Teste 2: Upload Manual

```
1. Clique em "Nova Análise"
2. Ir para aba "Upload"
3. Seleciona arquivo .xlsx local
4. Clica "Enviar Arquivo"
5. Aguarde resposta
6. Dashboard carrega análise
```

### Teste 3: Entrada Manual

```
1. Clique em "Nova Análise"
2. Ir para aba "Manual"
3. Preenche: depth=8.2, length=125.4, thickness=18.1
4. Clica "Calcular Análise"
5. Dashboard mostra 1 medição com ERF calculado
```

---

## Configuração SSL

O projeto já possui bypass SSL configurado em `lib/api-client.ts`:

```typescript
httpsAgent: {
  rejectUnauthorized: false,  // Permite localhost SSL
}
```

Isso funciona em desenvolvimento. **Em produção, remover esta configuração**.

---

## Status de Integração

✅ **Aba 1 (Banco)**: Pronta - Download automático de lista via GET
✅ **Aba 2 (Upload)**: Pronta - FormData enviado para POST
✅ **Aba 3 (Manual)**: Pronta - Zod validation + POST

✅ **Build**: Compila sem erros (27.7s)
✅ **Dev Server**: Ready em 10.1s
✅ **TypeScript**: Sem erros de tipo

---

## Próximas Melhorias (Opcional)

- [ ] Barra de progresso para upload de arquivos
- [ ] Preview de dados antes de processar
- [ ] Histórico de análises recentes
- [ ] Exportar resultados em PDF
- [ ] Comparação de 2 análises lado a lado

---

## Troubleshooting

**Problema**: Lista de arquivos não aparece
**Solução**: Verificar se backend está em `https://localhost:8000` e endpoint `/spreadsheets/list` funciona

**Problema**: Upload falha com "multipart/form-data"
**Solução**: Verificar se backend aceita FormData e arquivo está sendo enviado corretamente

**Problema**: Dialog não abre
**Solução**: Verificar se `dialogOpen` state está sendo atualizado e buttons têm callbacks corretos

---

## Referências

- Backend: [FastAPI Documentation](https://localhost:8000/docs)
- Frontend: `components/dashboard/new-analysis-dialog-v2.tsx`
- API Client: `lib/api-client.ts`
- App Integration: `app/page.tsx`
