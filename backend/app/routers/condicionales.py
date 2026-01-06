import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Exercise
from ..schemas import ExerciseCreate, ExerciseOut

router = APIRouter(prefix="/api/v1/condicionales", tags=["condicionales"])


@router.post("", status_code=201, response_model=ExerciseOut)
def create_exercise(payload: ExerciseCreate, db: Session = Depends(get_db)):
    if payload.correct_index >= len(payload.options):
        raise HTTPException(status_code=422, detail="correct_index fuera de rango")

    item = Exercise(
        module="condicionales",
        statement=payload.statement,
        options_json=json.dumps(payload.options, ensure_ascii=False),
        correct_index=payload.correct_index,
        is_active=payload.is_active,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return ExerciseOut(
        id=item.id,
        module=item.module,
        statement=item.statement,
        options=json.loads(item.options_json),
        correct_index=item.correct_index,
        is_active=item.is_active,
        created_at=item.created_at,
    )


@router.get("", response_model=list[ExerciseOut])
def list_exercises(db: Session = Depends(get_db)):
    items = (
        db.query(Exercise)
        .filter(Exercise.module == "condicionales")
        .filter(Exercise.is_active == True)
        .order_by(Exercise.id.desc())
        .all()
    )

    out: list[ExerciseOut] = []
    for item in items:
        out.append(
            ExerciseOut(
                id=item.id,
                module=item.module,
                statement=item.statement,
                options=json.loads(item.options_json),
                correct_index=item.correct_index,
                is_active=item.is_active,
                created_at=item.created_at,
            )
        )
    return out
