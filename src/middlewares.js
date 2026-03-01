import { getCookie } from "hono/cookie";
import { AuthenticationError } from "./utils/custom_errors.js";

export const authenticateAdmin = async (c, next) => {
  const dbClient = c.get("dbClient");
  const adminId = getCookie(c, "adminId");
  const admin = dbClient.findAdminById({ adminId: Number(adminId) });

  if (!admin) {
    throw new AuthenticationError("Unauthorized!");
  }
  return await next();
};

export const authenticateMember = async (c, next) => {
  const dbClient = c.get("dbClient");
  const memberId = getCookie(c, "memberId");
  const member = dbClient.findMemberById({ memberId: Number(memberId) });

  if (!member) {
    throw new AuthenticationError("Unauthorized!");
  }
  return await next();
};
