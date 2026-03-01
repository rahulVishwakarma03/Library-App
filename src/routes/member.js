import { Hono } from "hono";
import {
  listMembersController,
  loginMemberController,
  registerMemberController,
} from "../controllers/member_controllers.js";
import { authenticateAdmin } from "../middlewares.js";

export const createMemberRoutes = () => {
  const member = new Hono();

  member.post("/register", registerMemberController);
  member.post("/login", loginMemberController);
  member.get("/list-all", authenticateAdmin, listMembersController);

  return member;
};
