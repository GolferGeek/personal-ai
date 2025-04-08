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
import { Conversation } from '../models/conversation';

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
  // Format date to relative time
  const formatRelativeTime = (timestamp: number | string | Date): string => {
    // Convert to timestamp if needed
    let timeMs: number;
    
    try {
      if (typeof timestamp === 'string') {
        timeMs = new Date(timestamp).getTime();
      } else if (timestamp instanceof Date) {
        timeMs = timestamp.getTime();
      } else {
        timeMs = timestamp;
      }
      
      // Handle invalid dates
      if (isNaN(timeMs)) {
        return 'Recently';
      }
      
      const now = Date.now();
      const diff = now - timeMs;
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        return days === 1 ? 'Yesterday' : `${days}d ago`;
      } else if (hours > 0) {
        return `${hours}h ago`;
      } else if (minutes > 0) {
        return `${minutes}m ago`;
      } else {
        return 'Just now';
      }
    } catch {
      // Handle any unexpected errors in date formatting
      return 'Recently';
    }
  };

  // Find the most relevant timestamp for a conversation
  const getConversationTimestamp = (conversation: Conversation): number => {
    try {
      // Try different properties in order of preference
      if (conversation?.lastUpdated) {
        return conversation.lastUpdated;
      }
      
      if (conversation?.updatedAt) {
        return new Date(conversation.updatedAt).getTime();
      }
      
      if (conversation?.createdAt) {
        return new Date(conversation.createdAt).getTime();
      }
      
      // Fall back to now
      return Date.now();
    } catch {
      // Handle any unexpected errors
      return Date.now();
    }
  };

  // Generate conversation title
  const getConversationTitle = (conversation: Conversation): string => {
    try {
      // If we have a title, use it
      if (conversation?.title) {
        return conversation.title;
      }
      
      // Try to find first user message to use as title
      if (conversation?.messages && conversation.messages.length > 0) {
        const firstUserMessage = conversation.messages.find(m => m.role === 'user');
        if (firstUserMessage?.content) {
          const content = firstUserMessage.content.trim();
          // Truncate if too long
          return content.length > 30 ? `${content.substring(0, 30)}...` : content;
        }
      }
      
      // Default fallback
      return 'New Conversation';
    } catch {
      // Handle any unexpected errors
      return 'New Conversation';
    }
  };

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