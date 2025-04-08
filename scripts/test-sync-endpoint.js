/**
 * Simple script to test the synchronous messages endpoint
 * 
 * Usage:
 *   node scripts/test-sync-endpoint.js <conversation-id> <message>
 * 
 * Example:
 *   node scripts/test-sync-endpoint.js 123 "Hello, how are you?"
 */

// Get command line arguments
const args = process.argv.slice(2);
const conversationId = args[0] || '123';
const message = args[1] || 'Test message from script';

// Set environment variable to use mock API
process.env.MOCK_API = 'true';

// Function to make the request
async function testSyncEndpoint() {
  console.log('Testing synchronous messages endpoint:');
  console.log(`- Conversation ID: ${conversationId}`);
  console.log(`- Message: "${message}"`);
  
  try {
    // Create the request URL
    const url = `http://localhost:3000/api/conversations/${conversationId}/messages/sync`;
    
    // Make the request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user'
      },
      body: JSON.stringify({
        content: message,
        role: 'user'
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    // Parse and display the response
    const data = await response.json();
    console.log('\nResponse:');
    console.log(JSON.stringify(data, null, 2));
    
    // Extract and display the assistant message
    if (data.assistantMessage) {
      console.log('\nAssistant response:');
      console.log(`"${data.assistantMessage.content}"`);
    }
  } catch (error) {
    console.error('Error testing endpoint:', error);
  }
}

// Run the test
testSyncEndpoint(); 