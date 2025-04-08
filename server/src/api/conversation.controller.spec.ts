import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { ConversationService } from '../shared/conversation.service';
import { UserService } from '../shared/user.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Create mock services
const mockConversationService = {
  createConversation: jest.fn(),
  getConversation: jest.fn(),
  updateConversationTitle: jest.fn(),
  listConversationsForUser: jest.fn(),
  deleteConversation: jest.fn(),
  addMessage: jest.fn(),
  getMessagesForConversation: jest.fn(),
  searchConversations: jest.fn(),
};

const mockUserService = {
  createAnonymousUser: jest.fn(),
  getUser: jest.fn(),
};

describe('ConversationController', () => {
  let controller: ConversationController;
  const testUserId = 'test-user-id';
  const anonymousUserId = 'anonymous-user-id';
  const testConversationId = 'test-conversation-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
    
    // Reset mock implementations
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockUserService.createAnonymousUser.mockReturnValue({ id: anonymousUserId });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  it('should get a user ID from header or create anonymous user', () => {
    const userIdFromHeader = controller['getUserIdFromHeader'](testUserId);
    expect(userIdFromHeader).toBe(testUserId);
    expect(mockUserService.createAnonymousUser).not.toHaveBeenCalled();
    
    const anonymousId = controller['getUserIdFromHeader']('');
    expect(anonymousId).toBe(anonymousUserId);
    expect(mockUserService.createAnonymousUser).toHaveBeenCalled();
  });
  
  it('should list conversations for a user', () => {
    const mockConversations = [
      { id: '1', title: 'Conversation 1' },
      { id: '2', title: 'Conversation 2' },
    ];
    mockConversationService.listConversationsForUser.mockReturnValue(mockConversations);
    
    const result = controller.listConversations(testUserId);
    
    expect(mockConversationService.listConversationsForUser).toHaveBeenCalledWith(testUserId);
    expect(result).toEqual(mockConversations);
  });
  
  it('should create a new conversation', () => {
    const mockConversation = { id: testConversationId, title: 'Test Conversation' };
    mockConversationService.createConversation.mockReturnValue(mockConversation);
    
    const result = controller.createConversation(testUserId, { title: 'Test Conversation' });
    
    expect(mockConversationService.createConversation).toHaveBeenCalledWith(testUserId, 'Test Conversation');
    expect(result).toEqual(mockConversation);
  });
  
  it('should throw NotFoundException when conversation not found', () => {
    mockConversationService.getConversation.mockReturnValue(null);
    
    expect(() => {
      controller.getConversation(testConversationId, testUserId);
    }).toThrow(NotFoundException);
  });
  
  it('should throw NotFoundException when user does not own conversation', () => {
    mockConversationService.getConversation.mockReturnValue({ 
      id: testConversationId, 
      userId: 'different-user-id' 
    });
    
    expect(() => {
      controller.getConversation(testConversationId, testUserId);
    }).toThrow(NotFoundException);
  });
}); 