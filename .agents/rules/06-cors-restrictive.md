---
title: "Configurar CORS de forma restrictiva"
description: "CORS debe configurarse para permitir solo los orígenes necesarios. Nunca usar allow_origins=['*'] en producción ya que expone la API a ataques CSRF. En desarrollo, permitir localhost; en producción, especificar dominios exactos."
scope: "project"
globs:
  - "backend/app/main.py"
application: "Always"
---

## Detalles

- ✅ Especificar orígenes exactos en allow_origins
- ✅ Usar variables de entorno para configuración por entorno
- ✅ Restringir métodos HTTP permitidos (solo GET, POST, etc.)
- ✅ Restringir headers permitidos (no usar ["*"])
- ✅ Especificar allow_credentials solo si es necesario
- ❌ NO usar allow_origins=["*"] en producción
- ❌ NO usar allow_methods=["*"] sin justificación
- ❌ NO usar allow_headers=["*"] sin pensarlo

## Ejemplo ❌ MALO (ACTUAL)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Ejemplo ✅ CORRECTO

```python
import os

ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
    allow_credentials=False,
)
```

## Variables de entorno recomendadas

- `CORS_ORIGINS`: Lista de orígenes permitidos (separados por coma)
  - Desarrollo: `http://localhost:5173`
  - Producción: `https://app.example.com`

## Impacto

Protege contra:
- Ataques CSRF
- Acceso no autorizado a la API
- Uso no autorizado desde aplicaciones terceras
