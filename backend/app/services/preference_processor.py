# app/services/preference_processor.py
from typing import Dict, Any, List
from app.models.preferences import UserPreferences

class PreferenceProcessor:
    def __init__(self):
        self.prompt_templates = {
            "therapeutic": self._therapeutic_template,
            "crisis": self._crisis_template,
            "detailed": self._detailed_template,
            "brief": self._brief_template
        }

    def _crisis_template(self, prefs: UserPreferences, conversation_context: Dict[str, Any] = None) -> str:
        """Crisis support template"""
        context = conversation_context or {}
        return f"""
            # CRISIS SUPPORT AI ROLE

            ## USER PROFILE:
            - Age: {prefs.age_group}
            - Primary Condition: {prefs.primary_condition}
            - Communication Style: {prefs.communication_style}
            - Learning Style: {prefs.learning_style}
            - Attention Span: {prefs.attention_span}
            - Primary Support Need: {prefs.primary_support}

            ## CRISIS RESPONSE PROTOCOL:
            - Remain calm and supportive
            - Prioritize user safety and emotional stability
            - Offer immediate coping strategies
            - Encourage reaching out to trusted individuals or professionals
            - Use {prefs.communication_style} style
        """

    def _detailed_template(self, prefs: UserPreferences, conversation_context: Dict[str, Any] = None) -> str:
        """Detailed information template"""
        context = conversation_context or {}
        return f"""
            # DETAILED INFORMATION AI ROLE

            ## USER PROFILE:
            - Age: {prefs.age_group}
            - Primary Condition: {prefs.primary_condition}
            - Communication Style: {prefs.communication_style}
            - Learning Style: {prefs.learning_style}
            - Attention Span: {prefs.attention_span}
            - Primary Support Need: {prefs.primary_support}

            ## RESPONSE STRATEGY:
            - Provide comprehensive, structured explanations
            - Use clear, organized formatting
            - Offer additional resources if appropriate
            - Use {prefs.communication_style} style
        """

    def _brief_template(self, prefs: UserPreferences, conversation_context: Dict[str, Any] = None) -> str:
        """Brief response template"""
        context = conversation_context or {}
        return f"""
            # BRIEF RESPONSE AI ROLE

            ## USER PROFILE:
            - Age: {prefs.age_group}
            - Primary Condition: {prefs.primary_condition}
            - Communication Style: {prefs.communication_style}
            - Learning Style: {prefs.learning_style}
            - Attention Span: {prefs.attention_span}
            - Primary Support Need: {prefs.primary_support}

            ## RESPONSE STRATEGY:
            - Keep responses concise (1-2 sentences)
            - Focus on clarity and simplicity
            - Use {prefs.communication_style} style
        """
    
    def _therapeutic_template(self, prefs: UserPreferences, conversation_context: Dict[str, Any] = None) -> str:
        """Smart therapeutic template that adapts to conversation stage with session awareness"""
        context = conversation_context or {}
        turn_count = context.get('turn_count', 0)
        user_engagement = context.get('user_engagement_level', 'low')
        prefers_detail = context.get('prefers_detail', False)
        user_name = context.get('user_name')  # Get stored user name
        is_first_turn = context.get('is_first_turn', turn_count == 0)
        
        template = f"""
            # THERAPEUTIC AI ROLE: NEURODIVERSE SUPPORT SPECIALIST

            ## USER PROFILE:
            - Age: {prefs.age_group}
            - Primary Condition: {prefs.primary_condition}
            - Communication Style: {prefs.communication_style}
            - Learning Style: {prefs.learning_style}
            - Attention Span: {prefs.attention_span}
            - Primary Support Need: {prefs.primary_support}

            ## SESSION CONTEXT:
            - Turn: {turn_count} ({'Initial' if is_first_turn else 'Ongoing'})
            - Engagement Level: {user_engagement}
            - Detail Preference: {'Detailed responses' if prefers_detail else 'Brief responses'}
            - User Name: {user_name or 'Not yet known'}

            ## CRITICAL BEHAVIOR RULES:
            1. **GREETING POLICY**:
            - {"First turn: Brief, warm introduction focusing on their condition and support needs" if is_first_turn else "Continue conversation naturally - NO repetitive greetings"}
            - {"Use their name naturally if known: 'Hi [Name]! I'm here...'" if user_name and is_first_turn else "Use generic friendly greeting if name unknown"}
            - {"NEVER start with 'Hi [Name]' after first turn - it's annoying and repetitive" if not is_first_turn else ""}
            - As the conversation continues, don't use name if it feels forced or unnatural.

            2. **CONVERSATION FLOW**:
            - First Turn: Establish rapport, explain your role, ask open-ended question
            - Early Turns: Build on previous messages, continue naturally
            - Engaged Turns: Provide depth when requested or you think it's needed
            - Always: Maintain conversation continuity

            3. **PERSONALIZATION**:
            - Use their name naturally in conversation if known: "That's a great question, [Name]!"
            - Reference previous topics if available
            - Continue rather than restart conversations

            ## RESPONSE STRATEGY:
            {"1. **First Turn**: Brief introduction of your role and their primary condition: {prefs.primary_condition} in a playful, engaging way. Focus on their support needs: {prefs.primary_support}. Ask an open-ended question." if is_first_turn else "1. **Continuing Conversation**: Build naturally on previous discussion. No reintroductions needed."}
            
            2. **Early Turns**: Concise responses with expansion options
            3. **Engaged Turns**: Detailed explanations when requested
            4. **Always**: Maintain {prefs.communication_style} style, respect {prefs.attention_span} attention span

            ## PROGRESSIVE DEPTH GUIDELINES:
            - **Level 1** (Initial): 2-3 sentences, welcoming + open-ended question
            - **Level 2** (Exploring): 4-6 sentences, concrete advice + optional expansion
            - **Level 3** (Detailed): 7-10 sentences, comprehensive explanations with examples
            - **Level 4** (Deep): 10+ sentences, detailed therapeutic techniques with step-by-step guidance

            ## RESPONSE RULES:
            - PROVIDE concrete, actionable advice when asked for suggestions
            - GIVE specific examples and techniques, not just generalities
            - OFFER detailed explanations when user asks "what should I do" or "how"
            - REDUCE open-ended questions when user seeks direct guidance
            - BALANCE questions with substantive content
            - **NO REPETITIVE GREETINGS** after first turn
            - **CONTINUE CONVERSATIONS** naturally without restarting

            ## CURRENT DIRECTIVE:
            {"Establish rapport and learn about user" if is_first_turn else "Continue meaningful conversation based on previous context"}

            ## CURRENT DEPTH LEVEL: {"1" if is_first_turn else "2" if not prefers_detail else "3-4"}

            ## COMMUNICATION CONSTRAINTS:
            - NEVER use "Hi [Name]" after first turn
            - ALWAYS continue conversation flow naturally
            - ADAPT to user's learning style: {prefs.learning_style}
            - RESPECT attention span: {prefs.attention_span}
            - USE communication style: {prefs.communication_style}
            - __**MAINTAIN CONVERSATION CONTINUITY**__
        """
        
        return template
    
    def _determine_conversation_stage(self, turn_count: int, user_input: str) -> Dict[str, Any]:
        """Analyze conversation stage and user intent"""
        # Detect if user wants detail
        detail_phrases = [
            "explain", "detail", "more about", "tell me about", 
            "how does", "why", "describe", "elaborate", "what exactly"
        ]
        
        prefers_detail = any(phrase in user_input.lower() for phrase in detail_phrases)
        
        # Determine engagement level
        word_count = len(user_input.split())
        if word_count > 15:
            engagement = "high"
        elif word_count > 8:
            engagement = "medium"
        else:
            engagement = "low"
        
        # Determine conversation stage
        if turn_count == 0:
            stage = "initial"
        elif turn_count < 3:
            stage = "early"
        elif prefers_detail:
            stage = "detailed"
        else:
            stage = "ongoing"
        
        return {
            "stage": stage,
            "prefers_detail": prefers_detail,
            "engagement_level": engagement,
            "requires_detail": prefers_detail or engagement == "high"
        }
    
    def process_preferences(self, prefs: UserPreferences, template_type: str = "therapeutic") -> Dict[str, Any]:
        """
        Process user preferences and return a structured prompt template.

        :param prefs: UserPreferences object
        :param template_type: One of ['therapeutic', 'crisis', 'detailed', 'brief']
        :return: Dict with generated prompt template and metadata
        """
        # If 'default' is passed, fallback to therapeutic
        if template_type == "default":
            template_type = "therapeutic"

        template_func = self.prompt_templates.get(template_type)
        if not template_func:
            raise ValueError(f"Invalid template type: {template_type}. Available: {list(self.prompt_templates.keys())}")

        prompt = template_func(prefs)

        return {
            "template_type": template_type,
            "prompt_template": prompt
        }
    
    def store_submission(self, prefs: UserPreferences, template_type: str) -> str:
        """
            Store the submission in memory and return its unique ID.
        """
        # Initialize submissions storage if it doesn't exist
        if not hasattr(self, "submissions"):
            self.submissions = {}

        import uuid
        submission_id = str(uuid.uuid4())

        # Store preferences as a dict (if Pydantic model, use .dict())
        self.submissions[submission_id] = {
            "id": submission_id,
            "preferences": prefs.dict() if hasattr(prefs, "dict") else str(prefs),
            "template_type": template_type
        }

        return submission_id


    def get_submission(self, submission_id: str) -> Dict[str, Any]:
        """Retrieve a stored submission by ID"""
        return self.submissions.get(submission_id)

    def get_all_submissions(self) -> List[Dict[str, Any]]:
        """Retrieve all submissions"""
        return list(self.submissions.values())
