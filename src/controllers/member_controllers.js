import {
  listMembers,
  loginMember,
  registerMember,
} from "../services/member_service.js";

export const registerMemberController = async (c) => {
  const dbClient = c.get("dbClient");
  const { name, email, password } = await c.req.valid("json");
  const res = registerMember(dbClient, { name, email, password });

  return c.json(res, 201);
};

export const loginMemberController = async (c) => {
  const dbClient = c.get("dbClient");
  const session = c.get("session");
  const { email, password } = await c.req.valid("json");
  const res = loginMember(dbClient, { email, password });
  const sessionId = session.create(res.data.memberId);

  c.header("set-cookie", `sessionId=${sessionId}`);
  return c.json(res, 200);
};

export const listMembersController = (c) => {
  const dbClient = c.get("dbClient");
  const res = listMembers(dbClient);

  return c.json(res, 200);
};
