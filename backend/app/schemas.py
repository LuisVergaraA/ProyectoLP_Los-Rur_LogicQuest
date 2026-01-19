from pydantic import BaseModel, Field
from typing import List, Dict, Any
from datetime import datetime

# Ejercicios (Condicionales)
class ExerciseCreate(BaseModel):
    statement: str
    options: List[str]
    correct_index: int
    is_active: bool = True

class ExerciseOut(BaseModel):
    id: int
    module: str
    statement: str
    options: List[str]
    correct_index: int
    is_active: bool
    created_at: datetime

class ConditionalAttemptCreate(BaseModel):
    user_id: int = Field(ge=1)
    selected_index: int = Field(ge=0)

class ConditionalAttemptResponse(BaseModel):
    success: bool
    message: str
    is_correct: bool
    correct_index: int
    attempt_id: int

# Usuarios
class UserCreate(BaseModel):
    name: str

class UserOut(BaseModel):
    id: int
    name: str
    total_points: int
    created_at: datetime

# Insignias
class BadgeCreate(BaseModel):
    code: str
    name: str
    points: int = 0

class BadgeOut(BaseModel):
    id: int
    code: str
    name: str
    points: int
    created_at: datetime

class AssignBadge(BaseModel):
    user_id: int
    badge_id: int

# Ciclos
class CycleCreate(BaseModel):
    title: str
    description: str
    difficulty: str = "facil"
    loop_type: str
    test_cases: List[Dict[str, str]]
    points: int = 10

class CycleOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    loop_type: str
    test_cases: List[Dict[str, str]]
    points: int
    created_at: datetime

class CycleAttemptCreate(BaseModel):
    user_id: int
    user_answer: Dict[str, Any]