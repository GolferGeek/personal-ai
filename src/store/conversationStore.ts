'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, ParametersNeededState } from '../models/conversation';
import apiClient, { Response as ApiResponse } from '../api/apiClient';

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
  createConversation: () => Promise<string | null>;
  selectConversation: (id: string) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<ApiResponse | null>;
  sendAgentParameters: (agentId: string, parameters: Record<string, any>) => Promise<ApiResponse | null>;
  clearParametersNeeded: () => void;
  setError: (error: string | null) => void;
  setMessages: (messages: Message[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  addMessage: (message: Message) => void;
  addLocalUserMessage: (content: string) => void;
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
      set({ isProcessing: true });
      
      console.log('Creating new conversation...');
      const newConversation = await apiClient.createConversation();
      console.log('Conversation created successfully:', newConversation);
      
      // Add to conversations and select it
      set(state => ({ 
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newConversation.id,
        messages: [],
        isProcessing: false
      }));
      
      return newConversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create conversation',
        isProcessing: false
      });
      return null;
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
    set({ isLoadingConversations: true, error: null });
    
    try {
      console.log('Loading conversations...');
      const conversations = await apiClient.getConversations();
      console.log('Conversations loaded:', conversations);
      
      set({ conversations });
      
      // If there are conversations and none is selected, select the first one
      if (conversations.length > 0 && !get().currentConversationId) {
        console.log('Auto-selecting first conversation:', conversations[0].id);
        get().selectConversation(conversations[0].id);
      } else if (conversations.length === 0) {
        // Create a new conversation if none exist
        console.log('No conversations found, creating new conversation');
        get().createConversation()
          .then(newId => {
            if (newId) {
              console.log('Created new conversation:', newId);
            } else {
              console.error('Failed to create new conversation');
            }
          })
          .catch(err => {
            console.error('Error creating conversation:', err);
          });
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      set({ 
        error: 'Failed to load conversations',
        isLoadingConversations: false
      });
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
    // Clear any previous errors and set loading state
    set({ error: null, isProcessing: true });
    
    try {
      // If no conversation is selected, create a new one first
      let conversationId = get().currentConversationId;
      if (!conversationId) {
        console.log('No conversation selected, creating new one before sending message');
        
        try {
          // Create a new conversation first
          const newId = await get().createConversation();
          if (!newId) {
            set({ error: 'Failed to create a conversation before sending message' });
            return null;
          }
          
          conversationId = newId;
          console.log('Created new conversation for message:', conversationId);
        } catch (error) {
          set({ error: 'Failed to create a conversation before sending message' });
          return null;
        }
      }
      
      // Add user message to the UI immediately (optimistic update)
      get().addLocalUserMessage(content);
      
      console.log(`Sending message to conversation ${conversationId} using sync endpoint:`, content);
      
      // Send the message using the synchronous endpoint
      const apiResponse = await apiClient.sendMessage(conversationId, content);
      
      console.log('Response from synchronous API:', apiResponse);
      
      // Handle response - make sure it exists before accessing properties
      if (apiResponse) {
        if (apiResponse.type === 'parameters_needed') {
          console.log('Parameters needed response received:', apiResponse.data);
          // We need additional parameters
          set({ parametersNeeded: apiResponse.data });
        } else if (apiResponse.type === 'message') {
          console.log('Message response received, adding to store:', apiResponse.data);
          // Add the assistant's response to the store
          get().addMessage(apiResponse.data);
        } else {
          // Check for the new synchronous response format that includes both messages
          const syncResponse = apiResponse as unknown as { userMessage?: Message; assistantMessage?: Message };
          if (syncResponse.assistantMessage) {
            console.log('Synchronous assistant message received:', syncResponse.assistantMessage);
            // Add the assistant's response to the store
            get().addMessage(syncResponse.assistantMessage);
          } else {
            console.warn('Unexpected response format:', apiResponse);
          }
        }
      } else {
        console.warn('No response received from API');
      }
      
      return apiResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      set({ error: 'Failed to send message. Please try again.' });
      return null;
    } finally {
      set({ isProcessing: false });
    }
  },

  sendAgentParameters: async (agentId: string, parameters: Record<string, any>) => {
    // Clear any previous errors and set loading state
    set({ error: null, isProcessing: true, parametersNeeded: null });
    
    try {
      // Need a conversation ID
      const conversationId = get().currentConversationId;
      if (!conversationId) {
        set({ error: 'No conversation selected' });
        return null;
      }
      
      console.log(`Sending parameters to agent ${agentId}:`, parameters);
      const apiResponse = await apiClient.sendParameters(conversationId, agentId, parameters);
      
      // Handle response - make sure it exists before accessing properties
      if (apiResponse) {
        // Type checking to satisfy TypeScript
        const responseWithType = apiResponse as { type?: string; data?: any };
        
        if (responseWithType.type === 'parameters_needed') {
          // We still need more parameters
          set({ parametersNeeded: responseWithType.data });
        } else if (responseWithType.type === 'message') {
          // Add the assistant's response to the store
          get().addMessage(responseWithType.data);
        } else {
          console.warn('Unexpected response type:', responseWithType.type);
        }
      } else {
        console.warn('No response received from API');
      }
      
      return apiResponse; 
    } catch (error) {
      console.error('Error sending parameters:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to process your request' });
      return null;
    } finally {
      // Always clear the loading state regardless of success or failure
      set({ isProcessing: false });
    }
  },

  clearParametersNeeded: () => {
    set({ parametersNeeded: null });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setMessages: (messages: Message[]) => {
    set({ messages });
  },
  
  setProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },
  
  /**
   * Add a message to the store without creating duplicates
   */
  addMessage: (message: Message) => {
    console.log('Attempting to add message to store:', message);
    
    set(state => {
      // Check if message with this ID already exists
      const idMatch = state.messages.some(m => 
        m.id !== undefined && message.id !== undefined && m.id === message.id
      );
      if (idMatch) {
        console.log('Message with same ID already exists, skipping:', message.id);
        return state;
      }
      
      // Check for content-based duplicates
      const contentMatch = state.messages.some(m => 
        m.role === message.role && 
        m.content === message.content &&
        // Only consider recent messages as potential duplicates
        (Date.now() - (m.timestamp || 0) < 10000)
      );
      if (contentMatch) {
        console.log('Content-based duplicate detected, skipping:', message.content);
        return state;
      }
      
      // Replace temporary local messages with server versions
      if (message.role === 'user' && message.id && !message.id.startsWith('local-')) {
        const tempIndex = state.messages.findIndex(m => 
          m.role === 'user' && 
          m.content === message.content && 
          m.id && m.id.startsWith('local-')
        );
        
        if (tempIndex >= 0) {
          console.log('Replacing temporary message with server version:', message.id);
          // Replace the temporary message
          const newMessages = [...state.messages];
          newMessages[tempIndex] = message;
          return { ...state, messages: newMessages };
        }
      }
      
      // Just append the new message
      console.log('Adding new message to store:', message);
      return { ...state, messages: [...state.messages, message] };
    });
  },
  
  /**
   * Add a local user message immediately, then update after API response
   */
  addLocalUserMessage: (content: string) => {
    // Create temporary message with local ID
    const tempUserMessage: Message = {
      id: `local-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    // Add to messages
    get().addMessage(tempUserMessage);
  }
})); 