import { Hono } from "hono";
import { logger } from "hono/logger";
import { createAdminRoutes } from "./routes/admin.js";
import { createMemberRoutes } from "./routes/member.js";

export const createAPP = (dbClient) => {
  const app = new Hono();
  const admin = createAdminRoutes();
  const member = createMemberRoutes();

  // app.use(logger());
  app.use(async (c, next) => {
    c.set("dbClient", dbClient);
    await next();
  });

  app.route("/admins", admin);
  app.route("/members", member);

  app.onError((error, c) => {
    // console.log(error);
    return c.json({
      success: error.success,
      errorName: error.name,
      message: error.message,
    }, error.status);
  });

  return app;
};
