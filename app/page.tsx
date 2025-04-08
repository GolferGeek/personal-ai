'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Paper, AppBar, Toolbar, Container, Divider } from '@mui/material';
import ConversationList from '../src/components/ConversationList';
import ConversationDisplay from '../src/components/ConversationDisplay';
import VoiceInputButton from '../src/components/VoiceInputButton';
import ErrorDisplay from '../src/components/ErrorDisplay';
import DynamicForm from '../src/components/DynamicForm';
import { useConversationStore } from '../src/store/conversationStore';

export default function Home() {
  const store = useConversationStore();

  // Load conversations on initial load
  useEffect(() => {
    store.loadConversations();
  }, []);

  // Add polling for messages when conversation changes
  useEffect(() => {
    if (!store.currentConversationId) return;
    
    console.log('Starting polling for conversation:', store.currentConversationId);
    const stopPolling = store.startPollingMessages(store.currentConversationId);
    
    // Clean up polling on unmount or when conversation changes
    return () => {
      console.log('Stopping polling');
      stopPolling();
    };
  }, [store.currentConversationId]);

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
          selectedConversationId={store.currentConversationId}
          onSelectConversation={store.selectConversation}
          onNewConversation={() => store.createConversation()}
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
              messages={store.messages} 
              isLoading={store.isLoadingMessages || store.isProcessing}
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