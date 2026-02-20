import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import { validateInputType } from "./admin_service.js";

export const registerMember = (dbClient, { name, email, password }) => {
  validateInputType({ name, email, password });

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
  validateInputType({ email, password });

  const member = dbClient.findMemberByEmailAndPassword({ email, password });

  if (!member) {
    throw new AuthenticationError("Wrong login details");
  }

  return createResponse(200, {
    success: true,
    data: { memberId: member.memberId },
    message: "Member loggedIn Successfully",
  });
};

export const memberRouteHandlers = {
  GET: {
    "/members/list": (library) => library.listAllCustomers(),
  },
  POST: {
    "/members/register": (library, data) => library.registerCustomer(data),
    "/members/login": (library, data) => library.loginCustomer(data),
  },
};

export const handleMemberService = async (library, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;

  if (method === "GET" && path in memberRouteHandlers.GET) {
    const handler = memberRouteHandlers.GET[path];
    return await handler(library);
  }

  if (method === "POST" && path in memberRouteHandlers.POST) {
    const body = await request.json();
    const handler = memberRouteHandlers.POST[path];
    return await handler(library, body);
  }
  throw new NotFoundError("Path not found");
};
