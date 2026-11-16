# Memory Bank - Documentación del Proyecto

Este directorio contiene la documentación centralizada del proyecto Financial Dashboard, diseñada para que nuevos desarrolladores, agentes IA y stakeholders comprendan rápidamente la esencia, arquitectura y estado del producto.

---

## 📋 Documentos Disponibles

### 1️⃣ [01-product-overview.md](./01-product-overview.md)
**Descripción General del Producto**

Responde a la pregunta: *"¿Para qué sirve esta aplicación?"*

Contenido:
- Propósito educativo y contexto
- Funcionalidades principales (8 endpoints API)
- Componentes del dashboard
- Problemas que resuelve
- Arquitectura del sistema
- Casos de uso y usuarios objetivo

**Leer si**: Acabas de llegar al proyecto y quieres entender qué hace.

---

### 2️⃣ [02-tech-stack.md](./02-tech-stack.md)
**Stack Tecnológico Completo**

Responde a la pregunta: *"¿Con qué tecnologías está construido?"*

Contenido:
- Desglose completo del stack (versiones exactas)
- Frontend: React, TypeScript, Vite, Tailwind, Recharts
- Backend: FastAPI, Uvicorn, Pydantic, Python
- Testing: Vitest, Pytest
- Infraestructura: Docker, Docker Compose
- Ejemplos de código para cada componente
- Flujo de datos end-to-end
- Tabla resumen de dependencias

**Leer si**: Necesitas entender la arquitectura técnica o buscar cómo usar una tecnología específica.

---

### 3️⃣ [03-current-state.md](./03-current-state.md)
**Estado Actual del Producto**

Responde a la pregunta: *"¿Qué funciona, qué falta y qué debería hacerse?"*

Contenido:
- ✅ Funcionalidades operativas (100% core features)
- ⚠️ Gaps conocidos (10 limitaciones identificadas)
- 🔴 Prioridades inmediatas (Fase 1 - Seguridad)
- 🟡 Roadmap recomendado (4 fases)
- Tabla de cumplimiento de las 16 reglas del proyecto
- Recomendaciones accionables

**Leer si**: Necesitas saber qué está roto, qué falta, o por dónde empezar una tarea.

---

## 🎯 Cómo Usar Este Memory Bank

### Para Nuevos Desarrolladores
1. Lee **01-product-overview.md** para entender qué es el proyecto
2. Lee **02-tech-stack.md** para familiarizarte con las herramientas
3. Lee **03-current-state.md** para identificar áreas de mejora
4. Revisa `../agents/rules/` para entender los estándares de código

### Para Agentes IA
1. Carga estos documentos como contexto previo a cualquier tarea
2. Usa **03-current-state.md** para entender prioridades
3. Consulta `../agents/rules/` para validar tu trabajo
4. Actualiza **verificacion.md** con tus cambios (Regla 16)

### Para Code Reviews
- Usa **02-tech-stack.md** como referencia de arquitectura
- Cruza cambios contra **03-current-state.md** (gaps a resolver)
- Verifica que los cambios respeten las reglas en `../agents/rules/`

### Para Planificación de Sprints
- Comienza en **03-current-state.md** sección "Siguientes Prioridades"
- Usa la Fase 1 (Seguridad) como punto de partida
- Revisa el roadmap de 4 fases para planificación a largo plazo

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Endpoints API** | 8 (todos funcionales) |
| **Componentes Frontend** | 5 (dashboard completo) |
| **Reglas de Desarrollo** | 16 (en `../agents/rules/`) |
| **Gaps Identificados** | 10 (priorizados en fases) |
| **Funcionalidades Core** | 100% operativas |
| **Recomendaciones Críticas** | 3 (seguridad + validación) |

---

## 🔗 Enlaces Útiles

- **Reglas del Proyecto**: `../agents/rules/`
- **Auditoría de Código**: `../Buenas-Malas-Prácticas.md`
- **Registro de Cambios**: `../verificacion.md`
- **Documentación Swagger**: `http://localhost:8000/docs`
- **Frontend (Dev)**: `http://localhost:5173`
- **Backend (Dev)**: `http://localhost:8000`

---

## 🔄 Cómo Mantener Este Memory Bank Actualizado

Cuando realices cambios significativos en el proyecto:

1. **Actualiza el documento relevante**:
   - Cambios en funcionalidades → `01-product-overview.md`
   - Cambios en dependencias → `02-tech-stack.md`
   - Cambios en estado o prioridades → `03-current-state.md`

2. **Registra tu tarea** en `../verificacion.md` siguiendo Regla 16:
   ```markdown
   ## Tarea X: Nombre descriptivo
   
   **Fecha**: YYYY-MM-DD
   **Realizado por**: [Tu nombre o "Copilot - <Tipo de Agente>"]
   
   **Situación anterior**: ...
   **Corrección aplicada**: ...
   ```

3. **Commits y PRs** deben mencionar qué documentación se actualizó

---

## 📝 Notas de Diseño

Este memory bank sigue estos principios:

✅ **Basado en realidad**: Solo documenta lo que realmente existe, no hipotéticos  
✅ **Accionable**: Cada documento sugiere next steps concretos  
✅ **Versionado con el código**: Se actualiza con cada cambio importante  
✅ **Accesible**: Lenguaje claro sin jerga innecesaria  
✅ **Estructurado**: Formato consistente para fácil navegación  

---

**Última actualización**: 2024-11-16  
**Realizado por**: Copilot - Full-Stack Agent
