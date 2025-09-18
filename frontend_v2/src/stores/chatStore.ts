import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
    sender: string;
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

interface ChatStore {
    messages: ChatMessage[];
    sessionId: string;
    addMessage: (msg: ChatMessage) => void;
    clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
        messages: [],
        sessionId: crypto.randomUUID(),
        addMessage: (msg: ChatMessage) =>
            set((state) => ({ messages: [...state.messages, msg] })),
        clearMessages: () => set({ messages: [] }),
        }),
        {
        name: "chat-storage", // localStorage key
        }
    )
);
