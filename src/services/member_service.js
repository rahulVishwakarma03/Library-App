import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import { parseBearerToken, validateInputType } from "../utils/utils.js";
import { isString } from "../utils/utils.js";

export const authorizeAdmin = (dbClient, request) => {
  const adminId = parseBearerToken(request);
  const admin = dbClient.findAdminById({ adminId });

  if (!admin) {
    throw new AuthenticationError("Unauthorized!");
  }
};

export const registerMember = (dbClient, { name, email, password }) => {
  const existing = dbClient.findMemberByEmail({ email });
  if (existing) {
    throw new ConflictError("Member already exists");
  }

  const res = dbClient.createMember({ name, email, password });

  return {
    success: true,
    data: { adminId: res.lastInsertRowid },
    message: "Member Registered Successfully",
  };
};

export const loginMember = (dbClient, { email, password }) => {
  const member = dbClient.findMemberByEmailAndPassword({ email, password });

  if (!member) {
    throw new AuthenticationError("Wrong login details");
  }

  return {
    success: true,
    data: { memberId: member.memberId },
    message: "Member loggedIn Successfully",
  };
};

export const listMembers = (dbClient) => {
  const members = dbClient.findAllMembers();

  return {
    success: true,
    data: { members },
    message: "Successful",
  };
};

export const memberRouteHandlers = {
  GET: {
    "/members/list": listMembers,
  },
  POST: {
    "/members/register": registerMember,
    "/members/login": loginMember,
  },
};

export const handleMemberService = async (dbClient, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;

  if (method === "GET" && path in memberRouteHandlers.GET) {
    const handler = memberRouteHandlers.GET[path];
    return await handler(dbClient, request);
  }

  if (method === "POST" && path in memberRouteHandlers.POST) {
    const body = await request.json();
    const handler = memberRouteHandlers.POST[path];
    return await handler(dbClient, body);
  }

  throw new NotFoundError("Path not found");
};
