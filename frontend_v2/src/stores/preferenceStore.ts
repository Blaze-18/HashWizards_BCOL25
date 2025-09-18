import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserPreferences } from "@/lib/api";

// Define the store interface
interface PreferencesState {
    preferences: UserPreferences;
    setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
    setMultiSelectPreference: <K extends keyof UserPreferences>(key: K, value: string[], replace?: boolean) => void;
    resetPreferences: () => void;
}

// Default initial values (can match your current formData)
const defaultPreferences: UserPreferences = {
    age_group: "",
    primary_condition: "",
    communication_style: "direct",
    literal_understanding: false,
    learning_style: "visual",
    attention_span: "medium",
    primary_support: "social_skills",
    interaction_pace: "normal",
    encouragement_style: "gentle",
    correction_style: "gentle",
    response_length: "balanced",
    sensory_sensitivities: [],
    sensory_seeking: [],
    executive_challenges: [],
    effective_strategies: [],
    regulation_tools: [],
    additional_notes: "",
};

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
        preferences: defaultPreferences,

        setPreference: (key, value) =>
            set((state) => ({
            preferences: { ...state.preferences, [key]: value },
            })),

        setMultiSelectPreference: (key, values, replace = false) =>
            set((state) => {
            const current = state.preferences[key] as string[] | undefined;
            return {
                preferences: {
                ...state.preferences,
                [key]: replace
                    ? values
                    : [...(current || []), ...values.filter((v) => !(current || []).includes(v))],
                },
            };
            }),

        resetPreferences: () => set({ preferences: defaultPreferences }),
        }),
        {
        name: "user-preferences", // key in localStorage
        }
    )
);
