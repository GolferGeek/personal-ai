# State Management Guidelines

## Zustand Store Template

```tsx
// src/store/someStore.ts
import { create } from 'zustand';

interface SomeState {
  // State properties
  items: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: string) => void;
  removeItem: (index: number) => void;
  fetchItems: () => Promise<void>;
  clearErrors: () => void;
}

export const useSomeStore = create<SomeState>((set, get) => ({
  // Initial state
  items: [],
  loading: false,
  error: null,
  
  // Actions
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  
  removeItem: (index) => set((state) => ({ 
    items: state.items.filter((_, i) => i !== index) 
  })),
  
  fetchItems: async () => {
    try {
      set({ loading: true, error: null });
      // API call
      const response = await fetch('/api/items');
      const data = await response.json();
      set({ items: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
  clearErrors: () => set({ error: null })
}));
```

## State Management Principles

1. **Backend State** (Persistent Data)
   - Conversation history
   - User profiles
   - System configurations
   - Should be stored in database with API access

2. **Frontend State** (UI/Temporary State)
   - Loading indicators
   - Modal visibility
   - Form input values before submission
   - UI preferences
   - Use Zustand stores

3. **Component-Level State**
   - Temporary form values
   - Toggle state for UI elements
   - Use React's useState/useReducer

## Best Practices

- Separate UI state from business logic
- Use selectors to access only needed portions of state
- Create multiple stores based on domains
- Implement proper error handling
- Use middleware for side effects when needed
- Include loading states for async operations
- Normalize complex data structures
- Avoid deeply nested state objects 