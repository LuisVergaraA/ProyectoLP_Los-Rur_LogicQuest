from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class ExerciseCreate(BaseModel):
    statement: str = Field(min_length=1)
    options: List[str] = Field(min_length=2)
    correct_index: int = Field(ge=0)
    is_active: bool = True


class ExerciseOut(BaseModel):
    id: int
    module: str
    statement: str
    options: List[str]
    correct_index: int
    is_active: bool
    created_at: datetime

class UserCreate(BaseModel):
    name: str = Field(min_length=1)


class UserOut(BaseModel):
    id: int
    name: str
    created_at: datetime


class BadgeCreate(BaseModel):
    code: str = Field(min_length=1)
    name: str = Field(min_length=1)
    points: int = Field(ge=0)


class BadgeOut(BaseModel):
    id: int
    code: str
    name: str
    points: int
    created_at: datetime


class AssignBadgeIn(BaseModel):
    user_id: int = Field(ge=1)
    badge_id: int = Field(ge=1)


class LeaderboardRow(BaseModel):
    user_id: int
    name: str
    total_points: int
    badges_count: int