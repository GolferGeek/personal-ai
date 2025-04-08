# Personal AI - Coding Standards

## React Patterns & Best Practices

### Store-Driven UI Pattern

1. **Single source of truth in the store**
   - The store (Zustand) is the single source of truth for application state
   - UI components subscribe to the store and rerender when the store changes
   - Avoid storing state in multiple places

2. **Store update flow**
   - User actions trigger service methods
   - Service methods call the store's update methods
   - Store updates its state and notifies subscribers
   - UI components automatically update via subscription

3. **Message handling pattern**
   - User message appears immediately via `store.addLocalUserMessage`
   - API is called and response awaited
   - Assistant response added via `store.addMessage`
   - UI updates automatically due to subscription

### Service Hook Pattern

1. **Use service hooks for data operations**
   - Create dedicated service hooks (e.g., `useConversationService`) that handle API interactions
   - Service hooks should encapsulate business logic
   - Services orchestrate the flow but do not store or manipulate UI state directly

2. **Component responsibilities**
   - UI components should focus on rendering and user interactions
   - Components should delegate data operations to service hooks
   - Components read state directly from the store, not managed by the service

3. **State management**
   - Use Zustand store for global state that needs to persist
   - Service hooks connect components to store and APIs
   - Components receive callbacks from services, state from the store

### useEffect Best Practices

1. **Keep useEffect focused**
   - Each useEffect should have a single responsibility
   - Clearly comment the purpose of each useEffect
   - Minimize side effects in components

2. **Proper dependency arrays**
   - Always specify complete dependency arrays
   - Use service hooks for complex operations to avoid dependency issues
   - Avoid empty dependency arrays unless truly needed

3. **Cleanup properly**
   - Always return cleanup functions when setting up subscriptions
   - Use clearTimeout/clearInterval for timers
   - Cancel in-flight requests when components unmount

### Data Fetching Guidelines

1. **Don't mix React Query with store state**
   - Use React Query only for read-only data that doesn't need to be in the store
   - For state that should be consistent (like messages), keep it in the store
   - Configure React Query with appropriate cache settings

2. **Avoid unnecessary refetching**
   - **CRUCIAL RULE:** Only fetch data when explicitly needed (e.g., when a user takes an action)
   - When a user makes an API call (e.g., sending a message), update the store directly with the response
   - Don't rely on background refetching to update the UI
   - Configure React Query with appropriate settings:
     ```javascript
     {
       refetchOnWindowFocus: false,
       refetchOnReconnect: false,
       staleTime: Infinity,
       gcTime: Infinity
     }
     ```

3. **Handle optimistic updates properly**
   - When showing user input immediately, ensure proper merging with server data
   - Be careful with local IDs vs. server IDs
   - Use store update methods that handle duplicates and merging

4. **Error handling**
   - Centralize error handling in service hooks
   - Store errors in the store so they can be displayed consistently
   - Implement retry mechanisms for transient failures

## Code Organization

1. **File structure**
   - Group related files by feature
   - Keep files under 300 lines
   - Use index files to simplify imports

2. **Import order**
   - React and framework imports first
   - Third-party libraries next
   - Local components and hooks
   - Styles and assets last

3. **Naming conventions**
   - Use descriptive, consistent names
   - Prefix hooks with "use"
   - Services should be named for their domain (e.g., conversationService) 