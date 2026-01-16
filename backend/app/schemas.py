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


# --- Schemas para Ciclos ---

class CycleTestCase(BaseModel):
    input: str
    output: str

class CycleCreate(BaseModel):
    title: str = Field(min_length=1)
    description: str
    difficulty: str # facil, medio, dificil
    loop_type: str # for, while
    test_cases: List[CycleTestCase]
    points: int = 10

class CycleOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    loop_type: str
    test_cases: List[CycleTestCase]
    points: int
    is_active: bool
    created_at: datetime

# Schema para intentar un ejercicio
class CycleAttemptCreate(BaseModel):
    user_id: int
    user_answer: dict # Esperamos algo como {"outputs": ["..."]}
    execution_time_ms: int = 0

class CycleAttemptResponse(BaseModel):
    success: bool
    message: str
    is_correct: bool
    points_earned: int
    attempt_id: int

# Schemas para el Historial (Complejo)
class StatsBase(BaseModel):
    total_attempts: int
    passed: int
    failed: int
    success_rate: float
    total_points: int
    average_time_ms: float

class ProgressByType(BaseModel):
    total_cycles: int
    completed_cycles: int
    completion_rate: float
    total_attempts: int
    correct_attempts: int

class HistoryResponse(BaseModel):
    statistics: StatsBase
    progress_by_type: dict[str, ProgressByType] # keys: 'for', 'while'
    # recent_attempts se podría agregar si definimos un schema para ello