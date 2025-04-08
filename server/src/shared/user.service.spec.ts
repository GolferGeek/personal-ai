import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create anonymous users with unique IDs', () => {
    const user1 = service.createAnonymousUser();
    const user2 = service.createAnonymousUser();
    
    expect(user1).toBeDefined();
    expect(user1.id).toBeDefined();
    expect(user1.createdAt).toBeInstanceOf(Date);
    expect(user1.preferences).toBeDefined();
    
    expect(user2).toBeDefined();
    expect(user2.id).toBeDefined();
    
    // IDs should be different
    expect(user1.id).not.toBe(user2.id);
  });

  it('should retrieve a user by ID', () => {
    const createdUser = service.createAnonymousUser();
    const retrievedUser = service.getUser(createdUser.id);
    
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.id).toBe(createdUser.id);
  });

  it('should return undefined for non-existent user', () => {
    const nonExistentUser = service.getUser('non-existent-id');
    expect(nonExistentUser).toBeUndefined();
  });

  it('should update user preferences', () => {
    const user = service.createAnonymousUser();
    
    // Update with new preferences
    const updatedPreferences = {
      theme: 'dark',
      fontSize: 16,
    };
    
    const updatedUser = service.updateUserPreferences(user.id, updatedPreferences);
    
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.preferences?.theme).toBe('dark');
    expect(updatedUser?.preferences?.fontSize).toBe(16);
    
    // Update with additional preferences (should merge)
    const additionalPreferences = {
      language: 'en',
      notifications: true,
    };
    
    const userWithMorePrefs = service.updateUserPreferences(user.id, additionalPreferences);
    
    expect(userWithMorePrefs).toBeDefined();
    expect(userWithMorePrefs?.preferences?.theme).toBe('dark');
    expect(userWithMorePrefs?.preferences?.fontSize).toBe(16);
    expect(userWithMorePrefs?.preferences?.language).toBe('en');
    expect(userWithMorePrefs?.preferences?.notifications).toBe(true);
  });

  it('should return undefined when updating preferences for non-existent user', () => {
    const result = service.updateUserPreferences('non-existent-id', { theme: 'light' });
    expect(result).toBeUndefined();
  });
}); 