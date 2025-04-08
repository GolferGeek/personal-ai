import { AgentInfo } from '../../../types';

/**
 * Simple agent that reverses a string.
 */
const reverseStringAgent: AgentInfo = {
  id: 'reverseStringAgent',
  name: 'Reverse String Agent',
  description: 'An agent that reverses the characters in a provided string.',
  parameters: [
    {
      name: 'text',
      type: 'string',
      description: 'The text to reverse',
      required: true,
    },
  ],
  async execute(params: Record<string, any>): Promise<any> {
    // Extract and validate the 'text' parameter
    const text = params.text;
    
    if (typeof text !== 'string') {
      throw new Error('The "text" parameter must be a string');
    }

    // Perform the reversal operation
    const reversedText = text.split('').reverse().join('');

    // Return a formatted response
    return { 
      message: `Reversed text: ${reversedText}`,
      original: text,
      reversed: reversedText
    };
  }
};

// Export the agent as the default export
export default reverseStringAgent; 