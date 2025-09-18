/* eslint-disable @typescript-eslint/no-explicit-any */
// Define API_BASE_URL at the top of the file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserPreferences {
  // Core Identity
  age_group: string; // "6-8", "9-11", "12-14", "15-17", "18-21", "22+"
  primary_condition: string;

  // Communication & Learning
  communication_style: "direct" | "gentle" | "visual" | "structured";
  literal_understanding: boolean;
  learning_style: "visual" | "auditory" | "kinesthetic" | "multisensory";
  attention_span: "short" | "medium" | "long" | "variable";

  // Primary Support Area
  primary_support:
    | "social_skills"
    | "emotional_regulation"
    | "executive_functioning"
    | "sensory_processing"
    | "communication"
    | "academic_support"
    | "daily_living"
    | "self_advocacy";

  // Interaction Preferences
  interaction_pace: "slow" | "patient" | "normal" | "brisk";
  encouragement_style: "gentle" | "enthusiastic" | "quiet" | "visual";
  correction_style: "direct" | "gentle" | "indirect" | "no_correction";

  // Response Formatting
  response_length: "brief" | "detailed" | "balanced";

  // Sensory Profile (Optional but clinically valuable)
  sensory_sensitivities?: (
    | "auditory"
    | "visual"
    | "tactile"
    | "olfactory"
    | "gustatory"
  )[];
  sensory_seeking?: (
    | "movement"
    | "pressure"
    | "visual_stimulation"
    | "rhythmic"
  )[];

  // Executive Functioning (Optional)
  executive_challenges?: (
    | "planning"
    | "organization"
    | "task_initiation"
    | "time_management"
  )[];

  // Support Strategies (What works)
  effective_strategies?: (
    | "visual_supports"
    | "breaks"
    | "clear_expectations"
    | "choices"
    | "first_then"
    | "timers"
    | "social_stories"
    | "positive_reinforcement"
  )[];

  // Emotional Regulation
  regulation_tools?: (
    | "deep_breathing"
    | "movement_breaks"
    | "sensory_tools"
    | "quiet_space"
  )[];

  // Additional context
  additional_notes?: string;
}

export interface ProcessedPreferences {
  preferences: UserPreferences;
  prompt_template: string;
  model_ready: boolean;
}

export interface ChatMessage {
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// ==================== SCENARIO LEARNING INTERFACES ==================== //

export interface QuestionStep {
  type: "question";
  content: string;
  options: string[];
  correct_answer: string;
}

export interface FeedbackStep {
  type: "feedback";
  content: string;
}

export interface ScenarioContent {
  steps: (QuestionStep | FeedbackStep)[];
  total_questions: number;
  estimated_duration: string;
  fallback?: boolean;
  error?: string;
}

export interface LearningSession {
  scenario: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    scenario_type: string;
    target_age_groups: string[];
  };
  content: ScenarioContent;
  user_preferences: UserPreferences;
  session_metadata: {
    total_questions: number;
    estimated_duration: string;
    current_step: number;
    is_fallback: boolean;
    generation_error?: string;
  };
}

// ==================== EXISTING FUNCTIONS ==================== //

export async function savePreferences(preferences: UserPreferences): Promise<{
  success: boolean;
  submission_id?: string;
  message: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/process-preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving preferences:", error);
    return {
      success: false,
      message: "Failed to connect to server. Please try again.",
    };
  }
}

export async function sendChatMessage(
  message: string,
  preferences: UserPreferences,
  sessionId: string = "default",
): Promise<{ response: string; success: boolean; turnCount?: number }> {
  try {
    const chatResponse = await fetch(
      `${API_BASE_URL}/api/v1/generate-response`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: message,
          preferences: preferences,
          session_id: sessionId,
        }),
      },
    );

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      throw new Error(`Server error: ${chatResponse.status} - ${errorText}`);
    }

    const responseData = await chatResponse.json();

    return {
      response: responseData.response,
      success: responseData.success,
      turnCount: responseData.turn_count,
    };
  } catch (error) {
    console.error("Error sending chat message:", error);
    return {
      response:
        "I apologize, but I'm having trouble connecting to my thinking system right now. Please try again in a moment.",
      success: false,
    };
  }
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  scenario_type: string;
  primary_conditions: string[];
  difficulty: string;
  target_age_groups: string[];
  content: string;
  suggested_strategies: string[];
  sensory_considerations: string[];
  communication_style: string[];
  attention_span: string;
}

export interface ScenarioResponse {
  success: boolean;
  scenarios?: Scenario[];
  error?: string;
}

// ==================== SCENARIO FUNCTIONS ==================== //

export async function getRecommendedScenarios(
  preferences: UserPreferences,
  query?: string,
  maxResults: number = 5,
): Promise<ScenarioResponse> {
  try {
    const requestBody = {
      user_prefs: preferences,
      query: query || null,
      max_results: maxResults,
    };

    const response = await fetch(`${API_BASE_URL}/api/v1/scenarios/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    const scenarios: Scenario[] = await response.json();
    return { success: true, scenarios };
  } catch (error) {
    console.error("Error getting recommended scenarios:", error);
    return {
      success: false,
      error: "Failed to get scenario recommendations",
    };
  }
}

export async function searchScenarios(
  query: string,
  preferences?: UserPreferences,
  maxResults: number = 5,
): Promise<ScenarioResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/scenarios/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        user_prefs: preferences,
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const scenarios: Scenario[] = await response.json();
    return { success: true, scenarios };
  } catch (error) {
    console.error("Error searching scenarios:", error);
    return {
      success: false,
      error: "Failed to search scenarios",
    };
  }
}

export async function getScenarioById(
  scenarioId: string,
): Promise<ScenarioResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scenarios/${scenarioId}`,
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${text}`);
    }

    const scenario: Scenario = await response.json();
    return { success: true, scenarios: [scenario] };
  } catch (error) {
    console.error("Error getting scenario by ID:", error);
    return { success: false, error: "Failed to get scenario" };
  }
}

export async function getAllScenarios(): Promise<ScenarioResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/scenarios/`);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${text}`);
    }

    const scenarios: Scenario[] = await response.json();
    return { success: true, scenarios };
  } catch (error) {
    console.error("Error getting all scenarios:", error);
    return { success: false, error: "Failed to get scenarios" };
  }
}

// ==================== NEW SCENARIO LEARNING FUNCTIONS ==================== //

export async function startLearningSession(
  scenarioId: string,
  preferences: UserPreferences,
): Promise<{ success: boolean; session?: LearningSession; error?: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scenarios/${scenarioId}/start-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_prefs: preferences }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    const data = await response.json();
    return {
      success: data.success,
      session: data.session,
    };
  } catch (error) {
    console.error("Error starting learning session:", error);
    return {
      success: false,
      error: "Failed to start learning session",
    };
  }
}

export async function generateScenarioContent(
  scenarioId: string,
  preferences: UserPreferences,
): Promise<{
  success: boolean;
  content?: any;
  scenario_title?: string;
  metadata?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scenarios/${scenarioId}/generate-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_prefs: preferences }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    const data = await response.json();
    return {
      success: data.success,
      content: data.content,
      scenario_title: data.scenario_title,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error("Error generating scenario content:", error);
    return {
      success: false,
      error: "Failed to generate scenario content",
    };
  }
}

export async function generateScenarioFeedback(
  scenarioId: string,
  preferences: UserPreferences,
  userAnswer: string,
  question: QuestionStep,
): Promise<{
  success: boolean;
  feedback?: string;
  is_correct?: boolean;
  correct_answer?: string;
  metadata?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scenarios/${scenarioId}/generate-feedback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_prefs: preferences,
          user_answer: userAnswer,
          question: question,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    const data = await response.json();
    return {
      success: data.success,
      feedback: data.feedback,
      is_correct: data.is_correct,
      correct_answer: data.correct_answer,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error("Error generating feedback:", error);
    return {
      success: false,
      error: "Failed to generate feedback",
    };
  }
}

export async function validateAnswer(
  scenarioId: string,
  userAnswer: string,
  correctAnswer: string,
): Promise<{
  success: boolean;
  is_correct?: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scenarios/${scenarioId}/validate-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_answer: userAnswer,
          correct_answer: correctAnswer,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    const data = await response.json();
    return {
      success: data.success,
      is_correct: data.is_correct,
      message: data.message,
    };
  } catch (error) {
    console.error("Error validating answer:", error);
    return {
      success: false,
      error: "Failed to validate answer",
    };
  }
}

export async function getLearningProgress(
  scenarioId: string,
  sessionId: string,
): Promise<{
  success: boolean;
  progress?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scenarios/${scenarioId}/progress/${sessionId}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    const data = await response.json();
    return {
      success: data.success,
      progress: data.progress,
    };
  } catch (error) {
    console.error("Error getting learning progress:", error);
    return {
      success: false,
      error: "Failed to get learning progress",
    };
  }
}
