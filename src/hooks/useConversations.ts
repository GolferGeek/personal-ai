'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Conversation } from '../models/conversation';

/**
 * Hook for fetching conversations with real-time updates
 */
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      try {
        console.log('Fetching conversations');
        return await apiClient.getConversations();
      } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
    },
    refetchInterval: false, // Disable automatic refetching
    refetchOnWindowFocus: false, // Don't refetch on window focus
    staleTime: Infinity, // Consider data fresh indefinitely
  });
} 