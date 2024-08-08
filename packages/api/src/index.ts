import buildServer from "./server";

const server = buildServer();

export async function start() {
  let port = process.env.PORT || 3000;
  if (typeof port === "string") {
    port = parseInt(port);
  }

  let host = process.env.HOST;
  
  try {
    let serverParams = { port } as any;
    if (host) {serverParams.host = host};
    await server.listen(serverParams);
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
