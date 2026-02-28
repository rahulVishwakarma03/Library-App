import { Hono } from "hono";
import {
  loginAdminController,
  registerAdminController,
} from "../controllers/admin_controllers.js";

export const createAdminRoutes = () => {
  const admin = new Hono();

  admin.post("/register", registerAdminController);
  admin.post("/login", loginAdminController);

  return admin;
};
