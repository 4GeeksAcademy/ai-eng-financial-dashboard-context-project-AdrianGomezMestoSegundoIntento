# Registro de Cambios del Proyecto

## Tarea 1: Creación del documento de verificación

**Situación anterior**: El proyecto no contaba con un documento centralizado para registrar y hacer seguimiento de los cambios realizados en la estructura, configuración y documentación del proyecto.

**Corrección aplicada**: Se creó el archivo `verificacion.md` en la carpeta `/EJERCICIOS/` que servirá como registro oficial de todos los cambios, modificaciones y mejoras realizadas en el proyecto. Este documento permite mantener un historial claro de qué se modificó, cuándo y por qué, facilitando la auditoría y el seguimiento del proyecto.

---

## Tarea 2: Corrección del enlace de Documentación de API

**Situación anterior**: El enlace de la documentación API (`http://localhost:8000/docs`) estaba incorrecto y retornaba un error 404: Not Found. Este enlace funcionaba en un entorno local, pero no era válido para el entorno de Codespaces.

**Corrección aplicada**: Se actualizó el enlace del Docs API a la URL correcta: `https://glorious-memory-v4j4rq4vw6rhxrwj-8000.app.github.dev/docs`, que funciona correctamente en el entorno de GitHub Codespaces. Este cambio se realizó en los documentos `README.es.md` y `Resumen` para garantizar consistencia en toda la documentación del proyecto.

---

## Tarea 3: Documentación de cambios

**Situación anterior**: Los cambios anteriores (Tarea 1 y Tarea 2) fueron realizados sin ser documentados en un registro centralizado, lo que dificultaba el seguimiento y la comprensión de qué se había modificado y por qué.

**Corrección aplicada**: Se redactaron párrafos explicativos para cada una de las tareas anteriores en este mismo documento de verificación. Cada párrafo describe claramente la situación inicial, el problema identificado y la solución implementada, creando así un registro transparente y detallado de los cambios realizados en el proyecto.

---

## Tarea 4: Auditoría de código - Buenas y malas prácticas

**Situación anterior**: El proyecto no disponía de un análisis documentado sobre las buenas y malas prácticas implementadas en el código, lo que dificultaba que nuevos desarrolladores y agentes IA comprendieran los estándares de calidad, patrones utilizados y áreas de mejora.

**Corrección aplicada**: Se realizó una auditoría completa del código analizando la estructura de carpetas, archivos y comportamientos concretos en el backend (FastAPI), frontend (React + TypeScript), Docker e infraestructura. Se documentaron 18 buenas prácticas detectadas y 17 malas prácticas identificadas, clasificadas por severidad (Crítico, Importante, Recomendado). El resultado se guardó en el archivo `Buenas-Malas-Prácticas.md` en la carpeta `/EJERCICIOS/`, proporcionando una guía clara para nuevos desarrolladores y agentes IA sobre qué hacer y qué evitar al contribuir al proyecto.

---
