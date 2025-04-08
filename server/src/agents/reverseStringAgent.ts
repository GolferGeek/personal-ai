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
    // Validate parameters
    if (!params.text) {
      throw new Error('Text parameter is required');
    }

    // Reverse the string
    const reversed = params.text.split('').reverse().join('');
    
    return {
      result: reversed,
    };
  },
};

export default reverseStringAgent; 