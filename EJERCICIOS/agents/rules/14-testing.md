---
title: "Mantener tests extensivos y cerca del código"
description: "Los tests deben estar en la misma carpeta que el código que testan (especialmente en frontend) o en carpeta tests/ (backend). Tests deben cubrir casos normales, casos límite y errores."
scope: "project"
globs:
  - "frontend/src/**/*.test.ts"
  - "frontend/src/**/*.test.tsx"
  - "backend/tests/**/*.py"
application: "Always"
---

## Detalles

- ✅ Colocar tests.ts junto a archivo correspondiente (.test.ts)
- ✅ Backend: tests en carpeta `backend/tests/`
- ✅ Cubrir casos de éxito, error y casos límite
- ✅ Usar nombres descriptivos para tests
- ✅ Ejecutar tests antes de commit
- ✅ Mantener tests independientes (no depender de otro test)
- ✅ Usar fixtures para datos de prueba
- ❌ NO escribir tests que solo reiteran la implementación
- ❌ NO dejar tests sin ejecutar (commented out)
- ❌ NO crear tests flaky (que fallan aleatoriamente)

## Estructura recomendada - Frontend

```
frontend/src/
├── lib/
│   ├── financial-utils.ts
│   ├── financial-utils.test.ts    ← Tests del módulo
│   ├── financial-types.ts
│   └── ...
└── components/
    └── dashboard/
        ├── kpi-card.tsx
        ├── kpi-card.test.tsx       ← Tests del componente
        └── ...
```

## Estructura recomendada - Backend

```
backend/
├── app/
│   ├── main.py
│   ├── routes.py
│   └── ...
└── tests/
    ├── conftest.py                ← Fixtures compartidas
    ├── test_routes.py             ← Tests de rutas
    └── ...
```

## Ejemplo ✅ CORRECTO - Backend (FastAPI)

```python
# backend/tests/test_routes.py
from fastapi.testclient import TestClient
from app.main import app
from app.routes import filter_movements_by_date, generate_mock_movements

client = TestClient(app)

def test_generate_mock_movements_returns_full_year_sorted_data():
    """Test mock data generation produces consistent, sorted data."""
    movements = generate_mock_movements(seed=42)
    
    assert len(movements) == 360  # Full year
    assert movements == sorted(movements, key=lambda item: item.create_date)

def test_filter_movements_by_date_includes_range_edges():
    """Test that date filtering includes both start and end dates."""
    movements = generate_mock_movements(seed=42)
    target_date = movements[0].create_date
    
    filtered = filter_movements_by_date(movements, target_date, target_date)
    
    assert filtered  # No vacío
    assert all(movement.create_date == target_date for movement in filtered)

def test_metrics_endpoint_respects_date_filters():
    """Test API endpoint respects date filters."""
    response = client.get(
        "/api/metrics",
        params={"start_date": "2025-01-01", "end_date": "2025-01-01"},
    )
    
    assert response.status_code == 200
    payload = response.json()
    assert all(item["create_date"] == "2025-01-01" for item in payload)
```

## Ejemplo ✅ CORRECTO - Frontend (Vitest)

```typescript
// frontend/src/lib/financial-utils.test.ts
import { describe, it, expect } from 'vitest'
import { computeKPIs, computeMonthlyData } from './financial-utils'
import { FinancialMovement } from './financial-types'

describe('computeKPIs', () => {
  it('calculates correct totals from movements', () => {
    const movements: FinancialMovement[] = [
      {
        create_date: '2024-01-01',
        amount: 1000,
        operation_type: 'income',
        category: 'sales',
        business_type: 'B2B',
      },
      {
        create_date: '2024-01-02',
        amount: 500,
        operation_type: 'outcome',
        category: 'suppliers',
        business_type: 'B2B',
      },
    ]
    
    const kpis = computeKPIs(movements)
    
    expect(kpis.totalIncome).toBe(1000)
    expect(kpis.totalOutcome).toBe(500)
    expect(kpis.profit).toBe(500)
    expect(kpis.profitPercent).toBe(50)
  })
  
  it('handles zero income correctly', () => {
    const movements: FinancialMovement[] = [
      {
        create_date: '2024-01-01',
        amount: 100,
        operation_type: 'outcome',
        category: 'suppliers',
        business_type: 'B2B',
      },
    ]
    
    const kpis = computeKPIs(movements)
    
    expect(kpis.totalIncome).toBe(0)
    expect(kpis.profitPercent).toBe(0)  // No error on division
  })
})
```

## Ejecución de tests

```bash
# Backend
cd backend
pytest                    # Ejecutar todos
pytest -v                 # Verbose
pytest tests/test_routes.py  # Solo un archivo
pytest --cov=app         # Con cobertura

# Frontend
cd frontend
npm test                  # Vitest
npm run test:coverage     # Con cobertura
npm run test:watch        # Modo watch
```

## Impacto

Proporciona:
- Confianza en cambios
- Documentación viva
- Detección temprana de bugs
- Facilita refactorización
- Calidad de código
