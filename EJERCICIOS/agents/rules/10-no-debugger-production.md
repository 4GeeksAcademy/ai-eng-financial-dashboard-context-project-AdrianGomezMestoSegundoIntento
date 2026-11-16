---
title: "Nunca exponer puerto de debugger en producción"
description: "El puerto 5678 (debugpy) debe estar disponible SOLO en desarrollo local. Nunca debe exponerse en producción ni estar accesible desde la red pública. Esto es un riesgo crítico de seguridad."
scope: "project"
globs:
  - "backend/Dockerfile"
  - "docker-compose.yml"
  - "backend/app/main.py"
application: "Always"
---

## Detalles

- ✅ Usar debugpy solo en entorno de desarrollo
- ✅ Restringir puerto 5678 a localhost en docker-compose
- ✅ NO exponer puerto 5678 en producción
- ✅ Usar variables de entorno para activar/desactivar debug
- ✅ Usar entrypoinsts diferentes para dev y prod
- ❌ NO dejar `EXPOSE 5678` en Dockerfile
- ❌ NO permitir acceso público a puerto 5678
- ❌ NO usar debugpy en production images

## Ejemplo ❌ MALO (ACTUAL)

```dockerfile
# backend/Dockerfile
EXPOSE 8000 5678

CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", 
     "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", 
     "--port", "8000", "--reload"]
```

## Ejemplo ✅ CORRECTO - Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Default: production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Ejemplo ✅ CORRECTO - docker-compose.yml

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  ports:
    - "8000:8000"
  # Para debug local: descomentar y ejecutar
  # - "5678:5678"
  volumes:
    - ./backend:/app
  environment:
    - DEBUG=false
```

## Para desarrollo local con debug

Crear archivo `docker-compose.debug.yml`:

```yaml
version: '3.8'
services:
  backend:
    command: python -m debugpy --listen 127.0.0.1:5678 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "5678:5678"
```

Ejecutar con: `docker-compose -f docker-compose.yml -f docker-compose.debug.yml up`

## Impacto

Protege contra:
- Inyección de código remota
- Acceso no autorizado a aplicación
- Ejecución de comandos arbitrarios
- Exposición de datos sensibles
