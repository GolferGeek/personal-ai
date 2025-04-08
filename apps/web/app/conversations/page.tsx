'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
import { ConversationList } from '@personal-ai/ui';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useRouter } from 'next/navigation';

/**
 * Conversations page that displays the list of conversations
 */
export default function ConversationsPage() {
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConversations([
        {
          id: '1',
          title: 'First Conversation',
          lastUpdated: Date.now() - 1000 * 60 * 5, // 5 minutes ago
        },
        {
          id: '2',
          title: 'AI Discussion',
          lastUpdated: Date.now() - 1000 * 60 * 60, // 1 hour ago
        },
        {
          id: '3',
          title: 'Project Planning',
          lastUpdated: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    router.push(`/conversations/${id}`);
  };

  const handleNewConversation = () => {
    // In a real app, this would create a new conversation and redirect
    console.log('Creating new conversation');
    // For now, just redirect to a placeholder
    router.push('/conversations/new');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <SmartToyIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal AI - Conversations
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <ConversationList
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          conversations={conversations}
          isLoading={isLoading}
        />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flexGrow: 1,
          p: 4,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="h4" gutterBottom>
            Select a conversation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a conversation from the list or start a new one
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 