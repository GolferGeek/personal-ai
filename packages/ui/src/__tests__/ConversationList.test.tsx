import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConversationList } from "../ConversationList";
import { Conversation } from "@personal-ai/models";

describe("ConversationList", () => {
  const mockConversations: Conversation[] = [
    {
      id: "1",
      title: "First Conversation",
      lastUpdated: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    },
    {
      id: "2",
      title: "AI Discussion",
      lastUpdated: Date.now() - 1000 * 60 * 60, // 1 hour ago
    },
    {
      id: "3",
      title: "Project Planning",
      lastUpdated: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    },
  ];

  const mockSelectConversation = jest.fn();
  const mockNewConversation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner when isLoading is true", () => {
    render(
      <ConversationList
        conversations={[]}
        selectedConversationId={null}
        onSelectConversation={mockSelectConversation}
        onNewConversation={mockNewConversation}
        isLoading={true}
      />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("New Conversation")).toBeInTheDocument();
  });

  it("renders empty state when no conversations are provided", () => {
    render(
      <ConversationList
        conversations={[]}
        selectedConversationId={null}
        onSelectConversation={mockSelectConversation}
        onNewConversation={mockNewConversation}
        isLoading={false}
      />
    );

    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
    expect(screen.getByText("New Conversation")).toBeInTheDocument();
  });

  it("renders the list of conversations", () => {
    render(
      <ConversationList
        conversations={mockConversations}
        selectedConversationId={null}
        onSelectConversation={mockSelectConversation}
        onNewConversation={mockNewConversation}
        isLoading={false}
      />
    );

    expect(screen.getByText("First Conversation")).toBeInTheDocument();
    expect(screen.getByText("AI Discussion")).toBeInTheDocument();
    expect(screen.getByText("Project Planning")).toBeInTheDocument();
  });

  it("highlights the selected conversation", () => {
    render(
      <ConversationList
        conversations={mockConversations}
        selectedConversationId="2"
        onSelectConversation={mockSelectConversation}
        onNewConversation={mockNewConversation}
        isLoading={false}
      />
    );

    // Get all list items
    const listItems = screen.getAllByRole("button");

    // Find the one for "AI Discussion" (which has id "2")
    const selectedItem = listItems.find((item) =>
      item.textContent?.includes("AI Discussion")
    );

    // Verify it has the 'selected' class from MUI
    expect(selectedItem).toHaveClass("Mui-selected");
  });

  it("calls onSelectConversation when a conversation is clicked", () => {
    render(
      <ConversationList
        conversations={mockConversations}
        selectedConversationId={null}
        onSelectConversation={mockSelectConversation}
        onNewConversation={mockNewConversation}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByText("AI Discussion"));
    expect(mockSelectConversation).toHaveBeenCalledWith("2");
  });

  it("calls onNewConversation when new conversation button is clicked", () => {
    render(
      <ConversationList
        conversations={mockConversations}
        selectedConversationId={null}
        onSelectConversation={mockSelectConversation}
        onNewConversation={mockNewConversation}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByText("New Conversation"));
    expect(mockNewConversation).toHaveBeenCalled();
  });

  it("disables the new conversation button when isLoading is true", () => {
    render(
      <ConversationList
        conversations={mockConversations}
        selectedConversationId={null}
        onSelectConversation={mockSelectConversation}
        onNewConversation={mockNewConversation}
        isLoading={true}
      />
    );

    expect(
      screen.getByText("New Conversation").closest("button")
    ).toBeDisabled();
  });
});
