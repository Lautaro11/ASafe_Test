import buildServer from "./server";

const server = buildServer();

export async function start() {
  try {
    await server.listen({ port: 3000 });
    server.log.info(`Server listening on http://localhost:3000`);
    return server;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();