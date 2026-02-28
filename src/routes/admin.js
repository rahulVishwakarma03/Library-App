import { Hono } from "hono";
import {
  loginAdminController,
  registerAdminController,
} from "../controllers/admin_controller.js";

export const createAdminRoute = () => {
  const admin = new Hono();

  admin.post("/register", registerAdminController);
  admin.post("/login", loginAdminController);

  return admin;
};
