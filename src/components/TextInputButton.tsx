'use client';

import React, { useState, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  InputAdornment, 
  CircularProgress 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

/**
 * TextInputButton Component
 * 
 * A text input component with a send button for submitting messages in the conversation interface.
 * Features:
 * - Multi-line text input with expansion capability
 * - Send button with proper accessibility attributes
 * - Loading state handling with visual feedback
 * - Enter key support for quick submission (Shift+Enter for new line)
 */
interface TextInputButtonProps {
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  /** Callback function triggered when a message is sent */
  onSendMessage: (text: string) => void;
}

const TextInputButton: React.FC<TextInputButtonProps> = ({ 
  isLoading = false,
  onSendMessage
}) => {
  const [input, setInput] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  /**
   * Handles keyboard events in the text field
   * Submits on Enter, allows Shift+Enter for new line
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Processes the message submission
   * Trims whitespace and only sends non-empty messages
   */
  const handleSendMessage = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading) {
      onSendMessage(trimmedInput);
      setInput('');
    }
  };

  return (
    <Box>
      <Paper
        elevation={2}
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Type your message..."
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
          color="primary" 
          sx={{ p: '10px' }}
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default TextInputButton; 