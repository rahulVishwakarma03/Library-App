import { Hono } from "hono";
import { logger } from "hono/logger";
import { createAdminRoute } from "./routes/admin.js";

export const createAPP = (dbClient) => {
  const app = new Hono();
  const admin = createAdminRoute();

  app.use(logger());
  app.use(async (c, next) => {
    c.set("dbClient", dbClient);
    await next();
  });

  app.get("/", (c) => {
    return c.text("hello");
  });

  app.route("/admins", admin);

  app.onError((error, c) => {
    return c.json({
      success: error.success,
      errorName: error.name,
      message: error.message,
    }, error.status);
  });

  return app;
};
