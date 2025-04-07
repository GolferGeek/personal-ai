// Define available models (can be expanded later)
// Example structure, potentially referencing environment variables for keys
export const availableModels = [
  // Example:
  // {
  //   provider: 'openai',
  //   model: 'gpt-4',
  //   apiKeyEnvVar: 'OPENAI_API_KEY',
  // },
  // {
  //   provider: 'anthropic',
  //   model: 'claude-3-opus-20240229',
  //   apiKeyEnvVar: 'ANTHROPIC_API_KEY',
  // },
];

// Define default LLM settings
export const defaultProvider = 'default-provider'; // Replace with your actual default
export const defaultModel = 'default-model'; // Replace with your actual default
export const defaultTemperature = 0.7;

// You might add more configuration options here, like:
// export const defaultMaxTokens = 1024;

// Interface for model definition (optional but good practice)
export interface LLMModel {
  provider: string;
  model: string;
  apiKeyEnvVar?: string; // Environment variable name for the API key
  // Add other potential properties like endpoint, specific config, etc.
} 