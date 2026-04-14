import { DatabaseSync } from "node:sqlite";
import { DbClient } from "./src/db_client.js";
import { createApp } from "./src/app.js";
import { logger } from "hono/logger";
import { Session } from "./src/session.js";
import { connect } from "@db/redis";

const onListen = ({ port }) => console.log(`Server started at ${port}...`);

const connectToRedis = async () => {
  const redis = await connect({
    hostname: "127.0.0.1",
    port: 6379,
  });
  return redis;
};

const main = async (port) => {
  const redis = await connectToRedis();
  const session = new Session(redis);
  const db = new DatabaseSync("./db/library.db");
  const dbClient = new DbClient(db);
  dbClient.initializeSchema();

  const app = createApp(dbClient, session, logger);

  Deno.serve({ port, onListen }, app.fetch);
};

await main(8000);
