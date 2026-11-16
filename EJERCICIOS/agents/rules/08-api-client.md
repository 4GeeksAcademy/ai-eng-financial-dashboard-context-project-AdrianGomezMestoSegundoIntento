---
title: "Crear cliente HTTP reutilizable en lugar de usar fetch raw"
description: "No usar fetch() directamente en componentes. En su lugar, crear un cliente API centralizado (api-client.ts) que encapsule toda la lógica de HTTP. Esto facilita el reuso, manejo consistente de errores y cambios globales."
scope: "project"
globs:
  - "frontend/src/**/*.tsx"
  - "frontend/src/lib/api-client.ts"
application: "Always"
---

## Detalles

- ✅ Crear `frontend/src/lib/api-client.ts` con todas las llamadas API
- ✅ Exportar funciones nombradas para cada endpoint
- ✅ Centralizar headers, autenticación y configuración
- ✅ Usar el mismo cliente en todos los componentes
- ✅ Documentar cada función con JSDoc
- ❌ NO usar fetch() directamente en componentes
- ❌ NO copiar código fetch en múltiples lugares
- ❌ NO duplicar configuración de headers

## Ejemplo ❌ MALO (ACTUAL)

```typescript
// En App.tsx
async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`)
  if (!response.ok) throw new Error(`Failed: ${response.status}`)
  return response.json()
}

// En OtroComponente.tsx - Código duplicado
async function fetchData(): Promise<SummaryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/summary`)
  if (!response.ok) throw new Error(`Failed: ${response.status}`)
  return response.json()
}
```

## Ejemplo ✅ CORRECTO

```typescript
// frontend/src/lib/api-client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

export const apiClient = {
  async getMetrics(params?: MetricsParams): Promise<FinancialMovement[]> {
    const query = new URLSearchParams(params)
    const response = await fetch(`${API_BASE_URL}/api/metrics?${query}`)
    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    return response.json()
  },

  async getSummary(params?: SummaryParams): Promise<SummaryItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/metrics/summary`, {
      method: "GET",
    })
    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    return response.json()
  },
}

// En cualquier componente
import { apiClient } from "@/lib/api-client"

const movements = await apiClient.getMetrics()
```

## Estructura recomendada

```
frontend/src/lib/
├── api-client.ts          ← Cliente centralizado
├── api-types.ts           ← Tipos de request/response
├── financial-types.ts     ← Tipos del dominio
└── financial-utils.ts     ← Funciones de utilidad
```

## Impacto

Permite:
- Cambiar estrategia HTTP sin tocar componentes
- Añadir reintentos globalmente
- Centralizar manejo de errores
- Implementar caché en un solo lugar
- Reducir código duplicado
