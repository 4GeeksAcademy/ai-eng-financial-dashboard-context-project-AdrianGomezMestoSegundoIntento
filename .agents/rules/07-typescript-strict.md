---
title: "Usar TypeScript con interfaces estrictas en React"
description: "Todo código TypeScript en React debe incluir interfaces explícitas para props, estado y datos. Esto garantiza type checking en tiempo de compilación y evita errores de runtime."
scope: "project"
globs:
  - "frontend/src/**/*.tsx"
  - "frontend/src/**/*.ts"
application: "Always"
---

## Detalles

- ✅ Declarar interfaces para todos los props de componentes
- ✅ Declarar tipos para variables y funciones
- ✅ Usar tipos compartidos desde `financial-types.ts`
- ✅ Configurar TypeScript en modo estricto
- ✅ Usar `Record<K, V>` para objetos con claves dinámicas
- ✅ Usar `readonly` en props para evitar mutaciones accidentales
- ❌ NO usar `any` sin documentación explícita
- ❌ NO omitir tipos porque "es evidente"
- ❌ NO declarar props inline en componentes sin interfaz

## Ejemplo correcto

```typescript
interface KPICardProps {
  label: string
  value: string
  helperText: string
  icon: LucideIcon
  variant: 'income' | 'outcome' | 'profit' | 'profitPercent'
  loading?: boolean
}

export function KPICard({
  label,
  value,
  helperText,
  icon: Icon,
  variant,
  loading = false,
}: KPICardProps) {
  // ...
}
```

## Archivos de tipos compartidos

- `frontend/src/lib/financial-types.ts`: Tipos del dominio
- `frontend/src/lib/financial-utils.ts`: Funciones y tipos de utilidad

## Impacto

Proporciona:
- Detección de errores en compilación
- Mejor autocompletar en IDEs
- Documentación explícita de contrato
- Refactorización segura
