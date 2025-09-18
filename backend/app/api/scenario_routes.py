from fastapi import APIRouter, HTTPException
from typing import List, Optional
import traceback
from typing import Any, Dict
from app.services.scenario_generator import ScenarioGenerator
from app.models.scenario_content import (
    ScenarioContent, 
    GenerateContentRequest, 
    GenerateFeedbackRequest,
    QuestionStep
)

from ..services.scenario_service import ScenarioService
from ..models.preferences import UserPreferences
from ..models.scenario import Scenario, ScenarioRecommendationRequest, ScenarioSearchRequest

router = APIRouter(tags=["scenarios"])

# ------------------- Initialize Services ------------------- #
scenario_service = ScenarioService()
scenario_generator = ScenarioGenerator()

# ------------------- Recommendation Endpoint ------------------- #
@router.post("/recommend", response_model=List[Scenario])
async def recommend_scenarios(request: ScenarioRecommendationRequest):
    """
    Get personalized scenario recommendations based on user preferences.

    - **user_prefs**: User preferences object
    - **query**: Optional search query
    - **max_results**: Maximum number of scenarios to return
    """
    try:
        # Call service to find scenarios
        scenarios = scenario_service.find_matching_scenarios(
            user_prefs=request.user_prefs,
            query=request.query,
            max_results=request.max_results
        )

        if not scenarios:
            # Explicit 404 if nothing found
            raise HTTPException(
                status_code=404,
                detail="No matching scenarios found. Try adjusting your preferences or search query."
            )

        return scenarios

    except Exception as e:
        # Full logging for debugging
        print("[ERROR] recommend_scenarios failed:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ------------------- Search Endpoint ------------------- #
@router.post("/search", response_model=List[Scenario])
async def search_scenarios(request: ScenarioSearchRequest):
    """
    Search scenarios using semantic search with optional preference filtering.

    - **query**: Search string
    - **user_prefs**: Optional user preferences
    - **max_results**: Maximum results to return
    """
    try:
        if not request.query:
            raise HTTPException(
                status_code=400,
                detail="Search query cannot be empty."
            )

        # Use service with or without preferences
        scenarios = scenario_service.find_matching_scenarios(
            user_prefs=request.user_prefs if request.user_prefs else None,
            query=request.query,
            max_results=request.max_results
        )

        if not scenarios:
            raise HTTPException(
                status_code=404,
                detail="No scenarios found matching your search criteria."
            )

        return scenarios

    except Exception as e:
        print("[ERROR] search_scenarios failed:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ------------------- Get Scenario By ID ------------------- #
@router.get("/{scenario_id}", response_model=Scenario)
async def get_scenario_by_id(scenario_id: str):
    """
    Get a specific scenario by its ID.

    - **scenario_id**: Unique identifier
    """
    try:
        scenario = scenario_service.get_scenario_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=404,
                detail=f"Scenario with ID '{scenario_id}' not found."
            )
        return scenario
    except Exception as e:
        print(f"[ERROR] get_scenario_by_id failed for {scenario_id}:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ------------------- Get All Scenarios ------------------- #
@router.get("/", response_model=List[Scenario])
async def get_all_scenarios():
    """
    Get all available scenarios (for testing or admin purposes)
    """
    try:
        scenarios = scenario_service.get_all_scenarios()
        if not scenarios:
            raise HTTPException(
                status_code=404,
                detail="No scenarios available in the database."
            )
        return scenarios
    except Exception as e:
        print("[ERROR] get_all_scenarios failed:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

# ================= SCENARIO-BASED LEARNING ENDPOINTS ================= #

# ------------------- Generate Interactive Content ------------------- #
@router.post("/{scenario_id}/generate-content", response_model=Dict[str, Any])
async def generate_scenario_content(
    scenario_id: str,
    request: GenerateContentRequest
):
    """
    Generate interactive content for a specific scenario based on user preferences.
    
    Returns a structured learning experience with questions and feedback steps.
    
    - **scenario_id**: ID of the scenario to generate content for
    - **user_prefs**: User preferences for personalization
    """
    try:
        # Get scenario from service
        scenario = scenario_service.get_scenario_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=404, 
                detail=f"Scenario with ID '{scenario_id}' not found"
            )
        
        # Generate content using the scenario generator
        content = scenario_generator.generate_scenario_content(scenario, request.user_prefs)
        
        return {
            "success": True,
            "scenario_id": scenario_id,
            "scenario_title": scenario.title,
            "content": content.dict(),
            "metadata": {
                "total_questions": content.total_questions,
                "estimated_duration": content.estimated_duration,
                "is_fallback": content.fallback,
                "generation_error": content.error
            }
        }
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except Exception as e:
        print(f"[ERROR] generate_scenario_content failed for {scenario_id}:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating content: {str(e)}"
        )

# app/api/scenario_routes.py - Key fixes only

# ------------------- Generate Interactive Content ------------------- #
@router.post("/{scenario_id}/generate-content", response_model=Dict[str, Any])
async def generate_scenario_content(
    scenario_id: str,
    request: GenerateContentRequest
):
    """Generate interactive content for a specific scenario based on user preferences."""
    try:
        scenario = scenario_service.get_scenario_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=404, 
                detail=f"Scenario with ID '{scenario_id}' not found"
            )
        
        # Remove await - ScenarioGenerator methods are synchronous
        content = scenario_generator.generate_scenario_content(scenario, request.user_prefs)
        
        return {
            "success": True,
            "scenario_id": scenario_id,
            "scenario_title": scenario.title,
            "content": content.dict(),
            "metadata": {
                "total_questions": content.total_questions,
                "estimated_duration": content.estimated_duration,
                "is_fallback": content.fallback,
                "generation_error": content.error
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] generate_scenario_content failed for {scenario_id}:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating content: {str(e)}"
        )

# ------------------- Generate Feedback for User Response ------------------- #
@router.post("/{scenario_id}/generate-feedback", response_model=Dict[str, Any])
async def generate_scenario_feedback(
    scenario_id: str,
    request: GenerateFeedbackRequest
):
    """Generate personalized feedback for a user's response to a scenario question."""
    try:
        scenario = scenario_service.get_scenario_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=404, 
                detail=f"Scenario with ID '{scenario_id}' not found"
            )
        
        if not request.user_answer.strip():
            raise HTTPException(
                status_code=400,
                detail="User answer cannot be empty"
            )
        
        # Remove await - ScenarioGenerator methods are synchronous
        feedback_result = scenario_generator.generate_feedback(
            user_answer=request.user_answer,
            question=request.question,
            scenario=scenario,
            user_prefs=request.user_prefs
        )
        
        return {
            "success": True,
            "scenario_id": scenario_id,
            "user_answer": request.user_answer,
            "correct_answer": request.question.correct_answer,
            "is_correct": feedback_result.get("is_correct", False),
            "feedback": feedback_result.get("feedback", ""),
            "metadata": {
                "is_fallback": feedback_result.get("fallback", False),
                "generation_error": feedback_result.get("error")
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] generate_scenario_feedback failed for {scenario_id}:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error generating feedback: {str(e)}"
        )

# ------------------- Start Learning Session ------------------- #
@router.post("/{scenario_id}/start-session", response_model=Dict[str, Any])
async def start_learning_session(
    scenario_id: str,
    request: GenerateContentRequest
):
    """Start a complete learning session for a scenario."""
    try:
        scenario = scenario_service.get_scenario_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=404,
                detail=f"Scenario with ID '{scenario_id}' not found"
            )
        
        # Remove await - ScenarioGenerator methods are synchronous
        content = scenario_generator.generate_scenario_content(scenario, request.user_prefs)
        
        return {
            "success": True,
            "session": {
                "scenario": {
                    "id": scenario.id,
                    "title": scenario.title,
                    "description": scenario.description,
                    "difficulty": scenario.difficulty,
                    "scenario_type": scenario.scenario_type,
                    "target_age_groups": scenario.target_age_groups
                },
                "content": content.dict(),
                "user_preferences": request.user_prefs.dict(),
                "session_metadata": {
                    "total_questions": content.total_questions,
                    "estimated_duration": content.estimated_duration,
                    "current_step": 0,
                    "is_fallback": content.fallback,
                    "generation_error": content.error
                }
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] start_learning_session failed for {scenario_id}:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error starting learning session: {str(e)}"
        )

# ------------------- Validate Answer ------------------- #
@router.post("/{scenario_id}/validate-answer", response_model=Dict[str, Any])
async def validate_answer(
    scenario_id: str,
    request: Dict[str, Any]
):
    """
    Quick validation of an answer without generating full feedback.
    Useful for immediate UI feedback.
    
    Expected request format:
    {
        "user_answer": "selected option",
        "correct_answer": "correct option"
    }
    """
    try:
        user_answer = request.get("user_answer", "").strip()
        correct_answer = request.get("correct_answer", "").strip()
        
        if not user_answer or not correct_answer:
            raise HTTPException(
                status_code=400,
                detail="Both user_answer and correct_answer are required"
            )
        
        is_correct = user_answer.lower() == correct_answer.lower()
        
        return {
            "success": True,
            "scenario_id": scenario_id,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "is_correct": is_correct,
            "message": "Correct!" if is_correct else "Let's explore this together."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] validate_answer failed for {scenario_id}:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Error validating answer: {str(e)}"
        )


# ------------------- Get Learning Progress ------------------- #
@router.get("/{scenario_id}/progress/{session_id}", response_model=Dict[str, Any])
async def get_learning_progress(scenario_id: str, session_id: str):
    """
    Get progress information for a learning session.
    This could be enhanced to store progress in a database.
    
    For now, returns basic scenario information.
    """
    try:
        scenario = scenario_service.get_scenario_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=404,
                detail=f"Scenario with ID '{scenario_id}' not found"
            )
        
        # This is a placeholder - you could enhance this to track real progress
        return {
            "success": True,
            "scenario_id": scenario_id,
            "session_id": session_id,
            "scenario_title": scenario.title,
            "progress": {
                "completed_steps": 0,  # Could track this in database/session
                "total_steps": 5,      # Could be dynamic based on generated content
                "completion_percentage": 0,
                "current_step_type": "question",
                "estimated_time_remaining": "5-7 minutes"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] get_learning_progress failed for {scenario_id}:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving progress: {str(e)}"
        )