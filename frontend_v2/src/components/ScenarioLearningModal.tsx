"use client";

import { useState, useEffect } from "react";
import { usePreferences } from "@/contexts/PreferencesContext";
import {
  startLearningSession,
  generateScenarioFeedback,
  LearningSession,
  QuestionStep,
  FeedbackStep,
} from "@/lib/api";

interface ScenarioLearningModalProps {
  scenarioId: string;
  isOpen: boolean;
  onClose: () => void;
}

type LearningState =
  | "loading"
  | "scenario"
  | "question"
  | "feedback"
  | "complete"
  | "error";

interface LearningProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  currentQuestion: QuestionStep | null;
  userAnswer: string | null;
  feedback: string | null;
  isCorrect: boolean | null;
}

export default function ScenarioLearningModal({
  scenarioId,
  isOpen,
  onClose,
}: ScenarioLearningModalProps) {
  const { preferences } = usePreferences();
  const [state, setState] = useState<LearningState>("loading");
  const [session, setSession] = useState<LearningSession | null>(null);
  const [progress, setProgress] = useState<LearningProgress>({
    currentQuestionIndex: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentQuestion: null,
    userAnswer: null,
    feedback: null,
    isCorrect: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Initialize learning session when modal opens
  useEffect(() => {
    if (isOpen && scenarioId && preferences) {
      initializeSession();
    }
  }, [isOpen, scenarioId, preferences]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setState("loading");
      setSession(null);
      setProgress({
        currentQuestionIndex: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        currentQuestion: null,
        userAnswer: null,
        feedback: null,
        isCorrect: null,
      });
      setError(null);
      setIsGeneratingFeedback(false);
    }
  }, [isOpen]);

  const initializeSession = async () => {
    if (!preferences) return;

    setState("loading");
    setError(null);

    try {
      const response = await startLearningSession(scenarioId, preferences);

      if (response.success && response.session) {
        setSession(response.session);
        const questions = response.session.content.steps.filter(
          (step) => step.type === "question",
        ) as QuestionStep[];

        setProgress({
          currentQuestionIndex: 0,
          totalQuestions: questions.length,
          correctAnswers: 0,
          currentQuestion: questions[0] || null,
          userAnswer: null,
          feedback: null,
          isCorrect: null,
        });

        setState("scenario");
      } else {
        setError(response.error || "Failed to start learning session");
        setState("error");
      }
    } catch (err) {
      console.error("Error initializing session:", err);
      setError("Failed to load learning content");
      setState("error");
    }
  };

  const startQuestions = () => {
    if (progress.currentQuestion) {
      setState("question");
    } else {
      setState("complete");
    }
  };

  const handleAnswerSelection = async (selectedAnswer: string) => {
    if (!session || !progress.currentQuestion || !preferences) return;

    setProgress((prev) => ({ ...prev, userAnswer: selectedAnswer }));
    setIsGeneratingFeedback(true);

    try {
      const feedbackResponse = await generateScenarioFeedback(
        scenarioId,
        preferences,
        selectedAnswer,
        progress.currentQuestion,
      );

      if (feedbackResponse.success) {
        const isCorrect = feedbackResponse.is_correct || false;

        setProgress((prev) => ({
          ...prev,
          feedback: feedbackResponse.feedback || "Answer recorded.",
          isCorrect,
          correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        }));

        setState("feedback");
      } else {
        // Fallback feedback
        const isCorrect =
          selectedAnswer.toLowerCase() ===
          progress.currentQuestion.correct_answer.toLowerCase();
        setProgress((prev) => ({
          ...prev,
          feedback: isCorrect
            ? "Great job! You got it right!"
            : `Not quite. The correct answer is: ${progress.currentQuestion?.correct_answer}`,
          isCorrect,
          correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        }));
        setState("feedback");
      }
    } catch (err) {
      console.error("Error generating feedback:", err);
      // Fallback feedback
      const isCorrect =
        selectedAnswer.toLowerCase() ===
        progress.currentQuestion.correct_answer.toLowerCase();
      setProgress((prev) => ({
        ...prev,
        feedback: isCorrect
          ? "Correct!"
          : `The correct answer is: ${progress.currentQuestion?.correct_answer}`,
        isCorrect,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      }));
      setState("feedback");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const nextQuestion = () => {
    if (!session) return;

    const questions = session.content.steps.filter(
      (step) => step.type === "question",
    ) as QuestionStep[];

    const nextIndex = progress.currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setProgress((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        currentQuestion: questions[nextIndex],
        userAnswer: null,
        feedback: null,
        isCorrect: null,
      }));
      setState("question");
    } else {
      setState("complete");
    }
  };

  const getScorePercentage = () => {
    if (progress.totalQuestions === 0) return 0;
    return Math.round(
      (progress.correctAnswers / progress.totalQuestions) * 100,
    );
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                {session?.scenario.title || "Learning Session"}
              </h2>
              {progress.totalQuestions > 0 && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    Question {progress.currentQuestionIndex + 1} of{" "}
                    {progress.totalQuestions}
                  </span>
                  <span className={`font-medium ${getScoreColor()}`}>
                    Score: {progress.correctAnswers}/{progress.totalQuestions}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Loading State */}
          {state === "loading" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Preparing your personalized learning experience...
              </p>
            </div>
          )}

          {/* Error State */}
          {state === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={initializeSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Scenario Introduction */}
          {state === "scenario" && session && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/60">
                <h3 className="font-semibold text-gray-800 text-xl mb-3">
                  {session.scenario.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {session.scenario.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {session.scenario.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    {session.content.estimated_duration}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {session.content.total_questions} Questions
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={startQuestions}
                  className="px-6 py-3 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Start Questions
                </button>
              </div>
            </div>
          )}

          {/* Question State */}
          {state === "question" && progress.currentQuestion && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">
                  {progress.currentQuestion.content}
                </h3>
                <div className="space-y-3">
                  {progress.currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelection(option)}
                      disabled={isGeneratingFeedback}
                      className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {isGeneratingFeedback && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">
                    Generating personalized feedback...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Feedback State */}
          {state === "feedback" && progress.feedback && (
            <div className="space-y-6">
              {/* User's Answer */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">
                  {progress.currentQuestion?.content}
                </h3>
                <div className="space-y-3">
                  {progress.currentQuestion?.options.map((option, index) => {
                    const isUserAnswer = option === progress.userAnswer;
                    const isCorrectAnswer =
                      option === progress.currentQuestion?.correct_answer;

                    let bgColor = "bg-white border-gray-200";
                    if (isUserAnswer && progress.isCorrect) {
                      bgColor = "bg-green-50 border-green-300";
                    } else if (isUserAnswer && !progress.isCorrect) {
                      bgColor = "bg-red-50 border-red-300";
                    } else if (isCorrectAnswer && !progress.isCorrect) {
                      bgColor = "bg-green-50 border-green-300";
                    }

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${bgColor}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 border-2 rounded-full flex items-center justify-center text-sm font-medium ${
                              isUserAnswer && progress.isCorrect
                                ? "border-green-500 bg-green-500 text-white"
                                : isUserAnswer && !progress.isCorrect
                                  ? "border-red-500 bg-red-500 text-white"
                                  : isCorrectAnswer && !progress.isCorrect
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-gray-300"
                            }`}
                          >
                            {isUserAnswer && progress.isCorrect
                              ? "✓"
                              : isUserAnswer && !progress.isCorrect
                                ? "✗"
                                : isCorrectAnswer && !progress.isCorrect
                                  ? "✓"
                                  : String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-gray-700">{option}</span>
                          {isUserAnswer && (
                            <span className="text-sm text-gray-500 ml-auto">
                              Your answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div
                className={`rounded-xl p-6 ${
                  progress.isCorrect
                    ? "bg-green-50 border border-green-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      progress.isCorrect ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    <span className="text-white text-sm">
                      {progress.isCorrect ? "✓" : "i"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold mb-2 ${
                        progress.isCorrect ? "text-green-800" : "text-blue-800"
                      }`}
                    >
                      {progress.isCorrect
                        ? "Excellent!"
                        : "Let's learn together"}
                    </h4>
                    <p
                      className={`leading-relaxed ${
                        progress.isCorrect ? "text-green-700" : "text-blue-700"
                      }`}
                    >
                      {progress.feedback}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  {progress.currentQuestionIndex + 1 < progress.totalQuestions
                    ? "Next Question"
                    : "View Results"}
                </button>
              </div>
            </div>
          )}

          {/* Complete State */}
          {state === "complete" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">🎉</span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-2xl mb-2">
                  Great Job!
                </h3>
                <p className="text-gray-600 mb-4">
                  You&apos;ve completed the learning session
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {progress.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${getScoreColor()}`}>
                      {progress.correctAnswers}
                    </div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${getScoreColor()}`}>
                      {getScorePercentage()}%
                    </div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Complete Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
