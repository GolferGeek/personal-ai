"use client";

import React, { useState, KeyboardEvent } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export interface TextInputButtonProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * A text input with a send button for sending messages
 */
export const TextInputButton: React.FC<TextInputButtonProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        multiline
        maxRows={4}
        disabled={isLoading || disabled}
        sx={{ flexGrow: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={
          isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SendIcon />
          )
        }
        onClick={handleSend}
        disabled={!message.trim() || isLoading || disabled}
      >
        Send
      </Button>
    </Box>
  );
};
