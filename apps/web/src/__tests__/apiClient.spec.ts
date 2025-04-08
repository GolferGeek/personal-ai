import { ApiClient } from "../../app/utils/api-client";

// Mock fetch implementation
global.fetch = jest.fn();

describe("ApiClient", () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockReset();
  });

  describe("getConversations", () => {
    it("should fetch conversations", async () => {
      const mockConversations = [
        {
          id: "1",
          title: "Conversation 1",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Conversation 2",
          lastUpdated: new Date().toISOString(),
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockConversations),
      });

      const result = await ApiClient.getConversations();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/conversations")
      );
      expect(result).toEqual(mockConversations);
    });

    it("should throw an error if the fetch is not successful", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(ApiClient.getConversations()).rejects.toThrow(
        "Failed to fetch conversations"
      );
    });
  });

  describe("createConversation", () => {
    it("should create a conversation", async () => {
      const mockConversation = {
        id: "1",
        title: "New Conversation",
        lastUpdated: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockConversation),
      });

      const result = await ApiClient.createConversation({
        title: "New Conversation",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/conversations"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ title: "New Conversation" }),
        })
      );
      expect(result).toEqual(mockConversation);
    });
  });

  describe("generateResponse", () => {
    it("should generate a response", async () => {
      const mockResponse = {
        id: "1",
        conversationId: "1",
        content: "Generated response",
        role: "assistant",
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await ApiClient.generateResponse("1", "Test message");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/orchestration/conversations/1/generate"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ message: "Test message" }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
