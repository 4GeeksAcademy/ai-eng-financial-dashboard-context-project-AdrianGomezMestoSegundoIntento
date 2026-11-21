# Panel de Métricas Financieras - Resumen del Proyecto

## 🎯 Objetivo
Un dashboard web que muestra métricas financieras, con:
- **Frontend**: React + TypeScript
- **Backend**: FastAPI
- **Infraestructura**: Docker Compose para ejecutar ambos servicios

## 📋 Características clave
- Dashboard de análisis financiero
- API REST con documentación Swagger en `/docs`
- Arquitectura moderna con separación frontend/backend
- Diseño modular para facilitar la enseñanza y el aprendizaje

## 🚀 Para ejecutar localmente
```bash
docker compose up --build
```

### URLs de acceso:
- **Frontend**: http://localhost:5173 (React + TypeScript)
- **Backend**: http://localhost:8000 (FastAPI)
- **Documentación API**: https://glorious-memory-v4j4rq4vw6rhxrwj-8000.app.github.dev/docs

## 📁 Estructura de agentes de IA
El proyecto está configurado para que agentes de IA inspeccionen y documenten el código:
- `./.agents/rules/` - Reglas del proyecto
- `./.agents/skills/` - Habilidades personalizadas

## 📚 Stack tecnológico
- **Frontend**: React, TypeScript, Vite
- **Backend**: FastAPI (Python)
- **DevOps**: Docker, Docker Compose
- **Propósito**: Proyecto educativo de 4Geeks Academy
