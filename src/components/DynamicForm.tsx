'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

// Define form value types
type FormValue = string | number | boolean;
type FormData = Record<string, FormValue>;
type FormErrors = Record<string, string>;

// Define the form field structure
interface FormField {
  name: string;
  type: 'string' | 'number' | 'boolean';
  label: string;
  description?: string;
  required?: boolean;
  default?: FormValue;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (formData: FormData) => void;
  initialData?: FormData;
  submitLabel?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  initialData = {},
  submitLabel = 'Submit',
}) => {
  // Initialize form data with defaults from fields or initialData
  const [formData, setFormData] = useState<FormData>(() => {
    const data: FormData = {};
    fields.forEach((field) => {
      // Use initialData value if available, otherwise use field default, or empty string
      data[field.name] = initialData[field.name] !== undefined 
        ? initialData[field.name] 
        : (field.default !== undefined ? field.default : '');
    });
    return data;
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    let fieldValue: FormValue = value;

    // Handle different input types
    if (type === 'checkbox' || type === 'switch') {
      fieldValue = checked;
    } else if (type === 'number') {
      fieldValue = value === '' ? '' : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      // Check required fields
      if (field.required && 
          (formData[field.name] === undefined || 
           formData[field.name] === null || 
           formData[field.name] === '')) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }

      // Validate number fields
      if (field.type === 'number' && formData[field.name] !== '' && isNaN(Number(formData[field.name]))) {
        newErrors[field.name] = `${field.label} must be a valid number`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Process number fields
      const processedData = { ...formData };
      fields.forEach((field) => {
        if (field.type === 'number' && typeof processedData[field.name] === 'string') {
          processedData[field.name] = processedData[field.name] === '' 
            ? undefined 
            : Number(processedData[field.name]);
        }
      });
      
      onSubmit(processedData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {fields.map((field) => (
          <FormControl 
            key={field.name} 
            fullWidth 
            error={!!errors[field.name]}
            required={field.required}
          >
            {field.type === 'boolean' ? (
              <FormControlLabel
                control={
                  <Switch
                    name={field.name}
                    checked={Boolean(formData[field.name])}
                    onChange={handleInputChange}
                  />
                }
                label={
                  <Typography component="div">
                    {field.label}
                    {field.description && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {field.description}
                      </Typography>
                    )}
                  </Typography>
                }
              />
            ) : field.type === 'string' ? (
              <>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name] || field.description}
                  required={field.required}
                  fullWidth
                />
              </>
            ) : field.type === 'number' ? (
              <>
                <TextField
                  label={field.label}
                  name={field.name}
                  type="number"
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name] || field.description}
                  required={field.required}
                  fullWidth
                />
              </>
            ) : null}
          </FormControl>
        ))}

        <Button type="submit" variant="contained">
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}; 