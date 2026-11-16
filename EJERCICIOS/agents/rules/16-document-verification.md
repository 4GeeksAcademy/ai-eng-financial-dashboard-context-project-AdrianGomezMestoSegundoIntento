---
title: "Documentar cambios en verificacion.md después de cada tarea"
description: "Después de completar cualquier tarea significativa en el proyecto, actualizar el documento verificacion.md siguiendo el formato estándar establecido. Incluir fecha y autoría de la tarea para mantener un registro transparente y auditable de todos los cambios realizados."
scope: "project"
globs:
  - "EJERCICIOS/verificacion.md"
application: "Always"
---

## Detalles

- ✅ Actualizar `EJERCICIOS/verificacion.md` al completar cada tarea
- ✅ Seguir el formato estándar: Número de tarea, título, descripción, corrección
- ✅ Incluir fecha en formato ISO (YYYY-MM-DD) o descriptivo
- ✅ Incluir quién realizó la tarea (nombre de agente, desarrollador, etc.)
- ✅ Describir la situación anterior y el problema identificado
- ✅ Explicar claramente la solución implementada
- ✅ Separar cada tarea con `---`
- ❌ NO dejar tareas completadas sin documentar
- ❌ NO omitir fecha o autoría
- ❌ NO variar el formato entre tareas
- ❌ NO incluir detalles técnicos excesivos (mantener breve pero descriptivo)

## Estructura estándar de cada tarea

```markdown
## Tarea N: Título descriptivo de la tarea

**Fecha**: YYYY-MM-DD
**Realizado por**: Nombre del agente/desarrollador

**Situación anterior**: Descripción de lo que existía o no existía antes.
Explicar el problema o necesidad identificada.

**Corrección aplicada**: Descripción clara de la solución implementada.
Incluir archivos creados/modificados y el resultado alcanzado.

---
```

## Ejemplo ✅ CORRECTO

```markdown
## Tarea 6: Implementar cliente HTTP centralizado en frontend

**Fecha**: 2024-11-16
**Realizado por**: Copilot - Frontend Agent

**Situación anterior**: El código frontend utilizaba llamadas `fetch()` directamente 
en componentes, lo que causaba duplicación de código y dificultaba cambios globales 
en la estrategia de HTTP.

**Corrección aplicada**: Se creó el archivo `frontend/src/lib/api-client.ts` que 
centraliza todas las llamadas a la API. Esto permite reutilizar el cliente en todos 
los componentes y facilita la adición de reintentos, logging y caché de forma global. 
Se actualizaron todos los componentes para usar el nuevo cliente siguiendo la regla 08.

---
```

## Ejemplo ❌ MALO

```markdown
## Tarea 6: Cambios al cliente HTTP

**Situación anterior**: Había problemas con fetch.

**Corrección aplicada**: Se agregó código nuevo.

---
```

## Campos requeridos

| Campo | Requerido | Formato | Notas |
|-------|-----------|---------|-------|
| Número de Tarea | ✅ | "Tarea N" | Secuencial, comenzar después de la última |
| Título | ✅ | Breve y descriptivo | Máx 70 caracteres |
| Fecha | ✅ | YYYY-MM-DD o descriptivo | Fecha cuando se completa |
| Realizado por | ✅ | Nombre/identificador | Agente IA: "Copilot - [Module]", Humano: nombre |
| Situación anterior | ✅ | Párrafo descriptivo | 2-4 líneas, el problema claramente explicado |
| Corrección aplicada | ✅ | Párrafo descriptivo | 2-4 líneas, qué se hizo y por qué |

## Identificadores de agentes

Usar estos identificadores cuando el agente IA realiza la tarea:

```
Copilot - Backend Agent
Copilot - Frontend Agent
Copilot - Full-Stack Agent
Copilot - DevOps Agent
Copilot - Testing Agent
Copilot - Code Review Agent
Copilot - [Custom Agent Name]
```

Para desarrolladores humanos:
```
Adrian Gomez (o nombre del desarrollador)
Team Name (si es trabajo colaborativo)
```

## Referencia a reglas

Si la tarea implementa o corrige algo relacionado con una regla, mencionarlo:

```markdown
## Tarea 7: Implementar CORS restrictivo

**Fecha**: 2024-11-16
**Realizado por**: Copilot - Backend Agent

**Situación anterior**: La configuración CORS permitía orígenes ["*"] 
lo que viola la Regla 06.

**Corrección aplicada**: Se modificó `backend/app/main.py` para 
especificar orígenes permitidos mediante variable de entorno, 
cumpliendo con la Regla 06-cors-restrictive.md.

---
```

## Tipos de tareas documentables

- ✅ Creación de nuevos archivos/módulos
- ✅ Refactorización de código existente
- ✅ Implementación de nuevas funcionalidades
- ✅ Corrección de bugs
- ✅ Mejora de documentación
- ✅ Actualización de dependencias
- ✅ Cambios de configuración
- ✅ Mejoras de seguridad

## Tipos de tareas NO documentables

- ❌ Cambios menores de formatting
- ❌ Comentarios triviales
- ❌ Reordenamientos visuales sin funcionalidad
- ❌ Cambios de nomenclatura sin refactorización

## Revisión y validación

Antes de completar una tarea:

```
1. ¿Realicé cambios significativos en el código?
   └─ SÍ → Documentar en verificacion.md
   └─ NO → Ir al paso 4

2. ¿Incluí fecha y quién realizó la tarea?
   └─ NO → Agregar
   └─ SÍ → Ir al paso 3

3. ¿Seguí el formato estándar?
   └─ NO → Ajustar
   └─ SÍ → Ir al paso 4

4. ¿Separé la tarea con "---"?
   └─ NO → Agregar
   └─ SÍ → Listo

5. Commit con mensaje que referencie la tarea
   └─ Ejemplo: "docs: add Task 6 to verificacion.md"
```

## Integración con workflow

```
Desarrollo → Cambios realizados
   ↓
¿Cambios significativos?
   ├─ NO → Finalizar sin documentación
   └─ SÍ → Ir a verificacion.md
      ↓
   Escribir entrada siguiendo formato
      ↓
   Incluir: Fecha, Autor, Situación anterior, Corrección
      ↓
   Revisar contra este documento (Regla 16)
      ↓
   Commitear cambios + actualización de verificacion.md
      ↓
   Finalizar tarea
```

## Impacto

Proporciona:
- Historial auditable de todos los cambios
- Trazabilidad: quién, qué, cuándo
- Facilita onboarding de nuevos contribuidores
- Documentación de decisiones y cambios
- Referencias para future debugging
- Cumplimiento de estándares de gobernanza
- Transparencia en el proyecto

## Notas

- El documento verificacion.md es oficial - es la fuente de verdad
- Se prioriza claridad sobre brevedad
- Cambios en verificacion.md también deben ser commiteados
- Mantener historial completo (no borrar tareas antigas)
- Sirve como base para PRs y releases notes

---
