# Especificación de Componentes de UI — Financial Metrics Dashboard

**Versión**: 1.0  
**Fase**: Frontend Implementation (Fase 3)  
**Fecha**: 2026-11-16

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Funcionalidad 1: Filtro de Rango de Fechas (Facets)](#funcionalidad-1-filtro-de-rango-de-fechas-facets)
3. [Funcionalidad 2: Tabla de Alertas de Anomalías](#funcionalidad-2-tabla-de-alertas-de-anomalías)
4. [Funcionalidad 3: Vista Comparativa B2B vs B2C](#funcionalidad-3-vista-comparativa-b2b-vs-b2c)
5. [Ambigüedades Resueltas y Decisiones Propuestas](#ambigüedades-resueltas-y-decisiones-propuestas)

---

## Introducción

Esta especificación define los componentes React necesarios para implementar las tres funcionalidades nuevas del Financial Metrics Dashboard. Cada componente está tipado con TypeScript usando los tipos definidos en `frontend/specs/api-types.ts` y `frontend/specs/param-types.ts`.

### Convenciones

- **Props**: Tipadas exactamente con tipos de Fase 2, sin redefiniciones
- **Estados**: Loading, Empty, Error, Success
- **Parámetros de Query**: Especificados mediante interfaces de `param-types.ts`
- **Ambigüedades**: Marcadas como "⚠️ Decisión propuesta — pendiente de confirmar"

---

## Funcionalidad 1: Filtro de Rango de Fechas (Facets)

### Contexto

El equipo de finanzas necesita filtrar datos por períodos concretos. Esta funcionalidad se implementa en la **parte superior del dashboard principal** con dos inputs de fecha (inicio y fin) y un indicador del rango disponible.

### Componentes

#### 1.1. `DateRangeFilter`

**Propósito**: Componente de entrada para seleccionar rango de fechas con indicador de rango disponible.

**Ubicación sugerida**: `frontend/src/components/dashboard/DateRangeFilter.tsx`

**Props**:

```typescript
interface DateRangeFilterProps {
  /**
   * Parámetros actuales del filtro de fechas
   * Ambos campos son opcionales; cuando están vacíos, no hay filtro activo
   * Type: DateRangeFilter (de param-types.ts)
   */
  value: DateRangeFilter;

  /**
   * Rango disponible en el dataset (min_date y max_date)
   * Type: FacetsResponse (de api-types.ts)
   */
  facets: FacetsResponse;

  /**
   * Callback disparado cuando el usuario cambia el rango de fechas
   * Se invoca con el nuevo rango de fechas para actualizar query params
   */
  onChange: (newRange: DateRangeFilter) => void;

  /**
   * Estado de carga
   * Mientras sea true, los inputs deben estar deshabilitados
   */
  isLoading?: boolean;

  /**
   * Mensaje de error si la solicitud de facets falló
   * Cuando está presente, se muestra el error y los inputs están deshabilitados
   */
  error?: string | null;
}
```

**Estados**:

| Estado | Comportamiento |
|--------|---|
| **Loading** | Spinner en inputs; inputs deshabilitados; "Cargando rango disponible..." |
| **Empty/Success** | Inputs habilitados; rango disponible visible (ej: "11/15/2025 - 11/16/2026"); hint con formato YYYY-MM-DD |
| **Error** | Inputs deshabilitados; mensaje de error visible (ej: "No se pudo cargar el rango de fechas") |

**Interacciones**:

| Acción | Parámetro Query | Comportamiento |
|--------|---|---|
| Usuario ingresa fecha de inicio | `start_date` (YYYY-MM-DD) | Triggerea `onChange` con `{start_date, end_date}` |
| Usuario ingresa fecha de fin | `end_date` (YYYY-MM-DD) | Triggerea `onChange` con `{start_date, end_date}` |
| Usuario borra un campo | Campo se pone `undefined` | Parámetro se elimina de query |
| Usuario selecciona fecha inválida | N/A | Validación: fecha debe estar dentro de [min_date, max_date] |

**Notas**:

- ⚠️ **Decisión propuesta — pendiente de confirmar**: ¿Los inputs deben validar que `start_date <= end_date`? Se asume **sí**, mostrando un error de validación si se viola.
- ⚠️ **Decisión propuesta — pendiente de confirmar**: ¿El rango disponible se muestra como texto o como tooltip? Se asume **texto cercano a los inputs** (ej: "Datos disponibles de 11/15/2025 a 11/16/2026").

---

#### 1.2. `DateRangeDisplayBadge` (opcional)

**Propósito**: Componente decorativo para mostrar el rango de fechas activo (si hay filtro aplicado).

**Ubicación sugerida**: `frontend/src/components/dashboard/DateRangeDisplayBadge.tsx`

**Props**:

```typescript
interface DateRangeDisplayBadgeProps {
  /**
   * Rango de fechas actualmente aplicado
   * Type: DateRangeFilter
   */
  value: DateRangeFilter;

  /**
   * Si true, muestra un ícono de "filtro activo" o badge visual
   */
  isActive?: boolean;

  /**
   * Callback para limpiar el filtro (cuando el usuario hace clic en "Limpiar")
   * Se invoca con un objeto vacío {}
   */
  onClear?: () => void;
}
```

**Estados**:

| Estado | Comportamiento |
|--------|---|
| **Sin filtro** | No se renderiza o se muestra opaco ("Ningún filtro aplicado") |
| **Con filtro** | Muestra rango en formato legible (ej: "11/15/2025 — 11/16/2026"); botón "Limpiar" visible |

---

### Punto de Integración: Dashboard Principal

El componente `DateRangeFilter` se renderiza en la **parte superior del dashboard** y controla el query param global que afecta a **todos los otros gráficos y tablas** de la página.

```typescript
// Pseudo-código del componente principal del dashboard
function MainDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeFilter>({});
  const { data: facets, loading, error } = useFacets();

  return (
    <div>
      <DateRangeFilter
        value={dateRange}
        facets={facets}
        onChange={setDateRange}
        isLoading={loading}
        error={error}
      />
      
      {/* Otros componentes que usan dateRange como filtro */}
      <AnomaliesTable dateRange={dateRange} />
      <TopCategoriesComparison dateRange={dateRange} />
    </div>
  );
}
```

---

## Funcionalidad 2: Tabla de Alertas de Anomalías

### Contexto

Bajo los gráficos existentes, se muestra una tabla que destaca períodos con gasto inesperado. El usuario puede ajustar el umbral de alerta mediante un control numérico. La tabla respeta el rango de fechas de la Funcionalidad 1.

### Componentes

#### 2.1. `AnomaliesAlertsTable`

**Propósito**: Tabla que muestra alertas de anomalías en gastos con columnas: período, outcome, baseline y % incremento.

**Ubicación sugerida**: `frontend/src/components/anomalies/AnomaliesAlertsTable.tsx`

**Props**:

```typescript
interface AnomaliesAlertsTableProps {
  /**
   * Array de alertas obtenidas de GET /api/metrics/alerts
   * Type: AlertsResponse (de api-types.ts)
   */
  alerts: AlertsResponse;

  /**
   * Parámetros actuales que se usaron para obtener las alertas
   * Type: AlertsParams (de param-types.ts)
   * Permite recalcular o refrescar si cambian
   */
  params: AlertsParams;

  /**
   * Callback cuando el usuario modifica el threshold
   * Se invoca con los parámetros actualizados para refrescar la API
   */
  onParamsChange: (newParams: AlertsParams) => void;

  /**
   * Estado de carga
   * Mientras sea true, mostrar skeleton/spinner y deshabilitar controles
   */
  isLoading?: boolean;

  /**
   * Mensaje de error si la solicitud de alertas falló
   */
  error?: string | null;
}
```

**Estados**:

| Estado | Comportamiento |
|--------|---|
| **Loading** | Skeleton/spinner en tabla; controles deshabilitados; "Cargando alertas..." |
| **Empty** | Tabla desaparece; se muestra: "No se detectaron anomalías para el umbral actual (0.3). Ajusta el umbral para ver más sensibilidad." |
| **Error** | Mensaje de error legible (ej: "Error al cargar alertas: [motivo]"); tabla no se renderiza |
| **Success** | Tabla con rows de alertas; controles habilitados; datos numéricos con 2 decimales |

**Columnas de la Tabla**:

| Columna | Fuente | Formato |
|---------|--------|---------|
| **Período** | `AlertEntry.period` | Texto directo (ej: "2025-11", "2025-W47") |
| **Outcome Registrado** | `AlertEntry.outcome_total` | Número con 2 decimales, símbolo de moneda (ej: "$1,234.56") |
| **Media Móvil (3 períodos)** | `AlertEntry.baseline_average` | Número con 2 decimales, símbolo de moneda |
| **Incremento %** | `AlertEntry.increase_ratio` | Porcentaje (ej: "35.47%") = `increase_ratio * 100` |

**Interacciones**:

| Acción | Parámetro | Comportamiento |
|--------|-----------|---|
| Usuario cambia threshold | `AlertsParams.threshold` | Rango válido 0.01-1.0; dispara `onParamsChange` que refrescar datos |
| Usuario cambia group_by | `AlertsParams.group_by` | Opciones: "day", "week", "month"; dispara refetch |
| Usuario cambia business_type | `AlertsParams.business_type` | Opciones: "B2B", "B2C", undefined; dispara refetch |
| Usuario combina con DateRangeFilter | `AlertsParams.start_date`, `end_date` | Ambos parámetros se propagan desde componente padre |

**Validaciones**:

- Threshold debe estar entre 0.01 y 1.0 (validación de entrada)
- Si threshold < 0.01, mostrar error: "Threshold mínimo es 0.01"
- Si threshold > 1.0, mostrar error: "Threshold máximo es 1.0"

**Notas**:

- ⚠️ **Decisión propuesta — pendiente de confirmar**: ¿El valor de threshold se muestra como decimal (0.3) o porcentaje (30%)? Se asume **decimal (0.3)** ya que el backend lo usa así, pero el label puede ser "Umbral de Incremento (0.3 = 30%)".
- ⚠️ **Decisión propuesta — pendiente de confirmar**: ¿Hay paginación si hay >10 alertas? Se asume **no** (tabla simple sin paginación). Si se necesita, es un nice-to-have.

---

#### 2.2. `ThresholdControl`

**Propósito**: Control numérico para ajustar el threshold de detección de anomalías.

**Ubicación sugerida**: `frontend/src/components/anomalies/ThresholdControl.tsx`

**Props**:

```typescript
interface ThresholdControlProps {
  /**
   * Valor actual del threshold (0.01 a 1.0)
   */
  value: number;

  /**
   * Callback cuando el usuario cambia el valor
   * Se invoca con el nuevo threshold
   */
  onChange: (newThreshold: number) => void;

  /**
   * Desabilitar el control (ej: mientras se carga)
   */
  disabled?: boolean;

  /**
   * Mensaje de error si hay validación fallida
   */
  error?: string | null;
}
```

**Comportamiento**:

- Input type="number" con step="0.01"
- Rango: min="0.01", max="1.0"
- Valor por defecto: 0.3
- Helper text: "Umbral de incremento de gasto (rango: 0.01 a 1.0, default: 0.3)"
- Validación en tiempo real (cliente)

---

### Punto de Integración: Dashboard Principal

```typescript
function MainDashboard() {
  const [alertsParams, setAlertsParams] = useState<AlertsParams>({
    threshold: 0.3,
    group_by: "month",
    // start_date y end_date se heredan del DateRangeFilter
  });

  const { data: alerts, loading, error } = useAnomaliesAlerts(alertsParams);

  return (
    <div>
      <DateRangeFilter {...} />
      
      <AnomaliesAlertsTable
        alerts={alerts}
        params={alertsParams}
        onParamsChange={setAlertsParams}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
```

---

## Funcionalidad 3: Vista Comparativa B2B vs B2C

### Contexto

Nueva página en el dashboard que compara rendimiento de ingresos entre B2B y B2C. Dos secciones en paralelo muestran top 5 categorías de cada segmento, más un gráfico comparativo de totales.

### Componentes

#### 3.1. `B2BVsB2CComparisonPage`

**Propósito**: Página raíz que contiene la comparación B2B vs B2C. Gestiona estado, filtros de fecha y coordinación de sub-componentes.

**Ubicación sugerida**: `frontend/src/pages/B2BVsB2CComparison.tsx`

**Props**: Ninguna (componente de página raíz)

**Estados Internos**:

```typescript
interface B2BVsB2CComparisonPageState {
  dateRange: DateRangeFilter; // Shared date range filter
  facets: FacetsResponse | null;
  facetsLoading: boolean;
  facetsError: string | null;

  b2bCategories: TopCategoriesResponse | null;
  b2bCategoriesLoading: boolean;
  b2bCategoriesError: string | null;

  b2cCategories: TopCategoriesResponse | null;
  b2cCategoriesLoading: boolean;
  b2cCategoriesError: string | null;

  comparisonData: MetricsComparison | null; // Para el gráfico
  comparisonLoading: boolean;
  comparisonError: string | null;
}
```

**Estructura de Render**:

```
<B2BVsB2CComparisonPage>
  <DateRangeFilter />
  <div className="comparison-container">
    <TopCategoriesSection businessType="B2B" />
    <TopCategoriesSection businessType="B2C" />
  </div>
  <ComparisonChart />
</B2BVsB2CComparisonPage>
```

---

#### 3.2. `TopCategoriesSection`

**Propósito**: Sección de tabla con top 5 categorías de ingreso para un tipo de negocio (B2B o B2C).

**Ubicación sugerida**: `frontend/src/components/comparison/TopCategoriesSection.tsx`

**Props**:

```typescript
interface TopCategoriesSectionProps {
  /**
   * Tipo de negocio a mostrar
   * Type: "B2B" | "B2C"
   */
  businessType: "B2B" | "B2C";

  /**
   * Top categorías obtenidas de GET /api/metrics/categories/top
   * operation_type siempre es "income" para esta funcionalidad
   * Type: TopCategoriesResponse (de api-types.ts)
   */
  categories: TopCategoriesResponse;

  /**
   * Parámetros usados para obtener las categorías
   * Type: TopCategoriesParams (de param-types.ts)
   * operation_type="income", limit=5, start_date y end_date del filtro global
   */
  params: TopCategoriesParams;

  /**
   * Estado de carga
   */
  isLoading?: boolean;

  /**
   * Mensaje de error
   */
  error?: string | null;
}
```

**Estados**:

| Estado | Comportamiento |
|--------|---|
| **Loading** | Skeleton/spinner en tabla; "Cargando categorías para {businessType}..." |
| **Empty** | Tabla desaparece; "No hay ingresos registrados para {businessType} en este período" |
| **Error** | Mensaje de error; tabla no se renderiza |
| **Success** | Tabla con 5 filas de categorías; datos numéricos con 2 decimales |

**Columnas de la Tabla**:

| Columna | Fuente | Formato | Notas |
|---------|--------|---------|-------|
| **Categoría** | `CategoryEntry.category` | Texto capitalizado (ej: "Sales", "Suppliers") | |
| **Total Ingresos** | `CategoryEntry.total_amount` | Número con 2 decimales, símbolo de moneda | |
| **% del Total** | Calculado | Porcentaje (ej: "45.23%") | = `(total_amount / sum_all_amounts) * 100` |

**Interacciones**:

| Acción | Comportamiento |
|--------|---|
| Usuario cambia fecha (DateRangeFilter global) | Componente padre refetch con nuevos `start_date`, `end_date` en query |
| Usuario hace clic en una categoría | ⚠️ **Decisión propuesta — pendiente de confirmar**: ¿Navegar a detalle o hacer drill-down? Se asume **no hay interacción** (tabla solo lectura por ahora) |

**Notas**:

- Siempre solicita `operation_type="income"` (no configurable)
- Siempre solicita `limit=5` (no configurable)
- El `business_type` es el parámetro principal que diferencia B2B de B2C

---

#### 3.3. `ComparisonChart`

**Propósito**: Gráfico comparativo que muestra total de ingresos B2B vs B2C.

**Ubicación sugerida**: `frontend/src/components/comparison/ComparisonChart.tsx`

**Props**:

```typescript
interface ComparisonChartProps {
  /**
   * Datos de comparación para ambos períodos
   * El gráfico visualiza B2B vs B2C usando los datos actuales
   * Type: Objeto con totales calculados a partir de TopCategoriesResponse
   */
  b2bTotal: number;
  b2cTotal: number;

  /**
   * Rango de fechas actualmente filtrado (para mostrar en título)
   * Type: DateRangeFilter
   */
  dateRange: DateRangeFilter;

  /**
   * Estado de carga
   */
  isLoading?: boolean;

  /**
   * Mensaje de error
   */
  error?: string | null;
}
```

**Formato del Gráfico**:

- Tipo: Gráfico de barras (BarChart de Recharts)
- Eje X: "B2B" y "B2C"
- Eje Y: Total de ingresos (con símbolo de moneda y formato legible)
- Colores: Diferenciados (ej: azul para B2B, naranja para B2C)
- Título: "Comparación de Ingresos Totales" o similar
- Subtítulo: Rango de fechas (ej: "11/15/2025 — 11/16/2026")

**Estados**:

| Estado | Comportamiento |
|--------|---|
| **Loading** | Skeleton del gráfico |
| **Empty** | "No hay datos para mostrar en este período" |
| **Error** | Mensaje de error |
| **Success** | Gráfico renderizado con datos y hover tooltips |

**Interacciones**:

| Acción | Comportamiento |
|--------|---|
| Usuario hovea barra | Tooltip con valor exacto (ej: "$12,345.67") |
| Usuario cambia DateRangeFilter | Gráfico se actualiza con nuevos totales |

---

### Punto de Integración: Routing

Crear ruta nueva en el router principal:

```typescript
// frontend/src/App.tsx o router config
const routes = [
  { path: "/", component: <MainDashboard /> },
  { path: "/comparison/b2b-vs-b2c", component: <B2BVsB2CComparisonPage /> },
  // ... otros routes
];
```

**Navegación**: Link o botón en menú principal que lleve a `/comparison/b2b-vs-b2c`.

---

## Ambigüedades Resueltas y Decisiones Propuestas

### 1. Validación de rango de fechas

**Ambigüedad Original**: ¿Debe validarse que `start_date <= end_date`?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **Sí**, validar en cliente (DateRangeFilter)
- Mostrar error: "La fecha de inicio no puede ser mayor que la fecha de fin"
- Deshabilitar botón de filtrar hasta que sea válido

---

### 2. Formato de threshold (decimal vs porcentaje)

**Ambigüedad Original**: ¿Mostrar threshold como 0.3 o 30%?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ Mostrar como **decimal (0.3)** en el input (coherente con backend)
- Label explicativo: "Umbral de Incremento (0.3 = 30%)"
- Helper text: "Rango válido: 0.01 a 1.0"

---

### 3. Paginación en tabla de alertas

**Ambigüedad Original**: ¿Implementar paginación si hay >10 alertas?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **No paginación en Fase 3** (MVP simple)
- Mostrar todas las alertas en una tabla scrollable
- Nice-to-have para Fase 4+

---

### 4. Interacción al hacer clic en categoría

**Ambigüedad Original**: ¿Qué pasa si el usuario hace clic en una fila de TopCategoriesSection?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **Sin interacción** (tabla solo lectura)
- Filas no son clickeables
- Si se necesita drill-down, es un nice-to-have

---

### 5. Formato de fecha en inputs (picker vs texto)

**Ambigüedad Original**: ¿Usar date picker visual o input de texto YYYY-MM-DD?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **Date picker HTML5** (`<input type="date">`)
- Fallback a input de texto si es necesario
- Format value as YYYY-MM-DD antes de enviar a API

---

### 6. Símbolo de moneda

**Ambigüedad Original**: ¿Qué símbolo de moneda usar en tablas y gráficos?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **"$"** (dólar) como convención por defecto
- Formato: "$1,234.56" (con separadores de miles)
- Configurar como constante global si se necesita cambiar más adelante

---

### 7. Límite de categorías en TopCategoriesSection

**Ambigüedad Original**: ¿Es configurable el límite de 5 categorías o siempre es 5?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **Siempre 5** (hardcoded en Fase 3)
- Parámetro `limit` en `TopCategoriesParams` siempre se envía como 5
- Si se necesita flexibilidad, es un nice-to-have

---

### 8. Manejo de errores y reintentos

**Ambigüedad Original**: ¿Implementar reintentos automáticos o botón "Reintentar"?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **Botón "Reintentar"** manual
- Mostrar error con contexto (ej: "Error al cargar alertas: conexión rechazada")
- Reintentos automáticos sin límite: **no**

---

### 9. Estados vacíos por business_type

**Ambigüedad Original**: En `TopCategoriesSection`, si no hay ingresos para B2B, ¿qué mostrar?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ Mostrar: "No hay ingresos registrados para **[tipo de negocio]** en este período"
- Tabla no se renderiza, solo el mensaje
- No mostrar tabla vacía

---

### 10. Accesibilidad (a11y)

**Ambigüedad Original**: ¿Nivel de accesibilidad requerido?

**Decisión Propuesta — Pendiente de Confirmar**:
- ✅ **WCAG 2.1 Nivel AA** como mínimo
- Labels asociados a inputs (`<label htmlFor>`)
- Atributos ARIA donde sea necesario
- Navegación por teclado en tablas

---

## Resumen de Cambios de Interfaz

### Nuevas Rutas

| Ruta | Componente | Funcionalidad |
|------|-----------|---|
| `/` | `MainDashboard` | Dashboard existente + Funcionalidad 1 (DateRangeFilter) + Funcionalidad 2 (AnomaliesAlertsTable) |
| `/comparison/b2b-vs-b2c` | `B2BVsB2CComparisonPage` | Funcionalidad 3 (Comparativa B2B vs B2C) |

### Nuevos Componentes (11 total)

**Funcionalidad 1 (Facets)**:
1. `DateRangeFilter`
2. `DateRangeDisplayBadge` (opcional)

**Funcionalidad 2 (Alertas)**:
3. `AnomaliesAlertsTable`
4. `ThresholdControl`

**Funcionalidad 3 (Comparativa B2B/B2C)**:
5. `B2BVsB2CComparisonPage` (page)
6. `TopCategoriesSection`
7. `ComparisonChart`

**Hooks customizados (soporte)**:
8. `useFacets` — obtiene FacetsResponse
9. `useAnomaliesAlerts` — obtiene AlertsResponse con AlertsParams
10. `useTopCategories` — obtiene TopCategoriesResponse con TopCategoriesParams
11. `useComparisonData` — obtiene datos de comparativa B2B vs B2C

---

## Checklist de Implementación

- [ ] Crear componente `DateRangeFilter` con validación
- [ ] Crear componente `DateRangeDisplayBadge` (opcional)
- [ ] Crear componente `AnomaliesAlertsTable` con columnas tipadas
- [ ] Crear componente `ThresholdControl` con validación
- [ ] Crear componente `TopCategoriesSection` × 2 (B2B y B2C)
- [ ] Crear componente `ComparisonChart` con Recharts
- [ ] Crear página `B2BVsB2CComparisonPage`
- [ ] Crear hooks customizados (useFacets, useAnomaliesAlerts, etc.)
- [ ] Agregar rutas en router
- [ ] Agregar navegación en menú/navbar
- [ ] Validar tipos con `npx tsc --noEmit`
- [ ] Probar estados: loading, empty, error, success
- [ ] Revisar accesibilidad (a11y)

---

## Notas Finales

- **Fase 3 es MVP**: Se enfoca en funcionalidad básica sin nice-to-haves
- **Tipos reutilizados exactamente**: Sin redefiniciones ni `any`
- **Props estrictamente tipadas**: Coherentes con `api-types.ts` y `param-types.ts`
- **Ambigüedades documentadas**: Todas marcadas para validación del PM
- **Integración con DateRangeFilter**: Funcionalidad 1 es filtro global que afecta a Funcionalidad 2 y 3

---

*Especificación completada. Pendiente de validación del PM antes de implementación.*
