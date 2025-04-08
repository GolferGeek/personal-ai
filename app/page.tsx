'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
import ConversationList from '../src/components/ConversationList';
import ConversationDisplay from '../src/components/ConversationDisplay';
import VoiceInputButton from '../src/components/VoiceInputButton';
import ErrorDisplay from '../src/components/ErrorDisplay';
import DynamicForm from '../src/components/DynamicForm';
import { useConversationStore } from '../src/store/conversationStore';
import { useMessages } from '../src/hooks/useMessages';
import { useConversations } from '../src/hooks/useConversations';
import { useQueryClient } from '@tanstack/react-query';

export default function Home() {
  const store = useConversationStore();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Use React Query hooks for data fetching
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations();
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
    refetch: refetchMessages
  } = useMessages(currentConversationId);
  
  // Track if we've refetched messages after a new message is sent
  const [needsRefetch, setNeedsRefetch] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  
  // Update the current conversation ID when the store's ID changes
  useEffect(() => {
    setCurrentConversationId(store.currentConversationId);
  }, [store.currentConversationId]);
  
  // Manually refetch messages when needed (after sending a message)
  useEffect(() => {
    // Only refetch if we have a message to fetch and we're not already refetching
    if (needsRefetch && !isRefetching && currentConversationId && !store.isProcessing) {
      const doRefetch = async () => {
        setIsRefetching(true);
        await refetchMessages();
        setNeedsRefetch(false);
        setIsRefetching(false);
      };
      
      // Wait a bit to ensure the backend has had time to process
      const timer = setTimeout(() => {
        doRefetch();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [needsRefetch, isRefetching, currentConversationId, store.isProcessing, refetchMessages]);
  
  // Initialize conversations if needed
  useEffect(() => {
    // If we have conversations but none is selected, select the first one
    if (conversations.length > 0 && !currentConversationId) {
      const firstConversation = conversations[0];
      console.log('Auto-selecting first conversation:', firstConversation.id);
      store.selectConversation(firstConversation.id);
    } 
    // If we have no conversations, create a new one
    else if (conversations.length === 0 && !isLoadingConversations) {
      console.log('No conversations found, creating new conversation');
      store.createConversation()
        .then(newId => {
          if (newId) {
            console.log('Created new conversation:', newId);
          } else {
            console.error('Failed to create new conversation');
          }
        });
    }
  }, [conversations, currentConversationId, isLoadingConversations, store]);

  const handleVoiceTranscript = async (transcript: string) => {
    console.log('Voice transcript:', transcript);
    
    // Add user message to the UI immediately to avoid duplication
    const userMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: transcript,
      timestamp: Date.now()
    };
    
    // Manually update messages array to include the new message
    queryClient.setQueryData(['messages', currentConversationId], 
      (old: any) => [...(old || []), userMessage]);
    
    // Send the message
    await store.sendMessage(transcript);
    
    // Schedule a refetch to get the assistant's response
    setNeedsRefetch(true);
  };

  const handleFormSubmit = async (agentId: string, formData: Record<string, any>) => {
    console.log('Form submitted:', agentId, formData);
    await store.sendAgentParameters(agentId, formData);
    
    // Schedule a refetch to get the assistant's response
    setNeedsRefetch(true);
  };

  // Compute actual loading state to avoid spinner staying forever
  const isActuallyLoading = isLoadingMessages || 
                           (isRefetching && needsRefetch) || 
                           store.isProcessing;

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
          onSelectConversation={store.selectConversation}
          onNewConversation={() => store.createConversation()}
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
          {store.error && <ErrorDisplay errorMessage={store.error} />}

          {/* Parameters Form */}
          {store.parametersNeeded && (
            <DynamicForm
              parametersNeeded={store.parametersNeeded}
              onSubmit={handleFormSubmit}
              onCancel={store.clearParametersNeeded}
              isLoading={store.isProcessing}
            />
          )}

          {/* Conversation Messages */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2 }}>
            <ConversationDisplay 
              messages={messages} 
              isLoading={isActuallyLoading}
            />
          </Box>

          {/* Voice Input Button */}
          <Box sx={{ pb: 2 }}>
            <VoiceInputButton
              isLoading={isActuallyLoading}
              onTranscript={handleVoiceTranscript}
              onError={store.setError}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 