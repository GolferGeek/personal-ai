import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { ParameterDefinition, ParametersNeededState } from '../store/conversationStore';

interface DynamicFormProps {
  parametersNeeded: ParametersNeededState;
  onSubmit: (agentId: string, formData: Record<string, any>) => void;
  onCancel: () => void; // Add a cancel handler prop
  isLoading: boolean; // To disable form during submission
}

const DynamicForm: React.FC<DynamicFormProps> = ({ parametersNeeded, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Initialize form data based on parameter definitions
    const initialData: Record<string, any> = {};
    parametersNeeded.parameters.forEach(param => {
      initialData[param.name] = param.type === 'boolean' ? false : ''; // Default values
    });
    return initialData;
  });

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add basic validation based on param.required
    console.log('Submitting form data:', formData);
    onSubmit(parametersNeeded.agentId, formData);
  }, [formData, onSubmit, parametersNeeded.agentId]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ border: '1px solid orange', p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Parameters needed for: {parametersNeeded.agentId}
      </Typography>
      {parametersNeeded.parameters.map(param => (
        <Box key={param.name} sx={{ mb: 2 }}>
          {param.type === 'string' && (
            <TextField
              fullWidth
              required={param.required}
              name={param.name}
              label={param.description || param.name}
              value={formData[param.name] || ''}
              onChange={handleChange}
              disabled={isLoading}
              variant="outlined"
            />
          )}
          {param.type === 'number' && (
            <TextField
              fullWidth
              required={param.required}
              type="number"
              name={param.name}
              label={param.description || param.name}
              value={formData[param.name] || ''}
              onChange={handleChange}
              disabled={isLoading}
              variant="outlined"
            />
          )}
          {param.type === 'boolean' && (
            <FormControlLabel
              control={
                <Checkbox
                  name={param.name}
                  checked={formData[param.name] || false}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              }
              label={param.description || param.name}
            />
          )}
          {/* Add other input types as needed */}
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button type="button" onClick={onCancel} disabled={isLoading} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} variant="contained">
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicForm; 