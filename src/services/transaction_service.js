import { AuthenticationError, NotFoundError } from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import {
  isInteger,
  parseBearerToken,
  validateInputType,
} from "../utils/utils.js";

export const listBorrowed = (dbClient, { memberId }) => {
  validateInputType({ memberId }, isInteger);

  const borrowedBooks = dbClient.findBorrowedBooksByMemberId({ memberId });
  return createResponse(200, {
    success: true,
    data: { borrowedBooks },
    message: "Successful",
  });
};

export const borrowsRouteHandler = {
  GET: {
    "/borrows/list": listBorrowed,
  },
  POST: {
    // "/borrows/borrow": borrowBook,
    // "/borrows/return": returnBook,
  },
};

export const handleBorrowService = async (dbClient, request) => {
  const { method } = request;
  const url = new URL(request.url);
  const path = url.pathname;

  if (method === "POST" && path in borrowsRouteHandler.POST) {
    authorizeMember(dbClient, request);
    const body = await request.json();
    const handler = borrowsRouteHandler.POST[path];
    return await handler(dbClient, body);
  }

  if (method === "GET" && path in borrowsRouteHandler.GET) {
    authorizeMember(dbClient, request);
    const handler = borrowsRouteHandler.GET[path];
    const memberId = url.searchParams.get("memberId");
    return await handler(dbClient, { memberId: Number(memberId) });
  }
  throw new NotFoundError("Path not found");
};
