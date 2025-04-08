"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import {
  ConversationList,
  ConversationDisplay,
  DynamicForm,
  ErrorDisplay,
  TextInputButton,
} from "@personal-ai/ui";
import { Conversation, Message, AgentParameter } from "@personal-ai/models";
import { ApiClient } from "./utils/api-client";

/**
 * Home page for the Personal AI application
 */
export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parametersNeeded, setParametersNeeded] = useState<{
    agentId: string;
    parameters: AgentParameter[];
  } | null>(null);

  // Load conversations on initial render
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const data = await ApiClient.getConversations();
        setConversations(data);

        // If we have conversations but none is selected, select the first one
        if (data.length > 0 && !currentConversationId) {
          setCurrentConversationId(data[0].id);
        }
        // If we have no conversations, create a new one
        else if (data.length === 0) {
          createNewConversation();
        }
      } catch (err) {
        setError("Failed to load conversations");
        console.error(err);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const loadMessages = async (conversationId: string) => {
    try {
      setIsProcessing(true);
      const data = await ApiClient.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      setError(`Failed to load messages for conversation ${conversationId}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const createNewConversation = async () => {
    try {
      setIsProcessing(true);
      const newConversation = await ApiClient.createConversation({
        title: "New Conversation",
      });
      setConversations((prev) => [...prev, newConversation]);
      setCurrentConversationId(newConversation.id);
    } catch (err) {
      setError("Failed to create new conversation");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentConversationId || !message.trim()) return;

    try {
      setIsProcessing(true);

      // Add user message
      const userMessage = await ApiClient.addMessage(
        currentConversationId,
        message,
        "user"
      );
      setMessages((prev) => [...prev, userMessage]);

      // Generate AI response
      const aiResponse = await ApiClient.generateResponse(
        currentConversationId,
        message
      );
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    // This would be implemented when agent parameters are needed
    console.log("Form submitted with data:", formData);
  };

  const handleSelectConversation = (newId: string) => {
    setCurrentConversationId(newId);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal AI
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Conversation List */}
        <ConversationList
          selectedConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={createNewConversation}
          conversations={conversations}
          isLoading={isLoadingConversations}
        />

        {/* Main Chat Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            p: 2,
            height: "100%",
            overflow: "hidden",
            maxHeight: "calc(100vh - 64px)", // 64px is the AppBar height
          }}
        >
          {/* Error Display */}
          {error && <ErrorDisplay errorMessage={error} />}

          {/* Parameters Form */}
          {parametersNeeded && (
            <DynamicForm
              fields={parametersNeeded.parameters}
              onSubmit={handleFormSubmit}
              submitLabel="Submit Parameters"
            />
          )}

          {/* Conversation Messages */}
          <Box sx={{ flexGrow: 1, overflow: "hidden", mb: 2 }}>
            <ConversationDisplay messages={messages} isLoading={isProcessing} />
          </Box>

          {/* Message Input */}
          <Box sx={{ pb: 2 }}>
            <TextInputButton
              isLoading={isProcessing}
              onSendMessage={handleSendMessage}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
