---
title: "Implementar logging en backend"
description: "Todo el backend debe incluir logging en endpoints y funciones críticas. Esto facilita debugging, monitoreo en producción y auditoría de operaciones."
scope: "project"
globs:
  - "backend/app/**/*.py"
  - "backend/**/*.py"
application: "Always"
---

## Detalles

- ✅ Usar módulo `logging` de Python
- ✅ Configurar logger en app/main.py
- ✅ Loguear inicio y finalización de requests
- ✅ Loguear errores con stack trace
- ✅ Loguear operaciones críticas (DB, cache, etc.)
- ✅ Incluir contexto en logs (user_id, request_id, etc.)
- ❌ NO usar print() para debugging en producción
- ❌ NO loguear información sensible (passwords, tokens)
- ❌ NO dejar logs de debug activados en producción

## Ejemplo ✅ CORRECTO

```python
# backend/app/config.py
import logging
import sys

def setup_logging(debug: bool = False):
    """Configure logging for the application."""
    level = logging.DEBUG if debug else logging.INFO
    
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
        ]
    )

# backend/app/main.py
import logging
from app.config import setup_logging

setup_logging(debug=False)
logger = logging.getLogger(__name__)

app = FastAPI(title="Financial Metrics API")

@app.on_event("startup")
async def startup():
    logger.info("Application startup")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Application shutdown")

# backend/app/routes.py
import logging

logger = logging.getLogger(__name__)

@router.get("/api/metrics")
def get_metrics(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
) -> list[FinancialMovement]:
    logger.debug(f"Fetching metrics from {start_date} to {end_date}")
    
    try:
        movements = generate_mock_movements(seed=42)
        filtered = filter_movements(movements, start_date, end_date, None, None)
        logger.info(f"Returned {len(filtered)} metrics")
        return ensure_chronological_order(filtered)
    
    except Exception as e:
        logger.error(f"Error fetching metrics: {str(e)}", exc_info=True)
        raise
```

## Niveles de log

- **DEBUG**: Información de debugging (argumentos, valores intermedios)
- **INFO**: Información general (inicio, inicio de request, éxito)
- **WARNING**: Situaciones inesperadas pero recuperables
- **ERROR**: Errores que necesitan atención
- **CRITICAL**: Fallos del sistema

## Estructura de logs recomendada

```
2024-01-15 10:30:45,123 - app.routes - INFO - Fetching metrics from 2024-01-01 to 2024-01-31
2024-01-15 10:30:45,456 - app.routes - DEBUG - Found 360 total movements
2024-01-15 10:30:45,789 - app.routes - INFO - Returned 100 filtered metrics
```

## Impacto

Proporciona:
- Visibilidad de operaciones en producción
- Facilita debugging de problemas
- Auditoría de acciones
- Monitoreo y alertas
- Mejora en performance (identificar cuellos)
