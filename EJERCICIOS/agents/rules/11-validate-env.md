---
title: "Validar variables de entorno en startup"
description: "Validar que todas las variables de entorno requeridas estén definidas cuando la aplicación inicia. Esto evita fallos silenciosos y proporciona mensajes de error claros."
scope: "project"
globs:
  - "frontend/src/main.tsx"
  - "frontend/src/App.tsx"
  - "backend/app/main.py"
application: "Always"
---

## Detalles

- ✅ Validar variables críticas (API_BASE_URL, DB_URL, etc.)
- ✅ Proporcionar mensajes de error claros
- ✅ Fallar rápido si falta configuración
- ✅ Documentar variables requeridas en .env.example
- ✅ Usar default values solo cuando sea seguro
- ❌ NO permitir que aplicación inicie con config incompleta
- ❌ NO usar valores vacíos silenciosamente
- ❌ NO confiar en que la validación ocurra "después"

## Ejemplo ❌ MALO (ACTUAL)

```typescript
// frontend/src/App.tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""
// Si es vacío, todas las llamadas fallan silenciosamente
```

## Ejemplo ✅ CORRECTO - Frontend

```typescript
// frontend/src/lib/env.ts
export function validateEnvironment() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  
  if (!apiBaseUrl) {
    throw new Error(
      'Missing required environment variable: VITE_API_BASE_URL\n' +
      'Please set it in .env or .env.local'
    )
  }
  
  return { apiBaseUrl }
}

// frontend/src/main.tsx
import { validateEnvironment } from './lib/env'

try {
  validateEnvironment()
} catch (error) {
  console.error('Configuration error:', error)
  document.body.innerHTML = `<h1>Error: ${error.message}</h1>`
  process.exit(1)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Ejemplo ✅ CORRECTO - Backend

```python
# backend/app/config.py
import os
from pathlib import Path

class Settings:
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    ).split(",")
    
    def validate(self):
        """Validar que todas las variables requeridas estén presentes."""
        errors = []
        
        if not self.CORS_ORIGINS or not self.CORS_ORIGINS[0]:
            errors.append("CORS_ORIGINS debe estar definido")
        
        if self.API_PORT < 1 or self.API_PORT > 65535:
            errors.append("API_PORT debe estar entre 1 y 65535")
        
        if errors:
            raise ValueError(
                "Configuration errors:\n" + 
                "\n".join(f"  - {e}" for e in errors)
            )

# backend/app/main.py
settings = Settings()
settings.validate()  # Fallar rápido si configuración es inválida

app = FastAPI(title="Financial Metrics API")
```

## Archivo .env.example

```env
# Frontend
VITE_API_BASE_URL=http://localhost:8000

# Backend
DEBUG=false
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,https://app.example.com
```

## Impacto

Proporciona:
- Fallos rápidos y claros
- Facilita debugging de problemas de config
- Evita comportamiento impredecible
- Mejor experiencia para nuevos desarrolladores
