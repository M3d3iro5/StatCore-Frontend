# QUICK REFERENCE: Dashboard Update Implementation

## 🔧 Files Modified (5 files total)

### 1. 📝 `components/dashboard/new-analysis-dialog-v2.tsx`

**Changes:** All 3 handlers updated (handleSelectFromBank, handleFileUpload, handleManualSubmit)

**Pattern Applied:**

```javascript
// 1️⃣ POST to process file
const postResult = await apiClient.post(endpoint, payload);

// 2️⃣ WAIT 500ms
await new Promise((r) => setTimeout(r, 500));

// 3️⃣ GET fresh data
const latestAnalysis = await apiClient.get("/api/analysis/latest");

// 4️⃣ Pass to parent
onSuccess?.(latestAnalysis);
```

**Logs Added:**

- `[ANÁLISE] Iniciando POST ...`
- `[ANÁLISE] ✅ POST concluído`
- `[ANÁLISE] Aguardando 500ms ...`
- `[ANÁLISE] GET /api/analysis/latest`
- `[ANÁLISE] ✅ Dados recebidos`

---

### 2. 📝 `app/page.tsx`

**Changes:** Import additional hooks + refetch all in onSuccess callback

**Before:**

```javascript
import { useAnalysis } from "@/hooks/use-api";

const { analysisData, isLoading, error, refetch } = useAnalysis();

onSuccess={() => refetch()}
```

**After:**

```javascript
import {
  useAnalysis,
  usePerdaParede,
  useVidaRemanescente,
  useDadosSinteticos
} from "@/hooks/use-api";

const { analysisData, isLoading, error, refetch } = useAnalysis();
const { refetch: refetchPerdaParede } = usePerdaParede();
const { refetch: refetchVidaRemanescente } = useVidaRemanescente();
const { refetch: refetchDadosSinteticos } = useDadosSinteticos();

onSuccess={() => {
  refetch();
  refetchPerdaParede();
  refetchVidaRemanescente();
  refetchDadosSinteticos();
}}
```

**Logs Added:**

- `[PAGE] 🔄 Triggers refetch para todos os hooks ...`
- `[PAGE] ✅ Todos os hooks disparados ...`

---

### 3. 📝 `components/dashboard/recommendations.tsx`

**Changes:** Support new backend format (priority/title/description)

**Backward Compatibility:**

- Still supports old format: `{ type: "warning", message: "..." }`
- Now also supports: `{ priority: "high", title: "...", description: "..." }`
- Maps priority to type: high→critical, medium→warning, low→success

**Feature Added:**

- Shows "✅ Operação normal" when no recommendations

---

### 4. 📝 `lib/analysis-workflow.ts` (NEW FILE)

**Purpose:** Reusable utility functions for analysis workflow

**Exports:**

- `processFileAndRefresh()` - Coordinates POST + WAIT + GET
- `extractIndicators()` - Gets ERF, status, colors, dimensions
- `extractMetrics()` - Gets remaining life, integrity, corrosion, thickness
- `extractHistoricoPerdaParede()` - Gets historical data for chart
- `extractRecommendations()` - Gets recommendations
- `logAnalysisUpdate()` - Helper for debugging

**Usage:**

```javascript
import { processFileAndRefresh } from "@/lib/analysis-workflow";

const freshData = await processFileAndRefresh("/analysis/spreadsheet/fromdb", {
  arquivo_nome: "file.xlsx",
});
```

---

### 5. 📝 `components/dashboard/erf-gauge.tsx` (POTENTIALLY updated)

**Status:** Component already displays fresh data from parent props
**When Updated:** Automatically when page refetches analysisData

---

## 🎯 Verification Checklist

✅ Check all 3 handlers have GET /api/analysis/latest call

- Line ~139 in handleSelectFromBank
- Line ~213 in handleFileUpload
- Line ~282 in handleManualSubmit

✅ Check all refetch hooks imported in page.tsx

- usePerdaParede
- useVidaRemanescente
- useDadosSinteticos

✅ Check all refetch functions called

- Line ~264 in onSuccess callback

✅ Check Recommendations supports new format

- Priority-to-type mapping exists
- Shows "Operação normal" message

✅ Check workflow utility exists

- `lib/analysis-workflow.ts` created
- Types exported
- Functions documented

---

## 🧪 Testing Workflow

### Step 1: Open DevTools

```
F12 → Console tab
```

### Step 2: Process File

- Click "Nova Análise"
- Select file
- Click "Processar Arquivo"

### Step 3: Observe Console

```
[ANÁLISE] Iniciando POST /analysis/spreadsheet/fromdb com arquivo: ...
[ANÁLISE] ✅ POST concluído. Total medidas: 30
[ANÁLISE] Aguardando 500ms antes de buscar dados atualizados...
[ANÁLISE] GET /api/analysis/latest para obter dados atualizados
[ANÁLISE] ✅ Dados da análise recebidos: {
  erfScore: 0.65,
  erfStatus: "ALTO",
  comprimento: 1000,
  profundidade: 4.2,
  vidaRemanescente: 5.5,
  recommendationsCount: 3
}
[PAGE] 🔄 Triggers refetch para todos os hooks após análise sucesso
[PAGE] ✅ Todos os hooks disparados para refetch
```

### Step 4: Verify Dashboard Updated

- ERF Score changed ✅
- Status de Risco updated ✅
- Comprimento updated ✅
- Profundidade updated ✅
- Your metrics cards (Vida Remanescente, Integridade, Corrosão, Espessura) ✅
- Gráfico updated ✅
- Recomendações updated ✅

---

## 🔗 Data Flow Diagram

```
┌─ User clicks "Nova Análise" ─┐
│                              │
└─────────────────┬────────────┘
                  │
                  ▼
      ┌─────────────────────────┐
      │ new-analysis-dialogV2   │
      │ selectFromBank()        │
      └────────────┬────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │ 1️⃣ POST /analysis/...      │
      │    Process File            │
      └────────────┬───────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │ POST /analysis/compute-   │
      │  result (save result)     │
      └────────────┬───────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │ 2️⃣ WAIT 500ms             │
      │    Backend persists data   │
      └────────────┬───────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │ 3️⃣ GET /api/analysis/latest│
      │    Fetch fresh data        │
      └────────────┬───────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │ 4️⃣ onSuccess(latestData)  │
      │    Pass to page.tsx        │
      └────────────┬───────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │ app/page.tsx::onSuccess    │
      │ 🔄 refetch() ALL hooks:    │
      │ ├─ refetch()               │
      │ ├─ refetchPerdaParede()    │
      │ ├─ refetchVidaRemanescente │
      │ └─ refetchDadosSinteticos()│
      └────────────┬───────────────┘
                   │
           ┌───────┴───────────┬─────────────┬──────────────┐
           │                   │             │              │
           ▼                   ▼             ▼              ▼
      ┌────────────┐    ┌──────────┐   ┌────────────┐   ┌──────────┐
      │ KPICards   │    │ERFGauge  │   │ Perda      │   │Recomend  │
      │✅ Updates  │    │✅ Updates│   │ Parede ✅  │   │✅ Updates│
      └────────────┘    └──────────┘   └────────────┘   └──────────┘
```

---

## 📌 Key Implementation Details

### The 500ms Wait

- Backend needs time to save data to memory
- Prevents race condition where GET returns old data
- Minimal UX impact (imperceptible)

### Multi-Hook Refetch

- Each hook makes independent API call
- All happen in parallel (not chained)
- Dashboard fully refreshed after all complete

### Console Logs

- Prefixed with [ANÁLISE] or [PAGE] for easy filtering
- Shows exactly what data was received
- Easy to spot failures in DevTools

### Backward Compatibility

- Recommendations component works with both formats
- No breaking changes to existing code
- Smooth transition to new backend response format

---

## 🚀 When to Use Workflow Utility

**Good for:**

- Future integrations needing same POST→GET pattern
- Reusing across multiple components
- Testing workflow independently
- Creating automated tests

**Usage Pattern:**

```javascript
import {
  processFileAndRefresh,
  extractIndicators,
  extractMetrics,
} from "@/lib/analysis-workflow";

const freshData = await processFileAndRefresh(endpoint, payload);
const indicators = extractIndicators(freshData);
const metrics = extractMetrics(freshData);
```

---

## 🐛 Debugging Tips

**Log too verbose?**

- Search console for `[ANÁLISE]` or `[PAGE]` to filter

**Data not updating?**

- Check if GET is being called (log would show)
- Verify backend returns data in correct format
- Check browser Network tab for response

**Components not refetching?**

- Verify hook is imported
- Check if refetch function is called
- Look for errors in console

**Recommendations not showing?**

- Check if data has `priority` field
- Verify format: priority (not type), title, description
- Check logs show recommendationsCount > 0
