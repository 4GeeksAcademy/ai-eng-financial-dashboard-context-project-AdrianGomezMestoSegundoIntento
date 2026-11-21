# Directorio de Agentes IA - Guía de Uso

Este directorio contiene configuración y guías para que agentes IA trabajen efectivamente en el proyecto Financial Dashboard.

## 📁 Estructura

```
.agents/
├── README.md           ← Este archivo
├── rules/              ← Reglas del proyecto
│   ├── README.md           (Índice completo)
│   ├── SUMMARY.txt         (Resumen rápido)
│   ├── 01-structure-separation.md
│   ├── 02-component-modularity.md
│   ├── 03-python-type-hints.md
│   ... (13 reglas más)
│   └── 15-env-example.md
└── skills/             ← (Futuro) Habilidades personalizadas
```

## 🎯 Propósito

Las reglas en `.agents/rules/` establecen estándares que:
- ✅ Protegen la calidad del código
- ✅ Documentan buenas prácticas existentes
- ✅ Previenen errores comunes
- ✅ Facilitan onboarding de nuevos contribuidores

## 🚀 Para Agentes IA

Cuando trabajes en este proyecto:

### 1. **Cargar reglas al inicio**
```
Lee estas reglas antes de cualquier tarea:
→ EJERCICIOS/agents/rules/README.md
→ EJERCICIOS/agents/rules/SUMMARY.txt
```

### 2. **Validar código generado**
Antes de proponer cambios:
- [ ] Verificar contra reglas **CRÍTICAS** 🔴
- [ ] Verificar contra reglas **IMPORTANTES** 🟠
- [ ] Considerar reglas **RECOMENDADAS** 🟡

### 3. **Reportar incumplimientos**
Si encuentras código que incumple reglas:
- Comentar en PR el número de regla
- Proporcionar enlace a la regla
- Sugerir corrección según ejemplos en la regla

### 4. **Documentar excepciones**
Si hay razones para no seguir una regla:
- Documentar el motivo en commit message
- Justificar por qué la excepción es necesaria
- Preferir solución alternativa si es posible

## 📖 Arquitectura y Contexto

### Componentes principales
- **Backend**: FastAPI (Python 3.13+)
- **Frontend**: React 19 + TypeScript
- **Infraestructura**: Docker Compose

### Convenciones clave
- Separación clara frontend/backend
- Type hints exhaustivos
- Validación con Pydantic
- Componentes React modulares
- Tests colocados junto al código

### Archivos importantes
- `backend/app/routes.py` - Lógica de API
- `frontend/src/lib/` - Tipos y utilidades
- `frontend/src/components/` - Componentes React
- `docker-compose.yml` - Orquestación

## 🔍 Referencias rápidas

### Por tipo de tarea

**Modificar Backend**
1. Leer: [03-python-type-hints.md](rules/03-python-type-hints.md)
2. Leer: [04-pydantic-validation.md](rules/04-pydantic-validation.md)
3. Leer: [12-backend-logging.md](rules/12-backend-logging.md)
4. Leer: [13-pure-functions.md](rules/13-pure-functions.md)

**Modificar Frontend**
1. Leer: [07-typescript-strict.md](rules/07-typescript-strict.md)
2. Leer: [02-component-modularity.md](rules/02-component-modularity.md)
3. Leer: [08-api-client.md](rules/08-api-client.md)

**Añadir dependencias**
1. Leer: [09-pinned-versions.md](rules/09-pinned-versions.md)

**Configurar ambiente**
1. Leer: [11-validate-env.md](rules/11-validate-env.md)
2. Leer: [15-env-example.md](rules/15-env-example.md)

**Desplegar a producción**
1. Leer: [06-cors-restrictive.md](rules/06-cors-restrictive.md)
2. Leer: [10-no-debugger-production.md](rules/10-no-debugger-production.md)

## 💡 Ejemplos de aplicación

### ❌ Sin seguir reglas
```python
# Problema: CORS permisivo + sin tipos
allow_origins=["*"]

def get_metrics(movements):  # Sin type hints
    return movements
```

### ✅ Siguiendo reglas
```python
# Solución: CORS restrictivo + type hints
allow_origins=["http://localhost:5173"]

def get_metrics(
    movements: list[FinancialMovement]
) -> list[FinancialMovement]:
    return movements
```

## 📝 Flujo de trabajo

```
1. Recibir tarea
   ↓
2. Cargar reglas relevantes
   ↓
3. Analizar código existente
   ↓
4. Generar solución siguiendo reglas
   ↓
5. Auto-revisar contra reglas
   ↓
6. Proponer cambios documentados
```

## 🔗 Enlaces útiles

- [Buenas y Malas Prácticas](../Buenas-Malas-Prácticas.md) - Análisis completo
- [Verificación de Cambios](../verificacion.md) - Historial del proyecto
- [Índice de Reglas](rules/README.md) - Guía detallada

## ❓ Preguntas frecuentes

**P: ¿Puedo ignorar una regla?**
R: Solo en casos excepcionales. Documenta el motivo en el commit.

**P: ¿Qué hago si la regla entra en conflicto con el código existente?**
R: Proporciona refactorización que alinee el código con la regla.

**P: ¿Las reglas cambian?**
R: Sí. Revisa `verificacion.md` para ver cambios recientes.

**P: ¿Qué pasa si encuentro un error en una regla?**
R: Documenta el problema en un issue y propón una corrección.

---

**Última actualización:** 15/11/2024

Para más información, consulta `rules/README.md`
