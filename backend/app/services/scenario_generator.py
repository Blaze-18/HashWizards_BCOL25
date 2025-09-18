# app/services/scenario_generator.py
from typing import Dict, Any, List
import json
import logging
from app.models.scenario import Scenario
from app.models.preferences import UserPreferences
from app.llm.response_generator import ResponseGenerator
from app.models.scenario_content import ScenarioContent, QuestionStep, FeedbackStep

logger = logging.getLogger(__name__)


class ScenarioGenerator:
    """
    Generates interactive scenario content and feedback using your existing LLM service.
    """

    def __init__(self):
        self.llm = ResponseGenerator()  # reuse your LLM-backed generator

    def _create_scenario_prompt(self, scenario: Scenario, user_prefs: UserPreferences) -> str:
        """Create a STRICT JSON-only prompt for the LLM."""
        return f"""
SYSTEM INSTRUCTION:
You MUST respond with VALID JSON only. Do NOT include markdown, backticks, comments, or prose outside JSON.
If you cannot comply, return a minimal valid JSON with an "error" and "fallback": true.

ROLE:
You are a neurodiversity-affirming educational content generator.

GOAL:
Create interactive learning content based on this scenario and user profile.

SCENARIO:
- TITLE: {scenario.title}
- DESCRIPTION: {scenario.description}
- SCENARIO CONTENT: {scenario.content}
- TYPE: {scenario.scenario_type.value if hasattr(scenario.scenario_type, 'value') else str(scenario.scenario_type)}
- TARGET AGE GROUPS: {', '.join(scenario.target_age_groups) if scenario.target_age_groups else 'Not specified'}
- DIFFICULTY: {scenario.difficulty.value if hasattr(scenario.difficulty, 'value') else str(scenario.difficulty)}
- SUGGESTED STRATEGIES: {', '.join(scenario.suggested_strategies) if scenario.suggested_strategies else 'None specified'}

RESPONSE REQUIREMENTS:
1) Generate 3–5 interactive steps.
2) Each step is one of:
   - QUESTION: Multiple-choice question with 3–4 options and a "correct_answer"
   - FEEDBACK: Short guidance that could follow a question
3) Tailor language complexity and style based on user preferences provided in context.
4) Keep it concrete, literal-friendly if needed, and supportive.

OUTPUT FORMAT (JSON ONLY):
{{
  "steps": [
    {{
      "type": "question",
      "content": "Question text...",
      "options": ["A", "B", "C"],
      "correct_answer": "A"
    }},
    {{
      "type": "feedback",
      "content": "Two concise sentences of supportive guidance."
    }}
  ],
  "total_questions": 3,
  "estimated_duration": "5-7 minutes"
}}
"""

    def _create_feedback_prompt(self, user_answer: str, question: QuestionStep, scenario: Scenario, user_prefs: UserPreferences) -> str:
        """Create a feedback prompt that works well with the simple feedback method."""
        is_correct = user_answer.strip().lower() == question.correct_answer.strip().lower()
        
        return f"""
Generate supportive feedback for this learning scenario response:

SCENARIO: {scenario.title}
QUESTION: {question.content}
CORRECT ANSWER: {question.correct_answer}
USER ANSWER: {user_answer}
RESULT: {"Correct" if is_correct else "Incorrect"}

REQUIREMENTS:
1) Acknowledge the user's effort positively
2) If correct: reinforce why this approach works well
3) If incorrect: gently explain the better approach without being critical
4) Keep it brief (2-3 sentences) and encouraging
5) Use practical, concrete language
6) Focus on learning rather than being "right" or "wrong"

Provide only the feedback text, no additional formatting.
"""

    def generate_scenario_content(self, scenario: Scenario, user_prefs: UserPreferences) -> ScenarioContent:
        """
        Generate interactive content for a scenario using the specialized structured content method.
        """
        prompt = self._create_scenario_prompt(scenario, user_prefs)

        try:
            # Use the new structured content method instead of regular generate_response
            raw = self.llm.generate_structured_content(
                user_input=prompt,
                preferences=user_prefs.model_dump(),
                session_id=f"scenario-{scenario.id}"
            )

            # Extract JSON from the response
            json_str = self._extract_json(raw)
            data = json.loads(json_str)

            # Validate the structure
            if "steps" not in data:
                raise ValueError("Missing 'steps' in LLM response")

            # Validate and convert steps
            validated_steps = self._validate_and_convert_steps(data["steps"])
            
            if not validated_steps:
                raise ValueError("No valid steps generated")

            # Count actual questions
            question_count = sum(1 for step in validated_steps if isinstance(step, QuestionStep))

            # Create the scenario content with validated steps
            return ScenarioContent(
                steps=validated_steps,
                total_questions=question_count,
                estimated_duration=data.get("estimated_duration", "5-7 minutes"),
                fallback=data.get("fallback", False),
                error=data.get("error")
            )

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            fb = self._fallback_content(scenario)
            fb.error = f"JSON parsing error: {str(e)}"
            return fb
        except Exception as e:
            logger.error(f"Generation error: {e}")
            fb = self._fallback_content(scenario)
            fb.error = f"Generation error: {str(e)}"
            return fb

    def generate_feedback(
        self,
        user_answer: str,
        question: QuestionStep,
        scenario: Scenario,
        user_prefs: UserPreferences
    ) -> Dict[str, Any]:
        """
        Generate supportive feedback using the specialized feedback method.
        """
        if not user_answer or not question.correct_answer:
            return {
                "feedback": "Thank you for your response! Let's explore this together.",
                "is_correct": False,
                "fallback": True
            }

        is_correct = user_answer.strip().lower() == question.correct_answer.strip().lower()
        prompt = self._create_feedback_prompt(user_answer, question, scenario, user_prefs)

        try:
            # Use the specialized simple feedback method
            feedback = self.llm.generate_simple_feedback(
                user_input=prompt,
                preferences=user_prefs.model_dump(),
                session_id=f"feedback-{scenario.id}"
            )
            
            # Clean up any accidental formatting
            feedback = feedback.replace("```", "").replace("**", "").replace("*", "").strip()
            
            return {"feedback": feedback, "is_correct": is_correct}

        except Exception as e:
            logger.error(f"Feedback generation error: {e}")
            return {
                "feedback": "Thank you for your response! Great effort—would you like to review the reasoning together?",
                "is_correct": is_correct,
                "fallback": True,
                "error": str(e)
            }

    # ... (include all the helper methods from the previous version)
    def _extract_json(self, raw: str) -> str:
        """Extract JSON from raw LLM response."""
        if not raw or not isinstance(raw, str):
            return json.dumps({
                "steps": [],
                "total_questions": 0,
                "estimated_duration": "0 minutes",
                "fallback": True,
                "error": "Empty or invalid LLM response."
            })

        s = raw.strip()
        
        if s.startswith("{") and s.endswith("}"):
            return s

        start = s.find("{")
        end = s.rfind("}")
        if start != -1 and end != -1 and end > start:
            return s[start : end + 1]

        return json.dumps({
            "steps": [],
            "total_questions": 0,
            "estimated_duration": "0 minutes",
            "fallback": True,
            "error": "No valid JSON found in LLM output."
        })

    def _validate_and_convert_steps(self, steps_data: List[Dict[str, Any]]) -> List[Any]:
        """Validate and convert raw step data into proper step objects."""
        validated_steps = []
        
        for step_data in steps_data:
            try:
                if step_data.get("type") == "question":
                    if not all(key in step_data for key in ["content", "options", "correct_answer"]):
                        logger.warning(f"Invalid question step data: {step_data}")
                        continue
                    step = QuestionStep(**step_data)
                elif step_data.get("type") == "feedback":
                    if "content" not in step_data:
                        logger.warning(f"Invalid feedback step data: {step_data}")
                        continue
                    step = FeedbackStep(**step_data)
                else:
                    logger.warning(f"Unknown step type: {step_data.get('type')}")
                    continue
                
                validated_steps.append(step)
            except Exception as e:
                logger.error(f"Error validating step {step_data}: {e}")
                continue
        
        return validated_steps

    def _fallback_content(self, scenario: Scenario) -> ScenarioContent:
        """Static fallback if LLM fails."""
        return ScenarioContent(
            steps=[
                QuestionStep(
                    type="question",
                    content=f"How would you approach this situation: {scenario.content[:100]}..." if len(scenario.content) > 100 else scenario.content,
                    options=[
                        "Ask for clarification",
                        "Observe others' reactions",
                        "Use a coping strategy",
                        "I'm not sure"
                    ],
                    correct_answer="Ask for clarification"
                ),
                FeedbackStep(
                    type="feedback",
                    content="Good start—asking for clarity helps you understand the situation better and respond appropriately."
                ),
            ],
            total_questions=1,
            estimated_duration="3-5 minutes",
            fallback=True
        )