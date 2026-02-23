import { handleAdminService } from "./services/admin_service.js";
import { handleBookService } from "./services/book_service.js";
import { handleBorrowService } from "./services/borrows_service.js";
import { handleMemberService } from "./services/member_service.js";
import { NotFoundError } from "./utils/custom_errors.js";
import { createResponse } from "./utils/req_res_generator.js";

const resourceHandlers = {
  "admins": handleAdminService,
  "members": handleMemberService,
  "books": handleBookService,
  "borrows": handleBorrowService,
};

const route = async (dbClient, request) => {
  const path = new URL(request.url).pathname;
  const resourceName = path.split("/")[1];

  if (resourceName in resourceHandlers) {
    const handler = resourceHandlers[resourceName];
    return await handler(dbClient, request);
  }

  throw new NotFoundError("Path not found!");
};

export const handleRequest = async (dbClient, request) => {
  try {
    return await route(dbClient, request);
  } catch (error) {
    return createResponse(error.status, {
      success: false,
      errorName: error.name,
      message: error.message,
    });
  }
};

export const createRequestHandler = (dbClient) => async (request) =>
  await handleRequest(dbClient, request);
