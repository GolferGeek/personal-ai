'use client';

import React, { useState, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  TextField, 
  Paper, 
  InputAdornment,
  CircularProgress,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
  const [input, setInput] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (input.trim() && !isLoading) {
      onTranscript(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Focus the text field on mount
  React.useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);

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
          placeholder="Type or use your system's voice dictation (shortcut differs by OS)..."
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
      
      <Typography 
        variant="caption" 
        color="text.secondary"
        display="flex"
        alignItems="center"
        sx={{ mt: 0.5, ml: 1 }}
      >
        <InfoOutlinedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
        Use your system's voice dictation: 
        macOS (⌘+⌃+Space), Windows (Win+H), iOS (mic key), Android (mic key)
      </Typography>
    </Box>
  );
};

export default VoiceInputButton; 