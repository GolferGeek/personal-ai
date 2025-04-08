import { create } from 'zustand';
import { ParameterDefinition } from '../../types';

// Define message types
export type MessageType = 'user' | 'ai' | 'error';

export interface ConversationMessage {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
}

// Define store state
interface ConversationState {
  // Conversation state
  messages: ConversationMessage[];
  isListening: boolean;
  isProcessing: boolean;
  error: string | null;
  
  // Parameters needed state (for dynamic form)
  parametersNeeded: {
    agentId: string;
    parameters: ParameterDefinition[];
  } | null;
  
  // Actions
  addMessage: (text: string, type: MessageType) => void;
  setIsListening: (isListening: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  setParametersNeeded: (parametersNeeded: { agentId: string; parameters: ParameterDefinition[] } | null) => void;
  clearMessages: () => void;
}

// Create store
export const useConversationStore = create<ConversationState>((set) => ({
  // Initial state
  messages: [],
  isListening: false,
  isProcessing: false,
  error: null,
  parametersNeeded: null,
  
  // Actions
  addMessage: (text: string, type: MessageType) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: crypto.randomUUID(),
        text,
        type,
        timestamp: new Date(),
      },
    ],
  })),
  
  setIsListening: (isListening: boolean) => set({ isListening }),
  
  setIsProcessing: (isProcessing: boolean) => set({ isProcessing }),
  
  setError: (error: string | null) => set({ error }),
  
  setParametersNeeded: (parametersNeeded) => set({ parametersNeeded }),
  
  clearMessages: () => set({ messages: [] }),
})); 