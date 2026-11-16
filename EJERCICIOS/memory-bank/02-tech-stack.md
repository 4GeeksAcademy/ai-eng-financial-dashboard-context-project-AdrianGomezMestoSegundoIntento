# Tarea 2: Stack Tecnológico del Proyecto

**Fecha**: 2024-11-16
**Realizado por**: Copilot - Full-Stack Agent

---

## Stack Completo

```
┌─────────────────────────────────────────┐
│          FRONTEND LAYER                 │
│        (Cliente / Navegador)            │
├─────────────────────────────────────────┤
│ React 19.2.4 + TypeScript 6.0.2         │
│ Vite 8.0.4 (Build & Dev Server)         │
│ Tailwind CSS 4.2.2 (Styling)            │
│ Recharts 3.8.1 (Charts/Visualización)   │
├─────────────────────────────────────────┤
│          API LAYER                      │
│        (HTTP Communication)             │
├─────────────────────────────────────────┤
│ Fetch API (HTTP Client)                 │
│ JSON (Data Format)                      │
├─────────────────────────────────────────┤
│          BACKEND LAYER                  │
│       (Servidor / Lógica)               │
├─────────────────────────────────────────┤
│ FastAPI 0.109.0 (Framework)             │
│ Uvicorn 0.27.0 (ASGI Server)            │
│ Pydantic (Validación de datos)          │
│ Python 3.13 (Runtime)                   │
├─────────────────────────────────────────┤
│          INFRAESTRUCTURA                │
│       (Containerización)                │
├─────────────────────────────────────────┤
│ Docker (Containerización)               │
│ Docker Compose (Orquestación)           │
└─────────────────────────────────────────┘
```

---

## 1. FRONTEND

### Framework Principal
**React 19.2.4**
```typescript
// Ubicación: frontend/src/App.tsx
import { useEffect, useState } from "react";

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFinancialData().then(movements => {
      setMetrics(computeKPIs(movements));
    });
  }, []);
  
  return (
    <main className="dark min-h-screen bg-background">
      <KPIRow metrics={metrics} loading={loading} />
      <IncomeOutcomeChart data={monthlyData} loading={loading} />
    </main>
  );
}
```

### TypeScript 6.0.2
Proporciona type safety en tiempo de compilación:
```typescript
// frontend/src/lib/financial-types.ts
export interface KPIMetrics {
  totalIncome: number;
  totalOutcome: number;
  profit: number;
  profitPercent: number;
}

export type OperationType = 'income' | 'outcome';
export type BusinessType = 'B2B' | 'B2C';
```

### Build Tool: Vite 8.0.4
Configuración en `frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'  // Proxy a backend
    }
  }
})
```

**Comandos**:
- `npm run dev` - Desarrollo con hot-reload
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

### Styling: Tailwind CSS 4.2.2
Clases de utilidad para estilos:
```typescript
// En componentes .tsx
<div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
  {error}
</div>
```

**Archivo de configuración**: `frontend/tailwind.config.ts`

### Visualización: Recharts 3.8.1
Gráficos interactivos:
```typescript
// frontend/src/components/dashboard/income-outcome-chart.tsx
import { LineChart, Line, CartesianGrid, Tooltip } from 'recharts'

export function IncomeOutcomeChart({ data, loading }: Props) {
  return (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <Line type="monotone" dataKey="income" stroke="#10b981" />
      <Line type="monotone" dataKey="outcome" stroke="#ef4444" />
      <Tooltip />
    </LineChart>
  )
}
```

**Otros componentes**: `lucide-react` (iconos)

### Testing: Vitest 4.1.4
```bash
npm run test              # Ejecutar tests
npm run test:watch        # Modo watch
npm run test:coverage     # Con cobertura
```

**Archivo de test**: `frontend/src/lib/financial-utils.test.ts`

### Linting: ESLint 9.39.4
```bash
npm run lint             # Verificar código
```

---

## 2. API LAYER

### Protocolo HTTP
- **Método**: REST (GET requests)
- **Formato de respuesta**: JSON
- **Autenticación**: No implementada
- **Versionado de API**: No (endpoints en `/api/metrics/...`)

### Cliente HTTP (Frontend)
```typescript
// frontend/src/App.tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) throw new Error(`Failed: ${response.status}`);
  return response.json();
}
```

### Serialización de Datos
- **Formato**: JSON
- **Charset**: UTF-8
- **Validación**: Pydantic (backend)

---

## 3. BACKEND

### Framework: FastAPI 0.109.0
Microframework Python moderno:
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Financial Metrics API")

# CORS middleware (actualmente permisivo - ver Regla 06)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Documentación automática**: Swagger en `http://localhost:8000/docs`

### Validación: Pydantic
```python
# backend/app/routes.py
class FinancialMovement(BaseModel):
    create_date: date
    amount: float
    operation_type: OperationType  # Literal["income", "outcome"]
    category: Category
    business_type: BusinessType

# Validación automática en endpoints
@router.get("/api/metrics", response_model=list[FinancialMovement])
def get_metrics(...) -> list[FinancialMovement]:
    ...
```

### Servidor ASGI: Uvicorn 0.27.0
Ejecuta FastAPI en modo producción-like:
```bash
# En docker
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Lógica de Negocio
Funciones puras en `backend/app/routes.py`:

**Generación de datos**:
```python
def generate_mock_movements(seed: int | None = None) -> list[FinancialMovement]:
    if seed is not None:
        random.seed(seed)
    
    movements: list[FinancialMovement] = []
    for month in range(1, 13):
        income_probability = random.uniform(0.45, 0.7)
        for _ in range(30):  # 30 movimientos por mes
            movements.append(_build_movement(month, income_probability, today))
    
    return movements
```

**Filtrado**:
```python
def filter_movements(
    movements: list[FinancialMovement],
    start_date: date | None,
    end_date: date | None,
    category: Category | None,
    operation_type: OperationType | None,
) -> list[FinancialMovement]:
    # Implementa lógica de filtrado
    ...
```

**Cálculos**:
```python
def calculate_net_value(movements: list[FinancialMovement]) -> float:
    income = sum(item.amount for item in movements 
                 if item.operation_type == "income")
    outcome = sum(item.amount for item in movements 
                  if item.operation_type == "outcome")
    return round(income - outcome, 2)
```

**Detección de anomalías**:
```python
def detect_outcome_alerts(
    summary: list[MetricsSummaryItem],
    threshold: float,
) -> list[MetricsAlert]:
    # Detecta gastos anómalamente altos
    ...
```

### Runtime: Python 3.13
```dockerfile
# backend/Dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Testing: Pytest
```python
# backend/tests/test_routes.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_metrics_endpoint_respects_date_filters():
    response = client.get(
        "/api/metrics",
        params={"start_date": "2025-01-01", "end_date": "2025-01-01"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert all(item["create_date"] == "2025-01-01" for item in payload)
```

**Dependencias de testing**:
- `pytest` - Framework de testing
- `pytest-cov` - Cobertura de código
- `httpx` - Cliente HTTP para tests

---

## 4. INFRAESTRUCTURA

### Containerización: Docker

**Dockerfile Frontend**:
```dockerfile
# frontend/Dockerfile
FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

**Dockerfile Backend**:
```dockerfile
# backend/Dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000 5678
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", 
     "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", 
     "--port", "8000", "--reload"]
```

### Orquestación: Docker Compose

```yaml
# docker-compose.yml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
      - "5678:5678"
    volumes:
      - ./backend:/app
```

**Características**:
- Desarrollo con hot-reload
- Dependencias explícitas (backend debe estar listo primero)
- Acceso a puerto de debug (5678)
- Volúmenes para código fuente

---

## 5. HERRAMIENTAS DE DESARROLLO

### Version Control
- Git
- GitHub (repositorio origen)

### IDE/Editor
- VS Code (recomendado)
- Soporte para Remote Containers
- GitHub Codespaces (entorno cloud)

### Package Managers
- npm (Node.js dependencies)
- pip (Python dependencies)

---

## Tabla Resumen

| Capa | Componente | Versión | Propósito |
|------|-----------|---------|----------|
| **Frontend** | React | 19.2.4 | Framework UI |
| | TypeScript | 6.0.2 | Type safety |
| | Vite | 8.0.4 | Build tool |
| | Tailwind CSS | 4.2.2 | Styling |
| | Recharts | 3.8.1 | Gráficos |
| **Backend** | FastAPI | 0.109.0 | Framework API |
| | Uvicorn | 0.27.0 | ASGI Server |
| | Pydantic | Latest | Validación |
| | Python | 3.13 | Runtime |
| **Testing** | Vitest | 4.1.4 | Frontend tests |
| | Pytest | Latest | Backend tests |
| **DevTools** | ESLint | 9.39.4 | Linting (TS) |
| | Docker | Latest | Containerización |
| **Infrastructure** | Docker Compose | Latest | Orquestación |

---

## Flujo de Datos

```
1. Usuario abre navegador → http://localhost:5173
   
2. Frontend carga React app
   └─ Vite sirve archivos (con HMR)
   
3. App.tsx inicia
   └─ useEffect ejecuta fetchFinancialData()
   
4. Fetch hace HTTP GET a http://localhost:8000/api/metrics
   └─ Vite proxy redirecciona a backend
   
5. Backend (FastAPI/Uvicorn) recibe request
   └─ generate_mock_movements() crea datos
   └─ filter_movements() aplica filtros
   └─ Pydantic serializa a JSON
   
6. JSON viaja de vuelta al frontend
   └─ computeKPIs() procesa datos
   └─ Estado React actualiza
   
7. Componentes re-renderizan
   └─ KPICard, Charts, etc. muestran datos
   └─ Recharts anima gráficos
```

---

## Dependencias de Producción

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.8.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "recharts": "^3.8.1",
    "tailwind-merge": "^3.5.0"
  }
}
```

### Backend (`requirements.txt`)
```
fastapi
uvicorn[standard]
debugpy
pytest
pytest-cov
httpx
```

---

## Resumen del Stack

✅ **Frontend moderno**: React + TypeScript + Vite  
✅ **Styling eficiente**: Tailwind CSS  
✅ **Visualización**: Recharts  
✅ **Backend ligero**: FastAPI  
✅ **Validación automática**: Pydantic  
✅ **Containerización**: Docker + Docker Compose  
✅ **Testing**: Vitest + Pytest  
✅ **Desarrollo**: HMR, Debugger, Linting  

**Propósito**: Stack moderno y educativo que demuestra buenas prácticas de desarrollo full-stack.
