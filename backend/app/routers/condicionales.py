import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Exercise, ConditionalAttempt, User
from ..schemas import ExerciseCreate, ExerciseOut, ConditionalAttemptCreate, ConditionalAttemptResponse

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
    items = db.query(Exercise).filter(
        Exercise.module == "condicionales",
        Exercise.is_active == True
    ).order_by(Exercise.id.desc()).all()
    
    return [
        ExerciseOut(
            id=item.id,
            module=item.module,
            statement=item.statement,
            options=json.loads(item.options_json),
            correct_index=item.correct_index,
            is_active=item.is_active,
            created_at=item.created_at,
        )
        for item in items
    ]

@router.post("/{exercise_id}/intentar", response_model=ConditionalAttemptResponse)
def attempt_exercise(exercise_id: int, payload: ConditionalAttemptCreate, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    is_correct = payload.selected_index == exercise.correct_index
    
    attempt = ConditionalAttempt(
        user_id=payload.user_id,
        exercise_id=exercise_id,
        selected_index=payload.selected_index,
        is_correct=is_correct
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    message = "¡Correcto! Has entendido la lógica." if is_correct else "Incorrecto. Intenta repasar el concepto."
    
    return ConditionalAttemptResponse(
        success=True,
        message=message,
        is_correct=is_correct,
        correct_index=exercise.correct_index,
        attempt_id=attempt.id
    )

@router.get("/historial/{user_id}")
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    attempts = db.query(ConditionalAttempt).filter(
        ConditionalAttempt.user_id == user_id
    ).order_by(ConditionalAttempt.created_at.desc()).all()
    
    total = len(attempts)
    correct = sum(1 for a in attempts if a.is_correct)
    
    return {
        "user_id": user_id,
        "total_attempts": total,
        "correct_attempts": correct,
        "incorrect_attempts": total - correct,
        "success_rate": round((correct / total * 100), 2) if total > 0 else 0,
        "recent_attempts": [
            {
                "exercise_id": a.exercise_id,
                "is_correct": a.is_correct,
                "selected_index": a.selected_index,
                "created_at": a.created_at.isoformat()
            }
            for a in attempts[:10]
        ]
    }