"use client";
import LLMMessageRenderer from "@/components/LLMMessageRenderer";
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/lib/api";
import { useChatStore, ChatMessage } from "@/stores/chatStore";

interface ChatInterfaceProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: any;
  selectedQuestion: string;
  onQuestionUsed: () => void;
}

interface ExtendedChatMessage extends ChatMessage {
  sender: "user" | "ai";
  timestamp: string;
}

export default function ChatInterface({
    preferences,
    selectedQuestion,
    onQuestionUsed,
  }: ChatInterfaceProps) {
    // Zustand store (persistent)
    const messages = useChatStore((state) => state.messages);
    const addMessage = useChatStore((state) => state.addMessage);
    const clearMessages = useChatStore((state) => state.clearMessages);

    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    // Pre-fill input when a suggested question is clicked
    useEffect(() => {
      if (selectedQuestion) {
        setInputText(selectedQuestion);
        inputRef.current?.focus();
        onQuestionUsed();
      }
    }, [selectedQuestion, onQuestionUsed]);

    const handleSendMessage = async () => {
      if (!inputText.trim() || !preferences) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      addMessage(userMessage); // save in Zustand/localStorage
      const currentInput = inputText;
      setInputText("");
      setIsTyping(true);

      try {
        const response = await sendChatMessage(currentInput, preferences);

        if (response.success) {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: response.response,
            sender: "ai",
            timestamp: new Date().toISOString(),
          };
          addMessage(aiMessage);
        } else {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            text: "I'm having trouble processing your request right now. Please try again in a moment.",
            sender: "ai",
            timestamp: new Date().toISOString(),
          };
          addMessage(errorMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 3).toString(),
          text: "I'm having trouble connecting right now. Please try again.",
          sender: "ai",
          timestamp: new Date().toISOString(),
        };
        addMessage(errorMessage);
      } finally {
        setIsTyping(false);
      }
    };

    const handleClearChat = () => {
      if (window.confirm("Are you sure you want to clear all messages? This action cannot be undone.")) {
        clearMessages();
      }
    };

    const formatTime = (isoString: string) => {
      return new Date(isoString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const TypingIndicator = () => (
      <div className="flex justify-start items-end space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
          <span className="text-white text-sm">AI</span>
        </div>
        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200/80 shadow-xs px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          {/* Header with Clear Chat Button */}
          {messages.length > 0 && (
            <div className="bg-white border-b border-gray-200/80 p-3 sm:p-4 flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-600">Chat History</h2>
              <button
                onClick={handleClearChat}
                className="flex items-center text-xs text-gray-500 hover:text-red-500 transition-colors duration-200"
                title="Clear all messages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Chat
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-8 sm:py-16 px-4">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <span className="text-2xl sm:text-3xl">👋</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  Welcome to Your Support Chat
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  I&apos;m here to provide personalized support based on your
                  preferences. Let&apos;s work together on your goals and
                  challenges.
                </p>
                <div className="mt-3 sm:mt-4 text-xs text-gray-400">
                  Type your message below to get started
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    } items-end space-x-2`}
                  >
                    {message.sender === "ai" && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                        <span className="text-white text-xs sm:text-sm">AI</span>
                      </div>
                    )}
                    <div
                      className={`${
                        message.sender === "user"
                          ? "max-w-[70%] md:max-w-xl ml-auto"
                          : "max-w-[85%] md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md border border-gray-200/80 shadow-xs"
                        }`}
                      >
                        <div className="text-xs sm:text-sm leading-relaxed">
                          {message.sender === "ai" ? (
                            <LLMMessageRenderer content={message.text} />
                          ) : (
                            <span>{message.text}</span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-xs text-gray-400 mt-1 sm:mt-2 px-1 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                        <span className="text-white text-xs sm:text-sm">You</span>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200/80 p-3 sm:p-6 safe-area-bottom">
            <div className="flex space-x-2 sm:space-x-3 items-end">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300/80 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 bg-white text-gray-800 placeholder-gray-400 pr-8 sm:pr-12 transition-all duration-200 text-sm sm:text-base"
                  disabled={isTyping}
                />
                <div className="absolute right-2 sm:right-3 top-3 sm:top-3.5 text-gray-400 text-xs hidden sm:block">
                  ⏎
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-w-[70px] sm:min-w-[90px] shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                {isTyping ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
  );
}