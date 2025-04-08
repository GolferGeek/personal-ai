// Helper to store and retrieve user ID
export const getUserId = (): string => {
  // Check localStorage for existing user ID
  if (typeof window === 'undefined') {
    return '';
  }
  
  let userId = localStorage.getItem('userId');
  
  // If no userId in storage, create one when we're in the browser
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  
  return userId;
};

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }
  return response.json();
}; 