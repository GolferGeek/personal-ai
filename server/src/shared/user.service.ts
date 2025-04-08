import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface UserIdentity {
  id: string;
  createdAt: Date;
  preferences?: Record<string, any>;
}

@Injectable()
export class UserService {
  // For now, we'll store users in memory
  // In a production system, this would use a database
  private users: Map<string, UserIdentity> = new Map();

  /**
   * Create a new anonymous user or return existing one
   */
  createAnonymousUser(): UserIdentity {
    const userId = uuidv4();
    const user: UserIdentity = {
      id: userId,
      createdAt: new Date(),
      preferences: {},
    };
    
    this.users.set(userId, user);
    return user;
  }

  /**
   * Get a user by their ID
   */
  getUser(userId: string): UserIdentity | undefined {
    return this.users.get(userId);
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(userId: string, preferences: Record<string, any>): UserIdentity | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;

    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    this.users.set(userId, user);
    return user;
  }
} 