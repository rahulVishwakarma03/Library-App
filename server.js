import { Library } from "./src/library.js";
import { handleRequest } from "./src/request_handler.js";

const BUFFER_SIZE = 1024;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const readRequest = async (conn) => {
  const buffer = new Uint8Array(BUFFER_SIZE);
  const bytes = await conn.read(buffer);
  if (!bytes) {
    throw new Error("connection interrupted");
  }
  const request = decoder.decode(buffer.subarray(0, bytes));

  return JSON.parse(request);
};

const writeResponse = async (conn, response) => {
  await conn.write(encoder.encode(JSON.stringify(response)));
};

const handleConnection = async (conn, library) => {
  while (true) {
    try {
      const request = await readRequest(conn);
      const response = handleRequest(library, request);
      await writeResponse(conn, response);
    } catch {
      conn.close();
      return;
    }
  }
};

const main = async (port) => {
  const listener = Deno.listen({
    port,
    transport: "tcp",
  });

  console.log("listening...", port);
  const library = new Library({});

  for await (const conn of listener) {
    handleConnection(conn, library);
  }
};

await main(Deno.env.get("LIBRARY_PORT") || 8000);
