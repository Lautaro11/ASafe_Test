import buildServer from "./server";

const server = buildServer();

export async function start() {
  const PORT = parseInt(process.env.PORT || '3000', 10);
  try {
    await server.listen({ port: PORT });
    server.log.info(`Server listening on http://localhost:3000`);
    return server;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();