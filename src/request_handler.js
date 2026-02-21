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

const route = async (library, request) => {
  const path = new URL(request.url).pathname;
  const resource = path.split("/")[1];

  if (resource in resourceHandlers) {
    const handler = resourceHandlers[resource];
    return await handler(library, request);
  }

  throw new NotFoundError("Path not found!");
};

export const handleRequest = async (library, request) => {
  try {
    return await route(library, request);
  } catch (error) {
    return createResponse(error.status, {
      success: false,
      errorName: error.name,
      message: error.message,
    });
  }
};

export const createRequestHandler = (library) => async (request) =>
  await handleRequest(library, request);
