from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from ..db import get_db
from ..models import User, Badge, UserBadge
from ..schemas import UserCreate, UserOut, BadgeCreate, BadgeOut, AssignBadgeIn, LeaderboardRow

router = APIRouter(prefix="/api/v1", tags=["gamificacion"])


@router.post("/users", status_code=201, response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    item = User(name=payload.name)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/badges", status_code=201, response_model=BadgeOut)
def create_badge(payload: BadgeCreate, db: Session = Depends(get_db)):
    item = Badge(code=payload.code, name=payload.name, points=payload.points)
    db.add(item)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Badge code ya existe")
    db.refresh(item)
    return item


@router.post("/gamificacion/asignar-insignia", status_code=201)
def assign_badge(payload: AssignBadgeIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no existe")

    badge = db.query(Badge).filter(Badge.id == payload.badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Insignia no existe")

    link = UserBadge(user_id=payload.user_id, badge_id=payload.badge_id)
    db.add(link)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Insignia ya asignada a ese usuario")

    return {"message": "ok", "user_id": payload.user_id, "badge_id": payload.badge_id}


@router.get("/gamificacion/leaderboard", response_model=list[LeaderboardRow])
def leaderboard(db: Session = Depends(get_db)):
    points_sum = func.coalesce(func.sum(Badge.points), 0).label("total_points")
    badges_count = func.coalesce(func.count(UserBadge.id), 0).label("badges_count")

    rows = (
        db.query(User.id.label("user_id"), User.name.label("name"), points_sum, badges_count)
        .outerjoin(UserBadge, UserBadge.user_id == User.id)
        .outerjoin(Badge, Badge.id == UserBadge.badge_id)
        .group_by(User.id)
        .order_by(points_sum.desc(), User.id.asc())
        .all()
    )

    return [
        LeaderboardRow(
            user_id=r.user_id,
            name=r.name,
            total_points=int(r.total_points),
            badges_count=int(r.badges_count),
        )
        for r in rows
    ]
