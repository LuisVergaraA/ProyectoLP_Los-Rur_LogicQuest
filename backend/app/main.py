from fastapi import FastAPI
from .db import Base, engine
from .routers.condicionales import router as cond_router
from .routers.gamificacion import router as gam_router
    
from fastapi.middleware.cors import CORSMiddleware # <--- Agregar import
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LogicQuest API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(cond_router)
app.include_router(gam_router)

@app.get("/health")
def health():
    return {"status": "ok"}
