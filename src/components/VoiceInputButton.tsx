import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

// Remove custom declarations as @types/dom-speech-recognition provides them
/*
interface CustomSpeechRecognition extends SpeechRecognition {
  // No specific extensions needed for this basic use case
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
*/

interface VoiceInputButtonProps {
  isLoading: boolean;
  onTranscript: (transcript: string) => void;
  onError: (error: string | null) => void; // Allow null for clearing errors
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ isLoading, onTranscript, onError }) => {
  const [isListening, setIsListening] = useState(false);
  // Use the globally available SpeechRecognition type
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for both standard and prefixed versions
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('Speech Recognition API is not supported in this browser.');
      // Optionally, disable the button or show a message
      onError('Speech Recognition API is not supported in this browser.');
      return;
    }

    // Now correctly typed thanks to @types/dom-speech-recognition
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Set language

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('Transcript received:', transcript);
      onTranscript(transcript);
      setIsListening(false); // Automatically stop listening visually after result
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = `Speech recognition error: ${event.error}`;
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      }
      // Handle other errors like network, audio-capture, not-allowed
      onError(errorMessage);
      setIsListening(false); // Ensure listening state is reset
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
      // Ensure visual state matches recognition state
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup function: Stop recognition if component unmounts while listening
    return () => {
      // Check if recognitionRef.current exists and has the stop method
      if (recognitionRef.current?.stop && isListening) {
        try {
          recognitionRef.current.stop();
          console.log('Stopped speech recognition on component unmount.');
        } catch (error) {
          // Ignore errors during cleanup, e.g., if already stopped
          console.warn('Error stopping recognition on unmount:', error);
        }
      }
    };
    // Rerun effect only if callbacks change (though unlikely)
  }, [onTranscript, onError]); // Removed isListening dependency to prevent recreation on state change

  const handleButtonClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      onError('Speech Recognition is not initialized.');
      return;
    }

    if (isListening) {
      recognition.stop();
      console.log('Stopping voice input manually...');
      setIsListening(false);
    } else {
      try {
        recognition.start();
        console.log('Starting voice input...');
        setIsListening(true);
        onError(null); // Clear previous errors on start
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        // Check if error is an instance of Error before accessing message
        let errorMsg = 'An unknown error occurred while starting speech recognition.';
        if (error instanceof Error) {
          errorMsg = `Error starting speech recognition: ${error.message}`;
        }
        onError(errorMsg);
        setIsListening(false);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="contained"
        color={isListening ? 'error' : 'primary'}
        onClick={handleButtonClick}
        // Disable button if recognition is not supported or during API loading
        disabled={isLoading || !recognitionRef.current}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : (isListening ? <StopIcon /> : <MicIcon />)}
        sx={{ minWidth: '120px', height: '50px' }}
      >
        {isLoading
          ? 'Processing...'
          : isListening
          ? 'Stop'
          : recognitionRef.current ? 'Speak' : 'Unsupported'}
      </Button>
    </Box>
  );
};

export default VoiceInputButton; 