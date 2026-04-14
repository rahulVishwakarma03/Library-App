import { getCookie } from "hono/cookie";

const getUserId = async (c) => {
  const session = c.get("session");
  const sessionid = getCookie(c, "sessionId");
  return await session.getUser(sessionid);
};

export const authenticateAdmin = async (c, next) => {
  const dbClient = c.get("dbClient");
  const adminId = await getUserId(c);
  const admin = dbClient.findAdminById({ adminId: Number(adminId) });

  if (!admin) {
    return c.json("Unauthorized!", 401);
  }

  return await next();
};

export const authenticateMember = async (c, next) => {
  const dbClient = c.get("dbClient");
  const memberId = await getUserId(c);

  const member = dbClient.findMemberById({ memberId: Number(memberId) });

  if (!member) {
    return c.json("Unauthorized!", 401);
  }

  return await next();
};

export const authenticateAdminOrMember = async (c, next) => {
  const dbClient = c.get("dbClient");
  const userId = await getUserId(c);
  const admin = dbClient.findAdminById({ adminId: Number(userId) });
  const member = dbClient.findMemberById({ memberId: Number(userId) });

  if (!admin && !member) {
    return c.json("Unauthorized!", 401);
  }

  return await next();
};
