import { Hono } from "hono";
import {
  loginAdminController,
  registerAdminController,
} from "../controllers/admin_controllers.js";

import { sValidator } from "@hono/standard-validator";
import { loginSchema, regSchema } from "../validation_schema.js";

export const createAdminRoutes = () => {
  const admin = new Hono();

  admin.post(
    "/register",
    sValidator("json", regSchema),
    registerAdminController,
  );

  admin.post("/login", sValidator("json", loginSchema), loginAdminController);

  return admin;
};
