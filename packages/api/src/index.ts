import buildServer from "./server";

const server = buildServer();

export async function start() {
  let port = process.env.PORT || 4000;
  if (typeof port === "string") {
    port = parseInt(port);
  }
  try {
    await server.listen({ port: port, host: "0.0.0.0" });
    const serverAddress = server.server.address();
    if (serverAddress && typeof serverAddress === "object") {
      const { address, port, family } = serverAddress;
      const formattedAddress =
        family === "IPv6" && address === "::1" ? `[::1]` : address;
      const serverUrl = `http://${formattedAddress}:${port}`;
      console.log(serverUrl);
    }
    return server;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
