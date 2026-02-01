export const connectToServer = async (hostname, port) => {
  const conn = await Deno.connect({
    hostname,
    port,
    transport: "tcp",
  });
  return conn
};

export const handleUserRequest = async (conn, req) => {
  const buffer = new Uint8Array(1024);

  await conn.write(new TextEncoder().encode(JSON.stringify(req)));
  const bytes = await conn.read(buffer);
  const response = JSON.parse(new TextDecoder().decode(buffer.subarray(0, bytes)));
  return response;
};
