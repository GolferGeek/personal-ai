import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { MessageRole } from './models';

describe('ConversationService', () => {
  let service: ConversationService;
  const testUserId = 'test-user-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationService],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a conversation', () => {
    const conversation = service.createConversation(testUserId, 'Test Conversation');
    
    expect(conversation).toBeDefined();
    expect(conversation.id).toBeDefined();
    expect(conversation.userId).toBe(testUserId);
    expect(conversation.title).toBe('Test Conversation');
    expect(conversation.createdAt).toBeInstanceOf(Date);
    expect(conversation.updatedAt).toBeInstanceOf(Date);
  });

  it('should list conversations for a user', () => {
    // Create a few conversations with delay to ensure different timestamps
    const conv1 = service.createConversation(testUserId, 'Conversation 1');
    const conv2 = service.createConversation(testUserId, 'Conversation 2');
    service.createConversation('other-user', 'Other User Conversation');
    
    // Manually update the timestamps to ensure a predictable order
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    
    // Update conversation 1 to be older
    (service as any).conversations.set(conv1.id, {
      ...conv1,
      updatedAt: lastYear,
    });
    
    const conversations = service.listConversationsForUser(testUserId);
    
    expect(conversations).toHaveLength(2);
    // Since conversations are sorted by updatedAt desc, conv2 should be first
    expect(conversations.map(c => c.title)).toContain('Conversation 1');
    expect(conversations.map(c => c.title)).toContain('Conversation 2');
    
    // The first one should be the more recently updated one
    expect(conversations[0].updatedAt.getTime()).toBeGreaterThan(conversations[1].updatedAt.getTime());
  });

  it('should add messages to a conversation', () => {
    const conversation = service.createConversation(testUserId);
    const userMessage = service.addMessage(conversation.id, 'Hello', 'user');
    const assistantMessage = service.addMessage(conversation.id, 'Hi there', 'assistant');
    
    expect(userMessage).toBeDefined();
    expect(userMessage?.content).toBe('Hello');
    expect(userMessage?.role).toBe('user');
    
    expect(assistantMessage).toBeDefined();
    expect(assistantMessage?.content).toBe('Hi there');
    expect(assistantMessage?.role).toBe('assistant');
    
    const messages = service.getMessagesForConversation(conversation.id);
    expect(messages).toHaveLength(2);
    expect(messages[0].content).toBe('Hello');
    expect(messages[1].content).toBe('Hi there');
  });

  it('should update conversation title', () => {
    const conversation = service.createConversation(testUserId, 'Original Title');
    const updatedConversation = service.updateConversationTitle(conversation.id, 'New Title');
    
    expect(updatedConversation).toBeDefined();
    expect(updatedConversation?.title).toBe('New Title');
    
    const retrievedConversation = service.getConversation(conversation.id);
    expect(retrievedConversation?.title).toBe('New Title');
  });

  it('should delete a conversation and its messages', () => {
    const conversation = service.createConversation(testUserId);
    service.addMessage(conversation.id, 'Test message', 'user');
    
    const deleted = service.deleteConversation(conversation.id);
    expect(deleted).toBe(true);
    
    const retrievedConversation = service.getConversation(conversation.id);
    expect(retrievedConversation).toBeUndefined();
    
    const messages = service.getMessagesForConversation(conversation.id);
    expect(messages).toHaveLength(0);
  });

  it('should search conversations by title', () => {
    service.createConversation(testUserId, 'Work Meeting');
    service.createConversation(testUserId, 'Personal Chat');
    service.createConversation(testUserId, 'Work Project');
    
    const workConversations = service.searchConversations(testUserId, 'work');
    expect(workConversations).toHaveLength(2);
    
    const personalConversations = service.searchConversations(testUserId, 'personal');
    expect(personalConversations).toHaveLength(1);
    
    const nonexistentConversations = service.searchConversations(testUserId, 'nonexistent');
    expect(nonexistentConversations).toHaveLength(0);
  });
}); 