import { NotFoundError } from "../utils/custom_errors.js";

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
