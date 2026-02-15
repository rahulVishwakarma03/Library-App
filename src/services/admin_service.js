import { NotFoundError } from "../utils/custom_errors.js";

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
