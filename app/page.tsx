'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
import ConversationList from '../src/components/ConversationList';
import ConversationDisplay from '../src/components/ConversationDisplay';
import { DynamicForm } from '../src/components/DynamicForm';
import ErrorDisplay from '../src/components/ErrorDisplay';
import TextInputButton from '../src/components/TextInputButton';
import { useConversationStore } from '../src/store/conversationStore';
import { useConversations } from '../src/hooks/useConversations';
import { useConversationService } from '../src/hooks/useConversationService';

export default function Home() {
  const store = useConversationStore();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use React Query hook for conversations list
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations();
  
  // Use our service hook for all conversation interactions
  const conversationService = useConversationService(currentConversationId);
  
  // Update the current conversation ID when the store's ID changes
  useEffect(() => {
    setCurrentConversationId(store.currentConversationId);
  }, [store.currentConversationId]);
  
  // Initialize conversations if needed
  useEffect(() => {
    // If we have conversations but none is selected, select the first one
    if (conversations.length > 0 && !currentConversationId) {
      const firstConversation = conversations[0];
      console.log('Auto-selecting first conversation:', firstConversation.id);
      conversationService.selectConversation(firstConversation.id);
    } 
    // If we have no conversations, create a new one
    else if (conversations.length === 0 && !isLoadingConversations) {
      console.log('No conversations found, creating new conversation');
      conversationService.createConversation()
        .then((newId: string | null) => {
          if (newId) {
            console.log('Created new conversation:', newId);
          } else {
            console.error('Failed to create new conversation');
          }
        });
    }
  }, [conversations, currentConversationId, isLoadingConversations, conversationService]);

  // Debug the store state
  useEffect(() => {
    console.log('Current store messages:', store.messages);
  }, [store.messages]);

  // Update error state from service
  useEffect(() => {
    if (conversationService.error) {
      setError(conversationService.error);
    }
  }, [conversationService.error]);

  const handleSendMessage = async (message: string) => {
    // Store the pending message
    setPendingMessage(message);
    
    // Add the message locally first for immediate UI feedback
    store.addLocalUserMessage(message);
    
    try {
      // Send the message using the synchronous endpoint
      const response = await conversationService.sendMessage(message);
      console.log('Synchronous response received:', response);
    } catch (err) {
      setError(`Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      // Clear the pending message state
      setPendingMessage(null);
    }
  };

  const handleFormSubmit = async (agentId: string, formData: Record<string, any>) => {
    await conversationService.sendAgentParameters(agentId, formData);
  };

  // Selecting a conversation
  const handleSelectConversation = (newId: string) => {
    conversationService.selectConversation(newId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal AI
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Conversation List */}
        <ConversationList
          selectedConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={() => conversationService.createConversation()}
          conversations={conversations}
          isLoading={isLoadingConversations}
        />

        {/* Main Chat Area */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flexGrow: 1,
          p: 2,
          height: '100%',
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 64px)' // 64px is the AppBar height
        }}>
          {/* Error Display */}
          {error && (
            <ErrorDisplay errorMessage={error} onDismiss={() => setError(null)} />
          )}

          {/* Parameters Form */}
          {conversationService.parametersNeeded && (
            <DynamicForm
              parametersNeeded={conversationService.parametersNeeded}
              onSubmit={handleFormSubmit}
              onCancel={conversationService.clearParametersNeeded}
              isLoading={conversationService.isProcessing}
            />
          )}

          {/* Conversation Messages */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2 }}>
            <ConversationDisplay 
              messages={store.messages} 
              isLoading={!!pendingMessage || conversationService.isProcessing}
            />
          </Box>
          
          {/* Message Input */}
          <Box sx={{ pb: 2 }}>
            <TextInputButton
              isLoading={!!pendingMessage || conversationService.isProcessing}
              onSendMessage={handleSendMessage}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 