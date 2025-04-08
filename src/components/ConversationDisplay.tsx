'use client';

import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Divider } from '@mui/material';
import { Message } from '../models/conversation';

interface ConversationDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ 
  messages, 
  isLoading 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Paper 
      sx={{ 
        height: '100%', 
        p: 2, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {messages.length === 0 && !isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            Start a new conversation or select an existing one
          </Typography>
        </Box>
      ) : (
        <>
          {messages.map((message, index) => (
            <Box 
              key={index}
              sx={{ 
                mb: 2, 
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: message.role === 'user' ? 'primary.light' : 'background.paper',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1">
                  {message.content}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}
          
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </Paper>
  );
};

export default ConversationDisplay; 