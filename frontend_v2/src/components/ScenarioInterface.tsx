"use client";

import { useState, useEffect } from "react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getRecommendedScenarios, Scenario as ApiScenario } from "@/lib/api";
import ScenarioLearningModal from "./ScenarioLearningModal";

interface ScenariosInterfaceProps {
  onStartScenario?: (scenarioId: string) => void;
}

export default function ScenariosInterface({
  onStartScenario,
}: ScenariosInterfaceProps) {
  const { preferences } = usePreferences();
  const [scenarios, setScenarios] = useState<ApiScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      if (!preferences) {
        setError("No preferences found. Please complete your profile first.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First check sessionStorage for pre-fetched scenarios
        const storedScenarios = sessionStorage.getItem("userScenarios");
        if (storedScenarios) {
          const parsedScenarios = JSON.parse(storedScenarios);
          setScenarios(parsedScenarios);
          sessionStorage.removeItem("userScenarios"); // Clean up
        } else {
          // Fetch from API if not in sessionStorage
          const response = await getRecommendedScenarios(preferences);
          if (response.success && response.scenarios) {
            setScenarios(response.scenarios);
          } else {
            setError(response.error || "Failed to load scenarios");
          }
        }
      } catch (err) {
        console.error("Error fetching scenarios:", err);
        setError("Failed to load scenarios. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, [preferences]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-50 text-green-700 border-green-200";
      case "intermediate":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (scenarioType: string) => {
    const icons: { [key: string]: string } = {
      social_skills: "💬",
      emotional_regulation: "🧘",
      executive_functioning: "🎯",
      sensory_processing: "🌟",
      communication: "🤝",
      academic_support: "📚",
      daily_living: "📅",
      self_advocacy: "🗣️",
    };
    return icons[scenarioType] || "🎯";
  };

  const formatCategoryName = (scenarioType: string) => {
    return scenarioType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleStartScenario = (scenarioId: string) => {
    if (onStartScenario) {
      onStartScenario(scenarioId);
    } else {
      // Default behavior - open the learning modal
      setSelectedScenarioId(scenarioId);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScenarioId(null);
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-3 sm:p-6 bg-gray-50/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading personalized scenarios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto p-3 sm:p-6 bg-gray-50/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => (window.location.href = "/preferences")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-3 sm:p-6 bg-gray-50/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-600">
              No scenarios available for your preferences.
            </p>
            <button
              onClick={() => (window.location.href = "/preferences")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-y-auto p-3 sm:p-6 bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎯</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Learning Scenarios
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm px-4">
              Personalized activities based on your preferences
            </p>
          </div>

          <div className="grid gap-3 sm:gap-5">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/60 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300/60"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg sm:text-xl">
                      {getCategoryIcon(scenario.scenario_type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-block px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {formatCategoryName(scenario.scenario_type)}
                      </span>
                      <span
                        className={`inline-block px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(scenario.difficulty)}`}
                      >
                        {scenario.difficulty}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">
                      {scenario.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                      {scenario.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1 text-xs text-gray-500 font-medium">
                        <span>👤</span>
                        <span>For {scenario.target_age_groups.join(", ")}</span>
                      </div>
                      <button
                        onClick={() => handleStartScenario(scenario.id)}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-br from-green-600 to-green-700 text-white text-xs sm:text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Modal */}
      {selectedScenarioId && (
        <ScenarioLearningModal
          scenarioId={selectedScenarioId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
