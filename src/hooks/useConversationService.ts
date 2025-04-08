'use client';

import { useConversationStore } from '../store/conversationStore';
import { useCallback } from 'react';
import apiClient, { Response, MessageResponse } from '../api/apiClient';

/**
 * Hook that provides conversation service functionality
 * This acts as a service layer between the UI and the API
 * 
 * Note: UI components subscribe to the store directly via useConversationStore
 * and will automatically update when the store changes.
 */
export const useConversationService = (conversationId: string | null) => {
  const store = useConversationStore();
  
  /**
   * Send a user message and handle the response
   * 
   * Flow:
   * 1. Store adds local user message to UI via store.addLocalUserMessage
   * 2. Service calls API and awaits complete response (including assistant's response)
   * 3. UI components update automatically via subscription to store
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return null;
    
    try {
      console.log('Sending message and awaiting response...');
      
      // Set processing state
      store.setProcessing(true);
      
      // Send message to API - using the synchronous endpoint
      // The store will handle adding both messages from the response
      await store.sendMessage(content);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      store.setError(error instanceof Error ? error.message : 'Error sending message');
      return null;
    } finally {
      store.setProcessing(false);
    }
  }, [conversationId, store]);
  
  /**
   * Send agent parameters and handle the response
   * 
   * Flow:
   * 1. Service calls API with parameters and awaits complete response
   * 2. UI components update automatically via subscription to store
   */
  const sendAgentParameters = useCallback(async (agentId: string, parameters: Record<string, any>) => {
    if (!conversationId) return null;
    
    try {
      console.log('Sending parameters and awaiting response...');
      
      // Set processing state
      store.setProcessing(true);
      
      // Send parameters to API - the API should wait for the complete response
      await store.sendAgentParameters(agentId, parameters);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending parameters:', error);
      store.setError(error instanceof Error ? error.message : 'Error sending parameters');
      return null;
    } finally {
      store.setProcessing(false);
    }
  }, [conversationId, store]);
  
  /**
   * Type guard to check if a response is a MessageResponse
   */
  function isMessageResponse(response: Response): response is MessageResponse {
    return response.type === 'message' && 'data' in response;
  }
  
  /**
   * Create a new conversation
   */
  const createConversation = useCallback(async () => {
    try {
      return await store.createConversation();
    } catch (error) {
      console.error('Error creating conversation:', error);
      store.setError(error instanceof Error ? error.message : 'Error creating conversation');
      return null;
    }
  }, [store]);
  
  /**
   * Select a conversation
   */
  const selectConversation = useCallback((id: string) => {
    store.selectConversation(id);
  }, [store]);
  
  return {
    // Actions
    sendMessage,
    sendAgentParameters,
    createConversation,
    selectConversation,
    
    // States from the store
    isProcessing: store.isProcessing,
    error: store.error,
    parametersNeeded: store.parametersNeeded,
    clearParametersNeeded: store.clearParametersNeeded,
    setError: store.setError
  };
}; 