'use client';

import React from 'react';
import { Alert, AlertTitle, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ErrorDisplayProps {
  errorMessage: string;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  errorMessage,
  onDismiss
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity="error"
        action={
          onDismiss && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onDismiss}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
      >
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay; 