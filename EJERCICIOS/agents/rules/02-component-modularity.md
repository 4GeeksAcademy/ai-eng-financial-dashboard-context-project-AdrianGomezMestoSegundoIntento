---
title: "Organizar componentes React en estructura modular"
description: "Los componentes React deben organizarse en dos carpetas principales: /components/dashboard/ para componentes específicos del dominio y /components/ui/ para componentes reutilizables. Esta separación clara permite encontrar código rápidamente y facilita el reuso."
scope: "project"
globs:
  - "frontend/src/components/**/*.tsx"
  - "frontend/src/components/**/*.ts"
application: "Always"
---

## Detalles

- ✅ Crear `/components/dashboard/` para componentes específicos del negocio
- ✅ Crear `/components/ui/` para componentes genéricos reutilizables
- ✅ Mantener un componente por archivo
- ✅ Nombrar componentes con PascalCase
- ✅ Exportar tipos/interfaces en el mismo archivo del componente
- ❌ NO mezclar componentes de dominio con componentes genéricos
- ❌ NO crear componentes monolíticos que hagan múltiples cosas

## Estructura esperada

```
frontend/src/components/
├── dashboard/
│   ├── kpi-card.tsx
│   ├── dashboard-header.tsx
│   └── income-outcome-chart.tsx
└── ui/
    ├── card.tsx
    ├── skeleton.tsx
    └── button.tsx
```

## Impacto

Permite:
- Localizar código de forma rápida
- Reutilizar componentes genéricos en diferentes pantallas
- Entender el propósito de cada componente al ver su ubicación
- Facilita testing y mantenimiento
