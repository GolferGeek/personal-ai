"use client";

import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";

export interface ErrorDisplayProps {
  errorMessage: string;
  title?: string;
}

/**
 * Component to display error messages in a standardized way
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errorMessage,
  title = "Error",
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
};
