'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  FormControlLabel, 
  Switch, 
  CircularProgress,
  Divider
} from '@mui/material';
import { ParametersNeededState } from '../models/conversation';

interface DynamicFormProps {
  parametersNeeded: ParametersNeededState;
  onSubmit: (agentId: string, formData: Record<string, any>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  parametersNeeded,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  // Initialize form data based on parameters with defaults
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when parameters change
  useEffect(() => {
    const initialData: Record<string, any> = {};
    parametersNeeded.parameters.forEach(param => {
      // Set default value based on parameter type if available
      initialData[param.name] = param.default !== undefined 
        ? param.default 
        : param.type === 'boolean' 
          ? false 
          : param.type === 'number' 
            ? 0 
            : '';
    });
    setFormData(initialData);
    setErrors({});
  }, [parametersNeeded]);

  const handleInputChange = (name: string, value: any, type: string) => {
    let processedValue = value;
    
    // Convert value based on expected type
    if (type === 'number' && typeof value === 'string') {
      processedValue = value === '' ? '' : Number(value);
    } else if (type === 'boolean' && typeof value === 'string') {
      processedValue = value === 'true';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error if field was previously in error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    parametersNeeded.parameters.forEach(param => {
      // Check required fields
      if (param.required) {
        if (
          formData[param.name] === undefined || 
          formData[param.name] === '' ||
          (param.type === 'number' && isNaN(formData[param.name]))
        ) {
          newErrors[param.name] = 'This field is required';
        }
      }
      
      // Validate number type
      if (
        param.type === 'number' && 
        formData[param.name] !== undefined && 
        formData[param.name] !== '' && 
        isNaN(Number(formData[param.name]))
      ) {
        newErrors[param.name] = 'Must be a valid number';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert empty strings for number fields to actual numbers with value 0
      const processedData = { ...formData };
      parametersNeeded.parameters.forEach(param => {
        if (param.type === 'number' && processedData[param.name] === '') {
          processedData[param.name] = 0;
        }
      });
      
      console.log('Submitting form with data:', processedData);
      onSubmit(parametersNeeded.agentId, processedData);
    }
  };

  return (
    <Paper 
      elevation={3}
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        p: 3, 
        mb: 3, 
        width: '100%',
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Additional Information Needed
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {parametersNeeded.parameters.map(param => (
        <Box key={param.name} sx={{ mb: 2 }}>
          {param.type === 'boolean' ? (
            <FormControlLabel
              control={
                <Switch
                  checked={!!formData[param.name]}
                  onChange={(e) => handleInputChange(param.name, e.target.checked, 'boolean')}
                  disabled={isLoading}
                />
              }
              label={param.description || param.name}
            />
          ) : (
            <TextField
              fullWidth
              label={param.description || param.name}
              type={param.type === 'number' ? 'number' : 'text'}
              value={formData[param.name] ?? ''}
              onChange={(e) => handleInputChange(param.name, e.target.value, param.type)}
              error={!!errors[param.name]}
              helperText={errors[param.name] || ''}
              required={param.required}
              disabled={isLoading}
            />
          )}
        </Box>
      ))}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isLoading}
          endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default DynamicForm; 