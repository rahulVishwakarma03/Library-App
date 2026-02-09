import { Library } from "./src/library.js";
import { createRequestHandler } from "./src/request_handler.js";

const onListen = ({ port }) => console.log(`Server started at ${port}...`);

const main = (port) => {
  const library = new Library({});
  const requestHandler = createRequestHandler(library);

  Deno.serve({ port, onListen }, requestHandler);
};

main(Deno.env.get("LIBRARY_PORT") || 8000);
