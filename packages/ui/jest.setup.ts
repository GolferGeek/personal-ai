// Add testing-library jest-dom extensions
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock matchMedia for Material UI components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
