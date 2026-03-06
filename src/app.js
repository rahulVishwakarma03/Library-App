import { Hono } from "hono";
import { logger } from "hono/logger";
import { createAdminRoutes } from "./routes/admin.js";
import { createMemberRoutes } from "./routes/member.js";
import { createBookRoutes } from "./routes/book.js";
import { NotFoundError } from "./utils/custom_errors.js";
import { createTransactionRoutes } from "./routes/transaction.js";

export const createAPP = (dbClient) => {
  const app = new Hono();
  const admin = createAdminRoutes();
  const member = createMemberRoutes();
  const book = createBookRoutes();
  const transaction = createTransactionRoutes();

  // app.use(logger());
  app.use(async (c, next) => {
    c.set("dbClient", dbClient);
    await next();
  });

  app.route("/admins", admin);
  app.route("/members", member);
  app.route("/books", book);
  app.route("/transactions", transaction);

  app.notFound(() => {
    throw new NotFoundError("Invalid path");
  });

  app.onError((e, c) => {
    // console.log(error);
    const { name, message, success, status } = e;
    return c.json({ success, errorName: name, message }, status);
  });

  return app;
};
