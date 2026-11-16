---
title: "Crear archivo .env.example para configuración"
description: "Documentar todas las variables de entorno requeridas en archivo .env.example. Esto ayuda a nuevos desarrolladores y agentes IA a entender qué variables configurar sin tener que leer el código."
scope: "project"
globs:
  - ".env.example"
  - ".env"
application: "Always"
---

## Detalles

- ✅ Crear `.env.example` en raíz del proyecto
- ✅ Incluir todas las variables de entorno necesarias
- ✅ Documentar qué hace cada variable
- ✅ Proporcionar valores de ejemplo realistas
- ✅ Distinguir entre variables dev y producción
- ✅ Ignorar `.env` en .gitignore (valores secretos)
- ❌ NO incluir valores secretos reales en .env.example
- ❌ NO dejar variables sin documentar
- ❌ NO hacer .env.example un mystery hunt

## Contenido recomendado

```env
# ============================================================================
# FRONTEND CONFIGURATION
# ============================================================================

# API endpoint base URL
# Examples:
#   Development: http://localhost:8000
#   Production: https://api.example.com
VITE_API_BASE_URL=http://localhost:8000

# Application environment
# Values: development, production, staging
VITE_ENV=development

# Enable debug mode (logs API requests/responses)
VITE_DEBUG=false


# ============================================================================
# BACKEND CONFIGURATION
# ============================================================================

# Server configuration
# Port to run the API server
API_PORT=8000

# Debug mode (verbose logging, auto-reload)
# Values: true, false
DEBUG=false

# Environment type
# Values: development, production, staging
ENVIRONMENT=development


# ============================================================================
# SECURITY & CORS
# ============================================================================

# Allowed origins for CORS (comma-separated)
# Development example:
#   http://localhost:5173,http://localhost:3000
# Production example:
#   https://app.example.com,https://app-staging.example.com
CORS_ORIGINS=http://localhost:5173

# Allowed HTTP methods (comma-separated)
# Default: GET,POST
CORS_METHODS=GET,POST

# Allowed headers (comma-separated)
# Default: Content-Type
CORS_HEADERS=Content-Type


# ============================================================================
# DATABASE (si se utiliza en futuro)
# ============================================================================

# Database URL
# Format: dialect+driver://user:password@host:port/database
# Example PostgreSQL: postgresql://user:password@localhost:5432/financial_db
# DATABASE_URL=postgresql://user:password@localhost:5432/financial_db


# ============================================================================
# LOGGING & MONITORING
# ============================================================================

# Log level
# Values: DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL=INFO

# Log format
# Values: json, text
LOG_FORMAT=text


# ============================================================================
# CACHE (si se implementa)
# ============================================================================

# Redis URL for caching
# Format: redis://host:port
# REDIS_URL=redis://localhost:6379


# ============================================================================
# AUTHENTICATION (si se implementa)
# ============================================================================

# JWT secret key for authentication
# Generate with: openssl rand -hex 32
# JWT_SECRET_KEY=your-secret-key-here

# JWT expiration time (minutes)
# JWT_EXPIRATION_MINUTES=30
```

## Cómo usar

1. Copiar `.env.example` a `.env`
   ```bash
   cp .env.example .env
   ```

2. Editar `.env` con valores locales (nunca commitear)

3. Ignorar `.env` en `.gitignore` (ya está)

4. Documentar nuevas variables en `.env.example` cuando se añadan

## En docker-compose.yml

```yaml
backend:
  build:
    context: ./backend
  env_file:
    - .env
  environment:
    # Sobrescribir si es necesario
    - DEBUG=true
```

## Validación en aplicación

```python
# backend/app/config.py
from pathlib import Path
import os

# Cargar desde .env
from dotenv import load_dotenv
load_dotenv()

# Validar que exista .env.example en repo
def check_env_example_exists():
    if not Path('.env.example').exists():
        raise RuntimeError(
            '.env.example file is missing! '
            'Please create it with configuration template.'
        )

# Al inicio de main.py
check_env_example_exists()
```

## Impacto

Proporciona:
- Documentación clara de configuración
- Onboarding rápido para nuevos desarrolladores
- Referencia de variables disponibles
- Facilita debugging de problemas de config
- Evita sorpresas por variables faltantes
