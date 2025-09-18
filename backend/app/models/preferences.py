from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal, Union
from typing_extensions import Annotated

class UserPreferences(BaseModel):
    # Core Identity
    age_group: str = Field(..., description="Age group: 6-8, 9-11, 12-14, 15-17, 18-21, 22+")
    primary_condition: str = Field(..., description="Primary neurodiverse condition")
    
    # Communication & Learning
    communication_style: Literal["direct", "gentle", "visual", "structured"] = Field(..., description="Preferred communication approach")
    literal_understanding: bool = Field(..., description="Prefers literal language without metaphors")
    learning_style: Literal["visual", "auditory", "kinesthetic", "multisensory"] = Field(..., description="Preferred learning modality")
    attention_span: Literal["short", "medium", "long", "variable"] = Field(..., description="Typical attention span duration")
    
    # Primary Support Area
    primary_support: Literal[
        "social_skills", "emotional_regulation", "executive_functioning",
        "sensory_processing", "communication", "academic_support",
        "daily_living", "self_advocacy"
    ] = Field(..., description="Primary area needing support")
    
    # Interaction Preferences
    interaction_pace: Literal["slow", "patient", "normal", "brisk"] = Field(..., description="Preferred interaction speed")
    encouragement_style: Literal["gentle", "enthusiastic", "quiet", "visual"] = Field(..., description="Preferred encouragement approach")
    correction_style: Literal["direct", "gentle", "indirect", "no_correction"] = Field(..., description="Preferred correction method")
    
    # Response Formatting
    response_length: Literal["brief", "detailed", "balanced"] = Field(..., description="Preferred response length")
    
    # Optional fields with default empty lists instead of None
    sensory_sensitivities: List[Literal["auditory", "visual", "tactile", "olfactory", "gustatory"]] = Field(
        default_factory=list, description="Sensory sensitivities to avoid"
    )
    
    sensory_seeking: List[Literal["movement", "pressure", "visual_stimulation", "rhythmic"]] = Field(
        default_factory=list, description="Sensory seeking behaviors"
    )
    
    executive_challenges: List[Literal["planning", "organization", "task_initiation", "time_management"]] = Field(
        default_factory=list, description="Executive function challenges"
    )
    
    effective_strategies: List[Literal[
        "visual_supports", "breaks", "clear_expectations", "choices",
        "first_then", "timers", "social_stories", "positive_reinforcement"
    ]] = Field(default_factory=list, description="Strategies that work well")
    
    regulation_tools: List[Literal["deep_breathing", "movement_breaks", "sensory_tools", "quiet_space"]] = Field(
        default_factory=list, description="Effective regulation strategies"
    )
    
    # Additional context
    additional_notes: Optional[str] = Field(None, description="Any other important information")
    
    # Make the model more permissive
    class Config:
        extra = 'ignore'  # Ignore extra fields instead of rejecting
        arbitrary_types_allowed = True