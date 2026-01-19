# 🎮 LogicQuest - Plataforma Gamificada de Lógica de Programación

## 📋 Descripción

LogicQuest es una aplicación web educativa gamificada para ayudar a estudiantes a mejorar sus habilidades de lógica de programación mediante ejercicios interactivos de **condicionales** y **ciclos**, con retroalimentación inmediata y sistema de puntuación.

---

## ✨ Características Principales

- ✅ **Módulo de Condicionales** - Ejercicios interactivos if/else con validación automática
- ✅ **Módulo de Ciclos** - Retos de bucles for/while con casos de prueba
- ✅ **Sistema de Gamificación** - Puntos, niveles e insignias desbloqueables
- ✅ **Tabla de Clasificación** - Ranking global de jugadores
- ✅ **Perfil de Usuario** - Estadísticas detalladas y progreso
- ✅ **Retroalimentación Inmediata** - Validación en tiempo real

---

## 🏗️ Tecnologías Utilizadas

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy (ORM)
- SQLite (Base de datos)

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Python 3.10+
- Node.js 18+
- pip y npm

### Paso 1: Backend

```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos con datos de prueba
python init_data.py

# Iniciar servidor
uvicorn app.main:app --reload
```

El backend estará en: `http://127.0.0.1:8000`
Documentación API: `http://127.0.0.1:8000/docs`

### Paso 2: Frontend

```bash
cd logicquest-front

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará en: `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
logicquest-complete/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # Configuración FastAPI
│   │   ├── db.py            # Configuración BD
│   │   ├── models.py        # Modelos SQLAlchemy
│   │   ├── schemas.py       # Esquemas Pydantic
│   │   └── routers/
│   │       ├── condicionales.py
│   │       ├── ciclos.py
│   │       └── gamificacion.py
│   ├── init_data.py         # Script de inicialización
│   └── requirements.txt
│
└── logicquest-front/
    ├── src/
    │   ├── components/
    │   │   ├── Condicionales.jsx
    │   │   ├── Ciclos.jsx
    │   │   ├── Ranking.jsx
    │   │   └── Perfil.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## 📚 API Endpoints

### Condicionales
- `POST /api/v1/condicionales` - Crear ejercicio
- `GET /api/v1/condicionales` - Listar ejercicios
- `POST /api/v1/condicionales/{id}/intentar` - Validar respuesta
- `GET /api/v1/condicionales/historial/{user_id}` - Historial de usuario

### Ciclos
- `POST /api/v1/ciclos` - Crear reto
- `GET /api/v1/ciclos` - Listar retos
- `POST /api/v1/ciclos/{id}/intentar` - Validar solución
- `GET /api/v1/ciclos/historial` - Estadísticas de usuario

### Gamificación
- `POST /api/v1/users` - Crear usuario
- `POST /api/v1/badges` - Crear insignia
- `POST /api/v1/gamificacion/asignar-insignia` - Asignar insignia
- `GET /api/v1/gamificacion/leaderboard` - Obtener ranking

---

## 🎯 Datos de Prueba Incluidos

El script `init_data.py` crea automáticamente:
- ✅ 4 usuarios de prueba
- ✅ 5 ejercicios de condicionales
- ✅ 3 retos de ciclos
- ✅ 5 insignias

---

## 🏅 Sistema de Insignias

- 🎯 **Maestro Condicional** - 5 ejercicios correctos
- ⭐ **Experto en If/Else** - 10 ejercicios correctos
- 🔄 **Domina los Bucles** - 3 ciclos completados
- 💎 **Acumulador de Puntos** - 100 puntos totales
- 👑 **Lógica Suprema** - 15 ejercicios correctos

---

## 👥 Equipo de Desarrollo

| Integrante | Responsabilidad |
|------------|-----------------|
| **Johao Dorado** | Módulo de Condicionales |
| **Luis Roca** | Módulo de Ciclos |
| **Luis Vergara** | Sistema de Gamificación |

---

## 📝 Licencia

Proyecto académico - Lenguajes de Programación 2025

---

## 🆘 Solución de Problemas

### Error: "Module not found"
```bash
pip install -r requirements.txt
npm install
```

### Puerto ocupado
Backend:
```bash
uvicorn app.main:app --reload --port 8001
```

Frontend:
```bash
npm run dev -- --port 5174
```

### Error de CORS
Verifica que el backend esté corriendo y que la URL en `api.js` sea correcta.

---

**🎮 ¡Disfruta aprendiendo lógica de programación con LogicQuest! 🚀**