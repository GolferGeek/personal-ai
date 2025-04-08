// Custom Jest type extensions

import '@jest/globals';

declare global {
  // Define global fetch function that can be mocked
  const fetch: jest.Mock<Promise<Response>>;
  
  // Extend existing types
  namespace jest {
    // Define mocked functions that return specific values
    interface MockedFunction<T extends (...args: any[]) => any> {
      mockResolvedValue(value: ReturnType<T> extends Promise<infer U> ? U : never): this;
      mockRejectedValue(value: any): this;
    }
  }
} 