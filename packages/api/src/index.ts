import buildServer from "./server";

const server = buildServer();

export async function start() {
  let port = process.env.PORT || 4000;
  if (typeof port === "string") {
    port = parseInt(port);
  }
  try {
    await server.listen({ port: port });
    const addressInfo = server.server.address();
    console.log("address", addressInfo?.toString());
    // server.log.info(`Server listening at ${addressInfo}`);
    return server;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();