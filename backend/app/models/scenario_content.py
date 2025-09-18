# app/models/scenario_content.py
from typing import List, Optional, Union, Literal
from pydantic import BaseModel, Field
from app.models.preferences import UserPreferences


class QuestionStep(BaseModel):
    type: Literal["question"] = "question"
    content: str
    options: List[str]
    correct_answer: str


class FeedbackStep(BaseModel):
    type: Literal["feedback"] = "feedback"
    content: str


Step = Union[QuestionStep, FeedbackStep]


class ScenarioContent(BaseModel):
    steps: List[Step]
    total_questions: int
    estimated_duration: str
    fallback: Optional[bool] = False
    error: Optional[str] = None


class GenerateContentRequest(BaseModel):
    user_prefs: UserPreferences


class GenerateFeedbackRequest(BaseModel):
    user_prefs: UserPreferences
    user_answer: str
    # You can accept a full QuestionStep for strict typing,
    # or Dict[str, Any] if you want to be more permissive.
    question: QuestionStep