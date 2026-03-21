import { getCookie } from "hono/cookie";

export const authenticateAdmin = async (c, next) => {
  const dbClient = c.get("dbClient");
  const adminId = getCookie(c, "adminId");
  const admin = dbClient.findAdminById({ adminId: Number(adminId) });

  if (!admin) {
    return c.json("Unauthorized!", 401);
  }

  return await next();
};

export const authenticateMember = async (c, next) => {
  const dbClient = c.get("dbClient");
  const memberId = getCookie(c, "memberId");
  const member = dbClient.findMemberById({ memberId: Number(memberId) });

  if (!member) {
    return c.json("Unauthorized!", 401);
  }

  return await next();
};

export const authenticateAdminOrMember = async (c, next) => {
  const dbClient = c.get("dbClient");
  const adminId = getCookie(c, "adminId");
  const memberId = getCookie(c, "memberId");
  const admin = dbClient.findAdminById({ adminId: Number(adminId) });
  const member = dbClient.findMemberById({ memberId: Number(memberId) });

  if (!admin && !member) {
    return c.json("Unauthorized!", 401);
  }

  return await next();
};
