import { DatabaseSync } from "node:sqlite";
import { DbClient } from "./src/db_client.js";
import { createAPP } from "./src/app.js";

const onListen = ({ port }) => console.log(`Server started at ${port}...`);

const main = (port) => {
  const db = new DatabaseSync("./db/library.db");
  const dbClient = new DbClient(db);
  dbClient.initializeSchema();

  const app = createAPP(dbClient);

  Deno.serve({ port, onListen }, app.fetch);
};

main(8000);
