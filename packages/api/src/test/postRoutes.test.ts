import { FastifyInstance } from "fastify";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import {
  createPostResponseSchema,
  deletePostResponseSchema,
  GetPostByIdInput,
  UpdatePostInput,
} from "schemas/src/postsSchema";
import { start } from "api/src/index";
import { CreatePostInput } from "schemas/src/postsSchema";

describe("Post Routes", () => {
  let server: FastifyInstance;
  let post: any;
  let token: string;

  beforeAll(async () => {
    server = await start();
    let response = await server.inject({
      method: "POST",
      url: "/users/login",
      payload: {
        email: "testPost@example.com",
        password: "12345678",
      },
    });
    token = JSON.parse(response.payload).token;
  });

  afterAll(() => {
    server.close();
  });

  describe("POST /posts", () => {
    it("should create a new post", async () => {
      const mockPost: CreatePostInput = {
        title: "Post Example",
        content: "The content",
      };

      const response = await server.inject({
        method: "POST",
        url: "/posts",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: mockPost,
      });

      expect(response.statusCode).toBe(201);
      post = JSON.parse(response.payload);
      const result = createPostResponseSchema.safeParse(post);
      expect(result.success).toBe(true);
    });
  });

  describe("PATCH /posts/:id", () => {
    it("should update a post", async () => {
      const mockPost: UpdatePostInput = {
        title: "Updated Post Example",
        content: "Updated content",
      };

      const response = await server.inject({
        method: "PATCH",
        url: "/posts/" + post.id,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: mockPost,
      });

      expect(response.statusCode).toBe(200);
      post = JSON.parse(response.payload);
      const result = createPostResponseSchema.safeParse(post);
      expect(result.success).toBe(true);
    });
  });

  describe("DELETE /posts/:id", () => {
    it("should delete a post", async () => {
      const mockPost: GetPostByIdInput = {
        id: post.id,
      };

      const response = await server.inject({
        method: "DELETE",
        url: "/posts/" + mockPost.id,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      expect(response.statusCode).toBe(200);
      post = JSON.parse(response.payload);
      const result = deletePostResponseSchema.safeParse(post);
      expect(result.success).toBe(true);
    });
  });
});
