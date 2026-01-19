from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db import get_db
from ..models import User, Badge, UserBadge
from ..schemas import UserCreate, UserOut, BadgeCreate, BadgeOut, AssignBadge

router = APIRouter(prefix="/api/v1", tags=["gamificacion"])

# Usuarios
@router.post("/users", status_code=201, response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    
    user = User(name=payload.name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Insignias
@router.post("/badges", status_code=201, response_model=BadgeOut)
def create_badge(payload: BadgeCreate, db: Session = Depends(get_db)):
    existing = db.query(Badge).filter(Badge.code == payload.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Insignia ya existe")
    
    badge = Badge(
        code=payload.code,
        name=payload.name,
        points=payload.points
    )
    db.add(badge)
    db.commit()
    db.refresh(badge)
    return badge

# Asignar insignia
@router.post("/gamificacion/asignar-insignia")
def assign_badge(payload: AssignBadge, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    badge = db.query(Badge).filter(Badge.id == payload.badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Insignia no encontrada")
    
    existing = db.query(UserBadge).filter(
        UserBadge.user_id == payload.user_id,
        UserBadge.badge_id == payload.badge_id
    ).first()
    
    if existing:
        return {"success": True, "message": "Usuario ya tiene esta insignia"}
    
    user_badge = UserBadge(
        user_id=payload.user_id,
        badge_id=payload.badge_id
    )
    db.add(user_badge)
    db.commit()
    
    return {
        "success": True,
        "message": f"Insignia '{badge.name}' asignada a {user.name}"
    }

# Leaderboard
@router.get("/gamificacion/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.total_points.desc()).limit(10).all()
    
    leaderboard = []
    for i, user in enumerate(users, 1):
        badges_count = db.query(func.count(UserBadge.id)).filter(
            UserBadge.user_id == user.id
        ).scalar()
        
        leaderboard.append({
            "rank": i,
            "user_id": user.id,
            "name": user.name,
            "total_points": user.total_points,
            "badges_count": badges_count
        })
    
    return {"leaderboard": leaderboard}