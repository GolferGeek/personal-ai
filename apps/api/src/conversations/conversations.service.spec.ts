import { Test, TestingModule } from "@nestjs/testing";
import { ConversationsService } from "./conversations.service";
import { Conversation, Message, MessageRole } from "@personal-ai/models";
import { NotFoundException } from "@nestjs/common";

describe("ConversationsService", () => {
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationsService],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a conversation", async () => {
      const conversation = await service.create({ title: "Test Conversation" });

      expect(conversation).toBeDefined();
      expect(conversation.id).toBeDefined();
      expect(conversation.title).toBe("Test Conversation");
      expect(conversation.lastUpdated).toBeDefined();
    });

    it("should create a conversation with an initial message", async () => {
      const conversation = await service.create({
        title: "Test Conversation",
        initialMessage: "Hello, world!",
      });

      expect(conversation).toBeDefined();
      expect(conversation.messages).toHaveLength(1);
      expect(conversation.messages?.[0].content).toBe("Hello, world!");
      expect(conversation.messages?.[0].role).toBe("user");
    });
  });

  describe("findAll", () => {
    it("should return an array of conversations", async () => {
      await service.create({ title: "Test Conversation 1" });
      await service.create({ title: "Test Conversation 2" });

      const conversations = await service.findAll();

      expect(conversations).toBeInstanceOf(Array);
      expect(conversations.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("findOne", () => {
    it("should return a conversation by id", async () => {
      const createdConversation = await service.create({
        title: "Test Conversation",
      });

      const conversation = await service.findOne(createdConversation.id);

      expect(conversation).toBeDefined();
      expect(conversation.id).toBe(createdConversation.id);
      expect(conversation.title).toBe("Test Conversation");
    });

    it("should throw NotFoundException if conversation not found", async () => {
      await expect(service.findOne("nonexistent-id")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("update", () => {
    it("should update a conversation", async () => {
      const createdConversation = await service.create({ title: "Old Title" });

      const updatedConversation = await service.update(createdConversation.id, {
        title: "New Title",
      });

      expect(updatedConversation).toBeDefined();
      expect(updatedConversation.title).toBe("New Title");
    });

    it("should throw NotFoundException if conversation not found", async () => {
      await expect(
        service.update("nonexistent-id", { title: "New Title" })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    it("should delete a conversation", async () => {
      const createdConversation = await service.create({
        title: "Test Conversation",
      });

      await service.delete(createdConversation.id);

      await expect(service.findOne(createdConversation.id)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw NotFoundException if conversation not found", async () => {
      await expect(service.delete("nonexistent-id")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("addMessage", () => {
    it("should add a message to a conversation", async () => {
      const createdConversation = await service.create({
        title: "Test Conversation",
      });

      const message = await service.addMessage(createdConversation.id, {
        content: "Test message",
        role: "user",
      });

      expect(message).toBeDefined();
      expect(message.content).toBe("Test message");
      expect(message.role).toBe("user");

      const conversation = await service.findOne(createdConversation.id);
      expect(conversation.messages).toBeDefined();
    });

    it("should create conversation if not found", async () => {
      const nonExistentId = "non-existent-id";

      const message = await service.addMessage(nonExistentId, {
        content: "Test message",
        role: "user",
      });

      expect(message).toBeDefined();

      const conversation = await service.findOne(nonExistentId);
      expect(conversation).toBeDefined();
      expect(conversation.title).toBe("Recovered Conversation");
    });
  });

  describe("getMessages", () => {
    it("should get messages from a conversation", async () => {
      const createdConversation = await service.create({
        title: "Test Conversation",
      });

      await service.addMessage(createdConversation.id, {
        content: "Message 1",
        role: "user",
      });

      await service.addMessage(createdConversation.id, {
        content: "Message 2",
        role: "assistant",
      });

      const messages = await service.getMessages(createdConversation.id);

      expect(messages).toBeInstanceOf(Array);
      expect(messages.length).toBe(2);
      expect(messages[0].content).toBe("Message 1");
      expect(messages[1].content).toBe("Message 2");
    });
  });
});
