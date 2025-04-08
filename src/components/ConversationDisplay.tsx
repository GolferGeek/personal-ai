'use client';

import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { Message } from '../models/conversation';

interface ConversationDisplayProps {
  messages: Message[];
  isLoading: boolean;
  pendingMessage: string | null;
  sendMessage: (message: string) => Promise<any>;
  setPendingMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// Helper function to format a timestamp
const formatTimestamp = (timestamp: number | string | Date | undefined): string => {
  if (!timestamp) return '';
  
  try {
    // Convert to date if it's a number or string
    const date = typeof timestamp === 'number' || typeof timestamp === 'string' 
      ? new Date(timestamp) 
      : timestamp;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''; // Return empty string for invalid dates
    }
    
    // Format the time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ 
  messages, 
  isLoading,
  pendingMessage,
  sendMessage,
  setPendingMessage,
  setError
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug received props
  useEffect(() => {
    console.log('ConversationDisplay received messages:', messages);
    console.log('ConversationDisplay isLoading:', isLoading);
  }, [messages, isLoading]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (pendingMessage) {
      // Use the synchronous endpoint via the store's sendMessage function
      sendMessage(pendingMessage).then((response) => {
        console.log('Synchronous response received:', response);
        
        // Clear pending message after receiving response
        setPendingMessage(null);
        
        // If we're using scroll, update the position
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }).catch((error) => {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
        setPendingMessage(null);
      });
    }
  }, [pendingMessage, sendMessage]);

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
              key={message.id || index}
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
                {message.timestamp && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {formatTimestamp(message.timestamp)}
                  </Typography>
                )}
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