'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Personal AI Assistant
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to your personal AI assistant. Use the navigation to access conversations and features.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Start a Conversation
              </Typography>
              <Typography variant="body2">
                Create a new conversation with your AI assistant to ask questions, get information, or just chat.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Use Tools & Agents
              </Typography>
              <Typography variant="body2">
                Access specialized AI agents for specific tasks like data analysis, summarization, and more.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 