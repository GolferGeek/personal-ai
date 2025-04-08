import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversationList from '../ConversationList';
import { Conversation } from '../../models/conversation';

describe('ConversationList', () => {
  const mockOnSelectConversation = jest.fn();
  const mockOnNewConversation = jest.fn();
  
  const sampleConversations: Conversation[] = [
    {
      id: '1',
      title: 'First Conversation',
      lastUpdated: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      messages: []
    },
    {
      id: '2',
      title: 'Second Conversation',
      lastUpdated: Date.now() - 1000 * 60 * 60, // 1 hour ago
      messages: []
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders conversation list with items', () => {
    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={sampleConversations}
        isLoading={false}
      />
    );
    
    // Check header and new conversation button
    expect(screen.getByText('Conversations')).toBeInTheDocument();
    expect(screen.getByText('New Conversation')).toBeInTheDocument();
    
    // Check conversation items
    expect(screen.getByText('First Conversation')).toBeInTheDocument();
    expect(screen.getByText('Second Conversation')).toBeInTheDocument();
  });
  
  test('shows loading state', () => {
    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={[]}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Loading conversations...')).toBeInTheDocument();
  });
  
  test('shows empty state', () => {
    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={[]}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
  });
  
  test('calls onSelectConversation when item clicked', () => {
    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={sampleConversations}
        isLoading={false}
      />
    );
    
    fireEvent.click(screen.getByText('First Conversation'));
    expect(mockOnSelectConversation).toHaveBeenCalledWith('1');
  });
  
  test('calls onNewConversation when new button clicked', () => {
    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={sampleConversations}
        isLoading={false}
      />
    );
    
    fireEvent.click(screen.getByText('New Conversation'));
    expect(mockOnNewConversation).toHaveBeenCalled();
  });
  
  test('highlights selected conversation', () => {
    render(
      <ConversationList
        selectedConversationId="2"
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={sampleConversations}
        isLoading={false}
      />
    );
    
    // Find the list item by its text content
    const secondConversationItem = screen.getByText('Second Conversation').closest('div[role="button"]');
    
    // Verify it exists and has the selected property
    expect(secondConversationItem).toBeTruthy();
    expect(secondConversationItem).toHaveAttribute('aria-selected', 'true');
  });
}); 