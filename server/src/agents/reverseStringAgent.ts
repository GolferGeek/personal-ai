import { AgentInfo } from '../../../types';

/**
 * A simple agent that reverses a string.
 */
const reverseStringAgent: AgentInfo = {
  id: 'reverseString',
  name: 'Reverse String Agent',
  description: 'Reverses the provided string input',
  parameters: [
    {
      name: 'text',
      description: 'The text that will be reversed',
      type: 'string',
      required: true,
    },
  ],
  execute: async (params: { text: string }) => {
    console.log('⚡ reverseStringAgent received request with params:', params);
    
    // Validate parameters
    if (!params.text) {
      console.error('❌ reverseStringAgent error: Text parameter is required');
      throw new Error('Text parameter is required');
    }

    // Reverse the string
    const reversed = params.text.split('').reverse().join('');
    console.log(`✅ reverseStringAgent success: "${params.text}" → "${reversed}"`);
    
    return {
      result: reversed,
    };
  },
};

export default reverseStringAgent; 