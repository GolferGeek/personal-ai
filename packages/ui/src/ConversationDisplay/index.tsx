"use client";

import React from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { Message } from "@personal-ai/models";

export interface ConversationDisplayProps {
  messages: Message[];
  isLoading?: boolean;
}

/**
 * Displays a conversation with messages from the user and assistant
 */
export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  isLoading = false,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Start a new conversation
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                mb: 2,
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor:
                    message.role === "user" ? "#e3f2fd" : "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Typography>{message.content}</Typography>
              </Paper>
            </Box>
          ))
        )}

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};
