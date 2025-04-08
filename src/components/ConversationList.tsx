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
  Paper 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useConversationStore } from '../store/conversationStore';
import { Conversation } from '../models/conversation';

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation,
  onNewConversation
}) => {
  const { conversations, isLoadingConversations } = useConversationStore();

  // Format date to relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  // Generate placeholder title from first message
  const generatePlaceholderTitle = (text: string, maxLength: number = 30) => {
    if (!text) return 'New Conversation';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
        >
          New Conversation
        </Button>
      </Box>
      
      <Divider />
      
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {isLoadingConversations ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Loading conversations...
            </Typography>
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No conversations yet
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {conversations.map((conversation: Conversation) => {
              // Get first message content to use as fallback title
              const firstUserMessage = conversation.messages?.find(m => m.role === 'user');
              const title = conversation.title || 
                (firstUserMessage 
                  ? generatePlaceholderTitle(firstUserMessage.content)
                  : 'New Conversation');
              
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
                      secondary={formatRelativeTime(conversation.lastUpdated)}
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
        )}
      </Box>
    </Paper>
  );
};

export default ConversationList; 