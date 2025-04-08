'use client'; // Required for hooks like useState and useEffect

import { Box, Container, Typography } from '@mui/material';
import ConversationDisplay from '../components/ConversationDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import VoiceInputButton from '../components/VoiceInputButton';
import DynamicForm from '../components/DynamicForm';
import { useConversationStore, ParametersNeededState } from '../store/conversationStore';

export default function Home() {
  // Get state and actions from the Zustand store
  const messages = useConversationStore((state) => state.messages);
  const errorMessage = useConversationStore((state) => state.errorMessage);
  const isLoading = useConversationStore((state) => state.isLoading);
  const parametersNeeded = useConversationStore((state) => state.parametersNeeded);

  const addMessage = useConversationStore((state) => state.addMessage);
  const setErrorMessage = useConversationStore((state) => state.setErrorMessage);
  const setIsLoading = useConversationStore((state) => state.setIsLoading);
  const setParametersNeeded = useConversationStore((state) => state.setParametersNeeded);

  // Handler for successful speech recognition
  const handleTranscript = async (transcript: string) => {
    console.log('Handling transcript:', transcript);
    addMessage({ sender: 'user', text: transcript });
    setErrorMessage(null);
    setParametersNeeded(null);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL in .env.local');
      }

      const response = await fetch(`${apiUrl}/api/orchestrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: transcript }), // Send initial query
      });

      if (!response.ok) {
        // Attempt to read error message from response body
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignore if response body is not JSON or empty
        }
        throw new Error(
          `API request failed with status ${response.status}: ${ 
            errorData?.message || response.statusText
          }`
        );
      }

      const result = await response.json();

      console.log('API Response:', result);

      if (result.type === 'success' && result.message) {
        addMessage({ sender: 'ai', text: result.message });
      } else if (result.type === 'error' && result.message) {
        setErrorMessage(result.message);
      } else if (
        result.type === 'needs_parameters' &&
        result.agentId &&
        result.parameters
      ) {
        console.log('Parameters needed:', result.parameters);
        setParametersNeeded({ agentId: result.agentId, parameters: result.parameters });
        addMessage({
          sender: 'system',
          text: `Please provide parameters for the ${result.agentId} agent.`,
        });
        setErrorMessage(null);
      } else {
        console.warn('Unexpected API response structure:', result);
        setErrorMessage('Received an unexpected response from the server.');
      }
    } catch (error) {
      console.error('Error calling API:', error);
      let errorMsg = 'An unknown error occurred while contacting the server.';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      handleError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for speech recognition errors
  const handleError = (error: string | null) => {
    console.log('Handling error:', error);
    setErrorMessage(error);
    setParametersNeeded(null);
    setIsLoading(false);
  };

  // Handler for DynamicForm submission
  const handleFormSubmit = async (agentId: string, formData: Record<string, any>) => {
    console.log('Submitting parameters:', { agentId, formData });
    addMessage({
      sender: 'system',
      text: `Submitting parameters for ${agentId}...`,
    });
    setErrorMessage(null);
    setParametersNeeded(null); // Clear the form
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured.');
      }

      // Make API call with agentId and parameters
      const response = await fetch(`${apiUrl}/api/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send agentId and the collected parameters in the body
        body: JSON.stringify({ agentId: agentId, parameters: formData }), 
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) { /* Ignore */ }
        throw new Error(
          `API request failed with status ${response.status}: ${ 
            errorData?.message || response.statusText
          }`
        );
      }

      const result = await response.json();
      console.log('API Response (after parameters):', result);

      // Handle response after submitting parameters (likely success or error)
      if (result.type === 'success' && result.message) {
        addMessage({ sender: 'ai', text: result.message });
      } else if (result.type === 'error' && result.message) {
        setErrorMessage(result.message);
      } else {
        // Should not ideally ask for parameters again immediately,
        // but handle unexpected responses gracefully.
        console.warn('Unexpected API response structure after submitting parameters:', result);
        setErrorMessage('Received an unexpected response from the server after submitting parameters.');
      }

    } catch (error) {
      console.error('Error calling API with parameters:', error);
      let errorMsg = 'An unknown error occurred while submitting parameters.';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      handleError(errorMsg); // Reuse the existing error handler
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    console.log('Form cancelled');
    setParametersNeeded(null);
    setErrorMessage(null);
    addMessage({ sender: 'system', text: 'Parameter request cancelled.' });
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Ensure container takes full viewport height
          py: 4, // Add some vertical padding
        }}
      >
        {/* Pass messages to ConversationDisplay */}
        <ConversationDisplay messages={messages} />

        {/* Pass errorMessage to ErrorDisplay */}
        <ErrorDisplay errorMessage={errorMessage} />

        {/* Conditionally render DynamicForm or VoiceInputButton */}
        {parametersNeeded ? (
          <DynamicForm
            parametersNeeded={parametersNeeded}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        ) : (
          <VoiceInputButton
            isLoading={isLoading}
            onTranscript={handleTranscript}
            onError={handleError}
          />
        )}

        {/* TODO: Add DynamicForm component when needed */}
      </Box>
    </Container>
  );
}
