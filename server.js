import { Library } from "./src/library.js";
import { processRequest } from "./src/library_manager.js";

const BUFFER_SIZE = 1024;

const handleConnection = async (conn, library) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const buffer = new Uint8Array(BUFFER_SIZE);

  const bytes = await conn.read(buffer);
  const request = JSON.parse(decoder.decode(buffer.subarray(0, bytes)));
  const response = processRequest(library, request);
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
