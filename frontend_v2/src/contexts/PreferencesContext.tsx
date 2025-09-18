"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserPreferences } from "@/lib/api";

interface PreferencesContextType {
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences) => void;
  savePreferencesToBackend: (preferences: UserPreferences) => Promise<boolean>;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing saved preferences:", error);
      }
    }
  }, []);

  const savePreferencesToBackend = async (
    prefs: UserPreferences,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/save-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prefs),
      });

      if (response.ok) {
        setPreferences(prefs);
        localStorage.setItem("userPreferences", JSON.stringify(prefs));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving preferences:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setPreferences: savePreferencesToBackend, // This might need adjustment
        savePreferencesToBackend,
        isLoading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
