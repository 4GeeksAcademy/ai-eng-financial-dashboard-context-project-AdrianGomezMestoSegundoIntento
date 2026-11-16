# Auditoría de Código: Buenas y Malas Prácticas

## 📁 ESTRUCTURA DE CARPETAS Y ARCHIVOS

### ✅ Buenas Prácticas Detectadas

1. **Separación clara frontend/backend**
   - `/frontend` y `/backend` como directorios independientes
   - Cada uno con su propia configuración (`package.json`, `requirements.txt`)
   - Facilita escalabilidad y trabajo independiente de equipos

2. **Estructura modular de componentes React**
   - `/frontend/src/components/dashboard/` - Componentes específicos del dominio
   - `/frontend/src/components/ui/` - Componentes reutilizables
   - Separación de responsabilidades clara

3. **Carpetas `lib/` bien organizadas**
   - `financial-types.ts` - Tipos compartidos
   - `financial-utils.ts` - Funciones utilitarias
   - `financial-utils.test.ts` - Tests colacados junto al código
   - Facilita encontrar código relacionado

4. **Estructura modular en backend**
   - `app/routes.py` - Lógica de rutas separada
   - `app/main.py` - Configuración de FastAPI
   - `app/__init__.py` - Inicialización del módulo
   - `tests/` - Tests en carpeta dedicada

5. **.gitignore completo**
   - Excluye `node_modules/`, `__pycache__/`, archivos de entorno
   - Protege archivos sensibles (`.env`, secretos)
   - Evita commits de artefactos de build

6. **docker-compose.yml con volúmenes**
   - Facilita desarrollo local con recargas automáticas
   - Expone puertos de debug (5678 para Python/debugpy)
   - Define dependencias entre servicios

---

## 🐍 BACKEND (FastAPI)

### ✅ Buenas Prácticas

1. **Type hints exhaustivos (Python 3.13+)**
   ```python
   # En routes.py - tipos explícitos en todas las funciones
   def filter_movements(
       movements: list[FinancialMovement],
       start_date: date | None,
       end_date: date | None,
       category: Category | None,
   ) -> list[FinancialMovement]:
   ```
   - Mejora legibilidad y detecta errores con mypy
   - Genera documentación automática en Swagger

2. **Literales (Literal types) para enumeraciones**
   ```python
   OperationType = Literal["income", "outcome"]
   Category = Literal["suppliers", "sales", ...]
   ```
   - Más seguro que strings sin validar
   - IDE autocompletar efectivo

3. **Modelos Pydantic para validación**
   ```python
   class FinancialMovement(BaseModel):
       create_date: date
       amount: float
   ```
   - Validación automática de datos
   - Serialización JSON automática
   - Documentación Swagger generada

4. **Seed determinístico (seed=42)**
   ```python
   def generate_mock_movements(seed: int | None = None):
       if seed is not None:
           random.seed(seed)
   ```
   - Datos reproducibles en todas las llamadas
   - Facilita testing

5. **Tests exhaustivos**
   - `/backend/tests/test_routes.py` cubre todos los endpoints
   - Usa `TestClient` de FastAPI
   - Tests validan filtros, tipos y respuestas esperadas

6. **Funciones puras sin estado global**
   - `generate_mock_movements()` retorna nueva lista
   - `filter_movements()` no modifica entrada
   - Facilita testing y debugging

7. **CORS configurado (aunque permisivo)**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # ⚠️ Ver malas prácticas
   )
   ```

### ❌ Malas Prácticas

1. **CORS demasiado permisivo en producción**
   ```python
   allow_origins=["*"],  # ❌ Riesgo de seguridad
   allow_methods=["*"],
   allow_headers=["*"],
   ```
   - **Impacto**: Vulnerable a ataques CSRF
   - **Acción recomendada**: Especificar origenes concretos
   ```python
   allow_origins=["http://localhost:5173", "https://production-url.com"],
   allow_methods=["GET", "POST"],
   ```

2. **Datos mock siempre con mismo seed (seed=42)**
   ```python
   # En cada endpoint
   movements = generate_mock_movements(seed=42)  # Siempre igual
   ```
   - **Impacto**: No hay variación en datos, oculta bugs
   - **Acción**: Usar seed solo en tests, datos aleatorios en producción

3. **Generación de datos en cada request**
   ```python
   @router.get("/api/metrics")
   def get_metrics(...):
       movements = generate_mock_movements(seed=42)  # Se recalcula SIEMPRE
   ```
   - **Impacto**: Ineficiente, latencia innecesaria
   - **Acción**: Cachear datos o usar base de datos real

4. **Endpoints duplicados con lógica repetida**
   ```python
   # Dos endpoints similares con código casi idéntico
   @router.get("/api/metrics/b2b")
   def get_b2b_metrics(...):
       movements = [m for m in generate_mock_movements(seed=42) 
                   if m.business_type == "B2B"]
   
   @router.get("/api/metrics/b2c")
   def get_b2c_metrics(...):
       movements = [m for m in generate_mock_movements(seed=42) 
                   if m.business_type == "B2C"]
   ```
   - **Impacto**: Viola principio DRY (Don't Repeat Yourself)
   - **Acción**: Usar parámetro query único o función auxiliar reutilizable

5. **Sin validación de entrada de debugger**
   ```python
   # En Dockerfile
   CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", ...]
   ```
   - **Impacto**: Expone puerto de debug a toda la red en desarrollo
   - **Acción**: Restringir a localhost en desarrollo, NO usar en producción

6. **Sin logging**
   - No hay logs en endpoints
   - Dificulta debugging en producción
   - **Acción**: Añadir logging con `import logging`

7. **Sin manejo de excepciones explícito**
   - Errores retornan 500 genérico sin detalles
   - **Acción**: Usar `HTTPException` con status codes apropiados

---

## ⚛️ FRONTEND (React + TypeScript)

### ✅ Buenas Prácticas

1. **TypeScript estricto con interfaces**
   ```typescript
   export interface FinancialMovement {
     create_date: string
     amount: number
     operation_type: OperationType
     category: Category
     business_type: BusinessType
   }
   ```
   - Type checking en tiempo de compilación
   - Evita errores de runtime

2. **Componentes funcionales con hooks**
   - Uso de `useState` para estado local
   - `useEffect` para efectos secundarios
   - Patrón moderno de React

3. **Estructura de archivos clara**
   ```
   /components/dashboard/  → componentes específicos del dominio
   /components/ui/         → componentes reutilizables
   /lib/                   → utilidades, tipos, mock data
   ```

4. **Alias de imports**
   ```typescript
   import { computeKPIs } from "@/lib/financial-utils"
   ```
   - `@/` apunta a `src/`
   - Evita imports relativos complicados
   - Fácil refactorización

5. **Manejo de errores**
   ```typescript
   {error ? (
     <div className="rounded-lg border border-destructive/30 ...">
       {error}
     </div>
   ) : null}
   ```
   - Muestra mensaje de error al usuario
   - Interfaz amigable

6. **Loading states**
   ```typescript
   const [loading, setLoading] = useState(true)
   <KPIRow metrics={metrics} loading={loading} />
   ```
   - UX mejorada mientras carga datos
   - Componentes muestran skeletons

7. **Configuración de API con variable de entorno**
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""
   ```
   - Flexible entre entornos (dev/prod)
   - Usa Vite para acceder a env vars

8. **Tests con Vitest**
   - Scripts en package.json: `test`, `test:watch`, `test:coverage`
   - Framework moderno para React

### ❌ Malas Prácticas

1. **Fetch raw sin cliente HTTP reutilizable**
   ```typescript
   // En App.tsx
   async function fetchFinancialData(): Promise<FinancialMovement[]> {
     const response = await fetch(`${API_BASE_URL}/api/metrics`)
     if (!response.ok) {
       throw new Error(`Failed: ${response.status}`)
     }
     return response.json()
   }
   ```
   - **Impacto**: Si hay 10 componentes, 10 copias del código
   - **Acción**: Crear `api-client.ts` reutilizable
   ```typescript
   // lib/api-client.ts
   export const apiClient = {
     getMetrics: () => fetch(...),
     getSummary: () => fetch(...),
   }
   ```

2. **Sin reintentos en fetch**
   ```typescript
   fetchFinancialData()
     .then(...)
     .catch(() => setError("No se pudo cargar..."))
   ```
   - **Impacto**: Fallos transitorios de red causan error inmediato
   - **Acción**: Implementar retry logic con exponential backoff

3. **Error genérico sin contexto**
   ```typescript
   .catch(() => {
     setError("No se pudo cargar la informacion financiera. Revisa la API de backend.")
   })
   ```
   - **Impacto**: Mensaje sin detalles del error real
   - **Acción**: Pasar error real y loguear en consola dev
   ```typescript
   .catch((err) => {
     console.error("API Error:", err)
     setError(`Error: ${err.message}`)
   })
   ```

4. **Sin caché de datos**
   - Cada recarga de página re-fetch desde API
   - **Acción**: Usar `React Query` o `SWR` para caché y revalidación

5. **Strings hardcodeados**
   ```typescript
   <DashboardHeader period="2024 - Full Year" />  // ❌ Hardcoded
   ```
   - **Impacto**: Difícil de cambiar, no internacionalizable
   - **Acción**: Pasar como prop o usar constantes

6. **Sin testing visible**
   - `test:coverage` está en scripts pero no hay evidencia de ejecución
   - **Acción**: Ejecutar y revisar cobertura

7. **Variables de entorno sin validación**
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""
   ```
   - **Impacto**: Si API_BASE_URL está vacío, falla silenciosamente
   - **Acción**: Validar en startup
   ```typescript
   if (!API_BASE_URL) {
     throw new Error("VITE_API_BASE_URL must be defined")
   }
   ```

---

## 🐳 DOCKER & INFRAESTRUCTURA

### ✅ Buenas Prácticas

1. **docker-compose.yml con volumes**
   ```yaml
   volumes:
     - ./frontend:/app
     - /app/node_modules  # Evita overwrite de node_modules
   ```
   - Desarrollo con hot-reload

2. **Dependencias explícitas**
   ```yaml
   depends_on:
     - backend  # Frontend espera backend listo
   ```

3. **Python slim image**
   ```dockerfile
   FROM python:3.13-slim
   ```
   - Imagen pequeña, rápida

4. **Pip cache optimization**
   ```dockerfile
   RUN pip install --no-cache-dir -r requirements.txt
   ```
   - Reduce tamaño de imagen

### ❌ Malas Prácticas

1. **Debugger expuesto en puerto público**
   ```dockerfile
   EXPOSE 8000 5678
   CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", ...]
   ```
   - **Impacto**: Seguridad critica si se ejecuta en producción
   - **Acción**: Usar solo en desarrollo, nunca en prod

2. **Sin requirements.txt pinned versions**
   ```txt
   fastapi        # ❌ Puede cambiar en cualquier momento
   uvicorn[standard]
   ```
   - **Impacto**: Builds no reproducibles
   - **Acción**: Usar `pip freeze` para fijar versiones
   ```txt
   fastapi==0.109.0
   uvicorn[standard]==0.27.0
   ```

3. **Volume monta código fuente directamente**
   - Desarrollo problemático si hay permisos distintos
   - **Acción**: Considerar copiar en imagen, montar solo si necesario

---

## 📝 ARCHIVOS DE CONFIGURACIÓN

### ✅ Buenas Prácticas

1. **tsconfig.json con opciones estrictas**
   - Validación fuerte de tipos en TypeScript

2. **ESLint configurado**
   - `"lint": "eslint ."` en package.json
   - Mantiene consistencia de código

3. **Vite para bundling**
   - Rápido, moderno, soporte hot-reload
   - Mejor que Webpack para proyectos medianos

### ❌ Malas Prácticas

1. **Sin .env.example**
   - Nuevos desarrolladores no saben qué variables necesitan
   - **Acción**: Crear `.env.example` con variables requeridas

2. **Sin README.md con instrucciones**
   - Existe `README.es.md` pero no se documenta cómo contribuir
   - **Acción**: Añadir sección "Para desarrolladores"

---

## 🎯 RESUMEN DE PRIORIDADES PARA NUEVOS DESARROLLADORES Y AGENTES IA

### CRÍTICO 🔴
- [ ] CORS restrictivo en producción
- [ ] No exponer debugger en puerto 5678 en producción
- [ ] Validar variables de entorno en startup (API_BASE_URL)

### IMPORTANTE 🟠
- [ ] Refactorizar endpoints duplicados (b2b/b2c)
- [ ] Crear cliente HTTP reutilizable en frontend
- [ ] Fijar versiones en requirements.txt y package.json
- [ ] Implementar logging en backend

### RECOMENDADO 🟡
- [ ] Añadir reintentos en llamadas fetch
- [ ] Crear .env.example
- [ ] Implementar caché de datos con React Query
- [ ] Documentar guía para nuevos desarrolladores
- [ ] Ejecutar y revisar test coverage

---
