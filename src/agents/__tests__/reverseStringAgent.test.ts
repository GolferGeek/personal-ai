import reverseStringAgent from "../reverseStringAgent";

// Describe block for the agent tests
describe("reverseStringAgent", () => {

  // Test case for successful string reversal
  it("should reverse a simple string correctly", async () => {
    const params = { inputText: "hello" };
    const result = await reverseStringAgent.execute(params);
    expect(result).toBe("olleh");
  });

  // Test case for reversal with spaces
  it("should handle strings with spaces", async () => {
    const params = { inputText: "hello world" };
    const result = await reverseStringAgent.execute(params);
    expect(result).toBe("dlrow olleh");
  });

  // Test case for an empty string
  it("should return an empty string when input is empty", async () => {
    const params = { inputText: "" };
    const result = await reverseStringAgent.execute(params);
    expect(result).toBe("");
  });

  // Test case for string with numbers and symbols
  it("should reverse strings with numbers and symbols", async () => {
    const params = { inputText: "123!@#abc" };
    const result = await reverseStringAgent.execute(params);
    expect(result).toBe("cba#@!321");
  });

  // Test case for invalid input type (e.g., number)
  it("should throw an error if inputText is not a string", async () => {
    const params = { inputText: 123 }; // Invalid input
    // Expect the execute function to throw an error
    await expect(reverseStringAgent.execute(params))
      .rejects
      .toThrow("Invalid input: Parameter 'inputText' must be a string, received type number.");
  });

  // Test case for missing input parameter
  it("should throw an error if inputText parameter is missing", async () => {
    const params = {}; // Missing inputText
    await expect(reverseStringAgent.execute(params))
      .rejects
      .toThrow("Invalid input: Parameter 'inputText' must be a string, received type undefined.");
  });

   // Test case for null input parameter
  it("should throw an error if inputText parameter is null", async () => {
    const params = { inputText: null };
    await expect(reverseStringAgent.execute(params))
      .rejects
      .toThrow("Invalid input: Parameter 'inputText' must be a string, received type object."); // typeof null is 'object'
  });
}); 