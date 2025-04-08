import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TextInputButton } from "../TextInputButton";

describe("TextInputButton", () => {
  const mockSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);

    // Check if text field is rendered
    expect(
      screen.getByPlaceholderText("Type a message...")
    ).toBeInTheDocument();

    // Check if send button is rendered
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();

    // Send button should be disabled initially (empty input)
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("enables send button when text is entered", () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByRole("button", { name: "Send" });

    // Initially button should be disabled
    expect(sendButton).toBeDisabled();

    // Enter text
    fireEvent.change(input, { target: { value: "Hello world" } });

    // Button should be enabled now
    expect(sendButton).not.toBeDisabled();
  });

  it("sends message when button is clicked", () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByRole("button", { name: "Send" });

    // Enter text
    fireEvent.change(input, { target: { value: "Hello world" } });

    // Click send button
    fireEvent.click(sendButton);

    // Check if onSendMessage was called with the correct text
    expect(mockSendMessage).toHaveBeenCalledWith("Hello world");

    // Input should be cleared after sending
    expect(input).toHaveValue("");
  });

  it("sends message when Enter key is pressed", () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);

    const input = screen.getByPlaceholderText("Type a message...");

    // Enter text
    fireEvent.change(input, { target: { value: "Hello world" } });

    // Press Enter key
    fireEvent.keyDown(input, { key: "Enter" });

    // Check if onSendMessage was called with the correct text
    expect(mockSendMessage).toHaveBeenCalledWith("Hello world");

    // Input should be cleared after sending
    expect(input).toHaveValue("");
  });

  it("does not send message when Shift+Enter is pressed", () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);

    const input = screen.getByPlaceholderText("Type a message...");

    // Enter text
    fireEvent.change(input, { target: { value: "Hello world" } });

    // Press Shift+Enter key
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });

    // Check that onSendMessage was not called
    expect(mockSendMessage).not.toHaveBeenCalled();

    // Input should still have the text
    expect(input).toHaveValue("Hello world");
  });

  it("disables input and button when isLoading is true", () => {
    render(
      <TextInputButton onSendMessage={mockSendMessage} isLoading={true} />
    );

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByRole("button", { name: "Send" });

    // Input and button should be disabled
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();

    // Should show loading indicator
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("disables input and button when disabled prop is true", () => {
    render(<TextInputButton onSendMessage={mockSendMessage} disabled={true} />);

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByRole("button", { name: "Send" });

    // Input and button should be disabled
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it("uses custom placeholder text when provided", () => {
    const placeholder = "Ask me anything...";
    render(
      <TextInputButton
        onSendMessage={mockSendMessage}
        placeholder={placeholder}
      />
    );

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });
});
