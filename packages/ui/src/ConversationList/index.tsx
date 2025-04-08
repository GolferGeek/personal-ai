"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Conversation } from "@personal-ai/models";

export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading = false,
}) => {
  return (
    <Box
      sx={{
        width: 250,
        borderRight: "1px solid #e0e0e0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onNewConversation}
          disabled={isLoading}
        >
          New Conversation
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
          <CircularProgress size={30} />
        </Box>
      ) : conversations.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No conversations yet
          </Typography>
        </Box>
      ) : (
        <List sx={{ overflow: "auto", flexGrow: 1 }}>
          {conversations.map((conversation) => (
            <ListItem key={conversation.id} disablePadding>
              <ListItemButton
                selected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <ListItemText
                  primary={conversation.title || "New Conversation"}
                  primaryTypographyProps={{
                    noWrap: true,
                    style: {
                      fontWeight:
                        selectedConversationId === conversation.id
                          ? "bold"
                          : "normal",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
