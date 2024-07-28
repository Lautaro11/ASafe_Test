import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import { userSchemas } from "schemas/src/usersSchema";
// import { postSchemas } from "schemas/src/postsSchema";
import userRoutes from "./routes/userRoutes";
// import postRoutes from "./routes/postRoutes";
//swagger
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";
import { authenticateJWT } from "./middlewares/authMiddleware";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticateJWT: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}

function buildServer() {
  const server = Fastify({ logger: true });

  server.register(fjwt, {
    secret: process.env.JWT_SECRET || "the_secret",
  });

  server.decorate("authenticateJWT", authenticateJWT);

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  for (const schema of [...userSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      mode: "dynamic",
      openapi: {
        info: {
          title: "ASafe Technical Test",
          description: "API documentation",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
        tags: [
          { name: "Users", description: "User related end-points" },
          { name: "Posts", description: "Post related end-points" },
        ],
      },
    })
  );

  server.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "none",
      deepLinking: false,
    },
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  server.register(userRoutes, { prefix: "/users" });
  // server.register(postRoutes, { prefix: "/posts" });

  return server;
}

export default buildServer;
