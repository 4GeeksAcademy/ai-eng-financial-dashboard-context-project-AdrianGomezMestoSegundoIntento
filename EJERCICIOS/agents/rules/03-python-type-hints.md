---
title: "Usar type hints exhaustivos en Python"
description: "Todo código Python debe incluir type hints explícitos en parámetros y valores de retorno. Esto mejora la legibilidad, facilita la detección de errores con mypy y genera automáticamente documentación en Swagger para endpoints FastAPI."
scope: "project"
globs:
  - "backend/**/*.py"
application: "Always"
---

## Detalles

- ✅ Declarar tipos para todos los parámetros de función
- ✅ Declarar tipo de retorno en toda función
- ✅ Usar `list[T]`, `dict[K, V]` en lugar de tipos genéricos sin parámetros
- ✅ Usar `X | None` en lugar de `Optional[X]` (Python 3.10+)
- ✅ Usar Literal types para enumeraciones: `Literal["income", "outcome"]`
- ✅ Validar con mypy en CI/CD
- ❌ NO omitir type hints bajo el argumento de "es evidente"
- ❌ NO usar `Any` sin justificación documentada

## Ejemplo correcto

```python
def filter_movements(
    movements: list[FinancialMovement],
    start_date: date | None,
    end_date: date | None,
) -> list[FinancialMovement]:
    """Filter movements by date range."""
    ...
```

## Impacto

Proporciona:
- Documentación automática en Swagger
- Detección de errores en tiempo de compilación
- Mejor autocompletar en IDEs
- Código más mantenible
