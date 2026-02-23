import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import { parseBearerToken, validateInputType } from "../utils/utils.js";
import { isString } from "./admin_service.js";

export const authorizeAdmin = (dbClient, request) => {
  const adminId = parseBearerToken(request);
  const admin = dbClient.findAdminById({ adminId });

  if (!admin) {
    throw new AuthenticationError("Unauthorized!");
  }
};

export const registerMember = (dbClient, { name, email, password }) => {
  validateInputType({ name, email, password }, isString);

  const member = dbClient.findMemberByEmail({ email });
  if (member) {
    throw new ConflictError("Member already exists");
  }

  dbClient.createMember({ name, email, password });

  return createResponse(201, {
    success: true,
    message: "Member Registered Successfully",
  });
};

export const loginMember = (dbClient, { email, password }) => {
  validateInputType({ email, password }, isString);

  const member = dbClient.findMemberByEmailAndPassword({ email, password });

  if (!member) {
    throw new AuthenticationError("Wrong login details");
  }

  return createResponse(200, {
    success: true,
    token: member.memberId,
    message: "Member loggedIn Successfully",
  });
};

export const listMembers = (dbClient, request) => {
  authorizeAdmin(dbClient, request);
  const members = dbClient.findAllMembers();

  return createResponse(200, {
    success: true,
    data: { members },
    message: "Successful",
  });
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
