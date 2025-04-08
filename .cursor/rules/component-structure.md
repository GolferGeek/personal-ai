# Component Structure Guidelines

## React Component Template

```tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { SomeType } from '../models/types';

interface ComponentNameProps {
  // Define props here
  someProperty: string;
  onSomeEvent?: (value: string) => void;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  someProperty,
  onSomeEvent
}) => {
  // State hooks
  const [state, setState] = React.useState<string>('');
  
  // Effect hooks
  React.useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, [someProperty]);
  
  // Event handlers
  const handleEvent = () => {
    if (onSomeEvent) {
      onSomeEvent(state);
    }
  };
  
  // Render
  return (
    <Box>
      <Typography variant="h6">{someProperty}</Typography>
      {/* Component JSX */}
    </Box>
  );
};

export default ComponentName;
```

## Test Template

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName someProperty="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('calls onSomeEvent when triggered', () => {
    const mockHandler = jest.fn();
    render(<ComponentName someProperty="test" onSomeEvent={mockHandler} />);
    
    // Trigger the event
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

## Best Practices

1. Declare component at the top level with named export
2. Use explicit type annotations for props and state
3. Group related hooks together
4. Extract complex logic to custom hooks
5. Keep components focused on a single responsibility
6. Use proper semantic HTML elements
7. Add appropriate accessibility attributes
8. Implement proper error handling 