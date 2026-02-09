const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const connectToServer = async (hostname, port) => {
  const conn = await Deno.connect({
    hostname,
    port,
    transport: "tcp",
  });
  return conn;
};

const sendRequest = async (conn, req) => {
  await conn.write(encoder.encode(JSON.stringify(req)));
};

const readResponse = async (conn) => {
  const buffer = new Uint8Array(1024);
  const bytes = await conn.read(buffer);
  const response = decoder.decode(buffer.subarray(0, bytes));
  return JSON.parse(response);
};

export const handleUserRequest = async (conn, req) => {

  
  await sendRequest(conn, req);
  const response = await readResponse(conn);
  return response;
};
