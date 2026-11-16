---
title: "Evitar endpoints duplicados con lógica repetida"
description: "No crear múltiples endpoints que hacen esencialmente lo mismo. En su lugar, usar parámetros de query para filtrar datos. Esto sigue el principio DRY (Don't Repeat Yourself) y reduce la superficie de código a mantener."
scope: "project"
globs:
  - "backend/app/routes.py"
application: "Always"
---

## Detalles

- ✅ Usar parámetros query para casos como business_type
- ✅ Reutilizar funciones de filtrado común
- ✅ Un endpoint, múltiples formas de usar
- ✅ Documentar opciones de query en docstrings
- ❌ NO crear `/api/metrics/b2b` Y `/api/metrics/b2c` separados
- ❌ NO repetir la misma lógica de filtrado en múltiples funciones
- ❌ NO duplicar código validando simplemente porque es "más simple"

## Ejemplo ❌ MALO

```python
@router.get("/api/metrics/b2b")
def get_b2b_metrics(...):
    movements = [m for m in generate_mock_movements(seed=42) 
                 if m.business_type == "B2B"]
    ...

@router.get("/api/metrics/b2c")
def get_b2c_metrics(...):
    movements = [m for m in generate_mock_movements(seed=42) 
                 if m.business_type == "B2C"]
    ...
```

## Ejemplo ✅ CORRECTO

```python
@router.get("/api/metrics")
def get_metrics(
    business_type: BusinessType | None = Query(default=None),
    ...
):
    movements = generate_mock_movements(seed=42)
    if business_type:
        movements = [m for m in movements if m.business_type == business_type]
    ...
```

## Impacto

Reduce:
- Código duplicado
- Puntos de error
- Complejidad de mantenimiento
- Superficie de testing
