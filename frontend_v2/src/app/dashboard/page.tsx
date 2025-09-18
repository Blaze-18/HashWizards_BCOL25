"use client";

import { ReactNode, useState } from "react";
import {
  X,
  User,
  BookOpen,
  Star,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";


interface StatsCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  color?: "blue" | "green" | "red" | "yellow"; // or string if more flexible
}

interface DashboardCardProps {
  title: string;
  icon: React.ComponentType<any>; // for icon component
  preview?: ReactNode;
  onClick?: () => void;
  className?: string;
}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// Mock preference data
const mockPreferences = {
  age_group: "12-14",
  primary_condition: "ADHD",
  communication_style: "direct",
  literal_understanding: true,
  learning_style: "visual",
  attention_span: "medium",
  primary_support: "emotional_regulation",
  interaction_pace: "patient",
  encouragement_style: "gentle",
  correction_style: "direct",
  response_length: "balanced",
  sensory_sensitivities: ["auditory"],
  sensory_seeking: ["movement"],
  executive_challenges: ["planning"],
  effective_strategies: ["visual_supports", "breaks", "clear_expectations"],
  regulation_tools: ["deep_breathing"],
};

// Mock exercises/scenarios
const mockExercises = [
  {
    id: "asd_emotional_001",
    title: "When Plans Change Suddenly",
    description: "Managing anxiety when routines are disrupted - for ASD",
    difficulty: "intermediate",
    completed: true,
    score: 85,
  },
  {
    id: "asd_emotional_002",
    title: "Unexpected Loud Noises",
    description: "Managing sensory overload in public spaces",
    difficulty: "easy",
    completed: true,
    score: 92,
  },
  {
    id: "asd_social_001",
    title: "Reading Social Cues",
    description: "Understanding non-verbal communication",
    difficulty: "advanced",
    completed: false,
    score: null,
  },
  {
    id: "asd_executive_001",
    title: "Time Management Skills",
    description: "Breaking down tasks into manageable steps",
    difficulty: "intermediate",
    completed: true,
    score: 78,
  },
];

// Mock plan
const mockPlan = {
  type: "Premium",
  benefits: [
    "Access to all exercises",
    "Personalized recommendations",
    "Priority support",
    "Progress tracking",
    "Family sharing",
    "Monthly assessments",
  ],
};

// Additional mock data for stats
const mockStats = {
  exercisesCompleted: 12,
  currentStreak: 5,
  totalScore: 87,
  weeklyProgress: 75,
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Card Component
const DashboardCard = ({
  title,
  icon: Icon,
  preview,
  onClick,
  className = "",
}: DashboardCardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl">
          <Icon size={24} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600">{preview}</div>
      <div className="mt-4 text-blue-600 font-medium text-sm">
        Click to view details →
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, color = "blue" }: StatsCardProps) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Get top 3 most important preferences for preview
  const topPreferences = [
    { key: "Primary Condition", value: mockPreferences.primary_condition },
    { key: "Learning Style", value: mockPreferences.learning_style },
    { key: "Communication Style", value: mockPreferences.communication_style },
  ];

  // Get recent exercises for preview
  const recentExercises = mockExercises.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      {/* Navbar */}
        <Navbar></Navbar>
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Anan
            </span>
            ! 👋
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Here you can see a summary of your current preferences, exercises
            you&apos;ve tried, and your plan. Explore new exercises and track
            your progress over time.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={BookOpen}
            title="Exercises Completed"
            value={mockStats.exercisesCompleted}
            color="blue"
          />
          <StatsCard
            icon={TrendingUp}
            title="Current Streak"
            value={`${mockStats.currentStreak} days`}
            color="green"
          />
          <StatsCard
            icon={Award}
            title="Average Score"
            value={`${mockStats.totalScore}%`}
            color="purple"
          />
          <StatsCard
            icon={Calendar}
            title="Weekly Progress"
            value={`${mockStats.weeklyProgress}%`}
            color="orange"
          />
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Current Preferences"
            icon={User}
            preview={
              <div className="space-y-2">
                {topPreferences.map((pref, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {pref.key}:
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {pref.value}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-3">
                  + {Object.keys(mockPreferences).length - 3} more preferences
                </p>
              </div>
            }
            onClick={() => openModal("preferences")}
          />

          <DashboardCard
            title="Recent Exercises"
            icon={BookOpen}
            preview={
              <div className="space-y-3">
                {recentExercises.map((ex, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-3">
                    <p className="font-medium text-gray-800 text-sm">
                      {ex.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          ex.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ex.completed ? "Completed" : "In Progress"}
                      </span>
                      {ex.completed && (
                        <span className="text-xs text-gray-500">
                          Score: {ex.score}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-3">
                  + {mockExercises.length - 3} more exercises
                </p>
              </div>
            }
            onClick={() => openModal("exercises")}
          />

          <DashboardCard
            title="Your Plan"
            icon={Star}
            preview={
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-semibold rounded-full">
                    {mockPlan.type}
                  </span>
                </div>
                <div className="space-y-1">
                  {mockPlan.benefits.slice(0, 3).map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">
                    + {mockPlan.benefits.length - 3} more benefits
                  </p>
                </div>
              </div>
            }
            onClick={() => openModal("plan")}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Start Exercise
              </span>
            </button>
            <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                View Progress
              </span>
            </button>
            <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center">
              <User className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Update Profile
              </span>
            </button>
            <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-center">
              <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Achievements
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === "preferences"}
        onClose={closeModal}
        title="Your Preferences"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 border-b pb-2">
              Basic Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Age Group:</span>
                <span className="font-semibold text-gray-900">
                  {mockPreferences.age_group}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Condition:</span>
                <span className="font-semibold text-gray-900">
                  {mockPreferences.primary_condition}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Communication Style:</span>
                <span className="font-semibold text-gray-900">
                  {mockPreferences.communication_style}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Learning Style:</span>
                <span className="font-semibold text-gray-900">
                  {mockPreferences.learning_style}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attention Span:</span>
                <span className="font-semibold text-gray-900">
                  {mockPreferences.attention_span}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 border-b pb-2">
              Support Preferences
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 block mb-1">
                  Effective Strategies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {mockPreferences.effective_strategies.map(
                    (strategy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {strategy}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">
                  Regulation Tools:
                </span>
                <div className="flex flex-wrap gap-1">
                  {mockPreferences.regulation_tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">
                  Sensory Sensitivities:
                </span>
                <div className="flex flex-wrap gap-1">
                  {mockPreferences.sensory_sensitivities.map(
                    (sensitivity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        {sensitivity}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.href = '/preferences'}
          >
            Update Preferences
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "exercises"}
        onClose={closeModal}
        title="Your Exercises"
      >
        <div className="space-y-4">
          {mockExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {exercise.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {exercise.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        exercise.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : exercise.difficulty === "intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        exercise.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {exercise.completed ? "Completed" : "Not Started"}
                    </span>
                  </div>
                </div>
                {exercise.completed && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">
                      {exercise.score}%
                    </p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start New Exercise
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "plan"}
        onClose={closeModal}
        title="Your Premium Plan"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold text-lg">
            <Star size={20} />
            {mockPlan.type} Plan
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPlan.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-700 font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Plan Status</h4>
          <p className="text-blue-700 text-sm">
            Your premium plan is active and will renew on March 28, 2025.
          </p>
        </div>

        <div className="mt-6 flex justify-between">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Manage Plan
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </Modal>
    </div>
  );
}
