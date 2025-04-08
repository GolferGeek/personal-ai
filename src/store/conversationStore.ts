'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, ParametersNeededState } from '../models/conversation';
import apiClient from '../api/apiClient';

export interface ConversationState {
  // Data
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  error: string | null;
  parametersNeeded: ParametersNeededState | null;
  
  // Loading states
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isProcessing: boolean;
  
  // Actions
  createConversation: () => void;
  selectConversation: (id: string) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendAgentParameters: (agentId: string, parameters: Record<string, any>) => Promise<void>;
  clearParametersNeeded: () => void;
  setError: (error: string | null) => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  // Data
  conversations: [],
  currentConversationId: null,
  messages: [],
  error: null,
  parametersNeeded: null,

  // Loading states
  isLoadingConversations: false,
  isLoadingMessages: false,
  isProcessing: false,

  // Actions
  createConversation: async () => {
    try {
      const newConversation = await apiClient.createConversation();
      
      // Add to conversations and select it
      set(state => ({ 
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newConversation.id,
        messages: [] 
      }));
      
      return newConversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create conversation'
      });
    }
  },

  selectConversation: async (id: string) => {
    // If already selected, do nothing
    if (get().currentConversationId === id) return;
    
    set({ currentConversationId: id, messages: [], isLoadingMessages: true });
    
    try {
      // Load messages for this conversation
      await get().loadMessages(id);
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      set({ error: 'Failed to load conversation messages' });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  loadConversations: async () => {
    set({ isLoadingConversations: true });
    
    try {
      const conversations = await apiClient.getConversations();
      set({ conversations });
      
      // If there are conversations and none is selected, select the first one
      if (conversations.length > 0 && !get().currentConversationId) {
        get().selectConversation(conversations[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      set({ error: 'Failed to load conversations' });
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  loadMessages: async (conversationId: string) => {
    try {
      const messages = await apiClient.getMessages(conversationId);
      set({ messages });
    } catch (error) {
      console.error('Error loading messages:', error);
      throw error;
    }
  },

  sendMessage: async (content: string) => {
    // Clear any previous errors
    set({ error: null });
    
    // If no conversation is selected, create a new one
    if (!get().currentConversationId) {
      await get().createConversation();
    }
    
    const conversationId = get().currentConversationId!;
    
    // Add user message to local state immediately
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    set(state => ({
      messages: [...state.messages, userMessage],
      isProcessing: true
    }));
    
    try {
      // Send message to API
      const response = await apiClient.sendMessage(conversationId, content);
      
      // Handle different response types
      if (response.type === 'parameters_needed') {
        // We need additional parameters
        set({ 
          parametersNeeded: response.data,
          isProcessing: false
        });
      } else if (response.type === 'message') {
        // We received a response message
        const assistantMessage: Message = response.data;
        
        set(state => ({
          messages: [...state.messages, assistantMessage],
          isProcessing: false
        }));
        
        // Update conversation list to reflect the new message
        await get().loadConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to process your message',
        isProcessing: false
      });
    }
  },

  sendAgentParameters: async (agentId: string, parameters: Record<string, any>) => {
    set({ 
      isProcessing: true,
      parametersNeeded: null, // Clear the parameters request
      error: null // Clear any previous errors
    });
    
    try {
      const conversationId = get().currentConversationId!;
      
      // Send parameters to API
      const response = await apiClient.sendParameters(conversationId, agentId, parameters);
      
      // Add the assistant's response to the messages
      if (response.type === 'message') {
        const assistantMessage: Message = response.data;
        
        set(state => ({
          messages: [...state.messages, assistantMessage],
          isProcessing: false
        }));
        
        // Refresh the conversation list
        await get().loadConversations();
      }
    } catch (error) {
      console.error('Error sending parameters:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to process your request',
        isProcessing: false 
      });
    }
  },

  clearParametersNeeded: () => {
    set({ parametersNeeded: null });
  },

  setError: (error: string | null) => {
    set({ error });
  }
})); 