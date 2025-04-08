'use client';

import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';

export default function TestSyncPage() {
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState('test-conversation-123');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Make request to the sync endpoint
      const url = `/api/conversations/${conversationId}/messages/sync`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'test-user'
        },
        body: JSON.stringify({
          content: message,
          role: 'user'
        })
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error('Error testing sync endpoint:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Synchronous Messaging Endpoint
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Conversation ID"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            required
          />
          
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            margin="normal"
            required
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Paper>
      
      {error && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'error.main', color: 'error.contrastText' }}>
          <Typography variant="h6">Error</Typography>
          <Typography>{error}</Typography>
        </Paper>
      )}
      
      {response && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Response</Typography>
          
          {response.userMessage && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">User Message:</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography>{response.userMessage.content}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  ID: {response.userMessage.id}
                </Typography>
              </Paper>
            </Box>
          )}
          
          {response.assistantMessage && (
            <Box>
              <Typography variant="subtitle1">Assistant Response:</Typography>
              <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography>{response.assistantMessage.content}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  ID: {response.assistantMessage.id}
                </Typography>
              </Paper>
            </Box>
          )}
          
          <Typography variant="subtitle2" sx={{ mt: 3 }}>Raw Response:</Typography>
          <Paper 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.900', 
              color: 'grey.100',
              maxHeight: '200px',
              overflow: 'auto'
            }}
          >
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </Paper>
        </Paper>
      )}
    </Container>
  );
} 