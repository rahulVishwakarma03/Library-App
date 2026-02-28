import {
  listMembers,
  loginMember,
  registerMember,
} from "../services/member_service.js";
import { isString, validateInputType } from "../utils/utils.js";

export const registerMemberController = async (c) => {
  const dbClient = c.get("dbClient");
  const { name, email, password } = await c.req.json();
  validateInputType({ name, email, password }, isString);
  const res = registerMember(dbClient, { name, email, password });

  return c.json(res, 201);
};

export const loginMemberController = async (c) => {
  const dbClient = c.get("dbClient");
  const { email, password } = await c.req.json();
  validateInputType({ email, password }, isString);
  const res = loginMember(dbClient, { email, password });

  c.header("set-cookie", `memberId=${res.data.memberId}`);
  return c.json(res, 200);
};

export const listMembersController = (c) => {
  const dbClient = c.get("dbClient");
  const res = listMembers(dbClient);

  return c.json(res, 200);
};
