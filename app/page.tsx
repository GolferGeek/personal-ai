'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Home() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      p: 4
    }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Personal AI
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Welcome to your personal AI interface
      </Typography>
      <Typography variant="body1" sx={{ mt: 4 }}>
        Your NestJS server should be running at{' '}
        <Link href="http://localhost:3001" target="_blank" rel="noopener">
          http://localhost:3001
        </Link>
      </Typography>
    </Box>
  );
} 