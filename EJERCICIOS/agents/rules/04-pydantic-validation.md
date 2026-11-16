---
title: "Usar Pydantic para modelos de validación en FastAPI"
description: "Todos los modelos de datos en FastAPI deben estar definidos como clases BaseModel de Pydantic. Esto garantiza validación automática de datos, serialización JSON correcta y generación automática de documentación Swagger."
scope: "project"
globs:
  - "backend/app/routes.py"
  - "backend/**/*.py"
application: "Always"
---

## Detalles

- ✅ Definir todos los modelos como `class NombreModel(BaseModel)`
- ✅ Incluir type hints para cada campo
- ✅ Usar el modelo como tipo de retorno en `response_model=`
- ✅ Pydantic valida automáticamente tipos y restricciones
- ✅ La documentación Swagger se genera automáticamente
- ❌ NO pasar diccionarios sin validar de Pydantic
- ❌ NO crear funciones que retornen tipos genéricos sin estructura

## Ejemplo correcto

```python
class FinancialMovement(BaseModel):
    create_date: date
    amount: float
    operation_type: OperationType
    category: Category
    business_type: BusinessType

@router.get("/api/metrics", response_model=list[FinancialMovement])
def get_metrics() -> list[FinancialMovement]:
    ...
```

## Impacto

Garantiza:
- Validación automática de datos entrantes
- Serialización JSON correcta
- Documentación Swagger generada automáticamente
- Type safety en toda la API
