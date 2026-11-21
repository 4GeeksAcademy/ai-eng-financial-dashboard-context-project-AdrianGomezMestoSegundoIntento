# Contrato de Datos — Financial Metrics Dashboard (Fase 3)

**Versión**: 1.0  
**Fase**: Frontend Implementation  
**Fecha**: 2026-11-16  
**Propósito**: Documentación autosuficiente del contrato de datos entre frontend y API backend.

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Funcionalidad 1: Facets (Rango de Fechas)](#funcionalidad-1-facets-rango-de-fechas)
3. [Funcionalidad 2: Alertas de Anomalías](#funcionalidad-2-alertas-de-anomalías)
4. [Funcionalidad 3: Top Categorías (B2B vs B2C)](#funcionalidad-3-top-categorías-b2b-vs-b2c)
5. [Convenciones Globales](#convenciones-globales)
6. [Referencias de Tipos](#referencias-de-tipos)

---

## Introducción

Este documento especifica el contrato de datos (API REST) que el frontend consume para las 3 funcionalidades nuevas. Cada sección incluye:

- **Endpoint exacto** (ruta verificada en `/backend/app/routes.py`)
- **Parámetros de query** con rangos, formatos y validaciones
- **Tipos TypeScript** (referencias a `api-types.ts` y `param-types.ts`)
- **Casos límite** con ejemplos y comportamiento esperado en UI

### Para Leer Este Documento

Este README es **autosuficiente**. Un agente sin contexto previo puede:
1. Encontrar el endpoint exacto para cada funcionalidad
2. Construir URLs de query correctas
3. Parsear respuestas tipadas
4. Manejar casos límite sin necesidad de seguimiento

---

## Funcionalidad 1: Facets (Rango de Fechas)

### Propósito

Obtener el rango de fechas disponible en el dataset (fecha mínima y máxima) para:
1. Mostrar "Datos disponibles de [min] a [max]" en el componente `DateRangeFilter`
2. Validar que inputs de usuario no estén fuera de rango
3. Alimentar referencias visuales en la UI

---

### Endpoint

**Ruta**: `GET /api/metrics/facets`

**URL Completa**: `http://[host]:[port]/api/metrics/facets`

**Método HTTP**: GET  
**Parámetros Query**: Ninguno  
**Autenticación**: No requerida  
**CORS**: Habilitado (todos los orígenes)

**Código de Respuesta**:
- `200 OK` — Siempre retorna éxito (sin validaciones de entrada)
- `500 Server Error` — Solo si falla generación de datos (muy raro)

---

### Parámetros de Query

**Esta solicitud no acepta parámetros.** Siempre retorna facets de todo el dataset.

---

### Tipo de Respuesta

**TypeScript**: `FacetsResponse` (de `api-types.ts`)

```typescript
interface FacetsResponse {
  operation_types: Array<"income" | "outcome">;    // Siempre ["income", "outcome"]
  business_types: Array<"B2B" | "B2C">;           // Siempre ["B2B", "B2C"]
  categories: Array<"suppliers" | "sales" | "operational" | "administrative" | "others">;
  min_date: string;  // Formato YYYY-MM-DD (ej: "2025-01-15")
  max_date: string;  // Formato YYYY-MM-DD (ej: "2026-01-14")
}
```

**Notas de Implementación**:
- `operation_types`, `business_types`, `categories` son **estáticos y predecibles**
- `min_date` y `max_date` **cambian según seed** (en producción, según datos reales)
- Con seed=42 (datos mock): min_date es circa 2025-01-01, max_date es circa 2026-01-01

---

### Ejemplo de Solicitud y Respuesta

**Solicitud**:
```bash
curl -X GET "http://localhost:8000/api/metrics/facets"
```

**Respuesta (200 OK)**:
```json
{
  "operation_types": ["income", "outcome"],
  "business_types": ["B2B", "B2C"],
  "categories": ["administrative", "operational", "others", "sales", "suppliers"],
  "min_date": "2025-01-02",
  "max_date": "2026-01-01"
}
```

---

### Casos Límite

#### Caso 1.1: Dataset Vacío

**Escenario**: Backend genera un dataset vacío (edge case teórico, no sucede en Fase 3).

**Esperado en Respuesta**:
```json
{
  "operation_types": [],
  "business_types": [],
  "categories": [],
  "min_date": null,  // ¿O error?
  "max_date": null
}
```

**Comportamiento UI**:
- `DateRangeFilter` muestra: "No hay datos disponibles"
- Inputs deshabilitados
- Nada más en la página

**Implementación Frontend**:
```typescript
if (!facets.min_date || !facets.max_date) {
  return <div>No hay datos en el sistema</div>;
}
```

#### Caso 1.2: Rango Exacto de Un Día

**Escenario**: Backend retorna min_date === max_date (todos los datos en un único día).

**Respuesta**:
```json
{
  "min_date": "2025-06-15",
  "max_date": "2025-06-15"
}
```

**Comportamiento UI**:
- Mostrar: "Datos disponibles: 15/06/2025"
- `DateRangeFilter` acepta solo esa fecha
- Si usuario intenta otro rango, error de validación

---

### Integración en Frontend

**Componente**: `DateRangeFilter`

```typescript
function DateRangeFilter() {
  const { data: facets, loading, error } = useFacets();
  
  if (loading) return <Spinner />;
  if (error) return <Error msg={error} />;
  if (!facets) return <div>Sin datos</div>;

  return (
    <div>
      <label>Rango Disponible: {facets.min_date} a {facets.max_date}</label>
      <input type="date" min={facets.min_date} max={facets.max_date} />
    </div>
  );
}
```

---

## Funcionalidad 2: Alertas de Anomalías

### Propósito

Detectar períodos en los que el gasto **subió inesperadamente** comparando con una línea base (media móvil de 3 períodos anteriores). Retorna lista de alertas con:
- Período en el que se detectó la anomalía
- Monto de gasto registrado
- Baseline (promedio de 3 períodos previos)
- Ratio de incremento

---

### Endpoint

**Ruta**: `GET /api/metrics/alerts`

**URL Completa**: `http://[host]:[port]/api/metrics/alerts?threshold=0.3&group_by=month&start_date=2025-01-01&end_date=2026-01-01`

**Método HTTP**: GET  
**Parámetros Query**: Todos opcionales  
**Autenticación**: No requerida  
**CORS**: Habilitado

**Código de Respuesta**:
- `200 OK` — Retorna array (puede estar vacío)
- `400 Bad Request` — Parámetros inválidos (ej: threshold < 0, fechas mal formateadas)
- `500 Server Error` — Error interno

---

### Parámetros de Query

**Tipo TypeScript**: `AlertsParams` (de `param-types.ts`)

Extends `DateRangeFilter` + parámetros específicos:

| Parámetro | Tipo | Rango/Valores | Default | Formato | Requerido |
|-----------|------|---|---------|---------|-----------|
| `threshold` | `number` | 0.01 ≤ x ≤ ∞ | 0.3 | Decimal (ej: 0.3 = 30% incremento) | No |
| `group_by` | `string` | "day" \| "week" \| "month" | "month" | Literal | No |
| `start_date` | `string` | Cualquier fecha | undefined | YYYY-MM-DD | No |
| `end_date` | `string` | Cualquier fecha | undefined | YYYY-MM-DD | No |
| `business_type` | `string` | "B2B" \| "B2C" | undefined | Literal | No |

**Restricciones y Validaciones**:

- **threshold**: 
  - Mínimo recomendado: 0.01 (1% de incremento)
  - Máximo común: 1.0 (100% de incremento)
  - Backend valida: `ge=0` (≥ 0), no hay máximo en backend
  - **Validación cliente**: Mostrar error si < 0.01 o > 1.0 (restricción UX)

- **group_by**:
  - "day" → período = YYYY-MM-DD (ej: "2025-06-15")
  - "week" → período = YYYY-WNN (ej: "2025-W24" = semana ISO 24)
  - "month" → período = YYYY-MM (ej: "2025-06")

- **start_date, end_date**:
  - Formato estricto: YYYY-MM-DD (ej: "2025-01-15")
  - Ambos opcionales
  - Si se proporcionan: start_date ≤ end_date (validación cliente)
  - Rango válido: Debe estar dentro de [facets.min_date, facets.max_date]

- **business_type**:
  - "B2B" → solo alertas de operaciones B2B
  - "B2C" → solo alertas de operaciones B2C
  - undefined → alertas de ambas líneas de negocio

---

### Tipo de Respuesta

**TypeScript**: `AlertsResponse` (array de `AlertEntry`, de `api-types.ts`)

```typescript
type AlertsResponse = AlertEntry[];

interface AlertEntry {
  period: string;              // Formato según group_by (YYYY-MM-DD, YYYY-WNN, o YYYY-MM)
  outcome_total: number;       // Monto de gasto en el período (ej: 1234.56)
  baseline_average: number;    // Media de 3 períodos anteriores (ej: 1000.00)
  increase_ratio: number;      // (outcome_total - baseline_average) / baseline_average
                               // Ej: 0.2347 = 23.47% de incremento
}
```

**Notas**:
- Array retornado está **ordenado cronológicamente** (período más antiguo primero)
- Si no hay alertas para el threshold: **array vacío `[]`** (no null, no error)
- Cada `AlertEntry` siempre tiene 4 campos
- `increase_ratio` puede ser >= threshold (típicamente)

---

### Ejemplo de Solicitud y Respuesta

**Solicitud 1** (Threshold 30%, agrupación mensual):
```bash
curl -X GET "http://localhost:8000/api/metrics/alerts?threshold=0.3&group_by=month"
```

**Respuesta (200 OK)**:
```json
[
  {
    "period": "2025-07",
    "outcome_total": 1500.50,
    "baseline_average": 1000.00,
    "increase_ratio": 0.5005
  },
  {
    "period": "2025-09",
    "outcome_total": 1350.00,
    "baseline_average": 1000.00,
    "increase_ratio": 0.35
  }
]
```

**Solicitud 2** (Con filtro de rango y business_type):
```bash
curl -X GET "http://localhost:8000/api/metrics/alerts?threshold=0.5&start_date=2025-06-01&end_date=2025-12-31&business_type=B2B"
```

**Respuesta (200 OK)**:
```json
[]
```
(Sin alertas que cumplan criterios)

---

### Casos Límite

#### Caso 2.1: Threshold Muy Bajo (0.01)

**Escenario**: Usuario ajusta threshold a 0.01 (1% incremento = muy sensible).

**Solicitud**:
```bash
?threshold=0.01
```

**Respuesta Esperada**: Array con muchas alertas (casi cualquier variación dispara).

**Respuesta Ejemplo**:
```json
[
  {"period": "2025-02", "outcome_total": 1010.00, "baseline_average": 1000.00, "increase_ratio": 0.01},
  {"period": "2025-03", "outcome_total": 1015.50, "baseline_average": 1010.00, "increase_ratio": 0.00545},
  ... (10+ alertas)
]
```

**Comportamiento UI**:
- Tabla muestra muchas filas
- Mensaje: "Se detectaron [N] anomalías para el umbral 0.01"
- Si > 20 alertas: considerar paginación (nice-to-have)

---

#### Caso 2.2: Threshold Muy Alto (1.0 = 100% incremento)

**Escenario**: Usuario ajusta threshold a 1.0 (gasto debe duplicarse para alerta).

**Solicitud**:
```bash
?threshold=1.0
```

**Respuesta Esperada**: Array vacío o muy pocas alertas.

```json
[]
```

**Comportamiento UI**:
- Tabla desaparece
- Muestra: "No se detectaron anomalías para el umbral 1.0. Ajusta el umbral para más sensibilidad."
- Input de threshold visible para permitir cambio

---

#### Caso 2.3: Rango de Fechas Sin Datos

**Escenario**: Usuario filtra por rango fuera del dataset.

**Solicitud**:
```bash
?start_date=2030-01-01&end_date=2030-12-31
```

**Respuesta Esperada**: Array vacío (no hay movimientos en ese rango).

```json
[]
```

**Comportamiento UI**:
- Tabla desaparece
- Muestra: "No hay datos en el rango [2030-01-01 a 2030-12-31]"

---

### Integración en Frontend

**Componente**: `AnomaliesAlertsTable`

```typescript
interface AnomaliesAlertsTableProps {
  alerts: AlertsResponse;
  params: AlertsParams;
  onParamsChange: (params: AlertsParams) => void;
  isLoading?: boolean;
  error?: string | null;
}

function AnomaliesAlertsTable(props: AnomaliesAlertsTableProps) {
  if (props.isLoading) return <Spinner />;
  if (props.error) return <Error msg={props.error} />;
  
  if (props.alerts.length === 0) {
    return <EmptyState 
      message={`No se detectaron anomalías para el umbral ${props.params.threshold}`}
    />;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Período</th>
          <th>Outcome Registrado</th>
          <th>Media Móvil (3 períodos)</th>
          <th>Incremento %</th>
        </tr>
      </thead>
      <tbody>
        {props.alerts.map(alert => (
          <tr key={alert.period}>
            <td>{alert.period}</td>
            <td>${alert.outcome_total.toFixed(2)}</td>
            <td>${alert.baseline_average.toFixed(2)}</td>
            <td>{(alert.increase_ratio * 100).toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Funcionalidad 3: Top Categorías (B2B vs B2C)

### Propósito

Obtener las **top N categorías** (por monto total) para una línea de negocio (B2B o B2C) y un tipo de operación (income o outcome). Usado para:
1. Tabla en `TopCategoriesSection` — mostrar top 5 ingresos por B2B/B2C
2. Calcular totales para `ComparisonChart`

---

### Endpoint

**Ruta**: `GET /api/metrics/categories/top`

**URL Completa**: `http://[host]:[port]/api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B&start_date=2025-01-01&end_date=2026-01-01`

**Método HTTP**: GET  
**Parámetros Query**: `operation_type` requerido; otros opcionales  
**Autenticación**: No requerida  
**CORS**: Habilitado

**Código de Respuesta**:
- `200 OK` — Retorna array (puede estar vacío)
- `400 Bad Request` — Parámetros inválidos (ej: limit > 20, operation_type inválido)
- `500 Server Error` — Error interno

---

### Parámetros de Query

**Tipo TypeScript**: `TopCategoriesParams` (de `param-types.ts`)

Extends `DateRangeFilter` + parámetros específicos:

| Parámetro | Tipo | Rango/Valores | Default | Formato | Requerido |
|-----------|------|---|---------|---------|-----------|
| `operation_type` | `string` | "income" \| "outcome" | "outcome" | Literal | **Sí** |
| `limit` | `integer` | 1 ≤ x ≤ 20 | 5 | Número entero | No |
| `start_date` | `string` | Cualquier fecha | undefined | YYYY-MM-DD | No |
| `end_date` | `string` | Cualquier fecha | undefined | YYYY-MM-DD | No |
| `business_type` | `string` | "B2B" \| "B2C" | undefined | Literal | No |

**Restricciones y Validaciones**:

- **operation_type**:
  - "income" → categorías de ingreso (principalmente "sales")
  - "outcome" → categorías de egreso ("suppliers", "operational", "administrative", "others")
  - **Validación cliente**: Mostrar error si no es uno de estos dos valores
  - **En Fase 3**: Siempre se usa "income" para Funcionalidad 3 (hardcoded)

- **limit**:
  - Rango: 1 a 20
  - Default: 5
  - Backend valida: `ge=1, le=20`
  - **Validación cliente**: Mostrar error si < 1 o > 20
  - **En Fase 3**: Siempre se usa 5 para Funcionalidad 3 (hardcoded)

- **start_date, end_date**:
  - Formato estricto: YYYY-MM-DD
  - Ambos opcionales
  - Si se proporcionan: start_date ≤ end_date
  - Rango válido: Dentro de [facets.min_date, facets.max_date]

- **business_type**:
  - "B2B" → solo movimientos B2B
  - "B2C" → solo movimientos B2C
  - undefined → agregado de ambas líneas de negocio
  - **En Fase 3**: Se especifica explícitamente (B2B o B2C por sección)

---

### Tipo de Respuesta

**TypeScript**: `TopCategoriesResponse` (array de `CategoryEntry`, de `api-types.ts`)

```typescript
type TopCategoriesResponse = CategoryEntry[];

interface CategoryEntry {
  category: "suppliers" | "sales" | "operational" | "administrative" | "others";
  operation_type: "income" | "outcome";  // Refleja el parámetro enviado
  total_amount: number;                  // Monto total (ej: 5234.67)
}
```

**Notas**:
- Array retornado está **ordenado por `total_amount` descendente** (mayor primero)
- Longitud máxima = `limit` (ej: si limit=5, máximo 5 items)
- Longitud real puede ser < limit si hay < limit categorías con datos
- Si no hay datos para los criterios: **array vacío `[]`**
- El campo `operation_type` siempre coincide con el parámetro de entrada

---

### Ejemplo de Solicitud y Respuesta

**Solicitud 1** (Top 5 ingresos para B2B):
```bash
curl -X GET "http://localhost:8000/api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B"
```

**Respuesta (200 OK)**:
```json
[
  {
    "category": "sales",
    "operation_type": "income",
    "total_amount": 45670.50
  },
  {
    "category": "others",
    "operation_type": "income",
    "total_amount": 2345.25
  }
]
```

**Solicitud 2** (Top 3 gastos para B2C, rango específico):
```bash
curl -X GET "http://localhost:8000/api/metrics/categories/top?operation_type=outcome&limit=3&business_type=B2C&start_date=2025-06-01&end_date=2025-12-31"
```

**Respuesta (200 OK)**:
```json
[
  {
    "category": "suppliers",
    "operation_type": "outcome",
    "total_amount": 12345.00
  },
  {
    "category": "operational",
    "operation_type": "outcome",
    "total_amount": 8900.50
  },
  {
    "category": "administrative",
    "operation_type": "outcome",
    "total_amount": 3200.00
  }
]
```

---

### Casos Límite

#### Caso 3.1: Limit Mayor que Categorías Disponibles

**Escenario**: Usuario solicita top 10 ingresos, pero solo existen 2 categorías con datos.

**Solicitud**:
```bash
?operation_type=income&limit=10&business_type=B2B
```

**Respuesta Esperada**:
```json
[
  {"category": "sales", "operation_type": "income", "total_amount": 50000.00},
  {"category": "others", "operation_type": "income", "total_amount": 1000.00}
]
```
(Array con 2 items, no 10)

**Comportamiento UI**:
- Tabla muestra solo 2 filas (no fuerza a 10 vacías)
- Mensaje: "Top 2 de 10 solicitados (otras categorías sin datos)"

---

#### Caso 3.2: Business Type Sin Datos

**Escenario**: Usuario filtra por "B2C" pero en el rango seleccionado no hay operaciones B2C.

**Solicitud**:
```bash
?operation_type=income&limit=5&business_type=B2C&start_date=2025-01-01&end_date=2025-01-05
```

**Respuesta Esperada**:
```json
[]
```

**Comportamiento UI**:
- Tabla desaparece
- Muestra: "No hay ingresos registrados para B2C en este período"
- Section oculta o muestra estado vacío

---

#### Caso 3.3: Limit = 1 (Edge case)

**Solicitud**:
```bash
?operation_type=outcome&limit=1
```

**Respuesta Esperada**:
```json
[
  {"category": "suppliers", "operation_type": "outcome", "total_amount": 50000.00}
]
```
(Solo la categoría con más gasto)

**Comportamiento UI**:
- Tabla con 1 fila
- Válido (aunque limite práctico sería limit=5)

---

### Integración en Frontend

**Componente**: `TopCategoriesSection`

```typescript
interface TopCategoriesSectionProps {
  businessType: "B2B" | "B2C";
  categories: TopCategoriesResponse;
  params: TopCategoriesParams;
  isLoading?: boolean;
  error?: string | null;
}

function TopCategoriesSection(props: TopCategoriesSectionProps) {
  if (props.isLoading) return <Spinner />;
  if (props.error) return <Error msg={props.error} />;
  
  if (props.categories.length === 0) {
    return <EmptyState 
      message={`No hay ingresos registrados para ${props.businessType} en este período`}
    />;
  }

  const total = props.categories.reduce((sum, c) => sum + c.total_amount, 0);

  return (
    <table>
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Total Ingresos</th>
          <th>% del Total</th>
        </tr>
      </thead>
      <tbody>
        {props.categories.map(cat => (
          <tr key={cat.category}>
            <td>{capitalize(cat.category)}</td>
            <td>${cat.total_amount.toFixed(2)}</td>
            <td>{((cat.total_amount / total) * 100).toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Convenciones Globales

### Formatos

| Concepto | Formato | Ejemplo | Notas |
|----------|---------|---------|-------|
| **Fecha** | YYYY-MM-DD | "2025-06-15" | ISO 8601 estricto |
| **Período (día)** | YYYY-MM-DD | "2025-06-15" | Igual a fecha |
| **Período (semana)** | YYYY-WNN | "2025-W24" | Semana ISO (W01-W53) |
| **Período (mes)** | YYYY-MM | "2025-06" | Año y mes solo |
| **Decimal** | Número flotante | 1234.56 | Mínimo 2 decimales, siempre presente |
| **Porcentaje** | Decimal (0.0-1.0+) | 0.3547 | Se convierte a % en UI: 35.47% |
| **Moneda** | Número con símbolo | $1,234.56 | Formato en UI, no en API |

### Códigos HTTP Esperados

| Código | Significado | Acción Frontend |
|--------|-----------|---|
| 200 OK | Solicitud exitosa, retorna datos | Procesar y renderizar |
| 400 Bad Request | Parámetros inválidos | Mostrar error: "Parámetros inválidos: [detalles]" |
| 500 Server Error | Error interno del servidor | Mostrar error: "Error al cargar datos. Intenta de nuevo." + botón Reintentar |

### Validaciones Cliente

Antes de enviar solicitud a API:

1. **Formato de fecha**: YYYY-MM-DD (usar `<input type="date">` HTML5)
2. **Rango de fecha**: start_date ≤ end_date (si ambas presentes)
3. **Rango de threshold**: 0.01 ≤ threshold ≤ 1.0
4. **Rango de limit**: 1 ≤ limit ≤ 20
5. **Valores enum**: operation_type ∈ {"income", "outcome"}, etc.

### Reintentos

- **Automático**: No (salvo conexión rechazada al iniciar)
- **Manual**: Botón "Reintentar" en componentes de error
- **Delay**: Sin delay recomendado (datos mock son síncronos)

---

## Referencias de Tipos

### Archivos de Especificación

**`api-types.ts`** — Tipos de RESPUESTA de API
- `FacetsResponse`
- `AlertEntry`, `AlertsResponse`
- `CategoryEntry`, `TopCategoriesResponse`
- `MetricsSummaryItem`, `MetricsComparison` (soporte)

**`param-types.ts`** — Tipos de PARÁMETROS de Query
- `DateRangeFilter`
- `AlertsParams`
- `TopCategoriesParams`
- `SummaryParams`, `ComparisonParams` (soporte)

### Enumeraciones y Literales

```typescript
// Tipos de operación
type OperationType = "income" | "outcome";

// Tipos de negocio
type BusinessType = "B2B" | "B2C";

// Categorías de movimiento
type Category = "suppliers" | "sales" | "operational" | "administrative" | "others";

// Agrupación temporal
type GroupBy = "day" | "week" | "month";
```

### Importación en Componentes

```typescript
// En componentes frontend
import type { 
  FacetsResponse, 
  AlertsResponse, 
  TopCategoriesResponse 
} from "@/specs/api-types";

import type { 
  DateRangeFilter, 
  AlertsParams, 
  TopCategoriesParams 
} from "@/specs/param-types";
```

---

## Checklist de Implementación

- [ ] Verificar que todas las URLs están correctas
- [ ] Validaciones cliente implementadas para cada parámetro
- [ ] Manejo de estados (loading, error, empty, success)
- [ ] Formato de números (decimales, moneda)
- [ ] Formato de fechas (inputs vs display)
- [ ] Reintentos manuales en componentes
- [ ] Tipos importados desde `api-types.ts` y `param-types.ts`
- [ ] `npx tsc --noEmit` sin errores
- [ ] Pruebas de casos límite documentados

---

**Fin del Contrato de Datos**  
*Este documento es autosuficiente. No requiere seguimiento adicional para implementación.*
