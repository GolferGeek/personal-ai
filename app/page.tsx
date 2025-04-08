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

export default function Home() {
  const store = useConversationStore();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Use React Query hooks for data fetching
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations();
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages 
  } = useMessages(currentConversationId);
  
  // Update the current conversation ID when the store's ID changes
  useEffect(() => {
    setCurrentConversationId(store.currentConversationId);
  }, [store.currentConversationId]);
  
  // Update the store's messages when React Query fetches new messages
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      // Update store messages only if they differ
      const currentMessages = store.messages;
      const messagesChanged = 
        messages.length !== currentMessages.length || 
        (messages.length > 0 && currentMessages.length > 0 && 
         messages[messages.length - 1].id !== currentMessages[currentMessages.length - 1].id);
      
      if (messagesChanged) {
        console.log('Updating store with new messages from React Query');
        // Just update the store's messages without triggering a load
        store.messages = messages;
      }
    }
  }, [messages, currentConversationId, store]);
  
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

  const handleVoiceTranscript = (transcript: string) => {
    console.log('Voice transcript:', transcript);
    store.sendMessage(transcript);
  };

  const handleFormSubmit = (agentId: string, formData: Record<string, any>) => {
    console.log('Form submitted:', agentId, formData);
    store.sendAgentParameters(agentId, formData);
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
              isLoading={isLoadingMessages || isFetchingMessages || store.isProcessing}
            />
          </Box>

          {/* Voice Input Button */}
          <Box sx={{ pb: 2 }}>
            <VoiceInputButton
              isLoading={store.isProcessing}
              onTranscript={handleVoiceTranscript}
              onError={store.setError}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 