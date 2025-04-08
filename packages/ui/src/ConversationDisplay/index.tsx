import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { Message } from '@personal-ai/models';
import { formatTimestamp } from '@personal-ai/utils';

export interface ConversationDisplayProps {
  messages: Message[];
  isLoading?: boolean;
}

/**
 * Component to display conversation messages
 */
const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  isLoading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Log for debugging
  console.log('ConversationDisplay received messages:', messages);
  console.log('ConversationDisplay isLoading:', isLoading);

  // If no messages and not loading, show empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          Start a new conversation or select an existing one
        </Typography>
      </Box>
    );
  }

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        height: '100%',
        overflow: 'auto',
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 2,
              backgroundColor: message.role === 'user' ? 'primary.light' : 'background.paper',
              color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
            {message.timestamp && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                {formatTimestamp(message.timestamp)}
              </Typography>
            )}
          </Paper>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ConversationDisplay; 