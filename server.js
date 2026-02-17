import { DatabaseSync } from "node:sqlite";
import { DbClient } from "./src/db_client.js";
import { Library } from "./src/library.js";
import { createRequestHandler } from "./src/request_handler.js";

const onListen = ({ port }) => console.log(`Server started at ${port}...`);

const main = (port) => {
  const db = new DatabaseSync("./db/library.db");
  const dbClient = new DbClient(db);
  dbClient.initializeSchema();
  dbClient.createMember({ name: "A", email: "a@gmail.com", password: "123" });

  const library = new Library({});
  const requestHandler = createRequestHandler(library);

  Deno.serve({ port, onListen }, requestHandler);
};

main(Deno.env.get("LIBRARY_PORT") || 8000);
