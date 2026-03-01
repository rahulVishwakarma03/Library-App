import { AuthenticationError, NotFoundError } from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import {
  isInteger,
  parseBearerToken,
  validateInputType,
} from "../utils/utils.js";

const authorizeMember = (dbClient, request) => {
  const authToken = parseBearerToken(request);
  const member = dbClient.findMemberById({ memberId: authToken });
  if (!member) {
    throw new AuthenticationError("Unauthorized!");
  }
};

export const borrowBook = (dbClient, { bookId, memberId }) => {
  validateInputType({ bookId, memberId }, isInteger);

  const book = dbClient.findBookById({ bookId });
  const member = dbClient.findMemberById({ memberId });

  if (!book || !member) {
    throw new NotFoundError("bookId or memberId doesn't exist");
  }

  if (book.borrowed === book.total) {
    throw new NotFoundError("No copy is available");
  }

  const res = dbClient.borrowBook({ bookId, memberId });

  return createResponse(200, {
    success: true,
    data: { transactionId: res.lastInsertedRowid },
    message: "Book borrowed successfully",
  });
};

export const returnBook = (dbClient, { transactionId }) => {
  validateInputType({ transactionId }, isInteger);

  const transaction = dbClient.findTransactionById({ transactionId });

  if (!transaction) {
    throw new NotFoundError("Transaction id not found");
  }

  dbClient.returnBook({ transactionId });
  return createResponse(200, {
    success: true,
    message: "Book returned successfully",
  });
};

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
    "/borrows/borrow": borrowBook,
    "/borrows/return": returnBook,
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
