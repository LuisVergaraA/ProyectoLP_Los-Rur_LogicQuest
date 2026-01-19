import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Cycle, CycleAttempt, User
from ..schemas import CycleCreate, CycleOut, CycleAttemptCreate

router = APIRouter(prefix="/api/v1/ciclos", tags=["ciclos"])

@router.post("", status_code=201, response_model=CycleOut)
def create_cycle(payload: CycleCreate, db: Session = Depends(get_db)):
    item = Cycle(
        title=payload.title,
        description=payload.description,
        difficulty=payload.difficulty,
        loop_type=payload.loop_type,
        test_cases_json=json.dumps(payload.test_cases, ensure_ascii=False),
        points=payload.points,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return CycleOut(
        id=item.id,
        title=item.title,
        description=item.description,
        difficulty=item.difficulty,
        loop_type=item.loop_type,
        test_cases=json.loads(item.test_cases_json),
        points=item.points,
        created_at=item.created_at,
    )

@router.get("", response_model=list[CycleOut])
def list_cycles(db: Session = Depends(get_db)):
    items = db.query(Cycle).order_by(Cycle.id.desc()).all()
    return [
        CycleOut(
            id=item.id,
            title=item.title,
            description=item.description,
            difficulty=item.difficulty,
            loop_type=item.loop_type,
            test_cases=json.loads(item.test_cases_json),
            points=item.points,
            created_at=item.created_at,
        )
        for item in items
    ]

@router.post("/{cycle_id}/intentar")
def attempt_cycle(cycle_id: int, payload: CycleAttemptCreate, db: Session = Depends(get_db)):
    cycle = db.query(Cycle).filter(Cycle.id == cycle_id).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Reto no encontrado")
    
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    test_cases = json.loads(cycle.test_cases_json)
    user_outputs = payload.user_answer.get("outputs", [])
    
    is_correct = len(user_outputs) == len(test_cases)
    if is_correct:
        for i, tc in enumerate(test_cases):
            if i < len(user_outputs):
                if str(user_outputs[i]).strip() != str(tc.get("output", "")).strip():
                    is_correct = False
                    break
    
    points = cycle.points if is_correct else 0
    
    if is_correct:
        user.total_points += points
    
    attempt = CycleAttempt(
        user_id=payload.user_id,
        cycle_id=cycle_id,
        user_answer_json=json.dumps(payload.user_answer, ensure_ascii=False),
        is_correct=is_correct,
        points_earned=points
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    return {
        "success": True,
        "is_correct": is_correct,
        "points_earned": points,
        "message": "¡Correcto! Patrón identificado." if is_correct else "Incorrecto. Revisa la lógica del bucle.",
        "attempt_id": attempt.id
    }

@router.get("/historial")
def get_cycle_history(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    attempts = db.query(CycleAttempt).filter(
        CycleAttempt.user_id == user_id
    ).order_by(CycleAttempt.created_at.desc()).all()
    
    total = len(attempts)
    passed = sum(1 for a in attempts if a.is_correct)
    total_points = sum(a.points_earned for a in attempts)
    
    return {
        "user_id": user_id,
        "statistics": {
            "total_attempts": total,
            "passed": passed,
            "failed": total - passed,
            "success_rate": round((passed / total * 100), 2) if total > 0 else 0,
            "total_points": total_points
        },
        "recent_attempts": [
            {
                "cycle_id": a.cycle_id,
                "is_correct": a.is_correct,
                "points_earned": a.points_earned,
                "created_at": a.created_at.isoformat()
            }
            for a in attempts[:10]
        ]
    }