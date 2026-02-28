import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../utils/custom_errors.js";

export const registerAdmin = (dbClient, { name, email, password }) => {
  const existingAdmin = dbClient.findAdminByEmail({ email });

  if (existingAdmin) {
    throw new ConflictError("Admin already exists");
  }

  const res = dbClient.createAdmin({ name, email, password });

  return {
    success: true,
    data: { adminId: res.lastInsertRowid },
    message: "Admin Registered Successfully",
  };
};

export const loginAdmin = (dbClient, { email, password }) => {
  const admin = dbClient.findAdminByEmailAndPassword({ email, password });

  if (!admin) {
    throw new AuthenticationError("Wrong login details");
  }

  return {
    success: true,
    data: { adminId: admin.adminId },
    message: "Admin loggedIn Successfully",
  };
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
