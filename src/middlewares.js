import { getCookie } from "hono/cookie";
import { AuthenticationError } from "./utils/custom_errors.js";

export const authenticateAdmin = async (c, next) => {
  const dbClient = c.get("dbClient");
  const adminId = getCookie(c, "adminId");
  const admin = dbClient.findAdminById({ adminId });

  if (!admin) {
    throw new AuthenticationError("Unauthorized!");
  }
  return await next();
};
