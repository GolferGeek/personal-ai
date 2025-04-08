import reverseStringAgent from './reverseStringAgent';

// Note: Simple agent logic might not need NestJS testing utilities
// Plain Jest/Vitest is sufficient here.

describe('reverseStringAgent', () => {
  // Test agent metadata
  describe('metadata', () => {
    it('should have the correct id', () => {
      expect(reverseStringAgent.id).toBe('reverseStringAgent');
    });

    it('should have a name', () => {
      expect(reverseStringAgent.name).toBeDefined();
      expect(typeof reverseStringAgent.name).toBe('string');
    });

    it('should have a description', () => {
      expect(reverseStringAgent.description).toBeDefined();
      expect(typeof reverseStringAgent.description).toBe('string');
    });

    it('should define required parameters', () => {
      expect(reverseStringAgent.parameters).toBeDefined();
      expect(Array.isArray(reverseStringAgent.parameters)).toBe(true);
      
      // Check for the text parameter
      const textParam = reverseStringAgent.parameters.find(p => p.name === 'text');
      expect(textParam).toBeDefined();
      // Only continue testing if parameter is found
      if (textParam) {
        expect(textParam.type).toBe('string');
        expect(textParam.required).toBe(true);
      }
    });
  });

  // Test agent execution
  describe('execute', () => {
    it('should reverse a simple string', async () => {
      const result = await reverseStringAgent.execute({ text: 'hello' });
      expect(result).toBeDefined();
      expect(result.reversed).toBe('olleh');
      expect(result.original).toBe('hello');
      expect(result.message).toContain('Reversed text: olleh');
    });

    it('should handle empty strings', async () => {
      const result = await reverseStringAgent.execute({ text: '' });
      expect(result).toBeDefined();
      expect(result.reversed).toBe('');
      expect(result.original).toBe('');
    });

    it('should throw an error for non-string inputs', async () => {
      await expect(reverseStringAgent.execute({ text: 123 })).rejects.toThrow();
      await expect(reverseStringAgent.execute({ text: null })).rejects.toThrow();
      await expect(reverseStringAgent.execute({ text: undefined })).rejects.toThrow();
      await expect(reverseStringAgent.execute({ wrongParam: 'hello' })).rejects.toThrow();
    });
  });
}); 