"use client";
import { useState, useEffect } from "react";
import { usePreferences } from "@/contexts/PreferencesContext";
import ChatInterface from "@/components/ChatInterface";
import ScenariosInterface from "@/components/ScenarioInterface";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import Bot from "@/assets/bot.png";
import Link from "next/link";

type TabType = "chat" | "scenarios";

// Generic questions for neurotypical children
const topQuestions = [
  "How can I make friends at school?",
  "Why do I feel anxious sometimes?",
  "How can I focus better on my homework?",
  "What should I do when I feel overwhelmed?",
  "How can I express my feelings better?",
  "Why do some social situations feel difficult?",
  "How can I manage my emotions?",
  "What are good study techniques for me?"
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const { preferences } = usePreferences();

  // Redirect if no preferences
  useEffect(() => {
    const checkPreferences = setTimeout(() => {
      if (!preferences) {
        console.log("No preferences found, redirecting...");
        window.location.href = "/preferences";
      } else {
        console.log("Preferences found:", preferences);
      }
    }, 2000);

    return () => clearTimeout(checkPreferences);
  }, [preferences]);

  const handleStartScenario = (scenarioId: string) => {
    console.log(`Starting scenario ${scenarioId}`);
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-12 sm:w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-3">
                  <Link href="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Image
                      src={Logo}
                      alt="Sentio Logo"
                      width={60}
                      height={40}
                      className="mx-auto mb-3"
                  />
                  </Link>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} text-black`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4">
          {/* Back Button */}
          <div className="px-2 sm:px-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center w-8 h-8 sm:w-10 sm:h-10' : 'space-x-3'} w-full p-3 rounded-lg hover:bg-gray-100 transition-colors group`}
              title={sidebarCollapsed ? "Back" : ""}
            >
              <svg className={`${sidebarCollapsed ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'} text-gray-600 group-hover:text-gray-800`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {!sidebarCollapsed && <span className="text-gray-700 font-medium">Back</span>}
            </button>
          </div>

          {/* Main Navigation */}
          <div className="px-2 sm:px-4 space-y-2">
            <button
              onClick={() => window.location.href = "/dashboard"}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center w-8 h-8 sm:w-10 sm:h-10' : 'space-x-3'} w-full p-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group`}
              title={sidebarCollapsed ? "Dashboard" : ""}
            >
              <svg className={`${sidebarCollapsed ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'} text-gray-600 group-hover:text-blue-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
              </svg>
              {!sidebarCollapsed && <span className="text-gray-700 font-medium">Dashboard</span>}
            </button>

            <button
              onClick={() => window.location.href = "/social"}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center w-8 h-8 sm:w-10 sm:h-10' : 'space-x-3'} w-full p-3 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors group`}
              title={sidebarCollapsed ? "Social" : ""}
            >
              <svg className={`${sidebarCollapsed ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'} text-gray-600 group-hover:text-green-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              {!sidebarCollapsed && <span className="text-gray-700 font-medium">Social</span>}
            </button>
          </div>

          {/* Top Asked Questions Section */}
          {!sidebarCollapsed && (
            <div className="px-4 mt-8">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-800">Top Asked Questions</h3>
              </div>
              
              <div className="
                  space-y-2
                  max-h-64
                  overflow-y-auto
                  [scrollbar-width:none]
                  [-ms-overflow-style:none]
                  [&::-webkit-scrollbar]:hidden
              ">
                {topQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left p-2 text-xs text-gray-600 hover:bg-yellow-50 hover:text-yellow-800 rounded-md transition-colors border border-transparent hover:border-yellow-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          {!sidebarCollapsed && (
            <div className="text-sm text-gray-700 text-center">
              Sentio AI Assistant
              <br />
              <span className="text-green-500">● Online</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-2 sm:p-4">
          <div className="h-full flex flex-col rounded-xl sm:rounded-2xl shadow-lg overflow-hidden bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 shadow-sm rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={Bot}
                    alt="App Logo"
                    width={30}
                    height={30}
                    className="mx-auto mb-3"
                  />
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Support Assistant
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                      Ready to help you learn and grow
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-xs sm:text-sm text-gray-400 bg-gray-50 px-2 sm:px-3 py-1 rounded-full">
                    Online
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 border-gray-100  px-4 sm:px-6">
              <div className="flex gap-2 sm:gap-3 py-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    activeTab === "chat"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setActiveTab("scenarios")}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    activeTab === "scenarios"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  🎯 Scenarios
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "chat" ? (
                <ChatInterface 
                  preferences={preferences} 
                  selectedQuestion={selectedQuestion}
                  onQuestionUsed={() => setSelectedQuestion("")}
                />
              ) : (
                <ScenariosInterface />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}