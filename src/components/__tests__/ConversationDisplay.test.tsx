import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversationDisplay from '../ConversationDisplay';
import { Message } from '../../models/conversation';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('ConversationDisplay', () => {
  const mockMessages: Message[] = [
    {
      role: 'user',
      content: 'Hello',
      timestamp: Date.now() - 60000 // 1 minute ago
    },
    {
      role: 'assistant',
      content: 'Hi there! How can I help you today?',
      timestamp: Date.now() - 30000 // 30 seconds ago
    }
  ];

  test('renders empty state when no messages', () => {
    render(<ConversationDisplay messages={[]} isLoading={false} />);
    
    expect(screen.getByText(/Start a new conversation or select an existing one/i)).toBeInTheDocument();
  });

  test('renders loading indicator when isLoading is true', () => {
    render(<ConversationDisplay messages={[]} isLoading={true} />);
    
    // CircularProgress is rendered
    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  test('renders messages correctly', () => {
    render(<ConversationDisplay messages={mockMessages} isLoading={false} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there! How can I help you today?')).toBeInTheDocument();
  });
}); 