from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import engine, Base
from .routers import condicionales, ciclos, gamificacion

# Crear las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LogicQuest API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(condicionales.router)
app.include_router(ciclos.router)
app.include_router(gamificacion.router)

@app.get("/")
def read_root():
    return {
        "message": "Bienvenido a LogicQuest API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}