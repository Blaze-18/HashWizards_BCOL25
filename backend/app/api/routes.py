from fastapi import APIRouter, HTTPException
from app.models.preferences import UserPreferences
from app.services.preference_processor import PreferenceProcessor
from . import scenario_routes 
from app.llm.response_generator import ResponseGenerator  # Import the response generator
from typing import Dict, Any

router = APIRouter()
preference_processor = PreferenceProcessor()
response_generator = ResponseGenerator()  # Initialize the response generator

@router.post("/process-preferences")
async def process_preferences(preferences: UserPreferences, template_type: str = "default"):
    """
    Process user preferences and return structured data with prompt template
    """
    try:
        # Process the preferences (returns dict instead of ProcessedPreferences)
        processed_data = preference_processor.process_preferences(preferences, template_type)
        
        # Store the submission if needed
        submission_id = preference_processor.store_submission(preferences, template_type)
        
        return {
            "success": True,
            "submission_id": submission_id,
            "processed_data": processed_data,
            "message": "Preferences processed successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing preferences: {str(e)}"
        )

@router.post("/generate-prompt")
async def generate_prompt(preferences: UserPreferences, template_type: str = "default"):
    """
    Generate a prompt template based on user preferences
    """
    try:
        # Directly generate the prompt template
        processed_data = preference_processor.process_preferences(preferences, template_type)
        
        # Store the submission
        submission_id = preference_processor.store_submission(preferences, template_type)
        
        return {
            "success": True,
            "submission_id": submission_id,
            "prompt_template": processed_data["prompt_template"],
            "preferences_summary": {
                "age_group": preferences.age_group,
                "primary_condition": preferences.primary_condition,
                "primary_support": preferences.primary_support
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating prompt: {str(e)}"
        )


@router.post("/generate-response")
async def generate_response(request: Dict[str, Any]):
    """
    Generate response using sequential analysis and generation
    """
    try:
        prompt_template = request.get("prompt_template", "")
        user_input = request.get("user_input", "")
        preferences = request.get("preferences", {})
        session_id = request.get("session_id", "default")
        
        if not user_input:
            raise HTTPException(status_code=400, detail="User input is required")
        
        # Use the enhanced response generator
        response = response_generator.generate_response(
            user_input=user_input,
            preferences=preferences,
            session_id=session_id
        )
        
        return {
            "success": True,
            "response": response,
            "session_id": session_id,
            "turn_count": response_generator.conversation_state.get(session_id, {}).get("turn_count", 0)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating response: {str(e)}"
        )

@router.get("/submissions/{submission_id}")
async def get_submission(submission_id: str):
    """
    Get a specific submission by ID
    """
    try:
        submission = preference_processor.get_submission(submission_id)
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        return {
            "success": True,
            "submission": submission
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error retrieving submission: {str(e)}"
        )

@router.get("/submissions")
async def get_all_submissions():
    """
    Get all stored submissions
    """
    try:
        submissions = preference_processor.get_all_submissions()
        
        return {
            "success": True,
            "count": len(submissions),
            "submissions": submissions
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error retrieving submissions: {str(e)}"
        )

@router.get("/preferences-json")
async def get_preferences_json(preferences: UserPreferences):
    """
    Get preferences in structured JSON format
    """
    try:
        preferences_json = preference_processor.get_preferences_json(preferences)
        
        return {
            "success": True,
            "preferences": preferences_json
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating preferences JSON: {str(e)}"
        )

router.include_router(scenario_routes.router)