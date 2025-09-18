# app/llm/response_generator.py
import json
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.schema.runnable import RunnableMap
from app.core.config import settings
from app.models.preferences import UserPreferences
from app.services.preference_processor import PreferenceProcessor
from typing import Dict, Any
import re


class ResponseGenerator:
    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME,
            temperature=0.7,
            max_tokens=1000
        )
        self.preference_processor = PreferenceProcessor()
        self.conversation_state = {}
    
    def _get_conversation_state(self, session_id: str) -> dict:
        """Get conversation state from persistent storage"""
        try:
            state_json = self.redis_client.get(f"session:{session_id}")
            if state_json:
                return json.loads(state_json)
        except:
            pass
        
        # Return default state if not found or error
        return {
            "turn_count": 0,
            "history": [],
            "engagement_level": "low",
            "user_name": None  # Store user name to avoid "Hi Anan" every time
        }
    
    def _save_conversation_state(self, session_id: str, state: dict):
        """Save conversation state to persistent storage"""
        try:
            self.redis_client.setex(
                f"session:{session_id}",
                3600 * 24 * 7,  # Expire after 7 days
                json.dumps(state)
            )
        except Exception as e:
            print(f"Error saving session state: {e}")

    def create_conversation_analysis_chain(self):
        """Chain to analyze conversation context and intent using new Runnable syntax"""
        prompt = PromptTemplate(
            input_variables=["user_input", "turn_count", "history"],
            template="""
                Analyze the user's message and conversation context:

                User Input: {user_input}
                Turn Number: {turn_count}
                Recent History: {history}

                Determine:
                1. Emotional tone (neutral, anxious, curious, distressed)
                2. Information need (simple answer, detailed explanation, emotional support)
                3. Conversation stage (initial, exploring, deep discussion)
                4. Preferred response depth (brief, balanced, detailed)

                Respond in JSON format:
                {{
                "emotional_tone": "string",
                "information_need": "string",
                "conversation_stage": "string",
                "preferred_depth": "string",
                "requires_immediate_detail": boolean,
                "safety_concern": boolean
                }}
            """
        )

        # Using RunnableSequence
        return prompt | self.llm

    def create_response_generation_chain(self):
        """Chain to generate the actual response using new syntax"""
        prompt = PromptTemplate(
            input_variables=["analysis", "preferences", "base_prompt", "user_input"],
            template="""
                Based on the analysis and user preferences, generate a therapeutic response:

                ANALYSIS:
                {analysis}

                USER PREFERENCES:
                {preferences}

                BASE PROTOCOL:
                {base_prompt}

                USER'S MESSAGE:
                {user_input}

                GUIDELINES:
                - If initial turn: brief introduction, open-ended question
                - If early turn: concise response, offer expansion
                - If detailed requested: comprehensive explanation
                - Always: maintain preferred communication style
                - Progress naturally: don't overwhelm, don't underwhelm
                - Use emojis to make conversation interesting.
                Response:
            """
        )

        return prompt | self.llm

    def create_structured_content_chain(self):
        """Chain specifically for generating structured content (JSON, scenarios, etc.)"""
        prompt = PromptTemplate(
            input_variables=["user_input", "preferences_context"],
            template="""
                {user_input}

                USER CONTEXT FOR PERSONALIZATION:
                {preferences_context}

                Remember: You must follow the exact format requirements specified in the user input above.
                Adapt the content style and complexity based on the user context, but maintain the required structure.
            """
        )
        
        return prompt | self.llm

    def generate_response(self, user_input: str, preferences: dict, session_id: str = "default") -> str:
        """Generate response using modern LangChain Runnable syntax"""
        try:
            # ✅ Convert dict to UserPreferences model
            from app.models.preferences import UserPreferences
            user_prefs = UserPreferences(**preferences)
            
            # Get or create conversation state
            if session_id not in self.conversation_state:
                self.conversation_state[session_id] = {
                    "turn_count": 0,
                    "history": [],
                    "engagement_level": "low"
                }

            state = self.conversation_state[session_id]
            turn_count = state["turn_count"]

            # ✅ Step 1: Analyze conversation context
            analysis_chain = self.create_conversation_analysis_chain()
            analysis_result = analysis_chain.invoke({
                "user_input": user_input,
                "turn_count": turn_count,
                "history": str(state["history"][-3:])
            })

            # Extract text from analysis
            analysis_text = analysis_result.content if hasattr(analysis_result, "content") else str(analysis_result)

            # ✅ Step 2: Build base prompt using user preferences (now using user_prefs)
            conversation_context = {
                "turn_count": turn_count,
                "user_engagement_level": state["engagement_level"],
                "prefers_detail": '"requires_immediate_detail": true' in analysis_text.lower()
            }

            base_prompt = self.preference_processor._therapeutic_template(user_prefs, conversation_context)

            # ✅ Step 3: Generate final response
            response_chain = self.create_response_generation_chain()
            response_result = response_chain.invoke({
                "analysis": analysis_text,
                "preferences": str(preferences),  # Keep as dict for the chain
                "base_prompt": base_prompt,
                "user_input": user_input
            })

            response_text = response_result.content if hasattr(response_result, "content") else str(response_result)

            # ✅ Update conversation state
            state["turn_count"] += 1
            state["history"].append({"user": user_input, "assistant": response_text})

            # ✅ Update engagement level
            if len(response_text.split()) > 50 or "explain" in user_input.lower():
                state["engagement_level"] = "high"
            elif len(response_text.split()) > 25:
                state["engagement_level"] = "medium"

            return response_text

        except Exception as e:
            return f"Error generating response: {str(e)}"

    def generate_structured_content(self, user_input: str, preferences: dict, session_id: str = "default") -> str:
        """
        Generate structured content (like JSON scenarios) without conversation analysis overhead.
        This method is optimized for scenario generation and other structured tasks.
        """
        try:
            # Convert dict to UserPreferences model
            user_prefs = UserPreferences(**preferences)
            
            # Create simplified context for personalization
            preferences_context = f"""
            Communication Style: {user_prefs.communication_style}
            Learning Style: {user_prefs.learning_style}
            Age Group: {user_prefs.age_group}
            Attention Span: {user_prefs.attention_span}
            Primary Support Need: {user_prefs.primary_support}
            Primary Condition: {user_prefs.primary_condition}
            """
            
            # Use the structured content chain
            content_chain = self.create_structured_content_chain()
            result = content_chain.invoke({
                "user_input": user_input,
                "preferences_context": preferences_context
            })
            
            # Extract text from result
            response_text = result.content if hasattr(result, "content") else str(result)
            
            return response_text

        except Exception as e:
            return f"Error generating structured content: {str(e)}"

    def generate_simple_feedback(self, user_input: str, preferences: dict, session_id: str = "default") -> str:
        """
        Generate simple feedback without full conversation analysis.
        Optimized for quick feedback responses in learning scenarios.
        """
        try:
            user_prefs = UserPreferences(**preferences)
            
            # Create a simple feedback-focused prompt
            feedback_prompt = PromptTemplate(
                input_variables=["user_input", "communication_style", "age_group"],
                template="""
                Generate supportive, educational feedback based on this request:
                
                {user_input}
                
                Style Guidelines:
                - Communication Style: {communication_style}
                - Age Group: {age_group}
                - Keep it encouraging and constructive
                - Be direct if communication style is "direct", gentle if "supportive"
                - Avoid overwhelming language
                
                Feedback:
                """
            )
            
            feedback_chain = feedback_prompt | self.llm
            result = feedback_chain.invoke({
                "user_input": user_input,
                "communication_style": user_prefs.communication_style,
                "age_group": user_prefs.age_group
            })
            
            response_text = result.content if hasattr(result, "content") else str(result)
            return response_text.strip()

        except Exception as e:
            return f"Error generating feedback: {str(e)}"