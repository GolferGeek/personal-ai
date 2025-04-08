import { getForwardedHeaders, handleResponse, getUserId, createUrlWithParams } from './apiUtils';
import { describe, it, expect, jest } from '@jest/globals';

describe('API Utils', () => {
  describe('getForwardedHeaders', () => {
    it('should forward authorization header', () => {
      const headers = new Headers();
      headers.append('authorization', 'Bearer token123');
      
      const result = getForwardedHeaders(headers);
      
      expect(result).toEqual({
        authorization: 'Bearer token123'
      });
    });
    
    it('should forward cookie header', () => {
      const headers = new Headers();
      headers.append('cookie', 'session=abc123');
      
      const result = getForwardedHeaders(headers);
      
      expect(result).toEqual({
        cookie: 'session=abc123'
      });
    });
    
    it('should forward user ID header', () => {
      const headers = new Headers();
      headers.append('x-user-id', 'user123');
      
      const result = getForwardedHeaders(headers);
      
      expect(result).toEqual({
        'x-user-id': 'user123'
      });
    });
    
    it('should forward content-type header', () => {
      const headers = new Headers();
      headers.append('content-type', 'application/json');
      
      const result = getForwardedHeaders(headers);
      
      expect(result).toEqual({
        'content-type': 'application/json'
      });
    });
    
    it('should forward multiple headers', () => {
      const headers = new Headers();
      headers.append('authorization', 'Bearer token123');
      headers.append('cookie', 'session=abc123');
      headers.append('x-user-id', 'user123');
      headers.append('content-type', 'application/json');
      
      const result = getForwardedHeaders(headers);
      
      expect(result).toEqual({
        authorization: 'Bearer token123',
        cookie: 'session=abc123',
        'x-user-id': 'user123',
        'content-type': 'application/json'
      });
    });
  });
  
  describe('handleResponse', () => {
    it('should return json data for successful response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' })
      } as unknown as Response;
      
      const result = await handleResponse<{ data: string }>(mockResponse);
      
      expect(result).toEqual({ data: 'test' });
      expect(mockResponse.json).toHaveBeenCalled();
    });
    
    it('should throw error for unsuccessful response', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Not found')
      } as unknown as Response;
      
      await expect(handleResponse<any>(mockResponse)).rejects.toThrow('API error: 404 - Not found');
      expect(mockResponse.text).toHaveBeenCalled();
    });
    
    it('should handle error when text cannot be read', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: jest.fn().mockRejectedValue(new Error('Cannot read text'))
      } as unknown as Response;
      
      await expect(handleResponse<any>(mockResponse)).rejects.toThrow('API error: 500');
      expect(mockResponse.text).toHaveBeenCalled();
    });
  });
  
  describe('createUrlWithParams', () => {
    it('should return base URL when no params provided', () => {
      const result = createUrlWithParams('https://example.com/api');
      expect(result).toBe('https://example.com/api');
    });
    
    it('should append query parameters to URL', () => {
      const result = createUrlWithParams('https://example.com/api', {
        page: 1,
        limit: 10,
        filter: 'active'
      });
      
      // Check URL structure without caring about parameter order
      expect(result).toContain('https://example.com/api?');
      expect(result).toContain('page=1');
      expect(result).toContain('limit=10');
      expect(result).toContain('filter=active');
    });
    
    it('should skip undefined and null parameters', () => {
      const result = createUrlWithParams('https://example.com/api', {
        page: 1,
        filter: undefined as any,
        status: null as any,
        sort: 'name'
      });
      
      expect(result).toContain('page=1');
      expect(result).toContain('sort=name');
      expect(result).not.toContain('filter=');
      expect(result).not.toContain('status=');
    });
  });
}); 