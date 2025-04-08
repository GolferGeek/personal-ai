import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConversationDisplay } from "../ConversationDisplay";
import { Message } from "@personal-ai/models";

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("ConversationDisplay", () => {
  const mockMessages: Message[] = [
    {
      id: "1",
      conversationId: "conv1",
      content: "Hello, how can I help you?",
      role: "assistant",
      timestamp: Date.now(),
    },
    {
      id: "2",
      conversationId: "conv1",
      content: "I need help with my project",
      role: "user",
      timestamp: Date.now(),
    },
    {
      id: "3",
      conversationId: "conv1",
      content: "What kind of project are you working on?",
      role: "assistant",
      timestamp: Date.now(),
    },
  ];

  it("renders empty state when no messages are provided", () => {
    render(<ConversationDisplay messages={[]} />);

    expect(screen.getByText("Start a new conversation")).toBeInTheDocument();
  });

  it("renders all messages correctly", () => {
    render(<ConversationDisplay messages={mockMessages} />);

    // Check if all message contents are rendered
    expect(screen.getByText("Hello, how can I help you?")).toBeInTheDocument();
    expect(screen.getByText("I need help with my project")).toBeInTheDocument();
    expect(
      screen.getByText("What kind of project are you working on?")
    ).toBeInTheDocument();
  });

  it("shows loading indicator when isLoading is true", () => {
    render(<ConversationDisplay messages={mockMessages} isLoading={true} />);

    // Check if progress indicator is displayed
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not show loading indicator when isLoading is false", () => {
    render(<ConversationDisplay messages={mockMessages} isLoading={false} />);

    // Check that progress indicator is not displayed
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("calls scrollIntoView when messages change", () => {
    render(<ConversationDisplay messages={mockMessages} />);

    // Check if scrollIntoView was called
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });
});
