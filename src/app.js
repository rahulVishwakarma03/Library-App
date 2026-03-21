import { Hono } from "hono";
import { createAdminRoutes } from "./routes/admin.js";
import { createMemberRoutes } from "./routes/member.js";
import { createBookRoutes } from "./routes/book.js";
import { serveStatic } from "hono/deno";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "./utils/custom_errors.js";
import { createTransactionRoutes } from "./routes/transaction.js";

export const createApp = (dbClient, logger) => {
  const app = new Hono();
  const admin = createAdminRoutes();
  const member = createMemberRoutes();
  const book = createBookRoutes();
  const transaction = createTransactionRoutes();

  app.use(logger());
  app.use(async (c, next) => {
    c.set("dbClient", dbClient);
    await next();
  });

  app.route("/admins", admin);
  app.route("/members", member);
  app.route("/books", book);
  app.route("/transactions", transaction);

  app.get("*", serveStatic({ root: "public" }));

  app.notFound(() => {
    throw new NotFoundError("Invalid path");
  });

  app.onError((e, c) => {
    const errors = [
      { error: ValidationError, status: 400, msg: e.message },
      { error: AuthenticationError, status: 401, msg: e.message },
      { error: ConflictError, status: 409, msg: e.message },
      { error: NotFoundError, status: 404, msg: e.message },
    ];

    const { status, msg } = errors.find(({ error }) => e instanceof error) ||
      { status: 500, msg: "Internal server error" };

    return c.json({
      success: false,
      error: msg,
    }, status);
  });

  return app;
};
