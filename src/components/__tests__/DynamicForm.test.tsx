import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicForm from '../DynamicForm';
import { ParametersNeededState } from '../../models/conversation';

describe('DynamicForm', () => {
  const mockParametersNeeded: ParametersNeededState = {
    agentId: 'reverseString',
    parameters: [
      {
        name: 'text',
        type: 'string',
        description: 'Text to reverse',
        required: true
      },
      {
        name: 'uppercase',
        type: 'boolean',
        description: 'Convert to uppercase before reversing',
        required: false,
        default: false
      },
      {
        name: 'repeat',
        type: 'number',
        description: 'Number of times to repeat',
        required: false,
        default: 1
      }
    ]
  };

  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with all parameter types', () => {
    render(
      <DynamicForm
        parametersNeeded={mockParametersNeeded}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={false}
      />
    );
    
    // Check title
    expect(screen.getByText('Additional Information Needed')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByLabelText(/Text to reverse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Convert to uppercase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of times/i)).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('submits form with values', () => {
    render(
      <DynamicForm
        parametersNeeded={mockParametersNeeded}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={false}
      />
    );
    
    // Fill the string field
    fireEvent.change(screen.getByLabelText(/Text to reverse/i), {
      target: { value: 'Hello World' }
    });
    
    // Toggle the boolean switch
    fireEvent.click(screen.getByLabelText(/Convert to uppercase/i));
    
    // Change the number field
    fireEvent.change(screen.getByLabelText(/Number of times/i), {
      target: { value: '3' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Check if onSubmit was called with correct values
    expect(mockSubmit).toHaveBeenCalledWith('reverseString', {
      text: 'Hello World',
      uppercase: true,
      repeat: 3
    });
  });

  test('validates required fields', () => {
    render(
      <DynamicForm
        parametersNeeded={mockParametersNeeded}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={false}
      />
    );
    
    // Submit without filling required field
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Validation should prevent submission
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <DynamicForm
        parametersNeeded={mockParametersNeeded}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={false}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockCancel).toHaveBeenCalled();
  });

  test('disables inputs and buttons when loading', () => {
    render(
      <DynamicForm
        parametersNeeded={mockParametersNeeded}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={true}
      />
    );
    
    // Check that inputs are disabled
    expect(screen.getByLabelText(/Text to reverse/i)).toBeDisabled();
    
    // Check that buttons are disabled
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
}); 