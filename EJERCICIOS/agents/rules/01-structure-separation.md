---
title: "Mantener separación clara entre frontend y backend"
description: "Los directorios /frontend y /backend deben permanecer como componentes independientes con su propia configuración. Cada uno debe tener su propio package.json, requirements.txt y estructura de carpetas. Esto facilita la escalabilidad y permite que equipos independientes trabajen en cada parte sin conflictos."
scope: "project"
globs:
  - "/frontend/**"
  - "/backend/**"
  - "package.json"
  - "requirements.txt"
  - "docker-compose.yml"
application: "Always"
---

## Detalles

- ✅ Mantener `/frontend` y `/backend` como directorios completamente independientes
- ✅ Cada directorio debe tener su propia configuración de dependencias
- ✅ No incluir código del backend en frontend ni viceversa
- ✅ Usar docker-compose para orquestar ambos servicios
- ❌ NO compartir archivos de configuración entre frontend y backend
- ❌ NO mezclar lógica de ambos en el mismo directorio

## Impacto

Facilita:
- Trabajo paralelo de equipos
- Despliegues independientes
- Mantenimiento y escalabilidad
- Claridad en estructura del proyecto
