import { AgentInfo, AgentMetadata, ParameterDefinition } from "../lib/types";

// Define the metadata for the reverseString agent
const metadata: AgentMetadata = {
  id: "reverseString",
  name: "Reverse String Agent",
  description: "Reverses the provided input text.",
  parameters: [
    {
      name: "inputText",
      type: "string",
      required: true,
      description: "The text string to reverse.",
      control: "textInput",
    },
  ],
};

// Define the execution logic for the agent
async function run(params: Record<string, any>): Promise<string> {
  const inputText = params.inputText;

  // Add runtime validation for the parameter
  if (typeof inputText !== 'string') {
    // Provide a more informative error message
    throw new Error(`Invalid input: Parameter 'inputText' must be a string, received type ${typeof inputText}.`);
  }
  return inputText.split("").reverse().join("");
}

// Combine metadata and execution logic into the AgentInfo structure
const reverseStringAgent: AgentInfo = {
  ...metadata,
  execute: run,
};

export default reverseStringAgent; 