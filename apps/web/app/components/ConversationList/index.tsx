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
  CircularProgress,
  Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import { Conversation } from '@personal-ai/models';
import { formatRelativeTime, getConversationTimestamp, getConversationTitle } from '@personal-ai/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  conversations: Conversation[];
  isLoading: boolean;
}

/**
 * ConversationList component displays a list of conversations and allows the user to select or create a new one.
 */
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
    if (isLoading) {
      return Array(3).fill(0).map((_, index) => (
        <ListItem key={`skeleton-${index}`} disablePadding>
          <ListItemButton>
            <ListItemText 
              primary={<Skeleton width="80%" />} 
              secondary={<Skeleton width="40%" />} 
            />
          </ListItemButton>
        </ListItem>
      ));
    }
    
    if (!conversations || conversations.length === 0) {
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
              >
                <ListItemText 
                  primary={title}
                  secondary={timestamp}
                  primaryTypographyProps={{
                    noWrap: true,
                    style: { fontWeight: selectedConversationId === conversation.id ? 500 : 400 }
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
      sx={{ 
        width: 300, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        boxShadow: 1
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Conversations</Typography>
          <Button 
            size="small"
            startIcon={<AddIcon />}
            onClick={onNewConversation}
          >
            New
          </Button>
        </Box>
      </Box>
      
      {/* Conversation List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {isLoading ? renderLoadingState() : renderConversationItems()}
      </Box>
    </Paper>
  );
};

export default ConversationList; 