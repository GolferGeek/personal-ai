'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Message } from '../models/conversation';

/**
 * Hook for fetching messages for a conversation with real-time updates
 */
export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      if (!conversationId) return [];
      
      try {
        console.log(`Fetching messages for conversation ${conversationId}`);
        const messages = await apiClient.getMessages(conversationId);
        
        // Process the timestamps to make sure they're numbers
        return messages.map(msg => ({
          ...msg,
          // Ensure timestamp is a number
          timestamp: typeof msg.timestamp === 'number' ? msg.timestamp : 
                    (msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now())
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
    },
    enabled: !!conversationId, // Only run the query if we have a conversation ID
    refetchInterval: false, // Disable automatic refetching
    refetchOnWindowFocus: false, // Don't refetch on window focus
    staleTime: Infinity, // Consider data fresh indefinitely
  });
} 