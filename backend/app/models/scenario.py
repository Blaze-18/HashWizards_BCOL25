from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from .preferences import UserPreferences  # Make sure this points to the correct path

# ---- ENUMS ----

class ScenarioType(str, Enum):
    SOCIAL_SKILLS = "social_skills"
    EMOTIONAL_REGULATION = "emotional_regulation"
    EXECUTIVE_FUNCTIONING = "executive_functioning"
    SENSORY_PROCESSING = "sensory_processing"
    COMMUNICATION = "communication"
    ACADEMIC_SUPPORT = "academic_support"
    DAILY_LIVING = "daily_living"
    SELF_ADVOCACY = "self_advocacy"


class ScenarioDifficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


# ---- MAIN SCENARIO MODEL ----

class Scenario(BaseModel):
    id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the scenario")
    description: str = Field(..., description="Brief description of the scenario")
    scenario_type: ScenarioType = Field(..., description="Type of support this scenario provides")
    primary_conditions: List[str] = Field(..., description="Primary conditions this scenario is designed for")
    difficulty: ScenarioDifficulty = Field(..., description="Difficulty level of the scenario")
    target_age_groups: List[str] = Field(..., description="Age groups this scenario is appropriate for")
    content: str = Field(..., description="The actual scenario content and questions")
    suggested_strategies: List[str] = Field(..., description="Strategies that work well for this scenario")
    sensory_considerations: List[str] = Field(default_factory=list, description="Sensory factors to be aware of")
    communication_style: List[str] = Field(..., description="Preferred communication styles for this scenario")
    attention_span: str = Field(..., description="Required attention span for this scenario")


class ScenarioDatabase(BaseModel):
    scenarios: List[Scenario] = Field(..., description="List of all available scenarios")


# ---- REQUEST MODELS ----

class ScenarioRecommendationRequest(BaseModel):
    user_prefs: UserPreferences = Field(..., description="User preferences for scenario matching")
    query: Optional[str] = Field(None, description="Optional search query for refining recommendations")
    max_results: int = Field(5, description="Maximum number of scenarios to return")


class ScenarioSearchRequest(BaseModel):
    query: str = Field(..., description="Search query for semantic search")
    user_prefs: Optional[UserPreferences] = Field(None, description="Optional user preferences for filtering")
    max_results: int = Field(5, description="Maximum number of scenarios to return")
