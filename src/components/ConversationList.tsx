'use client';

import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  Divider, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import { Conversation } from '@personal-ai/models';
import { formatRelativeTime, getConversationTimestamp, getConversationTitle } from '@personal-ai/utils';

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  conversations: Conversation[];
  isLoading: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  conversations,
  isLoading
}) => {
  // Render empty state
  const renderEmptyState = () => (
    <Box 
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary'
      }}
    >
      <ChatIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
      <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
        No conversations yet
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
        Start a new conversation to begin
      </Typography>
      <Button 
        variant="outlined" 
        startIcon={<AddIcon />} 
        onClick={onNewConversation}
      >
        New Conversation
      </Button>
    </Box>
  );

  // Render loading state
  const renderLoadingState = () => (
    <Box 
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Loading conversations...
      </Typography>
    </Box>
  );

  // Render conversation list items
  const renderConversationItems = () => {
    if (!Array.isArray(conversations) || conversations.length === 0) {
      return renderEmptyState();
    }
    
    return (
      <List disablePadding>
        {conversations.map((conversation: Conversation) => {
          if (!conversation || !conversation.id) {
            return null; // Skip invalid conversations
          }
          
          // Get the conversation title and timestamp
          const title = getConversationTitle(conversation);
          const timestamp = getConversationTimestamp(conversation);
          
          return (
            <ListItem key={conversation.id} disablePadding divider>
              <ListItemButton 
                selected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                sx={{ 
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected'
                  }
                }}
                aria-selected={selectedConversationId === conversation.id}
              >
                <ListItemText 
                  primary={title}
                  secondary={formatRelativeTime(timestamp)}
                  primaryTypographyProps={{
                    noWrap: true,
                    style: { fontWeight: selectedConversationId === conversation.id ? 600 : 400 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: 300, 
        borderRight: 1, 
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Conversations</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onNewConversation}
          fullWidth
          disabled={isLoading}
        >
          New Conversation
        </Button>
      </Box>
      
      <Divider />
      
      <Box sx={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {isLoading ? renderLoadingState() : renderConversationItems()}
      </Box>
    </Paper>
  );
};

export default ConversationList; 