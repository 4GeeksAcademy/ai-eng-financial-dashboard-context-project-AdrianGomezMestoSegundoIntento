# Reglas del Proyecto - Índice

Este directorio contiene todas las reglas que desarrolladores y agentes IA deben seguir en el proyecto Financial Dashboard.

Las reglas se basan en las **buenas prácticas existentes** y las **mejoras necesarias** identificadas en la auditoría de código.

---

## 📋 Índice de Reglas

### 🏗️ Estructura y Organización

| ID | Regla | Descripción | Scope |
|----|-------|-------------|-------|
| 01 | [Mantener separación frontend/backend](01-structure-separation.md) | Directorios independientes, cada uno con su configuración | project |
| 02 | [Componentes React modulares](02-component-modularity.md) | Separar componentes dashboard/ de ui/ | project |
| 15 | [Archivo .env.example](15-env-example.md) | Documentar todas las variables de entorno | project |

### 🐍 Backend (FastAPI)

| ID | Regla | Descripción | Scope |
|----|-------|-------------|-------|
| 03 | [Type hints exhaustivos en Python](03-python-type-hints.md) | Tipos explícitos en parámetros y retorno | project |
| 04 | [Validación con Pydantic](04-pydantic-validation.md) | Usar BaseModel para todos los modelos | project |
| 05 | [Evitar endpoints duplicados](05-avoid-duplicated-endpoints.md) | Usar query params en lugar de múltiples endpoints | project |
| 06 | [CORS restrictivo](06-cors-restrictive.md) | No usar allow_origins=["*"] en producción | project |
| 12 | [Logging en backend](12-backend-logging.md) | Implementar logging en endpoints y funciones críticas | project |
| 13 | [Funciones puras](13-pure-functions.md) | Sin estado global, sin efectos secundarios | project |

### ⚛️ Frontend (React + TypeScript)

| ID | Regla | Descripción | Scope |
|----|-------|-------------|-------|
| 07 | [TypeScript estricto](07-typescript-strict.md) | Interfaces para todos los props y datos | project |
| 08 | [Cliente HTTP centralizado](08-api-client.ts) | Crear api-client.ts en lugar de fetch() raw | project |

### 🐳 Docker e Infraestructura

| ID | Regla | Descripción | Scope |
|----|-------|-------------|-------|
| 09 | [Versiones fijas en dependencias](09-pinned-versions.md) | Fijar versiones exactas en requirements.txt y package.json | project |
| 10 | [No exponer debugger en producción](10-no-debugger-production.md) | Puerto 5678 solo en desarrollo, nunca en producción | project |

### 🔍 Testing y Validación

| ID | Regla | Descripción | Scope |
|----|-------|-------------|-------|
| 11 | [Validar env en startup](11-validate-env.md) | Validar variables de entorno al iniciar | project |
| 14 | [Tests extensivos](14-testing.md) | Tests cerca del código, cubrir casos límite | project |

---

## 🎯 Aplicación de Reglas

### Por contexto

**Always** - Aplican a todo código nuevo
- 01, 02, 03, 04, 05, 06, 07, 13, 14, 15

**Auto Attached** - Se aplican automáticamente en ciertos archivos
- 08, 09, 10, 11, 12

### Por severidad

**🔴 CRÍTICO** (Riesgos de seguridad/funcionalidad)
- Regla 06: CORS restrictivo
- Regla 10: No exponer debugger
- Regla 11: Validar env en startup

**🟠 IMPORTANTE** (Calidad/Mantenibilidad)
- Regla 03: Type hints
- Regla 04: Pydantic validation
- Regla 05: Evitar duplicados
- Regla 07: TypeScript estricto
- Regla 08: Cliente HTTP
- Regla 09: Versiones fijas

**🟡 RECOMENDADO** (Mejores prácticas)
- Regla 01: Separación frontend/backend
- Regla 02: Componentes modulares
- Regla 12: Logging
- Regla 13: Funciones puras
- Regla 14: Testing
- Regla 15: .env.example

---

## 📖 Cómo usar estas reglas

### Para desarrolladores

1. Leer la regla relevante antes de empezar
2. Seguir los ejemplos proporcionados
3. Validar el código contra la regla
4. Si alguna regla entra en conflicto con el caso de uso, documentarlo en PR

### Para agentes IA

1. Cargar estas reglas al inicio de cualquier tarea
2. Validar código generado contra cada regla aplicable
3. Generar comentarios en PRs si se incumplen reglas
4. Priorizar reglas CRÍTICAS sobre RECOMENDADAS

---

## 🔄 Actualización de reglas

Cuando se identifique:
- Una nueva mala práctica → Crear nueva regla
- Una regla incorrecta → Editar el archivo
- Una regla obsoleta → Marcar como deprecated

Documentar cambios en `EJERCICIOS/verificacion.md`

---

## 📚 Referencias

- [Buenas y Malas Prácticas](../Buenas-Malas-Prácticas.md) - Análisis completo
- [Documento de Verificación](../verificacion.md) - Historial de cambios
- [README del Proyecto](../../README.md) - Documentación principal

---
