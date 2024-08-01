import { FastifyInstance } from "fastify";
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { CreateUserInput, createUserResponseSchema, deleteUserResponseSchema, LoginInput, loginResponseSchema } from "schemas/src/usersSchema";
import { start } from "api/src/index";

describe("User Routes", () => {
  let server: FastifyInstance;
  let user: any;
  let token: string;

  beforeAll(async () => {
    server = await start();
  });

  afterAll(() => {
    server.close();
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const mockUser: CreateUserInput = {
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        password: "password123"
      };

      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: mockUser,
      });

      expect(response.statusCode).toBe(201);
      user = JSON.parse(response.payload);
      const result = createUserResponseSchema.safeParse(user);
      expect(result.success).toBe(true);
    });
  });
  
  describe("POST /users/login", () => {
    it("should create a new user", async () => {
      const mockUserLogin: LoginInput = {
        email: "test@example.com",
        password: "password123"
      };

      let response = await server.inject({
        method: "POST",
        url: "/users/login",
        payload: mockUserLogin,
      });

      expect(response.statusCode).toBe(200);
      const result = loginResponseSchema.safeParse(JSON.parse(response.payload));
      expect(result.success).toBe(true);
      token = JSON.parse(response.payload).token;
    });
  });

  describe("DELETE /users", () => {
    it("should create a new user", async () => {

      let response = await server.inject({
        method: "DELETE",
        url: "/users",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      user = JSON.parse(response.payload);
      const result = deleteUserResponseSchema.safeParse(user);
      expect(result.success).toBe(true);
    });
  });
});