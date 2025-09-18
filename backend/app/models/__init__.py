from pydantic import BaseModel, Field
from typing import List, Optional

class UserPreferences(BaseModel):
    age_group: str = Field(..., description="Age group of the user")
    condition: str = Field(..., description="Primary condition of the user")
    communication_style: str = Field(..., description="Preferred communication style")
    learning_style: str = Field(..., description="Preferred learning style")
    support_areas: List[str] = Field(..., description="Areas where support is needed")
    interaction_pace: str = Field(..., description="Preferred interaction pace")
    encouragement_style: str = Field(..., description="Preferred encouragement style")
    time_preference: str = Field(..., description="Preferred time for interaction")
    language_preference: str = Field("English", description="Preferred language")
    difficulty_level: str = Field("Medium", description="Preferred difficulty level")
    tone_preference: List[str] = Field(["Friendly", "Reassuring"], description="Preferred tone")
    response_length: str = Field("Medium", description="Preferred response length")
    emoji_usage: bool = Field(True, description="Whether to use emojis")
    additional_notes: Optional[str] = Field(None, description="Additional user notes")

class ProcessedPreferences(BaseModel):
    preferences: UserPreferences
    prompt_template: str
    model_ready: bool