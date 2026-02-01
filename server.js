const BUFFER_SIZE = 1024;

const main = async (port = 8000) => {
  const listener = Deno.listen({
    port,
    transport: "tcp",
  });

  console.log("listening...")
  for await (const conn of listener){
    const buffer = new Uint8Array(BUFFER_SIZE);
      const bytes = await conn.read(buffer);
      await conn.write(buffer.subarray(0, bytes));
    }
    conn.close();
};

await main();
