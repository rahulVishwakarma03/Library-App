import { Library } from "./src/library.js";

const BUFFER_SIZE = 1024;

const handleRequest = (request, library) => {
  if (request.command === "registerCustomer") {
    const { customerName, email, password } = request.data;
    return library.registerCustomer(customerName, email, password);
  }
  return {success : false};
};

const handleConnection = async (conn, library) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const buffer = new Uint8Array(BUFFER_SIZE);
  const bytes = await conn.read(buffer);
  const request = JSON.parse(decoder.decode(buffer.subarray(0, bytes)));
  const response = handleRequest(request, library);
  await conn.write(encoder.encode(JSON.stringify(response)));
};

const main = async (port = 8000) => {
  const listener = Deno.listen({
    port,
    transport: "tcp",
  });

  console.log("listening...");
  const library = new Library({});
  for await (const conn of listener) {
    await handleConnection(conn, library);
  }
  conn.close();
};

await main();
