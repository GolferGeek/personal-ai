import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/conversations (GET)", () => {
    return request(app.getHttpServer())
      .get("/conversations")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it("/conversations (POST)", () => {
    return request(app.getHttpServer())
      .post("/conversations")
      .send({ title: "E2E Test Conversation" })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.title).toBe("E2E Test Conversation");
      });
  });

  it("/conversations/:id (GET)", async () => {
    // First create a conversation
    const createResponse = await request(app.getHttpServer())
      .post("/conversations")
      .send({ title: "Test Get Conversation" });

    const conversationId = createResponse.body.id;

    // Then retrieve it
    return request(app.getHttpServer())
      .get(`/conversations/${conversationId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(conversationId);
        expect(res.body.title).toBe("Test Get Conversation");
      });
  });

  it("/orchestration/agents/summary (GET)", () => {
    return request(app.getHttpServer())
      .get("/orchestration/agents/summary")
      .expect(200)
      .expect((res) => {
        expect(res.body.count).toBeDefined();
        expect(Array.isArray(res.body.agents)).toBe(true);
      });
  });

  it("/api/mcp (POST)", () => {
    return request(app.getHttpServer())
      .post("/api/mcp")
      .send({ task_id: "get_fixed_data" })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body.data.message).toBeDefined();
      });
  });
});
