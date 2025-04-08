import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

  test('renders conversations with different timestamp formats', () => {
    const timestampVariations: Conversation[] = [
      {
        id: 'timestamp-num',
        title: 'Numeric Timestamp',
        lastUpdated: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        messages: []
      },
      {
        id: 'timestamp-string',
        title: 'String Timestamp',
        lastUpdated: Date.now(), // Still need lastUpdated as required property
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        messages: []
      },
      {
        id: 'timestamp-date',
        title: 'Date Object',
        lastUpdated: Date.now(), // Still need lastUpdated as required property
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago, as string
        messages: []
      }
    ];

    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={timestampVariations}
        isLoading={false}
      />
    );

    // Check that all conversations are rendered
    expect(screen.getByText('Numeric Timestamp')).toBeInTheDocument();
    expect(screen.getByText('String Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Date Object')).toBeInTheDocument();

    // Check relative time formatting
    // We can't test exact strings as they depend on the current time
    // but we can verify that secondary text exists
    const items = screen.getAllByRole('button', { name: /(Numeric|String|Date)/ });
    expect(items.length).toBe(3);
    
    // Verify each item has some secondary text for the timestamp
    items.forEach(item => {
      const listItem = item.closest('li');
      expect(listItem).toBeInTheDocument();
      if (listItem) {
        const secondaryText = within(listItem).getByText(/ago|now|Yesterday/i);
        expect(secondaryText).toBeInTheDocument();
      }
    });
  });

  test('handles invalid timestamp data gracefully', () => {
    const invalidTimestamps: Conversation[] = [
      {
        id: 'invalid-date',
        title: 'Invalid Date',
        lastUpdated: 'not-a-date' as any,
        messages: []
      }
    ];

    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={invalidTimestamps}
        isLoading={false}
      />
    );

    // Check that the conversation is rendered
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    
    // Should show fallback time text
    expect(screen.getByText('Recently')).toBeInTheDocument();
  });

  test('generates titles from user messages when title is missing', () => {
    const conversationsWithMessages: Conversation[] = [
      {
        id: 'no-title',
        title: '', // Empty title to test title generation from messages
        lastUpdated: Date.now(),
        messages: [
          { id: 'm1', role: 'user', content: 'This is a test message that should become the title', timestamp: Date.now() }
        ]
      },
      {
        id: 'long-message',
        title: '', // Empty title
        lastUpdated: Date.now(),
        messages: [
          { id: 'm2', role: 'user', content: 'This is a very long message that should be truncated when used as the conversation title', timestamp: Date.now() }
        ]
      },
      {
        id: 'assistant-first',
        title: '', // Empty title
        lastUpdated: Date.now(),
        messages: [
          { id: 'm3', role: 'assistant', content: 'Assistant message should not be used', timestamp: Date.now() },
          { id: 'm4', role: 'user', content: 'User message should be used', timestamp: Date.now() }
        ]
      }
    ];

    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={conversationsWithMessages}
        isLoading={false}
      />
    );

    // Check for truncated title instead of full text
    expect(screen.getByText('This is a test message that sh...')).toBeInTheDocument();
    
    // Check for truncated long message
    expect(screen.getByText('This is a very long message th...')).toBeInTheDocument();
    
    // Check for the user message being used, not assistant
    expect(screen.getByText('User message should be used')).toBeInTheDocument();
  });

  test('handles empty and invalid conversation data', () => {
    const problematicConversations = [
      null, // Null conversation
      undefined, // Undefined conversation
      {}, // Empty object
      { id: 'no-messages', messages: [] }, // No messages
      { messages: [{ role: 'user', content: 'No ID' }] } // No ID
    ] as any[];

    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={problematicConversations}
        isLoading={false}
      />
    );

    // Use getAllByText to account for multiple "New Conversation" instances
    const newConversationElements = screen.getAllByText('New Conversation');
    expect(newConversationElements.length).toBeGreaterThan(0);
  });

  test('empty conversations array shows empty state', () => {
    // Test with empty array
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
    
    // Find button by its more specific location within the empty state container
    const emptyStateContainer = screen.getByText('Start a new conversation to begin').parentElement;
    expect(emptyStateContainer).toBeInTheDocument();
    
    if (emptyStateContainer) {
      const emptyStateButton = within(emptyStateContainer).getByRole('button');
      fireEvent.click(emptyStateButton);
      expect(mockOnNewConversation).toHaveBeenCalled();
    }
  });

  test('disables new conversation button when loading', () => {
    render(
      <ConversationList
        selectedConversationId={null}
        onSelectConversation={mockOnSelectConversation}
        onNewConversation={mockOnNewConversation}
        conversations={sampleConversations}
        isLoading={true}
      />
    );
    
    // Button should be disabled
    const newConversationButton = screen.getByRole('button', { name: /New Conversation/i });
    expect(newConversationButton).toBeDisabled();
  });
}); 