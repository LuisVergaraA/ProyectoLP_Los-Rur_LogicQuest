from fastapi import FastAPI
from .db import Base, engine
from .routers.condicionales import router as cond_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LogicQuest API")

app.include_router(cond_router)


@app.get("/health")
def health():
    return {"status": "ok"}
