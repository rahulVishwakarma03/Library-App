const conn = await Deno.connect({
  hostname : "127.0.0.1",
  port : 8000,
  transport : "tcp"
})

const buffer = new Uint8Array(1024);

await conn.write(new TextEncoder().encode("hello"));
const bytes = await conn.read(buffer);
console.log(new TextDecoder().decode(buffer.subarray(0,bytes)))
