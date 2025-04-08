import React from 'react';
import { Box, Typography } from '@mui/material';
import { Message } from '../store/conversationStore';

interface ConversationDisplayProps {
  messages: Message[];
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ messages }) => {
  // TODO: Add logic to display conversation history based on messages prop

  return (
    <Box sx={{ flexGrow: 1, border: '1px solid grey', p: 2, mb: 2, overflowY: 'auto', minHeight: '300px' }}>
      {messages.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Conversation will appear here...
        </Typography>
      ) : (
        messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              my: 1,
              p: 1,
              bgcolor: msg.sender === 'user' ? 'grey.200' : 'primary.light',
              borderRadius: 1,
              textAlign: msg.sender === 'user' ? 'right' : 'left',
            }}
          >
            <Typography variant="caption" display="block" color="text.secondary">
              {msg.sender} - {msg.timestamp.toLocaleTimeString()}
            </Typography>
            <Typography variant="body2">{msg.text}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ConversationDisplay; 