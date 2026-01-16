import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..db import get_db
from ..models import Cycle, CycleAttempt, User
from ..schemas import CycleCreate, CycleOut, CycleAttemptCreate, CycleAttemptResponse, HistoryResponse

router = APIRouter(prefix="/api/v1/ciclos", tags=["ciclos"])

@router.post("", status_code=201, response_model=CycleOut)
def create_cycle(payload: CycleCreate, db: Session = Depends(get_db)):
    # Convertimos los test cases a JSON string para guardar en DB
    test_cases_str = json.dumps([t.dict() for t in payload.test_cases], ensure_ascii=False)
    
    new_cycle = Cycle(
        title=payload.title,
        description=payload.description,
        difficulty=payload.difficulty,
        loop_type=payload.loop_type,
        test_cases_json=test_cases_str,
        points=payload.points
    )
    
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)
    
    return map_cycle_to_out(new_cycle)

@router.get("", response_model=list[CycleOut])
def list_cycles(db: Session = Depends(get_db)):
    cycles = (
        db.query(Cycle)
        .filter(Cycle.is_active == True)
        .order_by(Cycle.difficulty, Cycle.created_at.desc())
        .all()
    )
    return [map_cycle_to_out(c) for c in cycles]

@router.post("/{cycle_id}/intentar", response_model=CycleAttemptResponse)
def attempt_cycle(cycle_id: int, payload: CycleAttemptCreate, db: Session = Depends(get_db)):
    cycle = db.query(Cycle).filter(Cycle.id == cycle_id).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    
    # Validar lógica
    test_cases = json.loads(cycle.test_cases_json)
    is_correct = validate_test_cases(test_cases, payload.user_answer)
    
    # Guardar intento
    attempt = CycleAttempt(
        user_id=payload.user_id,
        cycle_id=cycle_id,
        user_answer_json=json.dumps(payload.user_answer, ensure_ascii=False),
        is_correct=is_correct,
        execution_time_ms=payload.execution_time_ms
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    message = "¡Correcto! Ejercicio completado" if is_correct else "Respuesta incorrecta, intenta de nuevo"
    points_earned = cycle.points if is_correct else 0
    
    return CycleAttemptResponse(
        success=True,
        message=message,
        is_correct=is_correct,
        points_earned=points_earned,
        attempt_id=attempt.id
    )

@router.get("/historial", response_model=HistoryResponse)
def get_history(user_id: int = Query(..., description="ID del usuario"), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    attempts = db.query(CycleAttempt).filter(CycleAttempt.user_id == user_id).all()
    
    # Cálculos estadísticos básicos
    total_attempts = len(attempts)
    passed_attempts = sum(1 for a in attempts if a.is_correct)
    failed_attempts = total_attempts - passed_attempts
    
    # Calcular puntos totales (sumando puntos de ciclos correctos únicos o todos los correctos dependiendo de la lógica de negocio)
    # Aquí sumaremos todos los intentos correctos cruzando con la tabla Cycle
    total_points = 0
    if passed_attempts > 0:
        total_points = (
            db.query(func.sum(Cycle.points))
            .join(CycleAttempt, Cycle.id == CycleAttempt.cycle_id)
            .filter(CycleAttempt.user_id == user_id)
            .filter(CycleAttempt.is_correct == True)
            .scalar()
        ) or 0
        
    avg_time = 0
    times = [a.execution_time_ms for a in attempts if a.execution_time_ms is not None]
    if times:
        avg_time = sum(times) / len(times)

    stats = {
        "total_attempts": total_attempts,
        "passed": passed_attempts,
        "failed": failed_attempts,
        "success_rate": round((passed_attempts / total_attempts * 100), 2) if total_attempts > 0 else 0,
        "total_points": total_points,
        "average_time_ms": round(avg_time, 2)
    }
    
    # Progreso por tipo
    progress = {
        "for": get_progress_by_type(db, user_id, "for"),
        "while": get_progress_by_type(db, user_id, "while")
    }
    
    return HistoryResponse(statistics=stats, progress_by_type=progress)

# --- Helpers ---

def map_cycle_to_out(cycle: Cycle) -> CycleOut:
    return CycleOut(
        id=cycle.id,
        title=cycle.title,
        description=cycle.description,
        difficulty=cycle.difficulty,
        loop_type=cycle.loop_type,
        test_cases=json.loads(cycle.test_cases_json),
        points=cycle.points,
        is_active=cycle.is_active,
        created_at=cycle.created_at
    )

def validate_test_cases(test_cases, user_answer):
    if "outputs" not in user_answer or not isinstance(user_answer["outputs"], list):
        return False
        
    outputs = user_answer["outputs"]
    if len(outputs) < len(test_cases):
        return False
        
    for i, case in enumerate(test_cases):
        expected = case["output"].strip()
        actual = str(outputs[i]).strip()
        if expected != actual:
            return False
            
    return True

def get_progress_by_type(db: Session, user_id: int, loop_type: str):
    # Total de ciclos disponibles de este tipo
    total_cycles = db.query(Cycle).filter(Cycle.loop_type == loop_type, Cycle.is_active == True).count()
    
    # Ciclos completados (únicos) por el usuario
    completed_cycles = (
        db.query(CycleAttempt.cycle_id)
        .join(Cycle)
        .filter(CycleAttempt.user_id == user_id)
        .filter(CycleAttempt.is_correct == True)
        .filter(Cycle.loop_type == loop_type)
        .distinct()
        .count()
    )
    
    # Total de intentos en este tipo
    total_attempts_type = (
        db.query(CycleAttempt)
        .join(Cycle)
        .filter(CycleAttempt.user_id == user_id)
        .filter(Cycle.loop_type == loop_type)
        .count()
    )
    
    correct_attempts_type = (
        db.query(CycleAttempt)
        .join(Cycle)
        .filter(CycleAttempt.user_id == user_id)
        .filter(Cycle.loop_type == loop_type)
        .filter(CycleAttempt.is_correct == True)
        .count()
    )

    return {
        "total_cycles": total_cycles,
        "completed_cycles": completed_cycles,
        "completion_rate": round((completed_cycles / total_cycles * 100), 2) if total_cycles > 0 else 0,
        "total_attempts": total_attempts_type,
        "correct_attempts": correct_attempts_type
    }