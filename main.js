const HOSTNAME = "127.0.0.1";
const PORT = 8000;

const connectToServer = async (hostname, port) => {
  const conn = await Deno.connect({
    hostname,
    port,
    transport: "tcp",
  });
  return conn
};

const sendRequest = async (conn, req) => {
  const buffer = new Uint8Array(1024);

  await conn.write(new TextEncoder().encode(JSON.stringify(req)));
  const bytes = await conn.read(buffer);
  console.log(JSON.parse(new TextDecoder().decode(buffer.subarray(0, bytes))));
};

const main = async (hostname, port) => {
  const conn = await connectToServer(hostname, port);
  const req = {
    command: "registerCustomer",
    data: { customerName: "Rahul", email: "abc@gmail.com", password: "1234" },
  };
  await sendRequest(conn, req);
};

await main(HOSTNAME, PORT);
