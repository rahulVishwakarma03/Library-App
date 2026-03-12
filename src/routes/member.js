import { Hono } from "hono";
import {
  listMembersController,
  loginMemberController,
  registerMemberController,
} from "../controllers/member_controllers.js";
import { authenticateAdmin } from "../middlewares.js";
import { sValidator } from "@hono/standard-validator";
import { loginSchema, regSchema } from "../validation_schema.js";

export const createMemberRoutes = () => {
  const member = new Hono();

  member.post(
    "/register",
    sValidator("json", regSchema),
    registerMemberController,
  );

  member.post("/login", sValidator("json", loginSchema), loginMemberController);
  member.get("/list-all", authenticateAdmin, listMembersController);

  return member;
};
