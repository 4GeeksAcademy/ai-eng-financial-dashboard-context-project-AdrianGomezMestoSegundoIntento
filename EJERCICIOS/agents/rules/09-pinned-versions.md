---
title: "Fijar versiones exactas de dependencias"
description: "Todos los archivos de dependencias (requirements.txt y package.json) deben especificar versiones exactas. Esto garantiza builds reproducibles y evita que cambios automáticos de librerías rompan el proyecto."
scope: "project"
globs:
  - "backend/requirements.txt"
  - "frontend/package.json"
  - "backend/Dockerfile"
  - "frontend/Dockerfile"
application: "Always"
---

## Detalles

- ✅ Usar `pip freeze` para generar requirements.txt con versiones exactas
- ✅ En package.json, fijar versiones sin ^ o ~ (usar versión exacta)
- ✅ Actualizar dependencias de forma deliberada y testeada
- ✅ Documentar cambios de versión en el registro de cambios
- ✅ Usar .lock files (package-lock.json) en git
- ❌ NO usar versiones sin número (ej: `fastapi` sin versión)
- ❌ NO usar ^ o ~ en package.json a menos que sea intencional
- ❌ NO confiar en "latest" en Dockerfile

## Ejemplo ❌ MALO (ACTUAL)

```txt
# backend/requirements.txt
fastapi
uvicorn[standard]
debugpy
pytest
pytest-cov
httpx
```

## Ejemplo ✅ CORRECTO

```txt
# backend/requirements.txt (después de pip freeze)
fastapi==0.109.0
uvicorn[standard]==0.27.0
debugpy==1.8.1
pytest==7.4.3
pytest-cov==4.1.0
httpx==0.25.2
```

## Para package.json

```json
{
  "dependencies": {
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "recharts": "3.8.1"
  },
  "devDependencies": {
    "vite": "8.0.4",
    "typescript": "6.0.2",
    "eslint": "9.39.4"
  }
}
```

## Cómo actualizar

1. Revisar cambios en los CHANGELOG
2. Actualizar versión en archivo
3. Instalar nuevas dependencias
4. Testear completamente
5. Documentar cambios

## Impacto

Proporciona:
- Reproducibilidad garantizada en todos los entornos
- Evita "funciona en mi máquina" syndrome
- Builds predecibles en CI/CD
- Control total sobre cuándo actualizar
