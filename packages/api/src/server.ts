import Fastify from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import { userSchemas } from "schemas/src/usersSchema";
import { postSchemas } from "schemas/src/postsSchema";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
//swagger
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";
import { authenticateJWT } from "./middlewares/authMiddleware";
//websocket
import websocket from "@fastify/websocket";
import { WebSocket as WS } from "ws";
import * as dotenv from "dotenv";

const clients = new Set<WS>();

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

export const notifyClients = (message: string) => {
  try {
    for (const client of clients) {
      if (client.readyState === WS.OPEN) {
        client.send(message);
      }
    }
  } catch (error) {
    console.log("Error on ws")
  }
};

function buildServer() {
  dotenv.config();
  const server = Fastify({ logger: true });

  server.register(fjwt, {
    secret: process.env.JWT_SECRET || "the_secret",
  });

  server.decorate("authenticateJWT", authenticateJWT);

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  for (const schema of [...userSchemas, ...postSchemas]) {
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
    routePrefix: "/",
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
  server.register(postRoutes, { prefix: "/posts" });

  // WebSocket route
  server.register(websocket);

  server.register(async (fastify) => {
    fastify.get(
      "/ws",
      {
        websocket: true,
        schema: {
          hide: true,
        },
      },
      (connection, request) => {
        clients.add(connection);

        connection.on("message", (message: string) => {
          for (const client of clients) {
            if (client.readyState === WS.OPEN) {
              client.send(message);
            }
          }
        });

        connection.on("close", () => {
          clients.delete(connection);
        });
      }
    );
  });

  server.get("/notifications", (request, reply) => {
    const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
    reply.type("text/html").send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WebSocket Notifications</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          #notifications { border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: scroll; }
          .message { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>WebSocket Notifications</h1>
        <div id="notifications"></div>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const ws = new WebSocket('${serverUrl}/ws');
            const notifications = document.getElementById('notifications');
            
            ws.onmessage = (event) => {
              const message = event.data;
              const div = document.createElement('div');
              div.classList.add('message');
              div.textContent = message;
              notifications.appendChild(div);
              notifications.scrollTop = notifications.scrollHeight; // Auto-scroll to the bottom
            };
            
            ws.onerror = (error) => {
              const div = document.createElement('div');
              div.classList.add('message');
              div.textContent = 'WebSocket error: ' + error.message;
              notifications.appendChild(div);
            };
          });
        </script>
      </body>
      </html>
    `);
  });

  return server;
}

export default buildServer;
