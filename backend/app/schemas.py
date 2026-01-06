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
