from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime
from .db import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    module = Column(String(50), index=True, nullable=False)
    statement = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False)
    correct_index = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(120), nullable=False)
    points = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class UserBadge(Base):
    __tablename__ = "users_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),
    )
