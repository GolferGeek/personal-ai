// Add any global test setup here
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Type definition for fetch mock
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
    statusText: 'OK'
  })
) as jest.Mock;

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock matchMedia for Material UI components
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock SpeechRecognition
  class MockSpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart?: () => void;
    onend?: () => void;
    
    constructor() {
      this.continuous = false;
      this.interimResults = false;
      this.lang = 'en-US';
    }
    
    start() {
      setTimeout(() => {
        if (this.onstart) this.onstart();
      }, 10);
      return true;
    }
    
    stop() {
      if (this.onend) this.onend();
      return true;
    }
    
    abort() {
      if (this.onend) this.onend();
      return true;
    }
  }

  Object.defineProperty(window, 'SpeechRecognition', {
    writable: true,
    value: MockSpeechRecognition,
  });

  Object.defineProperty(window, 'webkitSpeechRecognition', {
    writable: true,
    value: MockSpeechRecognition,
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED PROMISE REJECTION:', reason);
});

// Setup environment variables
process.env.BACKEND_URL = 'http://localhost:3001'; 