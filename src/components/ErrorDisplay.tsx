import React from 'react';
import { Box, Alert, AlertTitle } from '@mui/material';

interface ErrorDisplayProps {
  errorMessage: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  if (!errorMessage) {
    return null; // Don't render anything if there's no error
  }

  return (
    <Box sx={{ mb: 2, minHeight: '50px' }}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay; 