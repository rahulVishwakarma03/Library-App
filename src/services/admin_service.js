import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";

export const isString = (list) =>
  list.every((el) => typeof el === "string" && el !== "");

export const validateInputType = (inputs) => {
  if (!isString(Object.values(inputs))) {
    throw new ValidationError("Invalid input format");
  }
};

export const registerAdmin = (dbClient, { name, email, password }) => {
  validateInputType({ name, email, password });

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
  validateInputType({ email, password });

  const admin = dbClient.findAdminByEmailAndPassword({ email, password });

  if (!admin) {
    throw new AuthenticationError("Wrong login details");
  }

  return createResponse(200, {
    success: true,
    data: { adminId: admin.adminId },
    message: "Admin loggedIn Successfully",
  });
};

export const adminRouteHandlers = {
  "/admins/register": (library, data) => library.registerAdmin(data),
  "/admins/login": (library, data) => library.loginAdmin(data),
};

export const handleAdminService = async (library, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;

  if (method === "POST" && path in adminRouteHandlers) {
    const body = await request.json();
    const handler = adminRouteHandlers[path];
    return await handler(library, body);
  }

  throw new NotFoundError("Path not found");
};
