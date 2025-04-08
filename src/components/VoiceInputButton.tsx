'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  TextField, 
  Paper, 
  InputAdornment,
  CircularProgress
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';

// Define SpeechRecognition interface for browser compatibility
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

// Add global types for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  onError,
  isLoading
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        onError('Speech recognition is not supported in this browser');
        return;
      }
      
      const recognitionInstance = new SpeechRecognitionAPI();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript((prevTranscript) => 
            prevTranscript ? `${prevTranscript} ${finalTranscript}` : finalTranscript
          );
        }
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        onError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onError]);

  const startRecording = () => {
    if (recognition && !isRecording && !isLoading) {
      setIsRecording(true);
      setTranscript('');
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = () => {
    if (transcript.trim() && !isLoading) {
      onTranscript(transcript.trim());
      setTranscript('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper
      elevation={2}
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder={isRecording ? "Listening..." : "Type a message or press microphone to speak..."}
        inputRef={textFieldRef}
        InputProps={{
          disableUnderline: true,
          endAdornment: isLoading && (
            <InputAdornment position="end">
              <CircularProgress size={24} />
            </InputAdornment>
          ),
        }}
        variant="standard"
        sx={{
          ml: 1,
          flex: 1,
          '& .MuiInputBase-input': {
            py: 1.5,
          },
        }}
      />
      
      <IconButton 
        color={isRecording ? "error" : "default"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        sx={{ p: '10px' }}
      >
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
      
      <IconButton 
        color="primary" 
        sx={{ p: '10px' }}
        onClick={handleSendMessage}
        disabled={!transcript.trim() || isLoading}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default VoiceInputButton; 