import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInputButton from '../TextInputButton';

describe('TextInputButton', () => {
  const mockSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and send button', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);
    
    // Check for text field and button
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    
    // Send button should be disabled initially (no text)
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });

  test('enables send button when text is entered', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByLabelText('Send message');
    
    // Initially disabled
    expect(sendButton).toBeDisabled();
    
    // Enter text
    fireEvent.change(input, { target: { value: 'Hello world' } });
    
    // Now enabled
    expect(sendButton).not.toBeDisabled();
  });

  test('calls onSendMessage when send button is clicked', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByLabelText('Send message');
    
    // Enter text and click send
    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.click(sendButton);
    
    // Check if callback was called with correct text
    expect(mockSendMessage).toHaveBeenCalledWith('Hello world');
    
    // Input should be cleared
    expect(input).toHaveValue('');
  });

  test('calls onSendMessage when Enter key is pressed', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    
    // Enter text and press Enter
    fireEvent.change(input, { target: { value: 'Hello from keyboard' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Check if callback was called with correct text
    expect(mockSendMessage).toHaveBeenCalledWith('Hello from keyboard');
    
    // Input should be cleared
    expect(input).toHaveValue('');
  });

  test('does not submit on Shift+Enter', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    
    // Enter text and press Shift+Enter
    fireEvent.change(input, { target: { value: 'Line 1\nLine 2' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });
    
    // Check that callback was not called
    expect(mockSendMessage).not.toHaveBeenCalled();
    
    // Input should not be cleared
    expect(input).toHaveValue('Line 1\nLine 2');
  });

  test('disables input and button when loading', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByLabelText('Send message');
    
    // Both should be disabled
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
    
    // Should show loading indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('trims whitespace from message before sending', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByLabelText('Send message');
    
    // Enter text with extra whitespace
    fireEvent.change(input, { target: { value: '  Hello with spaces   ' } });
    fireEvent.click(sendButton);
    
    // Check if callback was called with trimmed text
    expect(mockSendMessage).toHaveBeenCalledWith('Hello with spaces');
  });

  test('does not send empty messages', () => {
    render(<TextInputButton onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    
    // Try to send whitespace-only message
    fireEvent.change(input, { target: { value: '    ' } });
    
    // Send button should remain disabled
    expect(screen.getByLabelText('Send message')).toBeDisabled();
    
    // Try pressing Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Callback should not be called
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
}); 