// Add any global test setup here
import '@testing-library/jest-dom';

// Mock matchMedia for Material UI components
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