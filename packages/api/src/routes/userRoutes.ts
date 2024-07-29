import { FastifyInstance } from "fastify";
import { $ref } from "schemas/src/usersSchema";
import {
  getUsersHandler,
  createUserHandler,
  loginHandler,
  getUserByIdHandler,
  updateUserHandler,
  profilePictureHandler,
  getProfilePictureHandler,
} from "../controllers/userController";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/login",
    {
      schema: {
        tags: ["Users"],
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.post(
    "/",
    {
      schema: {
        tags: ["Users"],
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    createUserHandler
  );

  server.patch(
    "/",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Users"],
        body: $ref("updateUserSchema"),
        response: {
          201: $ref("updateUserResponseSchema"),
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    updateUserHandler
  );

  server.get(
    "/",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Users"],
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    getUsersHandler
  );

  server.get(
    "/:id",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Users"],
        params: $ref("getUserByIdParamsSchema"),
        querystring: $ref("getUserByIdQuerySchema"),
        response: {
          200: $ref("getUserByIdResponseSchema"),
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    },
    getUserByIdHandler
  );

  server.put(
    "/profilePicture",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Users"],
        body: $ref("profilePictureSchema"),
        response: {
          200: $ref("profilePictureResponseSchema"),
        },
      },
    },
    profilePictureHandler
  );

  server.get(
    "/profilePicture",
    {
      preHandler: server.authenticateJWT,
      schema: {
        tags: ["Users"],
        response: {
          200: $ref("profilePictureResponseSchema"),
        },
      },
    },
    getProfilePictureHandler
  );
}

export default userRoutes;
