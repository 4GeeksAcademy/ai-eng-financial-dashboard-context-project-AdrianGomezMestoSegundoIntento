# Tarea 1: Descripción General del Producto

**Fecha**: 2024-11-16
**Realizado por**: Copilot - Full-Stack Agent

---

## Propósito del Producto

Financial Metrics Dashboard es una **aplicación web educativa de análisis financiero** que proporciona visualización y análisis de métricas financieras de movimientos de dinero (ingresos y egresos).

La aplicación permite a usuarios **monitorear y analizar el comportamiento financiero** de operaciones comerciales, identificando patrones, tendencias y anomalías en datos financieros.

---

## Problema que Resuelve

**Situación**: Empresas o estudiantes necesitan una forma clara y accesible de visualizar y analizar métricas financieras sin configuración compleja.

**Solución**: Proporciona:
- Visualización inmediata de datos financieros (sin necesidad de base de datos real)
- Análisis de ingresos vs egresos
- Identificación de categorías principales de gasto
- Comparación entre períodos
- Detección de anomalías en gastos

---

## Funcionalidades Principales

### 1. **Dashboard de Métricas Clave (KPI)**
Visualiza en la pantalla principal:
- **Ingresos totales**: Suma de todas las operaciones de ingreso
- **Egresos totales**: Suma de todas las operaciones de egreso
- **Ganancia neta**: Diferencia entre ingresos y egresos
- **Porcentaje de ganancia**: Ganancia respecto a ingresos (%)

**Ubicación**: Componentes React en `/frontend/src/components/dashboard/kpi-*.tsx`

### 2. **Visualización de Tendencias Mensuales**
Dos gráficos interactivos:
- **Gráfico de Ingresos/Egresos**: Línea temporal mostrando ingresos y egresos por mes
- **Gráfico de Porcentaje de Ganancia**: Evolución mensual de la rentabilidad

**Tecnología**: Gráficos con [Recharts](https://recharts.org/) (librería React para visualización)

### 3. **Consulta de Métricas Detalladas via API**

#### Endpoints disponibles:
- `GET /api/metrics` - Lista todos los movimientos financieros
- `GET /api/metrics/facets` - Obtiene opciones de filtrado (categorías, tipos de negocio, fechas)
- `GET /api/metrics/summary` - Resumen agrupado por período (día/semana/mes)
- `GET /api/metrics/categories/top` - Top N categorías por monto
- `GET /api/metrics/comparison` - Comparación de períodos (período actual vs anterior)
- `GET /api/metrics/alerts` - Detecta anomalías en gastos (outliers)
- `GET /api/metrics/b2b` - Métricas específicas para negocio B2B
- `GET /api/metrics/b2c` - Métricas específicas para negocio B2C

#### Filtros soportados:
- `start_date` y `end_date` - Rango de fechas
- `category` - Categoría (suppliers, sales, operational, administrative, others)
- `operation_type` - Tipo de operación (income, outcome)
- `business_type` - Tipo de negocio (B2B, B2C)
- `group_by` - Agrupación temporal (day, week, month)
- `threshold` - Umbral para detección de anomalías (%)
- `limit` - Límite de resultados

### 4. **Datos Mock Generados**
La aplicación **NO utiliza base de datos real**, sino que:
- Genera un año completo de datos financieros (360 movimientos)
- Usa seed determinístico (seed=42) para reproducibilidad
- Simula variabilidad realista en ingresos y egresos
- Categoriza operaciones en: suppliers, sales, operational, administrative, others
- Diferencia entre negocio B2B (55%) y B2C (45%)

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│          NAVEGADOR (Usuario)                        │
│  Financial Metrics Dashboard (React + TypeScript)   │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/JSON
                   ▼
┌─────────────────────────────────────────────────────┐
│          SERVIDOR (FastAPI)                         │
│  ├─ /api/metrics                                    │
│  ├─ /api/metrics/summary                            │
│  ├─ /api/metrics/categories/top                     │
│  ├─ /api/metrics/alerts                             │
│  └─ ... (8 endpoints totales)                       │
│                                                     │
│  Lógica:                                            │
│  ├─ Generación de datos mock                        │
│  ├─ Filtrado de operaciones                         │
│  ├─ Cálculo de métricas                             │
│  └─ Detección de anomalías                          │
└─────────────────────────────────────────────────────┘
```

---

## Casos de Uso Principales

### Caso 1: Monitoreo General
**Actor**: Gerente financiero  
**Acción**: Abre el dashboard  
**Resultado**: Ve KPIs principales actualizados automáticamente

### Caso 2: Análisis de Periodo
**Actor**: Analista  
**Acción**: Selecciona rango de fechas via API  
**Resultado**: Recibe métricas resumidas por mes

### Caso 3: Identificación de Overspending
**Actor**: Controller  
**Acción**: Consulta endpoint de alertas con threshold  
**Resultado**: Recibe anomalías detectadas automáticamente

### Caso 4: Análisis B2B vs B2C
**Actor**: Business Analyst  
**Acción**: Usa filtros `business_type`  
**Resultado**: Comparación de métricas entre segmentos

---

## Características Técnicas

| Aspecto | Descripción |
|---------|-------------|
| **Datos** | Mock generados (sin base de datos) |
| **Reproducibilidad** | Seed determinístico = datos idénticos en cada ejecución |
| **Escala de datos** | 360 movimientos = 1 año completo |
| **Variabilidad** | Probabilidades realistas (ingresos 45-70%, egresos 30-70%) |
| **Categorización** | 5 categorías de operaciones + 2 tipos de negocio |
| **Autenticación** | No implementada (N/A para propósito educativo) |
| **Base de datos** | No utiliza persistencia (datos en memoria) |
| **Caché** | No implementado |
| **Reintentos HTTP** | No implementados |

---

## Propósito Educativo

Este proyecto es parte del **programa de AI Engineering de 4Geeks Academy** y sirve para:
- ✅ Enseñar arquitectura full-stack (React + FastAPI)
- ✅ Practicar con TypeScript y type safety
- ✅ Implementar validación de datos con Pydantic
- ✅ Crear componentes React reutilizables
- ✅ Diseñar APIs RESTful con documentación automática (Swagger)
- ✅ Containerizar aplicaciones con Docker
- ✅ Aplicar buenas prácticas de desarrollo

---

## Resumen Ejecutivo

**Financial Metrics Dashboard** es una **aplicación web full-stack de demostración** que:
- 🎯 Visualiza métricas financieras en tiempo real
- 📊 Proporciona análisis de ingresos/egresos
- 🔍 Detecta anomalías automáticamente
- 🏢 Diferencia entre tipos de negocio (B2B/B2C)
- 📚 Sirve como referencia educativa de buenas prácticas
- 🚀 Se ejecuta completamente en contenedores Docker

**No es** una aplicación de producción, sino un ejemplo didáctico de cómo construir un dashboard financiero moderno con tecnologías actuales.
