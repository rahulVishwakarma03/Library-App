import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import { validateInputType } from "../utils/utils.js";

export const isString = (el) => typeof el === "string" && el !== "";

export const registerAdmin = (dbClient, { name, email, password }) => {
  validateInputType({ name, email, password }, isString);

  const admin = dbClient.findAdminByEmail({ email });
  if (admin) {
    throw new ConflictError("Admin already exists");
  }

  dbClient.createAdmin({ name, email, password });

  return createResponse(201, {
    success: true,
    message: "Admin Registered Successfully",
  });
};

export const loginAdmin = (dbClient, { email, password }) => {
  validateInputType({ email, password }, isString);

  const admin = dbClient.findAdminByEmailAndPassword({ email, password });

  if (!admin) {
    throw new AuthenticationError("Wrong login details");
  }

  return createResponse(200, {
    success: true,
    token: admin.adminId,
    message: "Admin loggedIn Successfully",
  });
};

export const adminRouteHandlers = {
  "/admins/register": registerAdmin,
  "/admins/login": loginAdmin,
};

export const handleAdminService = async (dbClient, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;

  if (method === "POST" && path in adminRouteHandlers) {
    const body = await request.json();
    const handler = adminRouteHandlers[path];
    return await handler(dbClient, body);
  }

  throw new NotFoundError("Path not found");
};
