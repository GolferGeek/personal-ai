import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VoiceInputButton from '../VoiceInputButton';

// Define SpeechRecognition interface for browser compatibility 
// (duplicated from VoiceInputButton.tsx for test independence)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// Define the interface for our mock SpeechRecognition
interface IMockSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => boolean;
  stop: () => boolean;
  abort: () => boolean;
  simulateResult: (transcript: string) => void;
  simulateError: (errorMessage: string) => void;
}

// Mock SpeechRecognition for tests
class MockSpeechRecognition implements IMockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  onresult: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onend: (() => void) | null = null;
  
  constructor() {}
  
  start(): boolean {
    // Simulate starting recognition
    return true;
  }
  
  stop(): boolean {
    if (this.onend) {
      this.onend();
    }
    return true;
  }
  
  abort(): boolean {
    if (this.onend) {
      this.onend();
    }
    return true;
  }
  
  // Helper to simulate receiving a result
  simulateResult(transcript: string): void {
    if (this.onresult) {
      const mockEvent = {
        resultIndex: 0,
        results: [
          {
            isFinal: true,
            0: {
              transcript: transcript
            }
          }
        ]
      };
      this.onresult(mockEvent);
    }
  }
  
  // Helper to simulate an error
  simulateError(errorMessage: string): void {
    if (this.onerror) {
      this.onerror({ error: errorMessage });
    }
  }
}

// Add global types for SpeechRecognition in the test environment
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// Set up global mock before tests
let mockSpeechRecognition: IMockSpeechRecognition;

beforeEach(() => {
  mockSpeechRecognition = new MockSpeechRecognition();
  
  // Mock window.SpeechRecognition
  window.SpeechRecognition = jest.fn().mockImplementation(() => {
    return mockSpeechRecognition as unknown as SpeechRecognition;
  });
  
  window.webkitSpeechRecognition = window.SpeechRecognition;
});

describe('VoiceInputButton', () => {
  const mockOnTranscript = jest.fn();
  const mockOnError = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders voice input button', () => {
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        onError={mockOnError}
        isLoading={false}
      />
    );
    
    // Check that the microphone button is rendered
    expect(screen.getByLabelText('Start microphone')).toBeInTheDocument();
    
    // Check that the text field is rendered
    expect(screen.getByPlaceholderText(/Type a message or press microphone to speak/i)).toBeInTheDocument();
  });
  
  test('starts recording when microphone button is clicked', () => {
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        onError={mockOnError}
        isLoading={false}
      />
    );
    
    // Spy on the start method
    const startSpy = jest.spyOn(mockSpeechRecognition, 'start');
    
    // Click the microphone button
    fireEvent.click(screen.getByLabelText('Start microphone'));
    
    // Expect start to have been called
    expect(startSpy).toHaveBeenCalled();
    
    // Check that the placeholder text changes
    expect(screen.getByPlaceholderText(/Listening/i)).toBeInTheDocument();
  });
  
  test('stops recording when stop button is clicked', () => {
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        onError={mockOnError}
        isLoading={false}
      />
    );
    
    // Start recording
    fireEvent.click(screen.getByLabelText('Start microphone'));
    
    // Spy on the stop method
    const stopSpy = jest.spyOn(mockSpeechRecognition, 'stop');
    
    // Click the stop button (now rendered instead of mic)
    fireEvent.click(screen.getByLabelText('Stop recording'));
    
    // Expect stop to have been called
    expect(stopSpy).toHaveBeenCalled();
  });
  
  test('updates transcript when receiving speech recognition results', () => {
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        onError={mockOnError}
        isLoading={false}
      />
    );
    
    // Start recording
    fireEvent.click(screen.getByLabelText('Start microphone'));
    
    // Simulate speech recognition result
    act(() => {
      mockSpeechRecognition.simulateResult('Hello world');
    });
    
    // Check that the text field value is updated
    expect(screen.getByDisplayValue('Hello world')).toBeInTheDocument();
  });
  
  test('calls onTranscript when send button is clicked', () => {
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        onError={mockOnError}
        isLoading={false}
      />
    );
    
    // Manually enter text
    fireEvent.change(screen.getByPlaceholderText(/Type a message or press microphone to speak/i), {
      target: { value: 'Test message' }
    });
    
    // Click the send button
    fireEvent.click(screen.getByLabelText('Send message'));
    
    // Expect onTranscript to have been called with the text
    expect(mockOnTranscript).toHaveBeenCalledWith('Test message');
    
    // Check that the text field is cleared
    expect(screen.queryByDisplayValue('Test message')).not.toBeInTheDocument();
  });
  
  test('calls onError when speech recognition encounters an error', () => {
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        onError={mockOnError}
        isLoading={false}
      />
    );
    
    // Start recording
    fireEvent.click(screen.getByLabelText('Start microphone'));
    
    // Simulate speech recognition error
    act(() => {
      mockSpeechRecognition.simulateError('no-speech');
    });
    
    // Expect onError to have been called with the error message
    expect(mockOnError).toHaveBeenCalledWith('Speech recognition error: no-speech');
  });
  
  test('disables buttons when isLoading is true', () => {
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        onError={mockOnError}
        isLoading={true}
      />
    );
    
    // Find buttons by label even when disabled
    const micButton = screen.getByLabelText('Start microphone');
    const sendButton = screen.getByLabelText('Send message');
    
    // Check that buttons are disabled
    expect(micButton).toBeDisabled();
    expect(sendButton).toBeDisabled();
    
    // Check that text field is disabled
    expect(screen.getByPlaceholderText(/Type a message or press microphone to speak/i)).toBeDisabled();
  });
}); 