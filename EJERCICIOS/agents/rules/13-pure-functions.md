---
title: "Usar funciones puras y evitar estado global"
description: "Las funciones deben ser puras: no modifican estado global, retornan el mismo output para el mismo input, y no tienen efectos secundarios. Esto facilita testing, debugging y permite reutilizar código con confianza."
scope: "project"
globs:
  - "backend/app/routes.py"
  - "backend/**/*.py"
application: "Always"
---

## Detalles

- ✅ Funciones que retornan nuevas listas/objetos, no modifican entrada
- ✅ Parámetros que documentan todas las dependencias
- ✅ Mismo input siempre produce mismo output
- ✅ Sin acceso a variables globales (excepto constantes)
- ✅ Sin efectos secundarios (no escriben files, no modifican BD)
- ❌ NO modificar parámetros que son listas/dicts
- ❌ NO usar variables globales para estado
- ❌ NO tener funciones que a veces funcionan diferente

## Ejemplo ✅ CORRECTO (ACTUAL)

```python
# PURA: no modifica entrada, retorna nueva lista
def filter_movements(
    movements: list[FinancialMovement],
    start_date: date | None,
    end_date: date | None,
) -> list[FinancialMovement]:
    """Filter movements by date range. Returns new list without modifying input."""
    filtered = movements  # Referencia, no copia
    
    if start_date is not None:
        filtered = [
            movement for movement in filtered 
            if movement.create_date >= start_date
        ]
    
    if end_date is not None:
        filtered = [
            movement for movement in filtered 
            if movement.create_date <= end_date
        ]
    
    return filtered  # Nueva lista, original no modificada
```

## Ejemplo ❌ MALO

```python
# IMPURA: modifica estado global
CACHED_MOVEMENTS = []

def fetch_movements():
    """Modifica variable global - difícil de testear."""
    global CACHED_MOVEMENTS
    CACHED_MOVEMENTS = generate_mock_movements()  # ❌ Efecto secundario
    return CACHED_MOVEMENTS

# IMPURA: modificar entrada
def sort_movements_inplace(movements: list[FinancialMovement]):
    """Modifica la lista que recibe - causa bugs inesperados."""
    movements.sort(key=lambda x: x.create_date)  # ❌ Modifica entrada
    return movements
```

## Ejemplo ✅ CORRECTO (alternativa)

```python
# PURA: retorna nueva lista ordenada
def ensure_chronological_order(
    movements: list[FinancialMovement]
) -> list[FinancialMovement]:
    """Return new sorted list without modifying input."""
    return sorted(movements, key=lambda item: item.create_date)

# PURA: sin estado global
def generate_mock_movements(seed: int | None = None) -> list[FinancialMovement]:
    """Generate mock data. Same seed = same output."""
    if seed is not None:
        random.seed(seed)  # Local scope only
    
    movements: list[FinancialMovement] = []
    # ... generar datos ...
    return movements  # Retorna valor sin efectos globales
```

## Ventajas de funciones puras

| Aspecto | Pura | Impura |
|---------|------|--------|
| Testing | Fácil (input → output) | Difícil (contexto global) |
| Debugging | Predecible | Depende del estado |
| Paralelización | Segura | Necesita sincronización |
| Cacheo | Posible | Complejo |
| Reusabilidad | Alta | Baja |

## Impacto

Permite:
- Testing simple y confiable
- Paralelización segura
- Refactorización sin miedo
- Debugging predecible
- Código reusable
