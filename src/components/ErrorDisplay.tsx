'use client';

import React from 'react';
import { Alert, AlertTitle, Box, Collapse } from '@mui/material';

interface ErrorDisplayProps {
  errorMessage: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  return (
    <Collapse in={!!errorMessage}>
      <Box sx={{ mb: 2 }}>
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      </Box>
    </Collapse>
  );
};

export default ErrorDisplay; 