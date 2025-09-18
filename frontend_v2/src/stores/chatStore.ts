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
    addMessage: (msg: ChatMessage) => void;
    clearMessages: () => void;
    }

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
        messages: [],
        addMessage: (msg) =>
            set((state) => ({ messages: [...state.messages, msg] })),
        clearMessages: () => set({ messages: [] }),
        }),
        {
        name: "chat-storage", // this will be the key in localStorage
        }
    )
);
