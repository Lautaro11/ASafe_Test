import { FastifyInstance } from "fastify";
import { $ref } from "schemas/src/postsSchema";
import {
  createPostHandler,
  deletePostHandler,
  getPostByIdHandler,
  getPostsHandler,
  updatePostHandler,
} from "../controllers/postController";

async function postRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Posts"],
        body: $ref("createPostSchema"),
        response: {
          201: $ref("createPostResponseSchema"),
        },
      },
    },
    createPostHandler
  );

  server.patch(
    "/:id",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Posts"],
        params: $ref("getPostByIdSchema"),
        body: $ref("updatePostSchema"),
        response: {
          201: $ref("updatePostResponseSchema"),
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    updatePostHandler
  );

  server.get(
    "/",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Posts"],
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    getPostsHandler
  );

  server.get(
    "/:id",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Posts"],
        params: $ref("getPostByIdSchema"),
        response: {
          200: $ref("getPostByIdResponseSchema"),
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    getPostByIdHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Posts"],
        params: $ref("getPostByIdSchema"),
        response: {
          200: $ref("deletePostResponseSchema"),
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    deletePostHandler
  );
}

export default postRoutes;
