import { Hono } from "hono";
import {
  loginAdminController,
  registerAdminController,
} from "../controllers/admin_controllers.js";
import { NotFoundError } from "../utils/custom_errors.js";

export const createAdminRoutes = () => {
  const admin = new Hono();

  admin.post("/register", registerAdminController);
  admin.post("/login", loginAdminController);
  admin.notFound(() => {
      throw new NotFoundError("Invalid path");
    });

  return admin;
};
